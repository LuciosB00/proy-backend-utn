import { Module } from '@nestjs/common';
import { QualificationStateService } from './qualification-state.service';
import { QualificationStateController } from './qualification-state.controller';

@Module({
  controllers: [QualificationStateController],
  providers: [QualificationStateService],
})
export class QualificationStateModule {}
