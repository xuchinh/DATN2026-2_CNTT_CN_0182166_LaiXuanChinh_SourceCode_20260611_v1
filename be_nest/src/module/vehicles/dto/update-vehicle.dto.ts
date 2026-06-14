import { PartialType } from '@nestjs/mapped-types';
import { CreateVehicleDto } from './create-vehicle.dto';
import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateVehicleDto {
    @IsMongoId({ message: "_id không hợp lệ" })
    @IsNotEmpty({ message: "_id không được để trống" })
    _id: string;
    @IsOptional()
    type: string;
    @IsOptional()
    price: string;
    @IsOptional()
    licensePlate: string;
    @IsOptional()
    shippingPrice: string;
    @IsOptional()
    userId: string;
    @IsOptional()
    roomId: string;
    @IsOptional()
    fromDate: Date;
    @IsOptional()
    toDate: Date;
    @IsOptional()
    status: string
}
