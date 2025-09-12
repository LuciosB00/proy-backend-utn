import { Injectable } from '@nestjs/common';
import { CreateQualificationStateDto } from './dto/create-qualification-state.dto';
import { UpdateQualificationStateDto } from './dto/update-qualification-state.dto';

@Injectable()
export class QualificationStateService {
  create(createQualificationStateDto: CreateQualificationStateDto) {
    return 'This action adds a new qualificationState';
  }

  findAll() {
    return `This action returns all qualificationState`;
  }

  findOne(id: number) {
    return `This action returns a #${id} qualificationState`;
  }

  update(id: number, updateQualificationStateDto: UpdateQualificationStateDto) {
    return `This action updates a #${id} qualificationState`;
  }

  remove(id: number) {
    return `This action removes a #${id} qualificationState`;
  }
}
