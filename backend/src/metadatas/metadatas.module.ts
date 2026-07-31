import { Module } from '@nestjs/common';
import { MetadatasService } from './metadatas.service';
import { MetadatasController } from './metadatas.controller';

@Module({
  controllers: [MetadatasController],
  providers: [MetadatasService],
  exports: [MetadatasService],
})
export class MetadatasModule { }
