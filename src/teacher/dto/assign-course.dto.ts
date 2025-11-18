import { Transform } from "class-transformer";
import { IsArray, IsDate, IsEnum, IsNumber, IsOptional, IsString, IsUUID, Length, ValidateIf } from "class-validator";

export class AssignCourseDto {
    @IsUUID()
    teacherId: string;

    @IsArray()
    @IsUUID('all', { each: true })
    courseIds: string[];
}
