import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductService {
  getProducts() {
    return {
      products: [
        { id: 1, name: 'Product 1', price: 100, description: 'Description for product 1' },
        { id: 2, name: 'Product 2', price: 200, description: 'Description for product 2' },
      ],
    };
  }
} 