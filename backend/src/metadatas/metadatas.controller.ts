import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MetadatasService } from './metadatas.service';
import { CreateMetadataDto } from './dto/create-metadata.dto';
import { UpdateMetadataDto } from './dto/update-metadata.dto';

@Controller('metadatas')
export class MetadatasController {
  constructor(private readonly metadatasService: MetadatasService) {}

  @Post()
  async create(@Body() createMetadataDto: CreateMetadataDto) {
    return await this.metadatasService.create(createMetadataDto);
  }

  @Get()
  findAll() {
    return this.metadatasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.metadatasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMetadataDto: UpdateMetadataDto) {
    return this.metadatasService.update(+id, updateMetadataDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.metadatasService.remove(+id);
  }
}
