import { Transform } from "class-transformer";
import { IsDate, IsEnum, IsString, IsUUID, Length, ValidateIf } from "class-validator";

export class CreateTeacherDto {
    @IsUUID()
    userId: String;

    @IsDate()
    dateBirth: Date;

    @IsString()
    @Length(8, 8)
    @ValidateIf((value) => value!== null)
    dni: string;

    @IsString()
    @Length(10, 11)
    phone: string;

    @IsString()
    @Length(10, 11)
    address: string; 
}
