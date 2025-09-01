import { Injectable } from '@nestjs/common';
import { CreateMatriculationDto } from './dto/create-matriculation.dto';
import { UpdateMatriculationDto } from './dto/update-matriculation.dto';

@Injectable()
export class MatriculationService {
  create(createMatriculationDto: CreateMatriculationDto) {
    return 'This action adds a new matriculation';
  }

  findAll() {
    return `This action returns all matriculation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} matriculation`;
  }

  update(id: number, updateMatriculationDto: UpdateMatriculationDto) {
    return `This action updates a #${id} matriculation`;
  }

  remove(id: number) {
    return `This action removes a #${id} matriculation`;
  }
}
