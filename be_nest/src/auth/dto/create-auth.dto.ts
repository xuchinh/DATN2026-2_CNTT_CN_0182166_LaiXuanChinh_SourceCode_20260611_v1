import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateAuthDto {
    @IsEmail()
    @IsNotEmpty({ message: "email không được để trống" })
    email: string;
    @IsNotEmpty({ message: "password không được để trống" })
    password: string;
    @IsNotEmpty({ message: "name không được để trống" })
    name: string;

    @IsNotEmpty({ message: "phone không được để trống" })
    phone: string;

    @IsNotEmpty({ message: "address không được để trống" })
    address?: string;
}

export class CodeAuthDto {

    @IsNotEmpty({ message: "_id không được để trống" })
    _id: string;

    @IsNotEmpty({ message: "code không được để trống" })
    code: string;

}


export class ChangePasswordAuthDto {
    @IsNotEmpty({ message: "code không được để trống" })
    code: string;

    @IsNotEmpty({ message: "password không được để trống" })
    password: string;

    @IsNotEmpty({ message: "confirmPassword không được để trống" })
    confirmPassword: string;

    @IsNotEmpty({ message: "email không được để trống" })
    email: string;

}
