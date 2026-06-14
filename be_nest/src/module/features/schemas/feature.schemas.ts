import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FeatureDocument = HydratedDocument<Feature>;

@Schema({ timestamps: true })
export class Feature {
    @Prop()
    code: string;
    @Prop()
    name: string;
    @Prop()
    systemRoles: string;
    @Prop()
    path: string;
    @Prop()
    description: string;
    @Prop()
    displayName: string;
    @Prop()
    menuCode: string;
}
export const FeatureSchema = SchemaFactory.createForClass(Feature);

