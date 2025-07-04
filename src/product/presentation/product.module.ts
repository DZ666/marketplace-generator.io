import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from '../application/product.service';

@Module({
  imports: [],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {} 