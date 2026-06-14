import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Review, ReviewDocument } from './schemas/review.schemas';
import mongoose, { Model } from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
  ) { }

  async create(createReviewDto: CreateReviewDto) {
    {
      const {
        rating,
        comment,
        image,
        expression,
        userId,
        buildingId,
        blogId
      } = createReviewDto;
      const review = await this.reviewModel.create({
        rating,
        comment,
        image,
        expression,
        userId,
        buildingId,
        blogId
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

    const totalItems = (await this.reviewModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);

    const skip = (current - 1) * (pageSize);

    const results = await this.reviewModel
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
    return `This action returns a #${id} review`;
  }

  async update(updateReviewDto: UpdateReviewDto) {
    return await this.reviewModel.updateOne(
      { _id: updateReviewDto._id }, { ...updateReviewDto });
  }

  remove(_id: string) {
    if (mongoose.isValidObjectId(_id)) {
      return this.reviewModel.deleteOne({ _id })
    } else {
      throw new BadRequestException("_id không đúng định dạng")
    }
  }
}
