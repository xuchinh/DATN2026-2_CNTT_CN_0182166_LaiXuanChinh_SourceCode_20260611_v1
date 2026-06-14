import { IsMongoId, IsNotEmpty, IsOptional } from "class-validator";

export class CreateElectricityBillDto {
    @IsOptional()
    eletricPrice: string;
    @IsOptional()
    amount: string;
    @IsOptional()
    payment: string;
    @IsOptional()
    userId: string;
    @IsMongoId()
    @IsOptional()
    roomId: string;
    @IsOptional()
    fromDate: string;
    @IsOptional()
    toDate: string;
    @IsOptional()
    status: string;
}
