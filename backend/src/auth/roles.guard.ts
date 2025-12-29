import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. ดึง Role ที่ต้องการจาก Decorator @Roles()
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // ถ้าไม่มีการระบุ Role แปลว่าใครเข้าก็ได้
    if (!requiredRoles) {
      return true;
    }

    // 2. ดึง User จาก Request (JwtAuthGuard แปะไว้ให้แล้ว)
    const { user } = context.switchToHttp().getRequest();

    // เช็คว่า user มี role ตามที่ต้องการไหม
    const hasRole = requiredRoles.some((role) => user?.role === role);
    
    if (!hasRole) {
        throw new ForbiddenException('You do not have permission (Roles)');
    }

    return true;
  }
}