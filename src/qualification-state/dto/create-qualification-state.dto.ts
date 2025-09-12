import { IsDecimal, IsString, IsUUID } from "class-validator";

export class CreateQualificationStateDto {

    @IsString()
    name: string;

    @IsDecimal()
    note: number;
}
