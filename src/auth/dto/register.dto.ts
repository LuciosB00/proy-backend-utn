import { IsString, IsEmail, Length, IsEnum, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { Role } from '@prisma/client';

export class RegisterDto {
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @IsString()
  @Length(6, 20, { message: 'La contraseña debe ser entre 6 y 20 caracteres' })
  password: string;

  @IsString()
  fullName: string;

  @IsEnum(Role)
  role: Role;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  dni: number;
}
