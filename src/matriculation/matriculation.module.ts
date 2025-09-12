import { Module } from '@nestjs/common';
import { MatriculationService } from './matriculation.service';
import { MatriculationController } from './matriculation.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [MatriculationController],
  providers: [MatriculationService, PrismaService],
})
export class MatriculationModule {}
