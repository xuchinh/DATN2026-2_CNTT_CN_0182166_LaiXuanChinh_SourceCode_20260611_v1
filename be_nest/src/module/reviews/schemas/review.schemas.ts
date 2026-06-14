import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import moment from 'moment';
import mongoose, { HydratedDocument } from 'mongoose';
import { Blog } from 'src/module/blogs/schemas/blog.schemas';
import { Building } from 'src/module/buildings/schemas/building.schemas';
import { User } from 'src/module/users/schemas/user.schema';

export type ReviewDocument = HydratedDocument<Review>;

@Schema({ timestamps: true })
export class Review {
    @Prop()
    creater_at: Date;
    @Prop()
    rating: string;
    @Prop()
    comment: string;
    @Prop()
    image: string;
    @Prop()
    expression: string;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
    userId: mongoose.Schema.Types.ObjectId;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Building.name })
    buildingId: mongoose.Schema.Types.ObjectId;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Blog.name })
    blogId: mongoose.Schema.Types.ObjectId;
}
export const ReviewSchema = SchemaFactory.createForClass(Review);

ReviewSchema.pre<ReviewDocument>('save', function (next) {
    const vnNow = moment().tz('Asia/Ho_Chi_Minh'); // giờ Việt Nam

    if (!this.creater_at) {
        this.creater_at = vnNow.toDate();
    }
    next();
});