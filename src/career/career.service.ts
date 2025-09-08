import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreateCareerDto } from './dto/create-career.dto';
import { UpdateCareerDto } from './dto/update-career.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CareerService {
  prismaService: any;
  constructor(private readonly prisma: PrismaService) { }

  async create(createCareerDto: CreateCareerDto, tx?: Prisma.TransactionClient) {
    try {
      const prisma = tx || this.prisma;

      const { name, description, title } = createCareerDto;

      const exist = await prisma.career.findFirst({
        where: {
          name: createCareerDto.name
        }
      })

      if (exist) {
        throw new ConflictException('Career already exists')
      }

      return await prisma.career.create({
        data: {
          name: name,
          description: description,
          title: title
        },
      })
    } catch (error) {
      throw new BadRequestException('Error creating career: ' + error.message)
    }
  }

  async findAll() {
    return await this.prisma.career.findMany();
  }

  async findOne(id: string) {
    const carrer = this.prisma.career.findUnique({
      where: {
        id: id,
        deletedAt: null
      }
    })
    if (!carrer) {
      throw new BadRequestException('Career not found')
    }
    return carrer;
  }

  async update(id: string, updateCareerDto: UpdateCareerDto) {
    try {
      const carrer = await this.prisma.career.findUnique({
        where: {
          id: id
        }
      })

      if (!carrer) {
        throw new BadRequestException('Career not found')
      }

      return await this.prisma.career.update({
        where: { id: id },
        data: updateCareerDto,
      })
    } catch (error) {
      throw new BadRequestException('Error updating career:' + error.message)
    }
  }

  async remove(id: string) {
    try {
      await this.prismaService.carrer.delete({ where: { id } });
      return { message: `Carrer #${id} deleted successfully` };
    } catch (error) {
      throw new BadRequestException(`Error deleting career: ${error.message}`);
    }
  }
}
