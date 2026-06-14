import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateElectricityBillDto } from './dto/create-electricity_bill.dto';
import { UpdateElectricityBillDto } from './dto/update-electricity_bill.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ElectricityBill, ElectricityBillDocument } from './schemas/electricity_bill.schemas';
import mongoose, { Model } from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class ElectricityBillsService {
  constructor(
    @InjectModel(ElectricityBill.name) private ekectricityBillModel: Model<ElectricityBillDocument>,
  ) { }
  async create(createElectricityBillDto: CreateElectricityBillDto) {
    const {
      eletricPrice,
      amount,
      // payment,
      userId,
      roomId,
      fromDate,
      toDate
    } = createElectricityBillDto;
    const electricity = await this.ekectricityBillModel.create({
      eletricPrice,
      amount,
      // payment,
      userId,
      roomId,
      fromDate,
      toDate
    })
    return {
      _id: electricity._id
    }
  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

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
      return this.ekectricityBillModel.deleteOne({ _id })
    } else {
      throw new BadRequestException("_id không đúng định dạng")
    }
  }
}
