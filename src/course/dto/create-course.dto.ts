import { IsEnum, IsNumber, IsString, IsUUID } from "class-validator";
import { FourMonth } from "@prisma/client"; // Enum generado por Prisma

export class CreateCourseDto {
  @IsUUID()
  careerId: string;

  @IsString()
  name: string;

  @IsNumber()
  year: number;

  @IsEnum(FourMonth)
  fourMonth: FourMonth;
}
