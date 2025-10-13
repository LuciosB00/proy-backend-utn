import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateTeacherDto } from "./dto/create-teacher.dto";
import { UpdateTeacherDto } from "./dto/update-teacher.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { UserService } from "src/user/user.service";
import { Prisma } from "@generated";
import { HandleErrors } from "src/common/exceptions/handle-errors";

@Injectable()
export class TeacherService {
  constructor(private readonly prismaService: PrismaService,) { }

  async create(createTeacherDto: CreateTeacherDto, tx: Prisma.TransactionClient) {
    try {
      const prisma = tx;

      const exists = await prisma.user.findUnique({
        where: {
          id: createTeacherDto.userId,
        },
      });

      if (!exists) {
        throw new Error("Usuario no encontrado");
      }

      const { dni, phone, address } = createTeacherDto;

      const existingTeacher = await prisma.teacher.findUnique({
        where: { dni },
      });

      if (existingTeacher) {
        throw new Error("Docente con este DNI ya existe");
      }

      return await prisma.teacher.create({
        data: {
          ...createTeacherDto,
          phone: phone,
          address: address,
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll() {
    try {
      return await this.prismaService.teacher.findMany({
        where: { deletedAt: null },
        select: {
          id: true,
          dni: true,
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
    const teacher = await this.prismaService.teacher.findUnique({
      where: { id, deletedAt: null },
    });
    if (!teacher) {
      HandleErrors.handleHttpExceptions(new Error("Docente no encontrado"));
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
      HandleErrors.handleHttpExceptions(error);
    }
  }

  async remove(id: string) {
    try {
      await this.prismaService.teacher.delete({ where: { id } });
      return { message: `Teacher #${id} deleted successfully` };
    } catch (error) {
      HandleErrors.handleHttpExceptions(error);
    }
  }
}
