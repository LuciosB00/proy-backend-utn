import { IsString, IsEmail, Length, IsEnum, IsNumber, Max, Min } from "class-validator";
import { Transform } from "class-transformer";
import { Role } from "@generated";

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

  @Transform(({ value }) => Number(value))
  @Max(99999999, { message: "El DNI debe ser menor a 99999999" })
  @Min(10000000, { message: "El DNI debe ser mayor a 10000000" })
  @IsNumber({}, { message: "El DNI debe ser un numero" })
  dni: number;
}
