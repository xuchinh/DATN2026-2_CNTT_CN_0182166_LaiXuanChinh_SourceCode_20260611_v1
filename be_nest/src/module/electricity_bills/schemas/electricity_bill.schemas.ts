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
}
export const ElectricityBillSchema = SchemaFactory.createForClass(ElectricityBill);

// ElectricityBillSchema.pre<ElectricityBillDocument>('save', function (next) {
//     const vnNow = moment().tz('Asia/Ho_Chi_Minh'); // giờ Việt Nam

//     if (!this.toDate) {
//         this.toDate = vnNow.toDate();
//     }

//     if (!this.fromDate) {
//         const oneMonthAgo = vnNow.clone().subtract(1, 'month');
//         this.fromDate = oneMonthAgo.toDate();
//     }
//     const amount = parseFloat(this.amount || '0');
//     const price = parseFloat(this.eletricPrice || '0');

//     const total = amount * price;
//     this.payment = total.toString();
//     next();
// });
