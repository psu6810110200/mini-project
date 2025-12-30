import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities/order.entity';
import { OrderItem } from '../order-items/entities/order-item.entity';
import { Weapon } from '../weapons/entities/weapon.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    // Register Entities ที่เกี่ยวข้องทั้งหมดเพื่อให้ TypeORM รู้จัก
    TypeOrmModule.forFeature([Order, OrderItem, Weapon, User]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}