import { Injectable } from '@nestjs/common';
import { CreateQualificationDto } from './dto/create-qualification.dto';
import { UpdateQualificationDto } from './dto/update-qualification.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@generated';
import { BadRequestException } from '@nestjs/common';
import { readFile } from 'fs';
import { HandleErrors } from 'src/common/exceptions/handle-errors';

@Injectable()
export class QualificationService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createQualificationDto: CreateQualificationDto, tx?: Prisma.TransactionClient) {
    try {
      const prisma = tx || this.prisma;

      const { studentId, courseId, qualificationStateId, qualificationDate, note } = createQualificationDto;

      const existingQualification = await prisma.qualification.findFirst({
        where: {
          studentId,
          courseId,
        },
      })

      if (existingQualification) {
        throw new BadRequestException('Calificacion ya existe')
      }

      const qualification = await prisma.qualification.create({
        data: {
          studentId: studentId,
          courseId: courseId,
          qualificationStateId: qualificationStateId,
          qualificationDate: qualificationDate,
          note: note,
        },
      })

      return qualification;
    } catch (error) {
      HandleErrors.handleHttpExceptions(error)
    }
  }

  async findAll() {
    return await this.prisma.qualification.findMany();
  }

  async findOne(id: string) {
    const qualification = await this.prisma.qualification.findUnique({
      where: {
        id: id,
      },
    });

    if (!qualification) {
      HandleErrors.handleHttpExceptions(new Error('Calificacion no encontrada'))
    }

    return qualification;
  }

  async update(id: string, updateQualificationDto: UpdateQualificationDto) {
    try {
      const qualification = await this.findOne(id);

      const { studentId, courseId, qualificationStateId, qualificationDate, note } = updateQualificationDto;

      const updatedQualification = await this.prisma.qualification.update({
        where: {
          id: qualification.id,
        },
        data: {
          studentId: studentId || qualification.studentId,
          courseId: courseId || qualification.courseId,
          qualificationStateId: qualificationStateId || qualification.qualificationStateId,
          qualificationDate: qualificationDate || qualification.qualificationDate,
          note: note || qualification.note,
        }
      })
      return updatedQualification;
    } catch (error) {
      HandleErrors.handleHttpExceptions(error)
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.qualification.delete({
        where: {
          id: id,
        },
      })
      return { message: 'Qualification deleted successfully' };
    } catch (error) {
      HandleErrors.handleHttpExceptions(error)
    }
  }
}
