import { IsMongoId, IsNotEmpty, IsOptional } from "class-validator";

// Khách (đã đăng nhập) bấm "Liên hệ thuê nhà" → tạo 1 yêu cầu thuê (chưa gán phòng).
export class CreateRentalRequestDto {
    @IsNotEmpty({ message: "roomId không được để trống" })
    @IsMongoId({ message: "roomId không hợp lệ" })
    roomId: string;

    @IsNotEmpty({ message: "userId không được để trống" })
    @IsMongoId({ message: "userId không hợp lệ" })
    userId: string;

    @IsOptional()
    message?: string;

    @IsOptional()
    desiredFromDate?: Date;

    @IsOptional()
    desiredMonths?: string;
}
