import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, Logger, NotFoundException } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { statSync, createReadStream } from 'fs';
import { extname } from 'path';
import { Request, Response } from 'express';
import { LibraryController } from 'src/library/library.controller';

const MIME_TYPES: Record<string, string> = {
  '.mp3': 'audio/mpeg',
  '.flac': 'audio/flac',
  '.wav': 'audio/wav',
  '.m4a': 'audio/mp4',
  '.ogg': 'audio/ogg',
  '.aac': 'audio/aac',
};

@Controller('tracks')
export class TracksController {
  private readonly logger = new Logger(LibraryController.name);
  constructor(private readonly tracksService: TracksService) { }

  @Post()
  create(@Body() createTrackDto: CreateTrackDto) {
    return this.tracksService.create(createTrackDto);
  }

  @Get()
  findAll() {
    return this.tracksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tracksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTrackDto: UpdateTrackDto) {
    return this.tracksService.update(+id, updateTrackDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tracksService.remove(+id);
  }

  @Get(':id/stream')
  async streamTrack(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const track = await this.tracksService.findOne(+id);

    const filePath = track.metadata.filePath;
    const fileSize = track.metadata?.fileSize;
    const range = req.headers.range;
    const mimeType = MIME_TYPES[extname(filePath).toLowerCase()] ?? 'audio/mpeg';

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;

      const stream = createReadStream(filePath, { start, end });

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': mimeType,
      });

      stream.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': mimeType,
        'Accept-Ranges': 'bytes',
      });

      createReadStream(filePath).pipe(res);
    }
  }
}
