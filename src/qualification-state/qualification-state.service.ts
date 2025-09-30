import { ConflictException, Injectable } from '@nestjs/common';
import { CreateQualificationStateDto } from './dto/create-qualification-state.dto';
import { UpdateQualificationStateDto } from './dto/update-qualification-state.dto';
import { Prisma } from 'generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { HandleErrors } from 'src/common/exceptions/handle-errors';

@Injectable()
export class QualificationStateService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createQualificationStateDto: CreateQualificationStateDto, tx?: Prisma.TransactionClient) {
    try {
      const prisma = tx || this.prisma;

      const { name, note } = createQualificationStateDto;

      const existingQualificationState = await (prisma.qualificationState.findFirst as any)({
        where: {
          name,
        }
      });

      if (existingQualificationState) {
        throw new ConflictException('Estado de calificacion ya existe');
      }

      const qualificationState = await (prisma.qualificationState.create as any)({
        data: {
          name: name,
          note: note,
        }
      })

      return qualificationState;
    } catch (error) {
      HandleErrors.handleHttpExceptions(error);
    }
  }

  async findAll() {
    return await this.prisma.qualificationState.findMany();
  }

  async findOne(id: string) {
    const qualificationState = await this.prisma.qualificationState.findUnique({
      where: {
        id: id,
      },
    });
    if (!qualificationState) {
      HandleErrors.handleHttpExceptions(new Error('Estado de la calificacion no encontrado'))
    }
    return qualificationState;
  }

  async update(id: string, updateQualificationStateDto: UpdateQualificationStateDto) {
    try {
      const qualificationState = await this.findOne(id);

      const { name, note } = updateQualificationStateDto;

      const updatedQualificationState = await this.prisma.qualificationState.update({
        where: {
          id: id,
        },
        data: {
          name: name,
          note: note
        }
      })
      return updatedQualificationState;
    } catch (error) {
      HandleErrors.handleHttpExceptions(error);
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.qualificationState.delete({
        where: {
          id: id,
        }
      })
      return { message: 'QualificationState deleted' };
    } catch (error) {
      HandleErrors.handleHttpExceptions(error);
    }
  }
}
