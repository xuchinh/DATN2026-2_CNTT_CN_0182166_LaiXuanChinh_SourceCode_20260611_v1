import { PartialType } from '@nestjs/mapped-types';
import { CreateRepReviewDto } from './create-rep_review.dto';
import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateRepReviewDto {
    @IsMongoId({ message: "_id không hợp lệ" })
    @IsNotEmpty({ message: "_id không được để trống" })
    _id: string;
    @IsOptional()
    comment: string;
    @IsOptional()
    image: string;
    @IsOptional()
    expression: string;
}
