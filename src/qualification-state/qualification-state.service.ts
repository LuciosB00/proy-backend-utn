import { ConflictException, Injectable } from '@nestjs/common';
import { CreateQualificationStateDto } from './dto/create-qualification-state.dto';
import { UpdateQualificationStateDto } from './dto/update-qualification-state.dto';
import { Prisma } from 'generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

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
        throw new ConflictException('QualificationState already exists');
      }

      const qualificationState = await (prisma.qualificationState.create as any)({
        data: {
          name: name,
          note: note,
        }
      })

      return qualificationState;
    } catch (error) {
      throw new Error(error.message);
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
      throw new Error('QualificationState not found');
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
      throw new Error(error.message);
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
      throw new Error(error.message);
    }
  }
}
