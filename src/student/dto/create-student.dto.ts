import { RegistrationState } from "@generated";
import { Transform } from "class-transformer";
import { IsDate, IsEnum, IsNumber, IsOptional, IsString, IsUUID, Length, ValidateIf } from "class-validator";


export class CreateStudentDto {
    @IsUUID()
    userId: string;

    @IsDate()
    @IsOptional()
    dateBirth?: Date;

    @IsNumber()
    @Length(8, 8)
    @ValidateIf((value) => value !== null)
    dni: number;

    @IsString()
    @Length(10, 11)
    @IsOptional()
    phone?: string;

    @IsString()
    @Length(10, 11)
    @IsOptional()
    address?: string;

    @IsOptional()
    @IsEnum(RegistrationState)
    registrationSate?: RegistrationState
}
