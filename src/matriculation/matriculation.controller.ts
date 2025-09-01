import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MatriculationService } from './matriculation.service';
import { CreateMatriculationDto } from './dto/create-matriculation.dto';
import { UpdateMatriculationDto } from './dto/update-matriculation.dto';

@Controller('matriculation')
export class MatriculationController {
  constructor(private readonly matriculationService: MatriculationService) {}

  @Post()
  create(@Body() createMatriculationDto: CreateMatriculationDto) {
    return this.matriculationService.create(createMatriculationDto);
  }

  @Get()
  findAll() {
    return this.matriculationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matriculationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMatriculationDto: UpdateMatriculationDto) {
    return this.matriculationService.update(+id, updateMatriculationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.matriculationService.remove(+id);
  }
}
