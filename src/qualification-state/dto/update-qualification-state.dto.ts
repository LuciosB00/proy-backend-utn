import { PartialType } from '@nestjs/mapped-types';
import { CreateQualificationStateDto } from './create-qualification-state.dto';

export class UpdateQualificationStateDto extends PartialType(CreateQualificationStateDto) {}
