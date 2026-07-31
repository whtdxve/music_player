import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { prisma } from "../../lib/prisma";
import { ArtistResponseDto } from './dto/artist-response.dto';

@Injectable()
export class ArtistsService {
  async create(createArtistDto: CreateArtistDto): Promise<ArtistResponseDto> {
    const artist = await prisma.artist.create({ data: createArtistDto });
    const response = ArtistResponseDto.fromEntity(artist);    
    return response;
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
}
