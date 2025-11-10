import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MatriculationService } from './matriculation.service';
import { CreateMatriculationDto } from './dto/create-matriculation.dto';
import { UpdateMatriculationDto } from './dto/update-matriculation.dto';
import { RegistrationState } from '@generated';
import { CourseState } from '@prisma/client';

@Controller('matriculation')
export class MatriculationController {
  constructor(private readonly matriculationService: MatriculationService) {}

  @Post()
  create(@Body() createMatriculationDto: CreateMatriculationDto) {
    return this.matriculationService.create(createMatriculationDto);
  }

  @Get()
  findAll(@Query('registrationState') registrationState?: RegistrationState, @Query('courseState') courseState?: CourseState, @Query('studentId') studentId?: string) {
    return this.matriculationService.findAll(registrationState, courseState, studentId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matriculationService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMatriculationDto: UpdateMatriculationDto) {
    return this.matriculationService.update(id, updateMatriculationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.matriculationService.remove(id);
  }
}
