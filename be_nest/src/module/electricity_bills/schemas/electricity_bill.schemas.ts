import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Room } from 'src/module/rooms/schemas/room.entity';

export type ElectricityBillDocument = HydratedDocument<ElectricityBill>;

@Schema({ timestamps: true })
export class ElectricityBill {
    @Prop()
    eletricPrice: string;
    @Prop()
    amount: string;
    @Prop()
    payment: string;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Room.name })
    roomId: mongoose.Schema.Types.ObjectId;
    @Prop()
    fromDate: Date;
    @Prop()
    toDate: Date;
    @Prop({ default: '1' })
    status: string;
    // Soft-delete: ẩn khỏi danh sách nhưng giữ lại để không mất lịch sử doanh thu điện
    @Prop({ default: false })
    isDeleted: boolean;
}
export const ElectricityBillSchema = SchemaFactory.createForClass(ElectricityBill);
