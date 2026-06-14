import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/module/users/schemas/user.schema';

export type BuildingDocument = HydratedDocument<Building>;

@Schema({ timestamps: true })
export class Building {
    @Prop()
    name: string;
    @Prop()
    address: string;
    @Prop()
    priceOfRoom: number; // giá trung bình mỗi phòng
    @Prop()
    totalRooms: number; // tổng số phòng
    @Prop()
    numberOfRoomsRented: number; //Số phòng đã cho thuê
    @Prop()
    numberOfPeopleRoom: number; //số người tối đã cho 1 phòng
    @Prop()
    rating: number;
    @Prop()
    shippingPrice: number;
    @Prop()
    income: string; //tổng thu nhập
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
    userId: mongoose.Schema.Types.ObjectId // id chủ nhà
}
export const BuildingSchema = SchemaFactory.createForClass(Building);