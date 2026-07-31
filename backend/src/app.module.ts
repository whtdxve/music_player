import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ReleasesModule } from './releases/releases.module';
import { TracksModule } from './tracks/tracks.module';
import { ArtistsModule } from './artists/artists.module';
import { LibraryModule } from './library/library.module';
import { MetadatasModule } from './metadatas/metadatas.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ReleasesModule,
    TracksModule,
    ArtistsModule,
    LibraryModule,
    MetadatasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
