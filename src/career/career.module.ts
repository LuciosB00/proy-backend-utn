import { Module } from '@nestjs/common';
import { CareerService } from './career.service';
import { CareerController } from './career.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [CareerController, AuthModule],
  providers: [CareerService, PrismaService],
})
export class CareerModule {}
