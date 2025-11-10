import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMatriculationDto } from './dto/create-matriculation.dto';
import { UpdateMatriculationDto } from './dto/update-matriculation.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, RegistrationState } from '@generated';
import { HandleErrors } from 'src/common/exceptions/handle-errors';
import { CourseState } from '@prisma/client';


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
      HandleErrors.handleHttpExceptions(error)
    }
  }

  async findAll(registrationState?: RegistrationState, courseState?: CourseState, studentId?: string) {
    try {
      return await this.prisma.matriculation.findMany({
        where: {
          registrationState,
          courseState,
          studentId,
          deletedAt: null,
        },
      });
    }catch (error) {
      HandleErrors.handleHttpExceptions(error)
    }
  }

  async findOne(id: string) {
    try {
      const matriculation = await this.prisma.matriculation.findUnique({
        where: {
          id: id,
        },
      })

      if (!matriculation) {
        HandleErrors.handleHttpExceptions(new Error('Matriculation not found'))
      }

      return matriculation;
    }catch (error) {
      HandleErrors.handleHttpExceptions(error)
    }
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
      HandleErrors.handleHttpExceptions(error)
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
      HandleErrors.handleHttpExceptions(error)
    }
  }
}
