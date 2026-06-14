import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import moment from "moment";
import mongoose, { HydratedDocument } from "mongoose";
import { Review } from "src/module/reviews/schemas/review.schemas";
import { User } from "src/module/users/schemas/user.schema";

export type RepReviewDocument = HydratedDocument<RepReview>;

@Schema({ timestamps: true })
export class RepReview {
    @Prop()
    creater_at: Date;
    @Prop()
    comment: string;
    @Prop()
    image: string;
    @Prop()
    expression: string;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
    userId: mongoose.Schema.Types.ObjectId;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Review.name })
    reviewId: mongoose.Schema.Types.ObjectId;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: RepReview.name })
    repReviewId: mongoose.Schema.Types.ObjectId;
}
export const RepReviewSchema = SchemaFactory.createForClass(RepReview);

RepReviewSchema.pre<RepReviewDocument>('save', function (next) {
    const vnNow = moment().tz('Asia/Ho_Chi_Minh'); // giờ Việt Nam

    if (!this.creater_at) {
        this.creater_at = vnNow.toDate();
    }
    next();
});
