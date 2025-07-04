import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PaymentDocument = Payment & Document;

@Schema()
export class Payment {
  @Prop({ required: true })
  name: string;
  
  @Prop()
  description: string;
  
  @Prop({ default: Date.now })
  createdAt: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
