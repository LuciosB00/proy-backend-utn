import { Module } from '@nestjs/common';
import { QualificationService } from './qualification.service';
import { QualificationController } from './qualification.controller';

@Module({
  controllers: [QualificationController],
  providers: [QualificationService],
})
export class QualificationModule {}
