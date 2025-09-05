import { IsOptional, IsString, Length } from "class-validator";

export class CreateCareerDto {
    @IsString()
    @Length(200, 500)
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsString()
    @Length(200, 500)
    title: string;

}
