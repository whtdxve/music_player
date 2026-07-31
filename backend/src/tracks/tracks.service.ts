import { Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { prisma } from "../../lib/prisma";
import { TrackResponseDto } from './dto/track-response.dto';

@Injectable()
export class TracksService {
  async create(createTrackDto: CreateTrackDto) {
    const track = await prisma.track.create({ data: createTrackDto });
    const response = TrackResponseDto.fromEntity(track);
    return response;
  }

  findAll() {
    return `This action returns all tracks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} track`;
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
        metadata: {
          title: title
        }
      }
    });
    const response = track ? TrackResponseDto.fromEntity(track) : null;
    return response;
  }
}
