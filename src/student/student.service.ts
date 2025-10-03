import { Injectable, BadRequestException } from "@nestjs/common";
import { CreateStudentDto } from "./dto/create-student.dto";
import { UpdateStudentDto } from "./dto/update-student.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from "@generated";
import { HandleErrors } from "src/common/exceptions/handle-errors";

@Injectable()
export class StudentService {
  constructor(
    private readonly prismaService: PrismaService,
  ) { }

  async create(
    createStudentDto: CreateStudentDto,
    tx: Prisma.TransactionClient,
  ) {
    try {
      const prisma = tx;

      const exists = await prisma.user.findUnique({
        where: {
          id: createStudentDto.userId,
        },
      });

      if (!exists) {
        throw new BadRequestException("Usuario no encontrado");
      }

      const { dni, phone, address } = createStudentDto;

      const existingStudent = await prisma.student.findUnique({
        where: { dni },
      });

      if (existingStudent) {
        throw new BadRequestException("Estudiante con este DNI ya existe");
      }

      return await prisma.student.create({
        data: {
          ...createStudentDto,
          phone: phone,
          address: address,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.prismaService.student.findMany({
        where: { deletedAt: null },
        select: {
          id: true,
          dni: true,
          registrationState: true,
          phone: true,
          dateBirth: true,
          address: true,
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              role: true,
            },
          },
        },
      });
    } catch (error) {
      HandleErrors.handleHttpExceptions(error);
    }
  }

  async findOne(id: string) {
    try {
      const student = await this.prismaService.student.findUnique({
        where: { id, deletedAt: null },
      });
      if (!student) {
        throw new BadRequestException("Estudiante no encontrado");
      }
      return student;
    } catch (error) {
      HandleErrors.handleHttpExceptions(error);
    }
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    try {
      const updatedStudent = await this.prismaService.student.update({
        where: { id },
        data: updateStudentDto,
      });
      return updatedStudent;
    } catch (error) {
      HandleErrors.handleHttpExceptions(error);
    }
  }

  async remove(id: string) {
    try {
      await this.prismaService.student.delete({ where: { id } });
      return { message: `Student #${id} deleted successfully` };
    } catch (error) {
      HandleErrors.handleHttpExceptions(error);
    }
  }
}
