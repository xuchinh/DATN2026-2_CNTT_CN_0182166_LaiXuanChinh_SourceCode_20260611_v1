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
    @IsNotEmpty({ message: "Phòng không được để trống" })
    @IsMongoId()
    roomId: string;
    @IsOptional()
    fromDate: Date;
    @IsOptional()
    toDate: Date;
    @IsOptional()
    status: string;
}
