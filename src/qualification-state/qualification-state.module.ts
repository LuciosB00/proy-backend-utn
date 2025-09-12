import { Module } from '@nestjs/common';
import { QualificationStateService } from './qualification-state.service';
import { QualificationStateController } from './qualification-state.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [QualificationStateController],
  providers: [QualificationStateService, PrismaService],
})
export class QualificationStateModule {}
