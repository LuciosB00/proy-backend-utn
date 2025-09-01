import { RegistrationState } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsDate, IsEnum, IsString, IsUUID, Length, ValidateIf } from "class-validator";


export class CreateStudentDto {
    @IsUUID()
    userId: string;

    @IsDate()
    dateBirth: Date;

    @IsString()
    @Length(8, 8)
    @ValidateIf((value) => value !== null)
    dni: string;

    @IsString()
    @Length(10, 11)
    phone: string;

    @IsString()
    @Length(10, 11)
    address: string;

    @IsEnum(RegistrationState)
    registrationSate: RegistrationState
}
