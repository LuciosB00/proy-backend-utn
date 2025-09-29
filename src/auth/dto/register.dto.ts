<<<<<<< HEAD
import { IsString, IsEmail, Length, IsEnum, IsNumber, IsPositive } from 'class-validator';
import { Transform } from 'class-transformer';
import { Role } from '@prisma/client';
=======
import {
  IsString,
  IsEmail,
  Length,
  IsEnum,
  IsNumber,
  IsPositive,
} from "class-validator";
import { Transform } from "class-transformer";
import { Role } from "@generated";
>>>>>>> afcf8836fba38bd02cf4b1f678cd9b7fd80a217c

export class RegisterDto {
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @IsString()
  @Length(6, 20, { message: "La contraseña debe ser entre 6 y 20 caracteres" })
  password: string;

  @IsString()
  fullName: string;

  @IsEnum(Role)
  role: Role;

  @Length(8, 8, { message: 'El DNI debe tener 8 dígitos' })
  @Transform(({ value }) => Number(value))
<<<<<<< HEAD
  @IsNumber()
  @IsPositive({ message: 'El DNI debe ser un número positivo' })
=======
  @IsNumber({}, { message: "El DNI debe ser un numero" })
>>>>>>> afcf8836fba38bd02cf4b1f678cd9b7fd80a217c
  dni: number;
}
