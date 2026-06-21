import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBuildingDto } from './dto/create-building.dto';
import { UpdateBuildingDto } from './dto/update-building.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Building } from './schemas/building.schemas';
import mongoose, { Model, Types } from 'mongoose';
import aqp from 'api-query-params';
import { User } from 'src/module/users/schemas/user.schema';
import { Package } from '../packages/schemas/package.schemas';
import { Room } from '../rooms/schemas/room.entity';
import dayjs from 'dayjs';
import { WaterBill, WaterBillDocument } from '../water_bills/schemas/water_bill.schemas';
import { ElectricityBill } from '../electricity_bills/schemas/electricity_bill.schemas';
import { Vehicle } from '../vehicles/schemas/vehicle.schemas';

@Injectable()
export class BuildingsService {

  constructor(
    @InjectModel(Building.name)
    private buildingModel: Model<Building>,
    @InjectModel(User.name)
    private userModel: Model<User>,

    @InjectModel(Package.name)
    private packageModel: Model<Package>,
    @InjectModel(Room.name)
    private roomModel: Model<Room>,
    @InjectModel(WaterBill.name) private waterBillModel: Model<WaterBill>,
    @InjectModel(ElectricityBill.name) private electricityBillModel: Model<ElectricityBill>,
    @InjectModel(Vehicle.name) private vehiclesModel: Model<Vehicle>,

  ) { }

  async create(createBuildingDto: CreateBuildingDto) {
    const {
      name, address, totalRooms, numberOfPeopleRoom,
      numberOfRoomsRented, priceOfRoom, rating, userId, shippingPrice
    } = createBuildingDto;

    // Lấy thông tin user
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException("Người dùng không tồn tại.");
    }

    // Lấy thông tin gói của user
    const userPackage = await this.packageModel.findById(user.packageId);
    if (!userPackage) {
      throw new BadRequestException("Gói chức năng không tồn tại.");
    }

    // Đếm số lượng nhà hiện tại (bỏ qua nhà đã soft-delete để giải phóng chỗ theo gói)
    const buildingCount = await this.buildingModel.countDocuments({ userId, isDeleted: { $ne: true } });
    if (buildingCount >= Number(userPackage.totalBuilding)) {
      throw new BadRequestException(
        `Số lượng nhà của bạn đã đạt giới hạn mà gói bạn đăng ký cho phép là: ${userPackage.totalBuilding}`
      );
    }

    const building = await this.buildingModel.create({
      name, address, totalRooms, numberOfPeopleRoom,
      numberOfRoomsRented, priceOfRoom, rating, userId, shippingPrice
    });

    return {
      _id: building._id
    };
  }

  async findAll(query: any, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;
    if (filter.search) delete filter.search; // tránh để aqp hiểu search là filter mặc định

    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { address: { $regex: query.search, $options: 'i' } }
      ];
    }
    // Ẩn nhà đã soft-delete khỏi danh sách
    filter.isDeleted = { $ne: true };

    const totalItems = await this.buildingModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (current - 1) * pageSize;

    const results = await this.buildingModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      .sort(sort as any);

    return {
      meta: {
        current,
        pageSize,
        pages: totalPages,
        total: totalItems
      },
      results
    };
  }


  findOne(id: number) {
    return `This action returns a #${id} building`;
  }

  async update(updateBuildingDto: UpdateBuildingDto) {
    return await this.buildingModel.updateOne(
      { _id: updateBuildingDto._id }, { ...updateBuildingDto });
  }

  async remove(_id: string) {
    if (!mongoose.isValidObjectId(_id)) {
      throw new BadRequestException("_id không đúng định dạng")
    }
    // Soft-delete nhà và cascade soft-delete phòng,hóa đơn,xe để giữ toàn bộ lịch sử doanh thu
    const rooms = await this.roomModel.find({ buildingId: _id }).select('_id').lean();
    const roomIds = rooms.map(r => r._id);
    if (roomIds.length > 0) {
      await this.waterBillModel.updateMany({ roomId: { $in: roomIds } }, { isDeleted: true });
      await this.electricityBillModel.updateMany({ roomId: { $in: roomIds } }, { isDeleted: true });
      await this.vehiclesModel.updateMany({ roomId: { $in: roomIds } }, { isDeleted: true });
      await this.roomModel.updateMany({ _id: { $in: roomIds } }, { isDeleted: true });
    }
    return this.buildingModel.updateOne({ _id }, { isDeleted: true })
  }

  async updateBuildingIncome(buildingId: string) {
    const startOfMonth = dayjs().startOf('month').toDate();
    const endOfMonth = dayjs().endOf('month').toDate();

    // Tính tổng thu nhập từ paymentHistory — mỗi lần xác nhận là 1 entry riêng
    // Đảm bảo cùng phòng có nhiều khách trong tháng đều được cộng dồn
    const rooms = await this.roomModel.find({ buildingId }).lean();

    let income = 0;
    for (const room of rooms) {
      for (const entry of room.paymentHistory || []) {
        const d = new Date(entry.date);
        if (d >= startOfMonth && d <= endOfMonth) {
          income += Number(entry.price) || 0;
        }
      }
    }

    const numberOfRoomsRented = await this.roomModel.countDocuments({
      buildingId,
      status: true,
      isDeleted: { $ne: true }
    });

    await this.buildingModel.updateOne(
      { _id: buildingId },
      { income: income.toString(), numberOfRoomsRented }
    );
  }


  async getMonthlyIncomeStats(buildingId: string) {
    const fiveMonthsAgo = dayjs().subtract(5, 'month').startOf('month').toDate();

    // Dùng paymentHistory để tính từng lần xác nhận riêng lẻ
    // Đảm bảo cộng dồn đúng kể cả nhiều khách trong cùng tháng
    const rooms = await this.roomModel.find({ buildingId }).lean();

    const stats = Array(5).fill(0).map((_, i) => {
      const month = dayjs().subtract(i, 'month').format('MM-YYYY');
      return { month, income: 0 };
    });

    for (const room of rooms) {
      for (const entry of room.paymentHistory || []) {
        const entryDate = dayjs(entry.date);
        if (entryDate.isBefore(fiveMonthsAgo)) continue;
        const month = entryDate.format('MM-YYYY');
        const stat = stats.find(s => s.month === month);
        if (stat) stat.income += Number(entry.price) || 0;
      }
    }

    return stats.reverse();
  }


  async getWaterStats(buildingId: string) {
    const fiveMonthsAgo = dayjs().subtract(5, 'month').startOf('month').toDate();

    // Lấy tất cả phòng thuộc building (kể cả đã hết hạn)
    const rooms = await this.roomModel.find({ buildingId }).select('_id toDate').lean();
    const roomIds = rooms.map(room => new Types.ObjectId(room._id));

    if (roomIds.length === 0) return [];

    // Lấy water bills của các room này trong 5 tháng gần nhất
    const waterBills = await this.waterBillModel.find({
      roomId: { $in: roomIds },
      fromDate: { $gte: fiveMonthsAgo },
      status: '3',
    }).lean();

    // Khởi tạo 5 tháng gần nhất
    const stats = Array(5).fill(0).map((_, i) => {
      const month = dayjs().subtract(i, 'month').format('MM-YYYY');
      return { month, totalAmount: 0, incomeWater: 0 };
    });

    for (const bill of waterBills) {
      const month = dayjs(bill.fromDate).format('MM-YYYY');
      const stat = stats.find(s => s.month === month);
      if (stat) {
        const amount = Number(bill.amount) || 0;
        const price = Number(bill.waterPrice) || 0;
        stat.totalAmount += amount;
        stat.incomeWater += amount * price;
      }
    }

    return stats.reverse(); // từ cũ đến mới
  }


  async getElectricityStats(buildingId: string) {
    const fiveMonthsAgo = dayjs().subtract(5, 'month').startOf('month').toDate();

    // Lấy tất cả phòng thuộc building (kể cả đã hết hạn)
    const rooms = await this.roomModel.find({ buildingId }).select('_id toDate').lean();
    const roomIds = rooms.map(room => new Types.ObjectId(room._id));

    if (roomIds.length === 0) return [];

    // Lấy các water bill của các room thuộc buildingId trong 5 tháng gần nhất
    const electricityBills = await this.electricityBillModel.find({
      roomId: { $in: roomIds },
      fromDate: { $gte: fiveMonthsAgo },
      status: '3',
    }).lean();

    // Khởi tạo 5 tháng gần nhất
    const stats = Array(5).fill(0).map((_, i) => {
      const month = dayjs().subtract(i, 'month').format('MM-YYYY');
      return { month, totalAmount: 0, incomeElectricity: 0 };
    });

    for (const bill of electricityBills) {
      const month = dayjs(bill.fromDate).format('MM-YYYY');
      const stat = stats.find(s => s.month === month);
      if (stat) {
        const amount = Number(bill.amount) || 0;
        const price = Number(bill.eletricPrice) || 0;
        stat.totalAmount += amount;
        stat.incomeElectricity += amount * price;
      }
    }

    return stats.reverse();
  }

  async getVehiclesStats(buildingId: string) {
    const fiveMonthsAgo = dayjs().subtract(5, 'month').startOf('month');

    // Lấy tất cả phòng thuộc building (kể cả đã hết hạn)
    const rooms = await this.roomModel
      .find({ buildingId })
      .select('_id toDate')
      .lean();

    const roomIds = rooms.map(room => new Types.ObjectId(room._id));
    if (roomIds.length === 0) return [];

    const vehicles = await this.vehiclesModel
      .find({
        roomId: { $in: roomIds },
        status: '3',
      })
      .lean();

    const stats = Array(5).fill(0).map((_, i) => {
      const month = dayjs().subtract(i, 'month').format('MM-YYYY');
      return { month, incomeVehicle: 0 };
    });

    for (const bill of vehicles) {
      const billDate = bill.fromDate ?? (bill as any).createdAt;
      const billMonth = dayjs(billDate).format('MM-YYYY');

      if (dayjs(billDate).isBefore(fiveMonthsAgo)) continue;

      const stat = stats.find(s => s.month === billMonth);
      if (stat) {
        const shippingPrice = Number(bill.shippingPrice) || 0;
        stat.incomeVehicle += shippingPrice;
      }
    }
    return stats.reverse();
  }



}

