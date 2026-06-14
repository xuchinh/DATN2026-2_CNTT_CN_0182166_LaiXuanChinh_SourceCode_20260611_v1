import { PartialType } from '@nestjs/mapped-types';
import { CreateFeatureDto } from './create-feature.dto';
import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateFeatureDto {
    @IsMongoId({ message: "_id không hợp lệ" })
    @IsNotEmpty({ message: "_id không được để trống" })
    _id: string;
    // @IsOptional()
    // code: string;
    @IsOptional()
    name: string;
    @IsOptional()
    systemRoles: string;
    @IsOptional()
    path: string;
    @IsOptional()
    description: string;
    @IsOptional()
    displayName: string;
    @IsOptional()
    menuCode: string;
}
