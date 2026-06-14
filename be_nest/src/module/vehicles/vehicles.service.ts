import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Vehicle, VehicleDocument } from './schemas/vehicle.schemas';
import mongoose, { Model } from 'mongoose';
import aqp from 'api-query-params';
import moment from 'moment';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectModel(Vehicle.name) private vehicleModel: Model<VehicleDocument>,
  ) { }

  async create(createVehicleDto: CreateVehicleDto) {
    const {
      type,
      price,
      licensePlate,
      shippingPrice,
      userId,
      roomId,
      fromDate,
      toDate,
      status,
    } = createVehicleDto;
    const vehicle = await this.vehicleModel.create({
      type,
      price,
      licensePlate,
      shippingPrice,
      userId,
      roomId,
      fromDate: fromDate ?? new Date(),
      toDate,
      status
    })
    return {
      _id: vehicle._id
    }
  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;
    if (filter.search) delete filter.search;

    if (query.search) {
      filter.$or = [
        { licensePlate: { $regex: query.search, $options: 'i' } },
      ];
    }
    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const totalItems = (await this.vehicleModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);

    const skip = (current - 1) * (pageSize);

    const results = await this.vehicleModel
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
    return `This action returns a #${id} vehicle`;
  }

  async update(updateVehicleDto: UpdateVehicleDto) {
    const updatedData: any = { ...updateVehicleDto };

    // Nếu có fromDate và totalMonth, thì tính lại toDate
    if (updateVehicleDto.fromDate) {
      updatedData.toDate = moment(updateVehicleDto.fromDate).add(1, 'months').toDate();
    }

    return await this.vehicleModel.updateOne(
      { _id: updateVehicleDto._id }, updatedData);
  }

  remove(_id: string) {
    if (mongoose.isValidObjectId(_id)) {
      return this.vehicleModel.deleteOne({ _id })
    } else {
      throw new BadRequestException("_id không đúng định dạng")
    }
  }
}
