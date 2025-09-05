import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreateCareerDto } from './dto/create-career.dto';
import { UpdateCareerDto } from './dto/update-career.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CareerService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createCareerDto: CreateCareerDto) {
    try{
      const { name, description, title } = createCareerDto;

      const exist = await this.prisma.career.findFirst({
        where: {
          name: createCareerDto.name
        }
      })

      if(!exist){
        throw new ConflictException('Career already exists')
      }
    }catch(error){
      throw new BadRequestException('La carrera ya existe')
    }

    return await this.prisma.career.create({
      data: {
        name: createCareerDto.name,
        description: createCareerDto.description,
        title: createCareerDto.title
      },
    });
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
