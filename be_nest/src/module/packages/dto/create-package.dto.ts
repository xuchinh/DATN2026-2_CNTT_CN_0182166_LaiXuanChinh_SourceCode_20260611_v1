import { IsArray, IsMongoId, IsNotEmpty, IsOptional } from "class-validator";

export class CreatePackageDto {
    @IsNotEmpty({ message: "code không được để trống" })
    code: string;
    @IsNotEmpty({ message: "name không được để trống" })
    name: string;
    @IsNotEmpty({ message: "description không được để trống" })
    description: string;
    @IsOptional()
    price: string;
    @IsOptional()
    isActive: boolean;
    @IsArray()
    @IsNotEmpty({ message: "code package không được để trống" })
    @IsMongoId({ each: true, message: 'Mỗi phần tử trong features phải là MongoId' })
    features: string[];
    @IsOptional()
    totalBuilding: string;
}
