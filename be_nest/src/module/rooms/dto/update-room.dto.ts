import { PartialType } from '@nestjs/mapped-types';
import { CreateRoomDto } from './create-room.dto';
import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateRoomDto {
    @IsMongoId({ message: "_id không hợp lệ" })
    @IsNotEmpty({ message: "_id không được để trống" })
    _id: string;
    @IsOptional()
    code: string;
    @IsOptional()
    acreage: string;
    @IsOptional()
    kitchen: boolean;
    @IsOptional()
    toilet: boolean;
    @IsOptional()
    washroom: boolean;
    @IsOptional()
    totalPeople: string;
    @IsOptional()
    price: string;
    @IsOptional()
    status: boolean;
    @IsOptional()
    @IsMongoId({ message: '_id không hợp lệ' })
    userId: string;
    @IsOptional()
    @IsMongoId({ message: '_id không hợp lệ' })
    buildingId: string;
    @IsOptional()
    fromDate: Date;
    @IsOptional()
    toDate: Date;
    @IsOptional()
    totalMonth: string;
    @IsOptional()
    paymentsDate: Date;
    @IsOptional()
    statusPayment: string;
    @IsOptional()
    payment: string;
}
