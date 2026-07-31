import { Module } from '@nestjs/common';
import { LibraryController } from './library.controller';
import { LibraryService } from './library.service';
import { AppService } from 'src/app.service';
import { MetadatasModule } from 'src/metadatas/metadatas.module';
import { ArtistsModule } from 'src/artists/artists.module';
import { TracksModule } from 'src/tracks/tracks.module';
import { ReleasesModule } from 'src/releases/releases.module';

@Module({
    imports: [
        MetadatasModule,
        ArtistsModule,
        TracksModule,
        ReleasesModule
    ],
    controllers: [LibraryController],
    providers: [LibraryService, AppService],
})
export class LibraryModule { }
