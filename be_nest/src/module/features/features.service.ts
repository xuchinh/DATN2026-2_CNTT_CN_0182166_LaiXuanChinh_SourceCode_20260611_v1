import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Feature } from './schemas/feature.schemas';
import aqp from 'api-query-params';

@Injectable()
export class FeaturesService {
  constructor(
    @InjectModel(Feature.name)
    private featuresModel: Model<Feature>,
  ) { }
  //fun check code exists
  isCodeExist = async (code: string) => {
    const features = await this.featuresModel.exists({ code });
    if (features) return true;
    return false;
  }

  async create(createFeatureDto: CreateFeatureDto) {
    const { code, name, systemRoles, path, description, displayName, menuCode } = createFeatureDto;

    const isExistCode = await this.isCodeExist(code);
    if (isExistCode) {
      throw new BadRequestException(`Mã chức năng ${code} đã tồn tại hãy dùng mã khác`)
    }

    const features = await this.featuresModel.create({
      code, name, systemRoles, path, description, displayName, menuCode
    })
    return {
      _id: features.id
    }
  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    if (!current) current = 1;
    if (!pageSize) pageSize = 10;
    const totalItems = (await this.featuresModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (current - 1) * (pageSize);
    const results = await this.featuresModel
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
    return `This action returns a #${id} feature`;
  }

  async update(updateFeatureDto: UpdateFeatureDto) {
    return await this.featuresModel.updateOne(
      { _id: updateFeatureDto._id }, { ...updateFeatureDto });
  }


  remove(_id: string) {
    if (mongoose.isValidObjectId(_id)) {
      return this.featuresModel.deleteOne({ _id })
    } else {
      throw new BadRequestException("_id không đúng định dạng")
    }
  }
}
