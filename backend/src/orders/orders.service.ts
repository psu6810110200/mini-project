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
      // 1. ดึงข้อมูล User ล่าสุดจาก Database (เพื่อให้ได้ license_number ที่เป็นปัจจุบันที่สุด)
      const customer = await queryRunner.manager.findOne(User, { 
        where: { id: user.id || user.userId } 
      });

      if (!customer) {
        throw new NotFoundException('ไม่พบข้อมูลผู้ใช้งาน');
      }

      // 2. แปลง License Number เป็นตัวเลข (Level)
      // ถ้าเป็น null, ว่าง, หรือไม่ใช่ตัวเลข จะให้ค่าเป็น 0
      const customerLevel = customer.license_number && !isNaN(Number(customer.license_number))
        ? Number(customer.license_number)
        : 0;

      const { items } = createOrderDto;
      let calculatedTotalPrice = 0;
      const newOrderItems: OrderItem[] = [];

      for (const itemDto of items) {
        // 3. ดึงข้อมูลอาวุธ (Lock แถวเพื่อป้องกัน Race Condition)
        const weapon = await queryRunner.manager.findOne(Weapon, { 
          where: { id: itemDto.weaponId },
          lock: { mode: 'pessimistic_write' } 
        });

        if (!weapon) {
          throw new NotFoundException(`ไม่พบอาวุธ ID: ${itemDto.weaponId}`);
        }

        // --- เพิ่มการตรวจสอบ License Level ตรงนี้ ---
        if (weapon.required_license_level > customerLevel) {
          throw new BadRequestException(
            `ใบอนุญาตของคุณ (Level ${customerLevel}) ไม่เพียงพอสำหรับซื้อ "${weapon.name}" (ต้องการ Level ${weapon.required_license_level})`
          );
        }
        // -----------------------------------------

        if (weapon.stock < itemDto.quantity) {
          throw new BadRequestException(`สินค้า ${weapon.name} คงเหลือไม่พอ (เหลือ ${weapon.stock})`);
        }

        // 4. ตัดสต็อก
        const newStock = weapon.stock - itemDto.quantity;
        await queryRunner.manager.update(Weapon, weapon.id, { stock: newStock });

        calculatedTotalPrice += Number(weapon.price) * itemDto.quantity;

        // 5. เตรียม OrderItem
        const orderItem = new OrderItem();
        
        const weaponRef = new Weapon();
        weaponRef.id = weapon.id;
        orderItem.weapon = weaponRef;
        
        orderItem.quantity = itemDto.quantity;
        orderItem.price_at_purchase = Number(weapon.price);
        
        newOrderItems.push(orderItem);
      }

      // 6. สร้าง Order หลัก
      const order = new Order();
      
      const userRef = new User();
      userRef.id = customer.id;
      order.user = userRef;
      
      order.total_price = calculatedTotalPrice;
      order.status = OrderStatus.PENDING;
      order.order_items = newOrderItems;

      // 7. บันทึก
      const savedOrder = await queryRunner.manager.save(Order, order);

      await queryRunner.commitTransaction();

      return { 
        message: 'Order created successfully', 
        orderId: savedOrder.id,
        totalPrice: savedOrder.total_price 
      };

    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  // --- Methods อื่นๆ คงเดิม ---

  async findMyOrders(user: any) {
    const userId = user.id || user.userId;
    return this.dataSource.getRepository(Order).find({
      where: { user: { id: userId } },
      relations: ['order_items', 'order_items.weapon'],
      order: { created_at: 'DESC' },
    });
  }

  async findAll() {
    return this.dataSource.getRepository(Order).find({
      relations: ['user', 'order_items', 'order_items.weapon'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string) {
    const order = await this.dataSource.getRepository(Order).findOne({
      where: { id },
      relations: ['user', 'order_items', 'order_items.weapon'],
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateStatus(id: string, status: OrderStatus) {
    const order = await this.findOne(id);
    order.status = status;
    return this.dataSource.getRepository(Order).save(order);
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}