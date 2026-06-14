import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Feature } from 'src/module/features/schemas/feature.schemas';
import { Offer } from 'src/module/offers/schemas/offer.schemas';

export type PackageDocument = HydratedDocument<Package>;

@Schema({ timestamps: true })
export class Package {
    @Prop()
    code: string;
    @Prop()
    name: string;
    @Prop()
    description: string;
    @Prop()
    price?: string;
    @Prop({ default: true })
    isActive: boolean;
    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Feature.name }] })
    features: mongoose.Schema.Types.ObjectId[];
    @Prop()
    totalBuilding: string;
}
export const PackageSchema = SchemaFactory.createForClass(Package)


