import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Room, RoomDocument } from './schemas/room.entity';
import mongoose, { Model } from 'mongoose';
import aqp from 'api-query-params';
import moment from 'moment';
import dayjs from 'dayjs';
import { Building } from '../buildings/schemas/building.schemas';
import { WaterBill } from '../water_bills/schemas/water_bill.schemas';
import { ElectricityBill } from '../electricity_bills/schemas/electricity_bill.schemas';
import { Vehicle } from '../vehicles/schemas/vehicle.schemas';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
    @InjectModel(Building.name) private buildingModel: Model<Building>,
    @InjectModel(WaterBill.name) private waterBillModel: Model<WaterBill>,
    @InjectModel(ElectricityBill.name) private electricityBillModel: Model<ElectricityBill>,
    @InjectModel(Vehicle.name) private vehicleModel: Model<Vehicle>,
  ) { }

  async create(createRoomDto: CreateRoomDto) {
    const {
      code,
      acreage,
      kitchen,
      toilet,
      washroom,
      totalPeople,
      price,
      status,
      buildingId, statusPayment, payment } = createRoomDto;

    // const isRoomOfBuildingExist = await this.isRoomOfBuildingExist(code, buildingId);
    // if (isRoomOfBuildingExist) {
    //   throw new BadRequestException(`Phòng có mã ${code} đã tộn tại trong tòa nhà này`)
    // }
    const existingRoom = await this.roomModel.findOne({
      code,
      buildingId,
      isDeleted: { $ne: true }
    });


    if (existingRoom) {
      throw new BadRequestException(
        `Phòng với mã ${code} đã tồn tại trong nhà trọ này.`,
      );
    }

    const userBuilding = await this.buildingModel.findById(buildingId);
    if (!userBuilding) {
      throw new BadRequestException("Nhà trọ không tồn tại.");
    }
    // Đếm số lượng nhà hiện tại (bỏ qua phòng đã soft-delete để giải phóng chỗ)
    const roomCount = await this.roomModel.countDocuments({ buildingId, isDeleted: { $ne: true } });
    if (roomCount >= Number(userBuilding.totalRooms)) {
      throw new BadRequestException(
        `Số lượng Phòng của nhà này đã đạt tối đa: ${userBuilding.totalRooms}`
      );
    }
    const room = await this.roomModel.create({
      code,
      acreage,
      kitchen,
      toilet,
      washroom,
      totalPeople,
      price,
      status,
      buildingId,
      statusPayment, payment,
    })
    return {
      _id: room._id
    };
  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;
    if (filter.search) delete filter.search;
    // Ẩn phòng đã soft-delete khỏi danh sách
    filter.isDeleted = { $ne: true };

    if (query.search) {
      filter.$or = [
        { code: { $regex: query.search, $options: 'i' } },
      ];
    }
    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const totalItems = (await this.roomModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);

    const skip = (current - 1) * (pageSize);

    const results = await this.roomModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      // .select("-password")
      .sort(sort as any);

    return {
      meta: {
        current: current, //trang hiện tại
        pageSize: pageSize, //số lượng bản ghi đã lấy
        pages: totalPages,  //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      results //kết quả query
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} room`;
  }


  async update(updateRoomDto: UpdateRoomDto) {
    const { _id, fromDate, totalMonth, price, userId, forceExpire } = updateRoomDto;

    // Mỗi khách chỉ được thuê 1 phòng tại một thời điểm.
    // Tính cả phòng đang chờ xác nhận (status false) — miễn là phòng còn gắn với khách và
    // hợp đồng CÒN HẠN (chưa có toDate = vừa thuê, hoặc toDate trong tương lai).
    // Chỉ cho thuê tiếp khi hợp đồng cũ đã hết hạn.
    if (userId) {
      const now = new Date();
      const existingRoom = await this.roomModel.findOne({
        userId,
        _id: { $ne: _id },
        isDeleted: { $ne: true },
        $or: [
          { toDate: { $exists: false } },
          { toDate: null },
          { toDate: { $gt: now } },
        ],
      });
      if (existingRoom) {
        throw new BadRequestException(
          `Bạn đang thuê phòng ${existingRoom.code} (hợp đồng còn hạn). Mỗi khách chỉ được thuê 1 phòng. Vui lòng đợi hết hạn hợp đồng rồi thuê tiếp.`
        );
      }
    }

    const setData: any = { ...updateRoomDto };
    delete setData.forceExpire; // không lưu forceExpire vào DB
    const unsetData: any = {};

    for (const key of Object.keys(setData)) {
      if (setData[key] === null) {
        unsetData[key] = 1;
        delete setData[key];
      }
    }

    // [Câu 8] Nếu đây là auto-expire (không có forceExpire), verify phòng thực sự đã hết hạn
    // tránh race condition khi checkAndUpdateExpiredRooms chạy sau khi landlord đã gán khách mới
    if (setData.status === false && !forceExpire) {
      const currentRoom = await this.roomModel.findById(_id).select('status toDate').lean();
      if (currentRoom?.status === true && currentRoom?.toDate) {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        if (new Date(currentRoom.toDate) >= todayStart) {
          throw new BadRequestException(
            "Phòng chưa hết hạn. Có thể khách mới vừa được gán vào phòng này. Vui lòng tải lại trang."
          );
        }
      }
    }

    if (fromDate && totalMonth) {
      setData.toDate = moment(fromDate).add(Number(totalMonth), 'months').toDate();
    }

    if (price && totalMonth) {
      setData.payment = Number(totalMonth) * Number(price);
    }

    const updateQuery: any = { $set: setData };
    if (Object.keys(unsetData).length > 0) {
      updateQuery.$unset = unsetData;
    }

    /*Thu nhập là nhật ký chỉ cộng khi xác nhận thanh toán, không bao giờ trừ.
      Chống trùng theo KHÁCH + THÁNG → cùng khách xác nhận lại trong tháng không bị cộng 2 lần,
      nhưng khách MỚI trong cùng phòng/tháng vẫn được cộng dồn */
    if (updateRoomDto.paymentsDate) {
      const room = await this.roomModel.findById(_id).lean();
      const startOfMonth = dayjs().startOf('month').toDate();
      const currentUserId = room?.userId ? String(room.userId) : null;
      const alreadyPaidThisMonth = room?.paymentHistory?.some(entry => {
        if (new Date(entry.date) < startOfMonth) return false;
        const entryUserId = entry.userId ? String(entry.userId) : null;
        return entryUserId === currentUserId;
      });
      if (!alreadyPaidThisMonth) {
        updateQuery.$push = {
          paymentHistory: {
            date: updateRoomDto.paymentsDate,
            price: room?.price || '0',
            userId: room?.userId ?? null,
          },
        };
      }
    }

    const result = await this.roomModel.updateOne({ _id }, updateQuery);

    // Khi phòng hết hạn thuê (status=false): soft-delete xe của phòng này
    // → gỡ xe khỏi danh sách phương tiện nhưng vẫn giữ income history (xe đã confirm status '3')
    if (setData.status === false) {
      await this.vehicleModel.updateMany({ roomId: _id }, { isDeleted: true });
    }

    return result;
  }

  async remove(_id: string) {
    if (!mongoose.isValidObjectId(_id)) {
      throw new BadRequestException("_id không đúng định dạng");
    }

    // Soft-delete: ẩn phòng nhưng giữ paymentHistory → doanh thu phòng không bị mất.
    // Vì không xóa cứng nữa nên không cần chặn phòng có lịch sử thanh toán.
    // Cascade soft-delete: hóa đơn điện/nước + xe → giữ toàn bộ lịch sử doanh thu.
    await this.waterBillModel.updateMany({ roomId: _id }, { isDeleted: true });
    await this.electricityBillModel.updateMany({ roomId: _id }, { isDeleted: true });
    await this.vehicleModel.updateMany({ roomId: _id }, { isDeleted: true });

    return this.roomModel.updateOne({ _id }, { isDeleted: true });
  }
}
