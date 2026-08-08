import { Module } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';
import { TracksService } from 'src/tracks/tracks.service';
import { TracksModule } from 'src/tracks/tracks.module';

@Module({
  imports: [TracksModule],
  controllers: [ArtistsController],
  providers: [ArtistsService, TracksService],
  exports: [ArtistsService],
})
export class ArtistsModule { }
