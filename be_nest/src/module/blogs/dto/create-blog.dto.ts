import { IsMongoId, IsNotEmpty, IsOptional } from "class-validator";
import { BlogContent } from "../schemas/blog.schemas";

export class CreateBlogDto {
    @IsNotEmpty({ message: "Giá nước không được để trống" })
    title: string;
    @IsOptional()
    mainImage: string;
    @IsOptional()
    introduce: string;
    @IsOptional()
    Content: BlogContent[];
    @IsOptional()
    conclusion: string;
    @IsMongoId()
    @IsNotEmpty({ message: "userId không được để trống" })
    userId: string;
    @IsOptional()
    buildingId: string;
}
