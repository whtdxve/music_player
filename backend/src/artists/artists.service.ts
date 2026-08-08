import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { prisma } from "../../lib/prisma";
import { ArtistResponseDto } from './dto/artist-response.dto';
import { TrackResponseDto } from 'src/tracks/dto/track-response.dto';
import { ReleaseResponseDto } from 'src/releases/dto/release-response.dto';
import { title } from 'node:process';
import { TracksService } from 'src/tracks/tracks.service';

@Injectable()
export class ArtistsService {
  constructor(private readonly tracksService: TracksService) { }

  async create(createArtistDto: CreateArtistDto): Promise<ArtistResponseDto> {
    const artist = await prisma.artist.create({ data: createArtistDto });
    return ArtistResponseDto.fromEntity(artist);
  }

  findAll() {
    return `This action returns all artists`;
  }

  async findOne(id: number) {
    return await prisma.artist.findUnique({ where: { id: id } });
  }

  update(id: number, updateArtistDto: UpdateArtistDto) {
    return `This action updates a #${id} artist`;
  }

  remove(id: number) {
    return `This action removes a #${id} artist`;
  }

  async findArtistByName(name: string): Promise<ArtistResponseDto | null> {
    const artist = await prisma.artist.findFirst({ where: { name: name } });
    const response = artist ? ArtistResponseDto.fromEntity(artist) : null;
    return response;
  }

  async findArtistTracks(id: number): Promise<TrackResponseDto[]> {
    const tracks = await prisma.track.findMany({
      where: { artistId: id },
      take: 5,
      include: {
        release: true,
        metadata: true
      },
    });
    return tracks.map(r => TrackResponseDto.fromEntity(r))
  }

  async findArtistAlbums(id: number) {
    const tracks = await prisma.track.groupBy({
      where: { artistId: id },
      by: ['releaseId'],
      _count: { id: true },
      having: {
        id: {
          _count: { gt: 1 },
        },
      },
    });

    const releaseIds = tracks.map(r => r.releaseId);
    const releases = await prisma.release.findMany({
      where: { id: { in: releaseIds } },
      take: 5,
      include: {
        tracks: {
          orderBy: { id: 'asc' },
          include: { metadata: true }
        },
        _count: {
          select: { tracks: true },
        },
      },
    });

    const result = await Promise.all(releases.map(async release => {
      const trackWithData = release.tracks.find(
        track => track.metadata.releasedAt !== null && track.metadata.coverData !== null
      );

      if (!trackWithData) {
        return null;
      }

      return {
        id: release.id,
        title: release.title,
        tracksCount: release._count.tracks,
        releasedAt: trackWithData?.metadata.releasedAt ?? null,
        cover: await this.tracksService.getCover(trackWithData?.id),
      };
    }));

    return result;
  }

  async findArtistSingles(id: number) {
    const tracks = await prisma.track.groupBy({
      where: { artistId: id },
      by: ['releaseId'],
      _count: { id: true },
      having: {
        id: {
          _count: { equals: 1 },
        },
      },
    });

    const releaseIds = tracks.map(r => r.releaseId);
    const releases = await prisma.release.findMany({
      where: { id: { in: releaseIds } },
      take: 5,
      include: {
        tracks: {
          orderBy: { id: 'asc' },
          include: { metadata: true }
        },
        _count: {
          select: { tracks: true },
        },
      },
    });

    const result = await Promise.all(releases.map(async release => {
      const trackWithData = release.tracks.find(
        track => track.metadata.releasedAt !== null && track.metadata.coverData !== null
      );

      if (!trackWithData) {
        return null;
      }

      return {
        id: release.id,
        title: release.title,
        tracksCount: release._count.tracks,
        releasedAt: trackWithData?.metadata.releasedAt ?? null,
        cover: await this.tracksService.getCover(trackWithData?.id),
      };
    }));

    return result;
  }
}
