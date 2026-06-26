import { IsMongoId, IsNotEmpty } from "class-validator";

// Khách tự xóa (hủy) yêu cầu thuê của mình ở 1 phòng.
export class CancelRentalRequestDto {
    @IsNotEmpty({ message: "roomId không được để trống" })
    @IsMongoId({ message: "roomId không hợp lệ" })
    roomId: string;

    @IsNotEmpty({ message: "userId không được để trống" })
    @IsMongoId({ message: "userId không hợp lệ" })
    userId: string;
}
