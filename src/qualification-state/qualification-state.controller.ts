import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QualificationStateService } from './qualification-state.service';
import { CreateQualificationStateDto } from './dto/create-qualification-state.dto';
import { UpdateQualificationStateDto } from './dto/update-qualification-state.dto';

@Controller('qualification-state')
export class QualificationStateController {
  constructor(private readonly qualificationStateService: QualificationStateService) {}

  @Post()
  create(@Body() createQualificationStateDto: CreateQualificationStateDto) {
    return this.qualificationStateService.create(createQualificationStateDto);
  }

  @Get()
  findAll() {
    return this.qualificationStateService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.qualificationStateService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQualificationStateDto: UpdateQualificationStateDto) {
    return this.qualificationStateService.update(id, updateQualificationStateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.qualificationStateService.remove(id);
  }
}
