import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Package } from 'src/module/packages/schemas/package.schemas';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @Prop()
    name: string;

    @Prop()
    email: string;

    @Prop()
    password: string;

    @Prop()
    phone: string;

    @Prop()
    address?: string;

    @Prop()
    avatar?: string;

    @Prop({ default: "USERS" })
    role?: string;

    @Prop({ default: "LOCAL" })
    accountType?: string;

    @Prop({ default: false })
    isActive?: boolean;

    @Prop()
    codeId?: string;

    @Prop()
    codeExpired?: Date;

    @Prop({ default: "0" })
    totalHouse?: string;

    @Prop({ default: "0" })
    totalHousePackage?: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Package.name })
    packageId: mongoose.Schema.Types.ObjectId;
    @Prop()
    fromDate: Date;
    @Prop()
    toDate: Date;
    @Prop({ default: false })
    status: boolean;
    @Prop()
    totalMonth: string;
    @Prop()
    payment: string;
    @Prop()
    paymentUpdate: string
    @Prop({ default: false })
    statusPayment: boolean;
    @Prop({ default: false })
    statusPaymentUpdate: boolean;
    @Prop()
    toDateUpdate: Date;
    @Prop()
    totalMonthUpdate: string
    @Prop()
    bank: string
    @Prop()
    bankAccount: string
}

export const UserSchema = SchemaFactory.createForClass(User);
