import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRepReviewDto } from './dto/create-rep_review.dto';
import { UpdateRepReviewDto } from './dto/update-rep_review.dto';
import { InjectModel } from '@nestjs/mongoose';
import { RepReview, RepReviewDocument } from './schemas/rep_review.schemas';
import mongoose, { Model } from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class RepReviewService {
  constructor(
    @InjectModel(RepReview.name) private rebReviewModel: Model<RepReviewDocument>,
  ) { }

  async create(createRepReviewDto: CreateRepReviewDto) {
    {
      const {
        comment,
        image,
        expression,
        userId,
        reviewId,
        repReviewId
      } = createRepReviewDto;
      const review = await this.rebReviewModel.create({
        comment,
        image,
        expression,
        userId,
        reviewId,
        repReviewId
      })
      return {
        _id: review._id
      }
    }
  }


  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const totalItems = (await this.rebReviewModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);

    const skip = (current - 1) * (pageSize);

    const results = await this.rebReviewModel
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
    return `This action returns a #${id} repReview`;
  }

  async update(updateRepReviewDto: UpdateRepReviewDto) {
    return await this.rebReviewModel.updateOne(
      { _id: updateRepReviewDto._id }, { ...updateRepReviewDto });
  }

  remove(_id: string) {
    if (mongoose.isValidObjectId(_id)) {
      return this.rebReviewModel.deleteOne({ _id })
    } else {
      throw new BadRequestException("_id không đúng định dạng")
    }
  }
}
