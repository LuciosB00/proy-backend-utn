import { Transform } from "class-transformer";
import { IsDate, IsEnum, IsNumber, IsOptional, IsString, IsUUID, Length, ValidateIf } from "class-validator";

export class CreateTeacherDto {
    @IsUUID()
    userId: string;

    @IsOptional()
    @IsDate()
    dateBirth?: Date;

    @IsNumber()
    @Length(8, 8)
    @ValidateIf((value) => value!== null)
    dni: number;

    @IsOptional()
    @IsString()
    @Length(10, 11)
    phone?: string;

    @IsOptional()
    @IsString()
    @Length(10, 11)
    address?: string; 
}
