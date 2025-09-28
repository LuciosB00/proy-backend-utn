import { Injectable } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@generated';

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
        throw new Error('Attendance already exists');
      }

      return await prisma.attendance.create({
        data: createAttendanceDto,
      });
    } catch (error) {
      throw new Error(`Failed to create attendance: ${error.message}`);
    }
  }

  async findAll() {
    return await this.prisma.attendance.findMany();
  }

  async findOne(id: string) {
    const attendance = await this.prisma.attendance.findUnique({
      where: { id },
    });

    if (!attendance) {
      throw new Error('Attendance not found');
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
      throw new Error(`Failed to update attendance: ${error.message}`);
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.attendance.delete({
        where: { id },
      });
      return { message: 'Attendance deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete attendance: ${error.message}`);
    }
  }
}
