import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CourseService {
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
        throw new BadRequestException('Course with this name already exists');
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
      throw new BadRequestException('Error creating course:' + error.message);
    }
  }

  async findAll() {
    return await this.prisma.course.findMany();
  }

  async findOne(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
    });
    if (!course) {
      throw new BadRequestException(`Course with ID ${id} not found`);
    }
    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    try {
      const course = await this.prisma.course.findUnique({
        where: { id },
      });

      if (!course) {
        throw new BadRequestException(`Course with ID ${id} not found`);
      }

      return await this.prisma.course.update({
        where: { id },
        data: updateCourseDto,
      });
    } catch (error) {
      throw new BadRequestException('Error updating course:' + error.message);
    }
  }

  async remove(id: string) {
    try {
      const course = await this.prisma.course.findUnique({
        where: { id },
      });

      if (!course) {
        throw new BadRequestException(`Course with ID ${id} not found`);
      }

      return await this.prisma.course.delete({
        where: { id },
      });
    } catch (error) {
      throw new BadRequestException('Error deleting course:' + error.message);
    }
  }
}
