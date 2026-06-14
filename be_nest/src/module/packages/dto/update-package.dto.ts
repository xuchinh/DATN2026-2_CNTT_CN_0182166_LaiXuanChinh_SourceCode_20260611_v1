import { PartialType } from '@nestjs/mapped-types';
import { CreatePackageDto } from './create-package.dto';
import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdatePackageDto extends PartialType(CreatePackageDto) {
    @IsMongoId({ message: "_id không hợp lệ" })
    @IsNotEmpty({ message: "_id không được để trống" })
    _id: string;
    @IsOptional()
    name: string;
    @IsOptional()
    description: string;
    @IsOptional()
    price: string;
    @IsOptional()
    isActive: boolean;
    @IsOptional()
    features: string[];
    @IsOptional()
    totalBuilding: string;
}
