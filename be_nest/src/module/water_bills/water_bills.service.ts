import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateWaterBillDto } from './dto/create-water_bill.dto';
import { UpdateWaterBillDto } from './dto/update-water_bill.dto';
import { InjectModel } from '@nestjs/mongoose';
import { WaterBill, WaterBillDocument } from './schemas/water_bill.schemas';
import mongoose, { Model } from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class WaterBillsService {
  constructor(
    @InjectModel(WaterBill.name) private waterBillModel: Model<WaterBillDocument>,
  ) { }

  async create(createWaterBillDto: CreateWaterBillDto) {
    const {
      waterPrice,
      amount,
      // payment,
      userId,
      roomId,
      fromDate,
      toDate
    } = createWaterBillDto;
    const waterBill = await this.waterBillModel.create({
      waterPrice,
      amount,
      // payment,
      userId,
      roomId,
      fromDate,
      toDate
    })
    return {
      _id: waterBill._id
    }
  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

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
      return this.waterBillModel.deleteOne({ _id })
    } else {
      throw new BadRequestException("_id không đúng định dạng")
    }
  }
}
