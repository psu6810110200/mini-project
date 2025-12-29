import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

export enum WeaponCategory {
  LIGHT = 'light',
  HEAVY = 'heavy',
  EXPLOSIVE = 'explosive',
}

@Entity('weapons')
export class Weapon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  name: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 }) // เก็บเงิน ต้องใช้ decimal
  price: number;

  @Column('int')
  stock: number;

  @Column({
    type: 'enum',
    enum: WeaponCategory,
  })
  category: WeaponCategory;

  @Column('int')
  required_license_level: number;

  @UpdateDateColumn()
  updated_at: Date;
}