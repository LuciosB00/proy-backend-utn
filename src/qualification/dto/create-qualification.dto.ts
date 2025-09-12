import { IsDate, IsDecimal, IsUUID } from "class-validator"

export class CreateQualificationDto {
    @IsUUID()
    studentId: string

    @IsUUID()
    courseId: string

    @IsUUID()
    qualificationStateId: string

    @IsDate()
    qualificationDate: Date

    @IsDecimal()
    note: number
}
