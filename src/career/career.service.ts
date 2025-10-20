import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreateCareerDto } from './dto/create-career.dto';
import { UpdateCareerDto } from './dto/update-career.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@generated';
import { HandleErrors } from 'src/common/exceptions/handle-errors';

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
        throw new ConflictException('Carrera ya existe')
      }

      return await prisma.career.create({
        data: {
          name: name,
          description: description,
          title: title
        },
      })
    } catch (error) {
      HandleErrors.handleHttpExceptions(error)
    }
  }

  async findAll() {
    try {
      return await this.prismaService.course.findMany({
        where: { deletedAt: null },
        select: {
          id: true,
          name: true,
          description: true,
          title: true,
        },
      });
    } catch (error) {
      HandleErrors.handleHttpExceptions(error);
    }
  }

  async findOne(id: string) {
    const carrer = this.prisma.career.findUnique({
      where: {
        id: id,
        deletedAt: null
      }
    })
    if (!carrer) {
      HandleErrors.handleHttpExceptions(new Error('Carrera no encontrada'))
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
        throw new Error('Carrera no encontrada')
      }

      return await this.prisma.career.update({
        where: { id: id },
        data: updateCareerDto,
      })
    } catch (error) {
      HandleErrors.handleHttpExceptions(error)
    }
  }

  async remove(id: string) {
    try {
      await this.prismaService.carrer.delete({ where: { id } });
      return { message: `Carrer #${id} deleted successfully` };
    } catch (error) {
      HandleErrors.handleHttpExceptions(error)
    }
  }
}
