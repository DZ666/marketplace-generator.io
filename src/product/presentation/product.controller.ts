import { Controller, Get } from '@nestjs/common';
import { ProductService } from '../application/product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  getProducts() {
    return this.productService.getProducts();
  }
} 