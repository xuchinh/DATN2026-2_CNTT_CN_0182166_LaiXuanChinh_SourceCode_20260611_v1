import { PartialType } from '@nestjs/mapped-types';
import { CreateReviewDto } from './create-review.dto';
import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateReviewDto {
    @IsMongoId({ message: "_id không hợp lệ" })
    @IsNotEmpty({ message: "_id không được để trống" })
    _id: string;
    @IsOptional()
    rating: string;
    @IsOptional()
    comment: string;
    @IsOptional()
    image: string;
    @IsOptional()
    expression: string;
}
