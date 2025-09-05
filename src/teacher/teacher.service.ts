import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TeacherService {
  constructor(private readonly prismaService: PrismaService, private readonly userService: UserService) { }

  async create(createTeacherDto: CreateTeacherDto, tx?: Prisma.TransactionClient) {
    try {
      const prisma = tx || this.prismaService;

      const exists = await this.userService.findOne(createTeacherDto.userId);

      if (!exists) {
        throw new BadRequestException('User not found');
      }

      const { dni, phone, address } = createTeacherDto;

      const existingStudent = await prisma.student.findUnique({
        where: { dni },
      });

      if (existingStudent) {
        throw new BadRequestException('Teacher with this DNI already exists');
      }

      return await prisma.student.create({
        data: {
          ...createTeacherDto,
          phone: phone,
          address: address,
        },
      });
    } catch (error) {
      throw new BadRequestException('Error creating student: ' + error.message);
    }
  }

  async findAll() {
    return await this.prismaService.teacher.findMany();
  }

  async findOne(id: string) {
    const teacher = await this.prismaService.teacher.findUnique({
      where: { id, deletedAt: null },
    });
    if (!teacher) {
      throw new BadRequestException(`Teacher with ID ${id} not found`);
    }
    return teacher;
  }

  async update(id: string, updateTeacherDto: UpdateTeacherDto) {
    try {
      const updatedTeacher = await this.prismaService.teacher.update({
        where: { id },
        data: updateTeacherDto,
      });
      return updatedTeacher;
    } catch (error) {
      throw new BadRequestException(`Error updating teacher: ${error.message}`);
    }
  }

  async remove(id: string) {
    try {
      await this.prismaService.teacher.delete({ where: { id } });
      return { message: `Teacher #${id} deleted successfully` };
    } catch (error) {
      throw new BadRequestException(`Error deleting teacher: ${error.message}`);
    }
  }
}
