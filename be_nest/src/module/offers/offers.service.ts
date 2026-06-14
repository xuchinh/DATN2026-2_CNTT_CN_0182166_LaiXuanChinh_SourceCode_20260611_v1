import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Offer } from './schemas/offer.schemas';
import aqp from 'api-query-params';

@Injectable()
export class OffersService {
  constructor(
    @InjectModel(Offer.name)
    private offerModel: Model<Offer>,
  ) { }

  //fun check code exists
  isCodeExist = async (code: string) => {
    const offer = await this.offerModel.exists({ code });
    if (offer) return true;
    return false;
  }

  async create(createOfferDto: CreateOfferDto) {
    const {
      code, name, description, discountCurrency, discountPercentage, isActive, condition } = createOfferDto;

    const isExistCode = await this.isCodeExist(code);
    if (isExistCode) {
      throw new BadRequestException(`Mã khuyến mãi ${code} đã tồn tại hãy dùng mã khác`)
    }

    const offer = await this.offerModel.create({
      code, name, description, discountCurrency, discountPercentage, isActive, condition
    })
    return {
      _id: offer.id
    }
  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    if (!current) current = 1;
    if (!pageSize) pageSize = 10;
    const totalItems = (await this.offerModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (current - 1) * (pageSize);
    const results = await this.offerModel
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
    return `This action returns a #${id} offer`;
  }

  async update(updateOfferDto: UpdateOfferDto) {
    return await this.offerModel.updateOne(
      { _id: updateOfferDto._id }, { ...updateOfferDto });
  }

  remove(_id: string) {
    if (mongoose.isValidObjectId(_id)) {
      return this.offerModel.deleteOne({ _id })
    } else {
      throw new BadRequestException("_id không đúng định dạng")
    }
  }
}
