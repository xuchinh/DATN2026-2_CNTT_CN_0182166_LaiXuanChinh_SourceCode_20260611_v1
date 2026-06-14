import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Room, RoomDocument } from './schemas/room.entity';
import mongoose, { Model } from 'mongoose';
import aqp from 'api-query-params';
import moment from 'moment';
import { Building } from '../buildings/schemas/building.schemas';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
    @InjectModel(Building.name)
    private buildingModel: Model<Building>,
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
      buildingId
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
    // Đếm số lượng nhà hiện tại
    const roomCount = await this.roomModel.countDocuments({ buildingId });
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
    const { _id, fromDate, totalMonth, price } = updateRoomDto;

    // Tạo bản sao dữ liệu cập nhật
    const updatedData: any = { ...updateRoomDto };

    // Nếu có fromDate và totalMonth, thì tính lại toDate
    if (fromDate && totalMonth) {
      updatedData.toDate = moment(fromDate).add(Number(totalMonth), 'months').toDate();
    }

    // Nếu có price và totalMonth, thì tính lại payment
    if (price && totalMonth) {
      updatedData.payment = Number(totalMonth) * Number(price);
    }
    return await this.roomModel.updateOne({ _id }, updatedData);
  }

  remove(_id: string) {
    if (mongoose.isValidObjectId(_id)) {
      return this.roomModel.deleteOne({ _id })
    } else {
      throw new BadRequestException("_id không đúng định dạng")
    }
  }
}
