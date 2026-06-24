import { IsMongoId, IsNotEmpty, IsOptional } from "class-validator";

export class CreateVehicleDto {
    @IsOptional()
    type: string;
    @IsOptional()
    price: string;
    @IsOptional()
    licensePlate: string;
    @IsOptional()
    shippingPrice: string;
    @IsOptional()
    @IsMongoId()
    userId: string;
    // roomId tùy chọn: khách thuê có thể nhập phương tiện TRƯỚC khi có phòng.
    // Khi chủ trọ xác nhận cho thuê, xe sẽ được gắn vào phòng tự động.
    @IsOptional()
    @IsMongoId()
    roomId?: string;
    @IsOptional()
    fromDate: Date;
    @IsOptional()
    toDate: Date;
    @IsOptional()
    status: string;
}
