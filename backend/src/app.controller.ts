import { Controller, Get, Render, Logger } from '@nestjs/common';
import { readdir, stat } from 'fs/promises';
import { dirname, join, basename, extname } from 'path';
import { IAudioMetadata, parseFile } from 'music-metadata';
import { writeFile, mkdir, access } from 'fs/promises';
import { AppService } from './app.service';

const AUDIO_EXTENSIONS = ['.mp3', '.flac', '.wav', '.m4a', '.ogg', '.aac'];

// interface AudioFileMetadata {
//   filePath: string;
//   img?: string;
//   title?: string;
//   extantion?: string;
//   artist?: string;
//   album?: string;
//   duration?: number;
//   year?: number;
//   genre?: string[];
// }

interface Release {
  img: string;
  artist: string;
  album: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }
  private readonly logger = new Logger(AppController.name);

  // Сканирование директории для получения метаданных аудиофайлов
  async scanDirectory(): Promise<Release[]> {
    const dirPath = 'music';
    const filePaths = await this.getAudioFilesPaths(dirPath);

    const releases: Release[] = [];

    for (const filePath of filePaths) {
      try {
        const metadata = await parseFile(filePath);

        const coverPath = await this.getReleaseCover(metadata);
        releases.push({
          img: coverPath,
          artist: metadata.common.albumartists?.join(', ') ?? 'Unknown Artist',
          album: metadata.common.album ?? 'Unknown Album',
        });
      } catch (error) {
        this.logger.warn(`Не удалось прочитать метадату: ${filePath} — ${error.message}`);
      }
    }
    
    return this.unique(releases);
  }

  async getReleaseCover(metadata: IAudioMetadata): Promise<string> {
    const picture = metadata.common.picture?.[0];
    let savePath = join(process.cwd(), 'public/covers');
    const ext = picture?.format.split('/')[1] || 'jpg'; // Определяем расширение картинки по её MIME-типу (image/jpeg → jpg)

    if (metadata.common.albumartists) savePath = join(savePath, metadata.common.albumartists.join(', '));
    if (metadata.common.album && ext) savePath = join(savePath, `${metadata.common.album}.${ext}`);
    const isFileExists = await this.fileExists(savePath);
    this.logger.log(savePath, isFileExists);
    if (isFileExists) {
      const urlPath = `/covers/${metadata.common.albumartists}/${metadata.common.album}.${ext}`;
      return urlPath;
    } else {
      savePath = await this.saveFile(metadata);
      return savePath;
    }
  }

  async saveFile(metadata: IAudioMetadata): Promise<string> {
    const picture = metadata.common.picture?.[0];
    let savePath = join(process.cwd(), 'public/covers');
    const ext = picture?.format.split('/')[1] || 'jpg'; // Определяем расширение картинки по её MIME-типу (image/jpeg → jpg)

    if (metadata.common.albumartists) savePath = join(savePath, metadata.common.albumartists.join(', '));
    if (metadata.common.album && ext) savePath = join(savePath, `${metadata.common.album}.${ext}`);

    const isFileExists = await this.fileExists(savePath);
    // Формируем имя файла на основе имени аудиофайла
    if (picture && !isFileExists) {
      await mkdir(dirname(savePath), { recursive: true });
      await writeFile(savePath, Buffer.from(picture.data));
    } else {
      savePath = 'Файл с таким названием уже существует'
    }
    return savePath;
  }

  // Рекурсивное получение путей к аудиофайлам
  private async getAudioFilesPaths(dirPath: string): Promise<string[]> {
    const items = await readdir(dirPath, { withFileTypes: true, recursive: true });
    let files: string[] = [];

    for (const item of items) {
      if (!item.isFile()) continue;
      const filePath = join(item.parentPath, item.name);
      files.push(filePath);
    }

    return files;
  }

  async fileExists(filePath: string): Promise<boolean> {
    try {
      await access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async unique(releases: Release[]): Promise<Release[]> {
    const map = new Map(releases.map(r => [`${r.artist}__${r.album}`, r]));
    return [...map.values()];
  }

  @Get()
  @Render('index')
  async root() {
    const data = await this.scanDirectory();
    return { data: data };
  }
}
