import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { StudentModule } from './student/student.module';
import { TeacherModule } from './teacher/teacher.module';
import { CareerModule } from './career/career.module';
import { CourseModule } from './course/course.module';
import { MatriculationModule } from './matriculation/matriculation.module';
import { QualificationModule } from './qualification/qualification.module';
import { QualificationStateModule } from './qualification-state/qualification-state.module';
import { AttendanceModule } from './attendance/attendance.module';

@Module({
  imports: [UserModule, StudentModule, TeacherModule, CareerModule, CourseModule, MatriculationModule, QualificationModule, QualificationStateModule, AttendanceModule],
})
export class AppModule {}
