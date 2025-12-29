import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config'; // 1. import ConfigModule
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { WeaponsModule } from './weapons/weapons.module';
import { OrdersModule } from './orders/orders.module';
import { OrderItemsModule } from './order-items/order-items.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // 2. โหลด ConfigModule เป็นอันแรกสุด
    ConfigModule.forRoot({
      isGlobal: true, // ให้ทุก Module เรียกใช้ค่า Config ได้เลย ไม่ต้อง import ซ้ำ
    }),

    // 3. เปลี่ยนค่า Hardcode เป็น process.env.ชื่อตัวแปร
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10), // แปลง string เป็นตัวเลข
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),

    UsersModule,
    WeaponsModule,
    OrdersModule,
    OrderItemsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}