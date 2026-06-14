import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import moment from 'moment';
import mongoose, { HydratedDocument } from 'mongoose';
import { Building } from 'src/module/buildings/schemas/building.schemas';
import { User } from 'src/module/users/schemas/user.schema';

export type RoomDocument = HydratedDocument<Room>;

@Schema({ timestamps: true })
export class Room {
    @Prop()
    code: string;
    @Prop()
    acreage: string;
    @Prop({ default: true })
    kitchen: boolean;
    @Prop({ default: true })
    toilet: boolean;
    @Prop({ default: true })
    washroom: boolean;
    @Prop()
    totalPeople: string;
    @Prop()
    price: string;
    @Prop()
    totalMonth: string;
    @Prop()
    payment: string
    @Prop({ default: false })
    status: boolean;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
    userId: mongoose.Schema.Types.ObjectId;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Building.name })
    buildingId: mongoose.Schema.Types.ObjectId;
    @Prop()
    fromDate: Date;
    @Prop()
    toDate: Date;
    @Prop()
    paymentsDate: Date
    @Prop({ default: '1' })
    statusPayment: string;
}
export const RoomSchema = SchemaFactory.createForClass(Room);
RoomSchema.pre<RoomDocument>('save', function (next) {
    if (!this.paymentsDate && this.fromDate) {
        this.paymentsDate = this.fromDate;
    }
    next();
});