import { Module, forwardRef } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { TeacherController } from './teacher.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    UserModule,
    forwardRef(() => AuthModule), // rompe la circular dependency
  ],
  controllers: [TeacherController],
  providers: [PrismaService, TeacherService],
  exports: [TeacherService],
})
export class TeacherModule {}
