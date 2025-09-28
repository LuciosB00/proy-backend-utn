import { CourseState, RegistrationState } from "@generated"
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
