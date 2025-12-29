import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeaponsService } from './weapons.service';
import { WeaponsController } from './weapons.controller';
import { Weapon } from './entities/weapon.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Weapon])], // ใส่บรรทัดนี้
  controllers: [WeaponsController],
  providers: [WeaponsService],
})
export class WeaponsModule {}