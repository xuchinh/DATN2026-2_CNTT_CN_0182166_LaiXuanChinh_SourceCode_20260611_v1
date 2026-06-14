import { IsEmail, IsEmpty, IsNotEmpty, IsOptional } from "class-validator";
import mongoose from "mongoose";

export class CreateUserDto {
    @IsNotEmpty({ message: "name không được để trống" })
    name: string;
    @IsNotEmpty({ message: "email không được để trống" })

    @IsEmail({}, { message: "email không đúng định dạng" })
    email: string;
    @IsNotEmpty({ message: "password không được để trống" })
    password: string;
    @IsNotEmpty({ message: "phone không được để trống" })
    phone: string;
    @IsOptional()
    address: string;
    @IsOptional()
    avatar: string;
    @IsOptional()
    packageId: string
}
