import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from './schemas/blog.schemas';
import mongoose, { Model } from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
  ) { }

  async create(createBlogDto: CreateBlogDto) {
    const {
      title,
      mainImage,
      introduce,
      Content,
      conclusion,
      userId,
      buildingId
    } = createBlogDto;
    if (buildingId) {
      const existedBlog = await this.blogModel.findOne({ buildingId, isDeleted: { $ne: true } });
      if (existedBlog) {
        throw new BadRequestException('Mỗi nhà trọ (building) chỉ được tạo 1 blog.');
      }
    }

    const blog = await this.blogModel.create({
      title,
      mainImage,
      introduce,
      Content,
      conclusion,
      userId,
      buildingId
    })
    return {
      _id: blog._id
    }
  }


  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;
    // Ẩn bài viết đã soft-delete khỏi danh sách
    filter.isDeleted = { $ne: true };

    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const totalItems = (await this.blogModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);

    const skip = (current - 1) * (pageSize);

    const results = await this.blogModel
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
    return `This action returns a #${id} blog`;
  }

  async update(updateBlogDto: UpdateBlogDto) {
    return await this.blogModel.updateOne(
      { _id: updateBlogDto._id }, { ...updateBlogDto });
  }

  remove(_id: string) {
    if (mongoose.isValidObjectId(_id)) {
      // Soft-delete: ẩn bài viết, vẫn giữ lại để khôi phục
      return this.blogModel.updateOne({ _id }, { isDeleted: true })
    } else {
      throw new BadRequestException("_id không đúng định dạng")
    }
  }
}
