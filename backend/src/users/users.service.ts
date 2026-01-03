import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(data: any) {
    const user = this.usersRepository.create(data);
    return this.usersRepository.save(user);
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  findAll() {
    return this.usersRepository.find();
  }

  async findOne(id: number | string) { // รองรับ UUID string
    const user = await this.usersRepository.findOne({ where: { id: id as string } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // ใช้สำหรับ Verify หรือ Update ข้อมูลอื่น
  async update(id: number | string, updateUserDto: any) {
    const user = await this.findOne(id);
    // Merge ข้อมูลใหม่ลงไป
    const updatedUser = this.usersRepository.merge(user, updateUserDto);
    return this.usersRepository.save(updatedUser);
  }

  async remove(id: number | string) {
    const user = await this.findOne(id);
    return this.usersRepository.remove(user);
  }
}