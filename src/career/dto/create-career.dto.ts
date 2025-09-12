import { IsOptional, IsString, Length } from "class-validator";

export class CreateCareerDto {
    @IsString()
    @Length(5, 50)
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsString()
    @Length(5, 50)
    title: string;

}
