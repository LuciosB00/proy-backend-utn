import { AttendanceStatus } from "@generated";
import { Type } from "class-transformer";
import { IsDate, IsEnum, IsUUID } from "class-validator";

export class CreateAttendanceDto {
    @IsUUID()
    studentId: string;

    @IsUUID()
    courseId: string;

    @Type(() => Date)
    @IsDate()
    attendanceDate: Date;

    @IsEnum(AttendanceStatus)
    attendanceState: AttendanceStatus;
}
