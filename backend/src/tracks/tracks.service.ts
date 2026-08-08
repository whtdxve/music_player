import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { prisma } from "../../lib/prisma";
import { TrackResponseDto } from './dto/track-response.dto';
import { isFloat16Array } from 'util/types';
import { parseFile } from 'music-metadata';

@Injectable()
export class TracksService {
  async create(createTrackDto: CreateTrackDto) {
    const track = await prisma.track.create({
      data: createTrackDto,
      include: { metadata: true }
    });
    const response = TrackResponseDto.fromEntity(track);
    return response;
  }

  findAll() {
    return `This action returns all tracks`;
  }

  async findOne(id: number) {
    const track = await prisma.track.findFirst({
      where: { id: id },
      include: { metadata: true }
    });
    if (!track) {
      throw new NotFoundException(`Трек с id ${id} не найден`);
    }
    return TrackResponseDto.fromEntity(track);
  }

  update(id: number, updateTrackDto: UpdateTrackDto) {
    return `This action updates a #${id} track`;
  }

  remove(id: number) {
    return `This action removes a #${id} track`;
  }

  async findTrackByTitleAndArtistId(title: string, artistId: number): Promise<TrackResponseDto | null> {
    const track = await prisma.track.findFirst({
      where: {
        artistId: artistId,
        metadata: { title: title }
      },
      include: { metadata: true }
    });
    return track ? TrackResponseDto.fromEntity(track) : null;
  }

  async getCover(id: number): Promise<string | null> {
    const track = await prisma.track.findFirst({
      where: { id: id },
      include: { metadata: true }
    });

    if (!track) {
      return null;
    }

    const filePath = track.metadata.filePath;
    const metadata = await parseFile(filePath);
    const picture = metadata.common.picture?.[0];
    if (picture) {
      const coverData = new Uint8Array(picture.data);
      const coverType = picture.format;
      const cover = `data:${coverType};base64,${Buffer.from(coverData).toString('base64')}`
      return cover;
    } else {
      return null
    }
  }
}
