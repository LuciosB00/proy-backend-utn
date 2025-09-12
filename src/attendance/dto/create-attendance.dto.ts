import { AttendanceStatus } from "@prisma/client";
import { IsDate, IsEnum, IsUUID } from "class-validator";

export class CreateAttendanceDto {
    @IsUUID()
    studentId: string;

    @IsUUID()
    courseId: string;

    @IsDate()
    attendanceDate: Date;

    @IsEnum(AttendanceStatus)
    attendanceState: AttendanceStatus;
}
