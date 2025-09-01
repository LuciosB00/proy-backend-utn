import { Injectable } from '@nestjs/common';
import { CreateQualificationDto } from './dto/create-qualification.dto';
import { UpdateQualificationDto } from './dto/update-qualification.dto';

@Injectable()
export class QualificationService {
  create(createQualificationDto: CreateQualificationDto) {
    return 'This action adds a new qualification';
  }

  findAll() {
    return `This action returns all qualification`;
  }

  findOne(id: number) {
    return `This action returns a #${id} qualification`;
  }

  update(id: number, updateQualificationDto: UpdateQualificationDto) {
    return `This action updates a #${id} qualification`;
  }

  remove(id: number) {
    return `This action removes a #${id} qualification`;
  }
}
