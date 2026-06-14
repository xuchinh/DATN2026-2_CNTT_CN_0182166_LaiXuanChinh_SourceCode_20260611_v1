import { IsMongoId, IsNotEmpty, IsOptional } from "class-validator";

export class CreateRoomDto {
    @IsNotEmpty({ message: "code không được để trống" })
    code: string;
    @IsNotEmpty({ message: "diện tích không được để trống" })
    acreage: string;
    @IsOptional()
    kitchen: boolean;
    @IsOptional()
    toilet: boolean;
    @IsOptional()
    washroom: boolean;
    @IsNotEmpty({ message: "số người tối đa không được để trống" })
    totalPeople: string;
    @IsNotEmpty({ message: "giá không được để trống" })
    price: string;
    @IsOptional()
    status: boolean;
    @IsOptional()
    @IsMongoId({ message: '_id không hợp lệ' })
    userId: string;
    @IsNotEmpty({ message: "Chủ nhà không được để trống" })
    @IsMongoId({ message: '_id không hợp lệ' })
    buildingId: string;
    @IsOptional()
    payment: string;
    @IsOptional()
    statusPayment: string;
}
