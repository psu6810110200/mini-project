export class CreateAuthDto {
  username: string;
  password: string;
  // เพิ่ม field อื่นๆ ถ้าต้องการตอนสมัคร เช่น license_number
  license_number?: string;
}