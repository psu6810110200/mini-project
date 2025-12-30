import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express'; // เพิ่ม
import { join } from 'path'; // เพิ่ม

async function bootstrap() {
  // เปลี่ยนบรรทัดนี้ให้ระบุ Type <NestExpressApplication>
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  app.enableCors();

  // เพิ่มส่วนนี้: บอกให้ Server เปิดโฟลเดอร์ uploads ให้คนนอกเข้าถึงได้
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();