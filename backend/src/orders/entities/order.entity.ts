import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { OrderItem } from '../../order-items/entities/order-item.entity';
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

  // --- เพิ่มส่วนนี้: วันที่ต้องรับสินค้า ---
  @Column({ type: 'date', nullable: true })
  received_date: string; 
  // ------------------------------------

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' }) 
  user: User; 

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    cascade: true, 
  })
  order_items: OrderItem[];
}