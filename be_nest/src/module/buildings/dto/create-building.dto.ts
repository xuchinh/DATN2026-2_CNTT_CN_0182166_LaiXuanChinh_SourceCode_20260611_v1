import { IsMongoId, IsNotEmpty, IsOptional } from "class-validator";

export class CreateBuildingDto {
    @IsNotEmpty({ message: "name không được để trống" })
    name: string;
    @IsNotEmpty({ message: "name không được để trống" })
    address: string;
    @IsNotEmpty({ message: "name không được để trống" })
    totalRooms: number;
    @IsNotEmpty({ message: "name không được để trống" })
    numberOfPeopleRoom: number;
    @IsOptional()
    numberOfRoomsRented: number;
    @IsOptional()
    priceOfRoom: number;
    @IsOptional()
    rating: number;
    @IsNotEmpty({ message: "userId không được để trống" })
    @IsMongoId({ message: 'userId phải là MongoId hợp lệ' })
    userId: string
    @IsOptional()
    shippingPrice: number; // giá gửi xe

}
