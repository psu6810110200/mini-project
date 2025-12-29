// backend/src/orders/entities/order.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum OrderStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 10, scale: 2 })
  total_price: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @CreateDateColumn()
  created_at: Date;

  // --- ส่วนที่แก้ Error ---
  // นี่คือตัวรับที่ User มองหาครับ
  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' }) // กำหนดชื่อ column ใน database ให้เป็น user_id ตาม ER Diagram
  user: User; 
}