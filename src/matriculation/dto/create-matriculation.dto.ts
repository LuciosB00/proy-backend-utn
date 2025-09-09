import { CourseState, RegistrationState } from "@prisma/client"
import { IsEnum, IsUUID } from "class-validator"

export class CreateMatriculationDto {
    @IsUUID()
    studentId: string

    @IsUUID()
    courseId: string

    @IsEnum(RegistrationState)
    registrationState: RegistrationState

    @IsEnum(CourseState)
    courseState: CourseState
}
