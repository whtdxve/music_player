import { Injectable } from '@nestjs/common';
import { CreateMetadataDto } from './dto/create-metadata.dto';
import { UpdateMetadataDto } from './dto/update-metadata.dto';
import { prisma } from "../../lib/prisma";


@Injectable()
export class MetadatasService {
  async create(createMetadataDto: CreateMetadataDto) {
    return await prisma.metadata.create({
      data: { ...createMetadataDto},
    });
  }

  async findAll() {
    return await prisma.metadata.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} metadata`;
  }

  update(id: number, updateMetadataDto: UpdateMetadataDto) {
    return `This action updates a #${id} metadata`;
  }

  remove(id: number) {
    return `This action removes a #${id} metadata`;
  }
}
