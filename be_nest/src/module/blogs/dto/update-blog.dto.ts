import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import { BlogContent } from '../schemas/blog.schemas';

export class UpdateBlogDto {
    @IsMongoId({ message: "_id không hợp lệ" })
    @IsNotEmpty({ message: "_id không được để trống" })
    _id: string;
    @IsOptional()
    title: string;
    @IsOptional()
    mainImage: string;
    @IsOptional()
    introduce: string;
    @IsOptional()
    Content: BlogContent[];
    @IsOptional()
    conclusion: string;
    @IsOptional()
    rating: string;
}
