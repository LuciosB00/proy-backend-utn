import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class StudentService {
  constructor(private readonly prisma: PrismaService, private readonly userService: UserService) { }

  async create(createStudentDto: CreateStudentDto) {
    try {
      const exists = this.userService.findOne(createStudentDto.userId);

      if (!exists) {
        throw new BadRequestException('User not found');
      }

      const { dni, phone, address } = createStudentDto;

      const existingStudent = await this.prisma.student.findUnique({
        where: { dni },
      });

      if (existingStudent) {
        throw new BadRequestException('Student with this DNI already exists');
      }

      return await this.prisma.student.create({
        data: {
          ...createStudentDto,
          phone: phone,
          address: address,
        },
      });
    } catch (error) {
      throw new BadRequestException('Error creating student: ' + error.message);
    }
  }

  async findAll() {
    return await this.prisma.student.findMany();
  }

  async findOne(id: string) {
    const student = await this.prisma.student.findUnique({
      where: { id, deletedAt: null },
    });
    if (!student) {
      throw new BadRequestException(`Student with ID ${id} not found`);
    }
    return student;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    try {
      const updatedStudent = await this.prisma.student.update({
        where: { id },
        data: updateStudentDto,
      });
      return updatedStudent;
    } catch (error) {
      throw new BadRequestException(`Error updating student: ${error.message}`);
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.student.delete({ where: { id } });
      return { message: `Student #${id} deleted successfully` };
    } catch (error) {
      throw new BadRequestException(`Error deleting student: ${error.message}`);
    }
  }
}
