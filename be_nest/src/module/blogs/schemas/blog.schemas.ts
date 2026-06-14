
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Building } from 'src/module/buildings/schemas/building.schemas';
import { User } from 'src/module/users/schemas/user.schema';

export type BlogDocument = HydratedDocument<Blog>;
export interface BlogContent {
    index?: string;
    Content1?: string;
    image?: string;
    Content2?: string;
}
@Schema({ timestamps: true })
export class Blog {
    @Prop()
    title: string;
    @Prop()
    mainImage: string;
    @Prop()
    introduce: string
    @Prop({ type: Array })
    Content: BlogContent[];
    conclusion: string;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
    userId: mongoose.Schema.Types.ObjectId;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Building.name })
    buildingId: mongoose.Schema.Types.ObjectId;
    @Prop()
    rating: string;
}
export const BlogSchema = SchemaFactory.createForClass(Blog);

