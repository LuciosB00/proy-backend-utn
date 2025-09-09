import { Injectable } from '@nestjs/common';
import { CreateQualificationDto } from './dto/create-qualification.dto';
import { UpdateQualificationDto } from './dto/update-qualification.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';
import { readFile } from 'fs';

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
        throw new Error('Qualification already exists')
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
      throw new BadRequestException(error.message)
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
      throw new BadRequestException('Qualification not found')
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
      throw new BadRequestException(error.message)
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
      throw new BadRequestException(error.message)
    }
  }
}
