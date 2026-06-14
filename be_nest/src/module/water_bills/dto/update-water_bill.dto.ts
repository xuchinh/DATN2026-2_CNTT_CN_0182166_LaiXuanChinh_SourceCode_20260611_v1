import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateWaterBillDto {
    @IsMongoId({ message: "_id không hợp lệ" })
    @IsNotEmpty({ message: "_id không được để trống" })
    _id: string;
    @IsOptional()
    waterPrice: string;
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
