import { Injectable, BadRequestException } from "@nestjs/common";
import { CreateStudentDto } from "./dto/create-student.dto";
import { UpdateStudentDto } from "./dto/update-student.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { UserService } from "src/user/user.service";
import { Prisma } from "@generated";

@Injectable()
export class StudentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
  ) {}

  async create(
    createStudentDto: CreateStudentDto,
    tx?: Prisma.TransactionClient,
  ) {
    try {
      const prisma = tx || this.prismaService;

      const exists = await prisma.user.findUnique({
        where: {
          id: createStudentDto.userId,
        },
      });

      if (!exists) {
        throw new BadRequestException("User not found");
      }

      const { dni, phone, address } = createStudentDto;

      const existingStudent = await prisma.student.findUnique({
        where: { dni },
      });

      if (existingStudent) {
        throw new BadRequestException("Student with this DNI already exists");
      }

      return await prisma.student.create({
        data: {
          ...createStudentDto,
          phone: phone,
          address: address,
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
      console.log("createStudent error:", error);
    }
  }

  async findAll() {
    return await this.prismaService.student.findMany();
  }

  async findOne(id: string) {
    const student = await this.prismaService.student.findUnique({
      where: { id, deletedAt: null },
    });
    if (!student) {
      throw new BadRequestException(`Student with ID ${id} not found`);
    }
    return student;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    try {
      const updatedStudent = await this.prismaService.student.update({
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
      await this.prismaService.student.delete({ where: { id } });
      return { message: `Student #${id} deleted successfully` };
    } catch (error) {
      throw new BadRequestException(`Error deleting student: ${error.message}`);
    }
  }
}
