import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateFeatureDto {
    @IsNotEmpty({ message: "code không được để trống" })
    code: string;
    @IsNotEmpty({ message: "name không được để trống" })
    name: string;
    @IsNotEmpty({ message: "systemRoles không được để trống" })
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
