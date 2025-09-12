import { Module, forwardRef } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    UserModule,
    forwardRef(() => AuthModule), // rompe la circular dependency
  ],
  controllers: [StudentController], 
  providers: [PrismaService, StudentService], 
  exports: [StudentService],
})
export class StudentModule {}
