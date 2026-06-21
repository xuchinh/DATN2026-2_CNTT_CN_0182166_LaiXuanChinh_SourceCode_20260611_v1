import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Vehicle, VehicleDocument } from './schemas/vehicle.schemas';
import mongoose, { Model } from 'mongoose';
import aqp from 'api-query-params';
import moment from 'moment';
import { Room } from '../rooms/schemas/room.entity';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectModel(Vehicle.name) private vehicleModel: Model<VehicleDocument>,
    @InjectModel(Room.name) private roomModel: Model<Room>,
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

    // [Câu 9] Không đăng ký xe cho phòng đang trống
    const room = await this.roomModel.findById(roomId).select('status code').lean();
    if (!room) throw new BadRequestException("Phòng không tồn tại.");
    if (!room.status) {
      throw new BadRequestException(`Phòng ${room.code} đang trống. Không thể đăng ký xe cho phòng chưa có khách thuê.`);
    }

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
    });
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
    // [Câu 6] Luôn ẩn xe đã soft-delete khỏi danh sách
    filter.isDeleted = { $ne: true };

    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const totalItems = (await this.vehicleModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);

    const skip = (current - 1) * (pageSize);

    const results = await this.vehicleModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
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

  async remove(_id: string) {
    if (!mongoose.isValidObjectId(_id)) {
      throw new BadRequestException("_id không đúng định dạng");
    }
    // [Câu 6] Soft-delete thay vì deleteOne — giữ lại income history cho xe đã confirm (status:'3')
    return this.vehicleModel.updateOne({ _id }, { isDeleted: true });
  }
}
