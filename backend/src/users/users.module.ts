import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // 1. ต้องบอกว่า Module นี้ใช้ตาราง User
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // 2. สำคัญ! ต้อง export เพื่อให้ AuthModule เรียกใช้ได้
})
export class UsersModule {}