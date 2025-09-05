import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCareerDto } from './dto/create-career.dto';
import { UpdateCareerDto } from './dto/update-career.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CareerService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createCareerDto: CreateCareerDto) {
    try{
      const { name, description, title } = createCareerDto;

      const exist = this.findOne(createCareerDto.name)

      if(!exist){
        throw new BadRequestException('')
      }
    }
  }

  async findAll() {
    return `This action returns all career`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} career`;
  }

  async update(id: number, updateCareerDto: UpdateCareerDto) {
    return `This action updates a #${id} career`;
  }

  async remove(id: number) {
    return `This action removes a #${id} career`;
  }
}
