import { Module } from '@nestjs/common';
import { QualificationService } from './qualification.service';
import { QualificationController } from './qualification.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [QualificationController],
  providers: [QualificationService, PrismaService],
})
export class QualificationModule {}
