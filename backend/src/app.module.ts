import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderItemsModule } from './order-items/order-items.module';

@Module({
  imports: [OrderItemsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
