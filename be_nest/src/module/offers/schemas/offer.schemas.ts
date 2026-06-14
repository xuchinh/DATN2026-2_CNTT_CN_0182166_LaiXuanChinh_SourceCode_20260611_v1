import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OfferDocument = HydratedDocument<Offer>;

@Schema({ timestamps: true })
export class Offer {
    @Prop()
    code: string;
    @Prop()
    name: string;
    @Prop()
    description: string;
    @Prop({ default: 0 })
    discountPercentage: string;
    @Prop()
    discountCurrency: string;
    @Prop()
    deletedAt: Date;
    @Prop({ default: true })
    isActive: boolean;
    @Prop({ default: '0' })
    condition: number; // Điều kiện
}
export const OfferSchema = SchemaFactory.createForClass(Offer)
