import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReleaseDto } from './dto/create-release.dto';
import { UpdateReleaseDto } from './dto/update-release.dto';
import { prisma } from '../../lib/prisma';
import { ReleaseResponseDto } from './dto/release-response.dto';

@Injectable()
export class ReleasesService {
  async create(createReleaseDto: CreateReleaseDto): Promise<ReleaseResponseDto> {
    const release = await prisma.release.create({ data: { ...createReleaseDto } });
    return ReleaseResponseDto.fromEntity(release);
  }

  async findAll(): Promise<ReleaseResponseDto[]> {
    const releases = await prisma.release.findMany({ include: { artist: true } });
    return releases.map(r => ReleaseResponseDto.fromEntity(r));
  }

  async findOne(id: number): Promise<ReleaseResponseDto> {
    const release = await prisma.release.findFirst({
      where: { id: id },
      include: {
        artist: true,
        tracks: { include: { metadata: true } }
      }
    });
    if (!release) {
      throw new NotFoundException(`Релиз с id ${id} не найден`);
    }
    return ReleaseResponseDto.fromEntity(release);
  }

  async update(id: number, updateReleaseDto: UpdateReleaseDto) {
    // const release = await prisma.release.update({ where: { id: id }, data: updateReleaseDto });
    // return ReleaseResponseDto.fromEntity(release);
  }

  remove(id: number) {
    return `This action removes a #${id} release`;
  }

  async findReleaseByTitleAndArtistId(title: string, artistId: number): Promise<ReleaseResponseDto | null> {
    const release = await prisma.release.findFirst({
      where: {
        title: title,
        artistId: artistId
      }
    });
    return release ? ReleaseResponseDto.fromEntity(release) : null;
  }
}
