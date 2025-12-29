// backend/src/order-items/entities/order-item.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { Weapon } from '../../weapons/entities/weapon.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int')
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price_at_purchase: number; // ราคา ณ ตอนที่ซื้อ (สำคัญมาก เผื่อราคาเปลี่ยนทีหลัง)

  // เชื่อมกับ Order (บิลใบไหน)
  @ManyToOne(() => Order, (order) => order.order_items)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  // เชื่อมกับ Weapon (สินค้าตัวไหน)
  @ManyToOne(() => Weapon)
  @JoinColumn({ name: 'weapon_id' })
  weapon: Weapon;
}