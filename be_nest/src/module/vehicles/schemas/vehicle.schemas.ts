import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import moment from 'moment';
import mongoose, { HydratedDocument } from 'mongoose';
import { Room } from 'src/module/rooms/schemas/room.entity';
import { User } from 'src/module/users/schemas/user.schema';

export type VehicleDocument = HydratedDocument<Vehicle>;

@Schema({ timestamps: true })
export class Vehicle {
    @Prop()
    type: string;
    @Prop({ default: "VND" })
    price: string;
    @Prop()
    licensePlate: string;
    @Prop()
    shippingPrice: string;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
    userId: mongoose.Schema.Types.ObjectId; // id chủ sở hữu
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Room.name })
    roomId: mongoose.Schema.Types.ObjectId;
    @Prop()
    fromDate: Date;
    @Prop()
    toDate: Date;
    @Prop({ default: '1' })
    status: string;
}
export const VehicleSchema = SchemaFactory.createForClass(Vehicle);

// VehicleSchema.pre<VehicleDocument>('save', function (next) {
//     const vnNow = moment().tz('Asia/Ho_Chi_Minh'); // giờ Việt Nam

//     if (!this.fromDate) {
//         this.fromDate = vnNow.toDate();
//     }

//     if (!this.toDate) {
//         const oneMonthAgo = vnNow.clone().subtract(1, 'month');
//         this.toDate = oneMonthAgo.toDate();
//     }
// });