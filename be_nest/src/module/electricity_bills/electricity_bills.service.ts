import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateElectricityBillDto } from './dto/create-electricity_bill.dto';
import { UpdateElectricityBillDto } from './dto/update-electricity_bill.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ElectricityBill, ElectricityBillDocument } from './schemas/electricity_bill.schemas';
import mongoose, { Model } from 'mongoose';
import aqp from 'api-query-params';
import dayjs from 'dayjs';
import { Room } from '../rooms/schemas/room.entity';

@Injectable()
export class ElectricityBillsService {
  constructor(
    @InjectModel(ElectricityBill.name) private ekectricityBillModel: Model<ElectricityBillDocument>,
    @InjectModel(Room.name) private roomModel: Model<Room>,
  ) { }

  async create(createElectricityBillDto: CreateElectricityBillDto) {
    const {
      eletricPrice,
      amount,
      userId,
      roomId,
      fromDate,
      toDate
    } = createElectricityBillDto;

    // [Câu 3] Không tạo hóa đơn cho phòng đang trống
    const room = await this.roomModel.findById(roomId).select('status code').lean();
    if (!room) throw new BadRequestException("Phòng không tồn tại.");
    if (!room.status) {
      throw new BadRequestException(`Phòng ${room.code} đang trống. Không thể tạo hóa đơn điện cho phòng chưa có khách.`);
    }

    // [Câu 7] Không tạo 2 hóa đơn điện cùng tháng cho cùng phòng
    const billDate = fromDate ? new Date(fromDate) : new Date();
    const startOfMonth = dayjs(billDate).startOf('month').toDate();
    const endOfMonth = dayjs(billDate).endOf('month').toDate();
    const existing = await this.ekectricityBillModel.findOne({
      roomId,
      fromDate: { $gte: startOfMonth, $lte: endOfMonth },
      isDeleted: { $ne: true },
    });
    if (existing) {
      throw new BadRequestException(`Hóa đơn điện tháng ${dayjs(billDate).format('MM/YYYY')} đã tồn tại cho phòng này.`);
    }

    const electricity = await this.ekectricityBillModel.create({
      eletricPrice,
      amount,
      userId,
      roomId,
      fromDate,
      toDate
    });
    return {
      _id: electricity._id
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

    const totalItems = (await this.ekectricityBillModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);

    const skip = (current - 1) * (pageSize);

    const results = await this.ekectricityBillModel
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
    return `This action returns a #${id} electricityBill`;
  }

  async update(updateElectricityBillDto: UpdateElectricityBillDto) {

    const updatedData: any = { ...updateElectricityBillDto };

    if (updateElectricityBillDto.eletricPrice && updateElectricityBillDto.amount) {
      updatedData.payment = Number(updateElectricityBillDto.amount) * Number(updateElectricityBillDto.eletricPrice);
    }
    return await this.ekectricityBillModel.updateOne(
      { _id: updateElectricityBillDto._id }, updatedData);
  }

  remove(_id: string) {
    if (mongoose.isValidObjectId(_id)) {
      // Soft-delete: giữ lại lịch sử doanh thu điện (hóa đơn status '3')
      return this.ekectricityBillModel.updateOne({ _id }, { isDeleted: true })
    } else {
      throw new BadRequestException("_id không đúng định dạng")
    }
  }
}
