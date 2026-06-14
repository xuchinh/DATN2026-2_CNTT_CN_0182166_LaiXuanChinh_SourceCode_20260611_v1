import { IsMongoId, IsNotEmpty, IsOptional } from "class-validator";

export class CreateRepReviewDto {
    @IsOptional()
    comment: string;
    @IsOptional()
    image: string;
    @IsOptional()
    expression: string;
    @IsMongoId({ message: "_id không hợp lệ" })
    @IsNotEmpty({ message: "userId không được để trống" })
    userId: string;
    @IsMongoId({ message: "_id không hợp lệ" })
    @IsOptional()
    reviewId: string;
    @IsMongoId({ message: "_id không hợp lệ" })
    @IsOptional()
    repReviewId: string;
}
