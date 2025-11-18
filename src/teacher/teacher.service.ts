import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateTeacherDto } from "./dto/create-teacher.dto";
import { UpdateTeacherDto } from "./dto/update-teacher.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from "@generated";
import { HandleErrors } from "src/common/exceptions/handle-errors";
import { AssignCourseDto } from "./dto/assign-course.dto";

@Injectable()
export class TeacherService {
  constructor(private readonly prismaService: PrismaService,) { }

  async create(createTeacherDto: CreateTeacherDto, tx: Prisma.TransactionClient) {
    try {
      const prisma = tx;

      const { userId, dateBirth, dni, phone, address } = createTeacherDto;

      const exists = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (!exists) {
        throw new Error("Usuario no encontrado");
      }

      const existingTeacher = await prisma.teacher.findUnique({
        where: { dni },
      });
      if (existingTeacher) {
        throw new Error("Docente con este DNI ya existe");
      }

      return await prisma.teacher.create({
        data: {
          dni,
          phone,
          address,
          dateBirth,
          user: { connect: { id: userId } },
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
          courses: {
            select: {
              id: true,
              name: true,
              year: true,
              fourMonth: true,
              career: {
                select: { id: true, name: true },
              },
            },
          },
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
      const { courseIds, ...rest } = updateTeacherDto;

      const data: any = { ...rest };
      if (courseIds) {
        data.courses = {
          set: courseIds.map((cid) => ({ id: cid })),
        };
      }

      const updatedTeacher = await this.prismaService.teacher.update({
        where: { id },
        data,
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

  async assignCourse(assignCourseDto: AssignCourseDto) {
    try {
      const prisma = this.prismaService;
      const { teacherId, courseIds } = assignCourseDto;

      const teacher = await prisma.teacher.findUnique({
        where: { id: teacherId, deletedAt: null },
      });
      if (!teacher) {
        throw new Error("Docente no encontrado");
      }

      await prisma.teacher.update({
        where: { id: teacherId },
        data: {
          courses: {
            set: courseIds.map((cid) => ({ id: cid })),
          },
        },
      });

      return { message: "Cursos asignados exitosamente" };
    } catch (error) {
      throw new Error(error);
    }
  }
}