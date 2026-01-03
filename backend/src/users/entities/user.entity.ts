import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true }) // ควรใส่ unique true กันชื่อซ้ำ
  username: string;

  @Column({ length: 255 })
  password_hash: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ length: 50, nullable: true })
  license_number: string;

  // --- เพิ่มใหม่: เก็บชื่อไฟล์รูปภาพ ---
  @Column({ nullable: true })
  license_image: string;

  @Column({ default: false })
  is_verified: boolean;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}