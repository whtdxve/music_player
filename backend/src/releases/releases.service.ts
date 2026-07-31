import { Injectable } from '@nestjs/common';
import { CreateReleaseDto } from './dto/create-release.dto';
import { UpdateReleaseDto } from './dto/update-release.dto';
import { prisma } from '../../lib/prisma';
import { ReleaseResponseDto } from './dto/release-response.dto';

@Injectable()
export class ReleasesService {
  async create(createReleaseDto: CreateReleaseDto): Promise<ReleaseResponseDto> {
    const release = await prisma.release.create({ data: createReleaseDto })
    const response = ReleaseResponseDto.fromEntity(release);
    return response;
  }

  findAll() {
    return `This action returns all releases`;
  }

  findOne(id: number) {
    return `This action returns a #${id} release`;
  }

  async update(id: number, updateReleaseDto: UpdateReleaseDto): Promise<ReleaseResponseDto> {
    const release = await prisma.release.update({ where: { id: id }, data: updateReleaseDto });
    const response = ReleaseResponseDto.fromEntity(release);
    return response;
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
    const response = release ? ReleaseResponseDto.fromEntity(release) : null;
    return response;
  }
}
