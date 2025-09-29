import { AttendanceStatus } from "@generated";
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
