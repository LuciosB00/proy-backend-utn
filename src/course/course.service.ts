import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@generated';
import { HandleErrors } from 'src/common/exceptions/handle-errors';

@Injectable()
export class CourseService {
  prismaService: any;
  constructor(private readonly prisma: PrismaService) { }

  async create(createCourseDto: CreateCourseDto, tx?: Prisma.TransactionClient) {
    try {
      const prisma = tx || this.prisma;

      const { careerId, name, year, fourthMonth } = createCourseDto;

      const existCareer = await prisma.course.findFirst({
        where: {
          name: createCourseDto.name
        }
      })

      if (existCareer) {
        throw new BadRequestException('Materia con este nombre ya existe');
      }

      return await prisma.course.create({
        data: {
          careerId: careerId,
          name: name,
          year: year,
          fourMonth: fourthMonth
        }
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
          year: true,
          fourMonth: true,
          user: {
            select: {
              id: true,
              name: true,
              year: true
            },
          },
        },
      });
    } catch (error) {
      HandleErrors.handleHttpExceptions(error);
    }
  }

  async findOne(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
    });
    if (!course) {
      HandleErrors.handleHttpExceptions(new Error(`Materia no encontrada`))
    }
    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    try {
      const course = await this.prisma.course.findUnique({
        where: { id },
      });

      if (!course) {
        throw new BadRequestException(`Materia no encontrada`);
      }

      return await this.prisma.course.update({
        where: { id },
        data: updateCourseDto,
      });
    } catch (error) {
      HandleErrors.handleHttpExceptions(error)
    }
  }

  async remove(id: string) {
    try {
      const course = await this.prisma.course.findUnique({
        where: { id },
      });

      if (!course) {
        throw new BadRequestException(`Materia no encontrada`);
      }

      return await this.prisma.course.delete({
        where: { id },
      });
    } catch (error) {
      HandleErrors.handleHttpExceptions(error)
    }
  }
}
