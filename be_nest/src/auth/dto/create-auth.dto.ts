import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateAuthDto {
    @IsEmail()
    @IsNotEmpty({ message: "email khong duoc de trong" })
    email: string;
    @IsNotEmpty({ message: "password khong duoc de trong" })
    password: string;
    @IsNotEmpty({ message: "name khong duoc de trong" })
    name: string;

    @IsNotEmpty({ message: "phone khong duoc de trong" })
    phone: string;

    @IsNotEmpty({ message: "address khong duoc de trong" })
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
