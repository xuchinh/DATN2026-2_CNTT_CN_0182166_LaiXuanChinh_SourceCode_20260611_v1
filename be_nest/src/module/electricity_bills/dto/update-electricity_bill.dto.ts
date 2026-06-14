import { PartialType } from '@nestjs/mapped-types';
import { CreateElectricityBillDto } from './create-electricity_bill.dto';
import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateElectricityBillDto {
    @IsMongoId({ message: "_id không hợp lệ" })
    @IsNotEmpty({ message: "_id không được để trống" })
    _id: string;
    @IsOptional()
    eletricPrice: string;
    @IsOptional()
    amount: string;
    @IsOptional()
    payment: string;
    @IsOptional()
    userId: string;
    @IsOptional()
    roomId: string;
    @IsOptional()
    fromDate: string;
    @IsOptional()
    toDate: string;
    @IsOptional()
    status: string;
}
