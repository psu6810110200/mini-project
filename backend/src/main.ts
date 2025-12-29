// backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 1. เพิ่มบรรทัดนี้ เพื่ออนุญาตให้ Frontend (Vite) เรียกใช้งานได้
  app.enableCors(); 

  await app.listen(3000);
}
bootstrap();