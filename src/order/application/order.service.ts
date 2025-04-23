import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderService {
  getOrders() {
    return {
      orders: [
        { id: 1, productId: 1, userId: 1, status: 'pending' },
        { id: 2, productId: 2, userId: 1, status: 'completed' },
      ],
    };
  }
} 