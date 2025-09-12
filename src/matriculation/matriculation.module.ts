import { Module } from '@nestjs/common';
import { MatriculationService } from './matriculation.service';
import { MatriculationController } from './matriculation.controller';

@Module({
  controllers: [MatriculationController],
  providers: [MatriculationService],
})
export class MatriculationModule {}
