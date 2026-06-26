import { IsIn, IsMongoId, IsNotEmpty, IsOptional } from "class-validator";

// Chủ trọ duyệt (accept) hoặc từ chối (reject) 1 yêu cầu thuê.
export class DecideRentalRequestDto {
    @IsNotEmpty({ message: "roomId không được để trống" })
    @IsMongoId({ message: "roomId không hợp lệ" })
    roomId: string;

    @IsNotEmpty({ message: "requestUserId không được để trống" })
    @IsMongoId({ message: "requestUserId không hợp lệ" })
    requestUserId: string;

    @IsNotEmpty({ message: "decision không được để trống" })
    @IsIn(['accept', 'reject'], { message: "decision phải là 'accept' hoặc 'reject'" })
    decision: 'accept' | 'reject';

    // Khi duyệt: chủ trọ có thể chốt lại số tháng / ngày bắt đầu (nếu không gửi sẽ lấy theo yêu cầu của khách).
    @IsOptional()
    totalMonth?: string;

    @IsOptional()
    fromDate?: Date;
}
