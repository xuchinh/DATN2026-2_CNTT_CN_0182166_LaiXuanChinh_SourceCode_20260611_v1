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
    // Ảnh của phòng (mảng URL từ /api/upload). Có thứ tự → ảnh đầu là ảnh bìa,
    // counter "1/N" tính theo index trong mảng.
    @Prop({ type: [String], default: [] })
    images: string[];
    // Lịch sử các lần xác nhận thanh toán — mỗi lần confirm push thêm 1 entry
    // userId: khách ứng với lần thu này → cho phép nhiều khách trong cùng phòng/tháng đều được cộng dồn
    @Prop({ type: [{ date: Date, price: String, userId: { type: mongoose.Schema.Types.ObjectId, ref: User.name } }], default: [] })
    paymentHistory: { date: Date; price: string; userId?: mongoose.Schema.Types.ObjectId }[];
    // Yêu cầu thuê nhà: khách bấm "Liên hệ thuê nhà" → push 1 entry status 'pending'.
    // Chủ trọ duyệt/từ chối trong dashboard. KHÔNG gán phòng trực tiếp khi khách bấm
    // → tránh race condition (2 khách cùng "thuê" ghi đè userId của nhau). Việc gán phòng
    // là quyết định thủ công, đơn lẻ của chủ trọ nên không bao giờ trùng.
    @Prop({
        type: [{
            userId: { type: mongoose.Schema.Types.ObjectId, ref: User.name },
            message: String,
            desiredFromDate: Date,
            desiredMonths: String,
            status: { type: String, default: 'pending' }, // pending | accepted | rejected | cancelled
            createdAt: { type: Date, default: Date.now },
        }],
        default: [],
    })
    rentalRequests: {
        userId: mongoose.Schema.Types.ObjectId;
        message?: string;
        desiredFromDate?: Date;
        desiredMonths?: string;
        status: string;
        createdAt: Date;
    }[];
    // Soft-delete: ẩn phòng khỏi danh sách nhưng giữ paymentHistory để không mất doanh thu phòng
    @Prop({ default: false })
    isDeleted: boolean;
}
export const RoomSchema = SchemaFactory.createForClass(Room);
// paymentsDate chỉ được set khi xác nhận thanh toán, không tự set từ fromDate