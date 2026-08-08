import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, NotFoundException } from '@nestjs/common';
import { ReleasesService } from './releases.service';
import { CreateReleaseDto } from './dto/create-release.dto';
import { UpdateReleaseDto } from './dto/update-release.dto';
import { ReleaseResponseDto } from './dto/release-response.dto';

@Controller('releases')
export class ReleasesController {
  constructor(
    private readonly releasesService: ReleasesService) {}

  @Post()
  create(@Body() createReleaseDto: CreateReleaseDto) {
    return this.releasesService.create(createReleaseDto);
  }

  @Get()
  async findAll(): Promise<ReleaseResponseDto[]> {
    return await this.releasesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.releasesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReleaseDto: UpdateReleaseDto) {
    return this.releasesService.update(+id, updateReleaseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.releasesService.remove(+id);
  }
}
