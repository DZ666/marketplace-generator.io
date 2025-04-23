import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from '../../domain/schema/payment.schema';

@Injectable()
export class PaymentRepository {
  constructor(
    @InjectModel(Payment.name)
    private paymentModel: Model<PaymentDocument>,
  ) {}

  async findAll(): Promise<Payment[]> {
    return this.paymentModel.find().exec();
  }

  async findById(id: string): Promise<Payment> {
    return this.paymentModel.findById(id).exec();
  }

  async create(data: Partial<Payment>): Promise<Payment> {
    const newPayment = new this.paymentModel(data);
    return newPayment.save();
  }

  async update(id: string, data: Partial<Payment>): Promise<Payment> {
    return this.paymentModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string): Promise<Payment> {
    return this.paymentModel.findByIdAndDelete(id).exec();
  }
}
