import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from '../order-items/entities/order-item.entity';
import { Weapon } from '../weapons/entities/weapon.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class OrdersService {
  constructor(private dataSource: DataSource) {}

  async create(createOrderDto: CreateOrderDto, user: any) { // user from req.user
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { items } = createOrderDto;
      let calculatedTotalPrice = 0;
      const newOrderItems: OrderItem[] = [];

      for (const itemDto of items) {
        // 1. ดึงข้อมูลปืน พร้อม Lock แถว (ป้องกันการแย่งตัดของพร้อมกัน)
        // ใช้ pessimistic_write เพื่อให้ Transaction อื่นรอจนกว่าเราจะจบงาน
        const weapon = await queryRunner.manager.findOne(Weapon, { 
          where: { id: itemDto.weaponId },
          lock: { mode: 'pessimistic_write' } 
        });

        if (!weapon) {
          throw new NotFoundException(`ไม่พบอาวุธ ID: ${itemDto.weaponId}`);
        }

        if (weapon.stock < itemDto.quantity) {
          throw new BadRequestException(`สินค้า ${weapon.name} คงเหลือไม่พอ (เหลือ ${weapon.stock})`);
        }

        // 2. คำนวณสต็อกใหม่และอัปเดตทันที
        const newStock = weapon.stock - itemDto.quantity;
        await queryRunner.manager.update(Weapon, weapon.id, { stock: newStock });

        calculatedTotalPrice += Number(weapon.price) * itemDto.quantity;

        // 3. เตรียม OrderItem
        const orderItem = new OrderItem();
        
        // เทคนิค: สร้าง Weapon ปลอมที่มีแค่ ID เพื่อผูก Relation โดยไม่ต้องโหลด Entity เต็มมา Save
        const weaponRef = new Weapon();
        weaponRef.id = weapon.id;
        orderItem.weapon = weaponRef;
        
        orderItem.quantity = itemDto.quantity;
        orderItem.price_at_purchase = Number(weapon.price);
        
        newOrderItems.push(orderItem);
      }

      // 4. สร้าง Order หลัก
      const order = new Order();
      
      // เทคนิค: สร้าง User ปลอมเพื่อผูก Relation
      const userRef = new User();
      userRef.id = user.id || user.userId; // รองรับทั้ง user entity หรือ jwt payload
      order.user = userRef;
      
      order.total_price = calculatedTotalPrice;
      order.status = OrderStatus.PENDING;
      order.order_items = newOrderItems; // Cascade จะช่วย Save Items ให้เอง

      // 5. บันทึกและ Commit
      const savedOrder = await queryRunner.manager.save(Order, order);

      await queryRunner.commitTransaction();

      return { 
        message: 'Order created successfully', 
        orderId: savedOrder.id,
        totalPrice: savedOrder.total_price 
      };

    } catch (err) {
      // ถ้ามี Error คืนค่าสต็อกทุกอย่างกลับสภาพเดิม
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: any) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}