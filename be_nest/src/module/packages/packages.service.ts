import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Package } from './schemas/package.schemas';
import mongoose, { Model } from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class PackagesService {
  constructor(
    @InjectModel(Package.name)
    private packageModel: Model<Package>,
  ) { }


  //fun check code exists
  isCodeExist = async (code: string) => {
    const offer = await this.packageModel.exists({ code });
    if (offer) return true;
    return false;
  }

  async create(createPackageDto: CreatePackageDto) {
    const { code, name, description, price, isActive, features, totalBuilding } = createPackageDto;

    const isExistCode = await this.isCodeExist(code);
    if (isExistCode) {
      throw new BadRequestException(`Mã gói ${code} đã tồn tại hãy dùng mã khác`)
    }

    const packages = await this.packageModel.create({
      code, name, description, price, isActive, features, totalBuilding
    })
    return {
      _id: packages.id
    }
  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;
    if (filter.search) delete filter.search;

    if (query.search) {
      filter.$or = [
        { code: { $regex: query.search, $options: 'i' } },
        { name: { $regex: query.search, $options: 'i' } },
      ];
    }

    if (!current) current = 1;
    if (!pageSize) pageSize = 10;
    const totalItems = (await this.packageModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (current - 1) * (pageSize);
    const results = await this.packageModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      .select("-password")
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
    return `This action returns a #${id} package`;
  }




  async update(updatePackageDto: UpdatePackageDto) {
    return await this.packageModel.updateOne(
      { _id: updatePackageDto._id }, { ...updatePackageDto });
  }

  remove(_id: string) {
    if (mongoose.isValidObjectId(_id)) {
      return this.packageModel.deleteOne({ _id })
    } else {
      throw new BadRequestException("_id không đúng định dạng")
    }
  }
}
