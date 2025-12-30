import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { Weapon } from '../../weapons/entities/weapon.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int')
  quantity: number;

  // บันทึกราคา ณ ตอนที่ซื้อ (ป้องกันปืนเปลี่ยนราคาในอนาคตแล้วกระทบออเดอร์เก่า)
  @Column('decimal', { precision: 10, scale: 2, name: 'price_at_purchase' })
  price_at_purchase: number;

  // Relation ไปหา Order
  @ManyToOne(() => Order, (order) => order.order_items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  // Relation ไปหา Weapon
  @ManyToOne(() => Weapon)
  @JoinColumn({ name: 'weapon_id' })
  weapon: Weapon;
}