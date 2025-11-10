import { Injectable } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@generated';
import { HandleErrors } from 'src/common/exceptions/handle-errors';

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createAttendanceDto: CreateAttendanceDto, tx?: Prisma.TransactionClient) {
    try {
      const prisma = tx || this.prisma;

      const { studentId, courseId, attendanceDate } = createAttendanceDto;

      const existingAttendance = await prisma.attendance.findFirst({
        where: {
          studentId: studentId,
          courseId: courseId,
          attendanceDate: attendanceDate,
        },
      })

      if (existingAttendance) {
        throw new Error('Asistencia ya existe')
      }

      return await prisma.attendance.create({
        data: createAttendanceDto,
      });
    } catch (error) {
      HandleErrors.handleHttpExceptions(error)
    }
  }

  async findAll(studentId?: string, courseId?: string) {
    return await this.prisma.attendance.findMany({
      where: {
        studentId: studentId,
        courseId: courseId,
        deletedAt: null,
      },
    });
  }

  async findOne(id: string) {
    const attendance = await this.prisma.attendance.findUnique({
      where: { id },
    });

    if (!attendance) {
      HandleErrors.handleHttpExceptions(new Error('Asistencia no encontrada'))
    }

    return attendance;
  }

  async update(id: string, updateAttendanceDto: UpdateAttendanceDto) {
    try {
      const updatedAttendance = await this.prisma.attendance.update({
        where: { id },
        data: updateAttendanceDto,
      });
      return updatedAttendance;
    } catch (error) {
      HandleErrors.handleHttpExceptions(error)
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.attendance.delete({
        where: { id },
      });
      return { message: 'Attendance deleted successfully' };
    } catch (error) {
      HandleErrors.handleHttpExceptions(error)
    }
  }
}
