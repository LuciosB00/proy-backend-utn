import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMatriculationDto } from './dto/create-matriculation.dto';
import { UpdateMatriculationDto } from './dto/update-matriculation.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@generated';

@Injectable()
export class MatriculationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMatriculationDto: CreateMatriculationDto, tx?: Prisma.TransactionClient) {
    try {
      tx = tx || this.prisma;

      const { studentId, courseId, registrationState, courseState } = createMatriculationDto;

      const existMatriculation = await tx.matriculation.findFirst({
        where: {
          studentId,
          courseId,
        },
      })

      if (existMatriculation) {
        throw new Error('Matriculation already exists')
      }

      const matriculation = await tx.matriculation.create({
        data: {
          studentId: studentId,
          courseId: courseId,
          registrationState: registrationState,
          courseState: courseState,
        },
      })
      return matriculation;
    }catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll() {
    return await this.prisma.matriculation.findMany();
  }

  async findOne(id: string) {
    const matriculation = await this.prisma.matriculation.findUnique({
      where: {
        id: id,
      },
    })

    if (!matriculation) {
      throw new BadRequestException('Matriculation not found')
    }

    return matriculation;
  }

  async update(id: string, updateMatriculationDto: UpdateMatriculationDto) {
    try {
      const { studentId, courseId, registrationState, courseState } = updateMatriculationDto;

      const matriculation = await this.prisma.matriculation.update({
        where: {
          id: id,
        },
        data: {
          studentId: studentId,
          courseId: courseId,
          registrationState: registrationState,
          courseState: courseState,
        }
      })
      return matriculation;
    }catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      const matriculation = await this.prisma.matriculation.delete({
        where: {
          id: id,
        },
      })
      return matriculation;
    }catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
