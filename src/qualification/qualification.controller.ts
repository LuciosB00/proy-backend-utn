import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QualificationService } from './qualification.service';
import { CreateQualificationDto } from './dto/create-qualification.dto';
import { UpdateQualificationDto } from './dto/update-qualification.dto';

@Controller('qualification')
export class QualificationController {
  constructor(private readonly qualificationService: QualificationService) {}

  @Post()
  create(@Body() createQualificationDto: CreateQualificationDto) {
    return this.qualificationService.create(createQualificationDto);
  }

  @Get()
  findAll() {
    return this.qualificationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.qualificationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQualificationDto: UpdateQualificationDto) {
    return this.qualificationService.update(+id, updateQualificationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.qualificationService.remove(+id);
  }
}
