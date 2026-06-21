import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateWaterBillDto } from './dto/create-water_bill.dto';
import { UpdateWaterBillDto } from './dto/update-water_bill.dto';
import { InjectModel } from '@nestjs/mongoose';
import { WaterBill, WaterBillDocument } from './schemas/water_bill.schemas';
import mongoose, { Model } from 'mongoose';
import aqp from 'api-query-params';
import dayjs from 'dayjs';
import { Room } from '../rooms/schemas/room.entity';

@Injectable()
export class WaterBillsService {
  constructor(
    @InjectModel(WaterBill.name) private waterBillModel: Model<WaterBillDocument>,
    @InjectModel(Room.name) private roomModel: Model<Room>,
  ) { }

  async create(createWaterBillDto: CreateWaterBillDto) {
    const {
      waterPrice,
      amount,
      userId,
      roomId,
      fromDate,
      toDate
    } = createWaterBillDto;

    // [Câu 3] Không tạo hóa đơn cho phòng đang trống
    const room = await this.roomModel.findById(roomId).select('status code').lean();
    if (!room) throw new BadRequestException("Phòng không tồn tại.");
    if (!room.status) {
      throw new BadRequestException(`Phòng ${room.code} đang trống. Không thể tạo hóa đơn nước cho phòng chưa có khách.`);
    }

    // [Câu 7] Không tạo 2 hóa đơn nước cùng tháng cho cùng phòng
    const billDate = fromDate ? new Date(fromDate) : new Date();
    const startOfMonth = dayjs(billDate).startOf('month').toDate();
    const endOfMonth = dayjs(billDate).endOf('month').toDate();
    const existing = await this.waterBillModel.findOne({
      roomId,
      fromDate: { $gte: startOfMonth, $lte: endOfMonth },
      isDeleted: { $ne: true },
    });
    if (existing) {
      throw new BadRequestException(`Hóa đơn nước tháng ${dayjs(billDate).format('MM/YYYY')} đã tồn tại cho phòng này.`);
    }

    const waterBill = await this.waterBillModel.create({
      waterPrice,
      amount,
      userId,
      roomId,
      fromDate,
      toDate
    });
    return {
      _id: waterBill._id
    }
  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;
    // Ẩn hóa đơn đã soft-delete khỏi danh sách
    filter.isDeleted = { $ne: true };

    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const totalItems = (await this.waterBillModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);

    const skip = (current - 1) * (pageSize);

    const results = await this.waterBillModel
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
    return `This action returns a #${id} waterBill`;
  }

  async update(updateWaterBillDto: UpdateWaterBillDto) {
    const updatedData: any = { ...updateWaterBillDto };

    if (updateWaterBillDto.waterPrice && updateWaterBillDto.amount) {
      updatedData.payment = Number(updateWaterBillDto.amount) * Number(updateWaterBillDto.waterPrice);
    }
    return await this.waterBillModel.updateOne(
      { _id: updateWaterBillDto._id }, updatedData);
  }

  remove(_id: string) {
    if (mongoose.isValidObjectId(_id)) {
      // Soft-delete: giữ lại lịch sử doanh thu nước (hóa đơn status '3')
      return this.waterBillModel.updateOne({ _id }, { isDeleted: true })
    } else {
      throw new BadRequestException("_id không đúng định dạng")
    }
  }
}
