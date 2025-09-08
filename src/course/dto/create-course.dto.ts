import { FourMonth } from "@prisma/client";
import { IsEnum, IsNumber, IsString, IsUUID, Length } from "class-validator";

export class CreateCourseDto {
    @IsUUID()
    careerId: string;

    @IsString()
    @Length(5, 50)
    name: string;

    @IsNumber()
    year: number;

    @IsEnum(FourMonth)
    fourthMonth: FourMonth;
}
