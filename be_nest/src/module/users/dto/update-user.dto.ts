import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateUserDto {
    @IsMongoId({ message: "_id không hợp lệ" })
    @IsNotEmpty({ message: "_id không được để trống" })
    _id: string;
    @IsOptional()
    name: string;
    @IsOptional()
    phone: string;
    @IsOptional()
    address: string;
    @IsOptional()
    avatar: string;
    @IsOptional()
    role: string;
    @IsOptional()
    totalHouse: string;
    @IsOptional()
    totalHousePackage: string;
    @IsOptional()
    fromDate: Date;
    @IsOptional()
    toDate: Date;
    @IsOptional()
    status: boolean;
    @IsOptional()
    packageId: string
    @IsOptional()
    totalMonth: string
    @IsOptional()
    payment: string
    @IsOptional()
    totalMonthUpdate: string
    @IsOptional()
    paymentUpdate: string
    @IsOptional()
    statusPayment: boolean;
    @IsOptional()
    toDateUpdate: Date;
    @IsOptional()
    statusPaymentUpdate: boolean;
    @IsOptional()
    bankAccount: string;
    @IsOptional()
    bank: string;
    // Cờ tạm (không lưu vào DB): khi = true, backend push 1 entry doanh thu vào paymentHistory
    @IsOptional()
    recordPackageRevenue?: boolean;
    // Số tiền ghi nhận cho lần thanh toán này (mua mới = payment, gia hạn = paymentUpdate)
    @IsOptional()
    revenueAmount?: number;
}
