import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthModule } from '@byob/nest-common';
import { ProductsModule } from './products/products.module';
import { ManufacturersModule } from './manufacturers/manufacturers.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), JwtAuthModule.register(), ProductsModule, ManufacturersModule],
})
export class AppModule {}
