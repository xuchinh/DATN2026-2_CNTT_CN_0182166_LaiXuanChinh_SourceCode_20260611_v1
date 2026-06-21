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
    // Lịch sử các lần xác nhận thanh toán — mỗi lần confirm push thêm 1 entry
    // userId: khách ứng với lần thu này → cho phép nhiều khách trong cùng phòng/tháng đều được cộng dồn
    @Prop({ type: [{ date: Date, price: String, userId: { type: mongoose.Schema.Types.ObjectId, ref: User.name } }], default: [] })
    paymentHistory: { date: Date; price: string; userId?: mongoose.Schema.Types.ObjectId }[];
    // Soft-delete: ẩn phòng khỏi danh sách nhưng giữ paymentHistory để không mất doanh thu phòng
    @Prop({ default: false })
    isDeleted: boolean;
}
export const RoomSchema = SchemaFactory.createForClass(Room);
// paymentsDate chỉ được set khi xác nhận thanh toán, không tự set từ fromDate