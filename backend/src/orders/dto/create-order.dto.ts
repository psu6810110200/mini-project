import { IsString, IsNumber, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderItemDto {
  @IsString()
  weaponId: string;

  @IsNumber()
  quantity: number;
}

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  // --- เพิ่มส่วนนี้: รับค่าวันที่ส่งมาจาก Frontend ---
  @IsOptional()
  @IsString()
  received_date?: string;
  // -------------------------------------------
}