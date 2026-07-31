import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getDbHost() {
    return this.configService.get<string>('DATABASE_HOST', 'localhost');
  }

  getMusicFolderPath() {
    return this.configService.get<string>('MUSIC_FOLDER_PATH', 'music');
  }
}