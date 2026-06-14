import { PartialType } from '@nestjs/mapped-types';
import { CreateBuildingDto } from './create-building.dto';
import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateBuildingDto {
    @IsMongoId({ message: "_id không hợp lệ" })
    @IsNotEmpty({ message: "_id không được để trống" })
    _id: string;
    @IsOptional()
    name: string;
    @IsOptional()
    address: string;
    @IsOptional()
    totalRooms: number;
    @IsOptional()
    numberOfPeopleRoom: number;
    @IsOptional()
    numberOfRoomsRented: number;
    @IsOptional()
    rating: number;
    @IsOptional()
    userId: string;
    @IsOptional()
    income: string;
    @IsOptional()
    priceOfRoom: number;
    @IsOptional()
    shippingPrice: number;
}
