import { Transform } from "class-transformer";
import { IsDate, IsEnum, IsString, IsUUID, Length, ValidateIf } from "class-validator";

export class CreateCareerDto {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsString()
    title: string;

}
