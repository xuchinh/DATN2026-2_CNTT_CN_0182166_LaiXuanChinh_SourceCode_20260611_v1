import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateOfferDto {
    @IsMongoId({ message: "_id không hợp lệ" })
    @IsNotEmpty({ message: "_id không được để trống" })
    _id: string;
    @IsOptional()
    code: string;
    @IsOptional()
    name: string;
    @IsOptional()
    description: string;
    @IsOptional()
    discountPercentage: number;
    @IsOptional()
    discountCurrency: string;
    @IsOptional()
    isActive: boolean;
    @IsOptional()
    condition: string;
}
