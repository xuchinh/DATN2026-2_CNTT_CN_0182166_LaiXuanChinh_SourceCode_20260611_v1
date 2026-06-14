import { IsMongoId, IsNotEmpty, IsOptional } from "class-validator";

export class CreateReviewDto {
    @IsOptional()
    rating: string;
    @IsOptional()
    comment: string;
    @IsOptional()
    image: string;
    @IsOptional()
    expression: string;
    @IsMongoId({ message: "_Id không hợp lệ" })
    @IsNotEmpty({ message: "userId không được để trống" })
    userId: string;
    @IsMongoId({ message: "_Id không hợp lệ" })
    @IsNotEmpty({ message: "buildingId không được để trống" })
    buildingId: string;
    @IsMongoId({ message: "_Id không hợp lệ" })
    @IsNotEmpty({ message: "blogId không được để trống" })
    blogId: string;
}
