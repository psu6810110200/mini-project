import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Order } from '../../orders/entities/order.entity'; // เดี๋ยวเราจะไปสร้าง Order ทีหลัง แต่ import ไว้ก่อน

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity('users') // ชื่อตารางใน Database
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  username: string;

  @Column({ length: 255 })
  password_hash: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ length: 50, nullable: true }) // nullable: true เพราะ admin อาจไม่ต้องมี license
  license_number: string;

  @Column({ default: false })
  is_verified: boolean;

  @CreateDateColumn()
  created_at: Date;

  // ความสัมพันธ์ One-to-Many: User 1 คน มีได้หลาย Order
  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}