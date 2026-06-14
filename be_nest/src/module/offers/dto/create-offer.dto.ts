import { IsEmpty, IsNotEmpty, IsOptional } from "class-validator";

export class CreateOfferDto {
    @IsNotEmpty({ message: "code không được để trống" })
    code: string;
    @IsNotEmpty({ message: "name không được để trống" })
    name: string;
    @IsNotEmpty({ message: "description không được để trống" })
    description: string;
    @IsOptional()
    discountPercentage: number;
    @IsOptional()
    discountCurrency: string;
    @IsOptional()
    condition: number;
    @IsOptional()
    isActive: boolean;
}


// @Prop()
// code: string;
// @Prop()
// name: string;
// @Prop()
// description: string;
// @Prop({ default: '' })
// discountPercentage?: string;
// @Prop({ default: 'VND' })
// discountCurrency?: string;
// @Prop()
// deletedAt?: Date;
// @Prop({ default: true })
// isActive: boolean;