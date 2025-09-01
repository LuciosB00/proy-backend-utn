import { PartialType } from '@nestjs/mapped-types';
import { CreateMatriculationDto } from './create-matriculation.dto';

export class UpdateMatriculationDto extends PartialType(CreateMatriculationDto) {}
