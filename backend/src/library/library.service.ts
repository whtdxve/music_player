import { Injectable, Logger } from '@nestjs/common';
import { readdir, stat } from 'fs/promises';
import { join, basename, extname } from 'path';
import { parseFile } from 'music-metadata';
import { AppService } from 'src/app.service';
import { CreateMetadataDto } from 'src/metadatas/dto/create-metadata.dto';
import { MetadatasService } from 'src/metadatas/metadatas.service';
import { ArtistsService } from 'src/artists/artists.service';
import { CreateArtistDto } from 'src/artists/dto/create-artist.dto';
import { TracksService } from 'src/tracks/tracks.service';
import { CreateTrackDto } from 'src/tracks/dto/create-track.dto';
import { ReleasesService } from 'src/releases/releases.service';
import { CreateReleaseDto } from 'src/releases/dto/create-release.dto';

const AUDIO_EXTENSIONS = ['.mp3', '.flac', '.wav', '.m4a', '.ogg', '.aac'];

@Injectable()
export class LibraryService {
    private readonly logger = new Logger(LibraryService.name);

    constructor(
        private readonly appService: AppService,
        private readonly metadatasService: MetadatasService,
        private readonly artistsService: ArtistsService,
        private readonly tracksService: TracksService,
        private readonly releasesService: ReleasesService
    ) { }

    // Обновляет данные библиотеки
    async libraryRefresh(): Promise<void> {
        await this.scanDirectory();
        await this.metadataScan();
    }

    // Сканирование директории для получения метаданных аудиофайлов
    async scanDirectory(): Promise<void> {
        const musicFolderPath = this.appService.getMusicFolderPath();

        this.logger.log(`Путь к папке с музыкой: ${musicFolderPath}`);

        const unindexedFilesPaths = await this.getUnindexedAudioFilesPaths(musicFolderPath);
        this.logger.log(`Новые пути: ${unindexedFilesPaths}`);
        for (const filePath of unindexedFilesPaths) {
            try {
                const metadata = await parseFile(filePath);
                const stats = await stat(filePath);

                const fileName = basename(filePath);
                const title = metadata.common.title ?? 'Unkown Title';
                const artist = metadata.common.artist ?? 'Unkown Artist';                 // TODO: подумать как можно разделять нескольких артистов
                const albumArtist = metadata.common.albumartist ?? 'Unkown Album Artist'; // TODO: подумать как можно разделять нескольких артистов
                const releaseTitle = metadata.common.album ?? 'Unkown Album';
                const trackNo = metadata.common.track.no ? String(metadata.common.track.no) : '';
                const trackOf = metadata.common.track.of ? String(metadata.common.track.of) : null;
                const trackNumber = trackOf ? trackNo + '/' + trackOf : trackNo;
                const releasedAt = String(metadata.common.year) ?? '00-00-0000';
                const comments = metadata.common.comment;
                const comment = comments?.map((comment) => comment.text).join(' | ') ?? '';
                const genre = String(metadata.common.genre) ?? '';
                const composer = metadata.common.composer?.join(' | ') ?? '';
                const diskNo = metadata.common.disk.no ? String(metadata.common.disk.no) : '';
                const diskOf = metadata.common.disk.of ? String(metadata.common.disk.of) : null;
                const diskNumber = diskOf ? diskNo + '/' + diskOf : diskNo;
                const fileUpdatedAt = stats.mtime;
                const fileSize = stats.size;

                const CreateMetadataDto: CreateMetadataDto = {
                    fileName: fileName,
                    filePath: filePath,
                    title: title,
                    artist: artist,
                    albumArtist: albumArtist,
                    releaseTitle: releaseTitle,
                    trackNumber: trackNumber,
                    releasedAt: releasedAt,
                    comment: comment,
                    genre: genre,
                    composer: composer,
                    diskNumber: diskNumber,
                    fileUpdatedAt: fileUpdatedAt,
                    fileSize: fileSize
                };

                this.metadatasService.create(CreateMetadataDto);

                this.logger.log(`Метадата сохранена: ${filePath}`);
            } catch (error) {
                this.logger.error(`Ошибка при сохранении метадаты: ${error}`);
            }
        }
    }

    // Рекурсивное получение путей к аудиофайлам
    private async getUnindexedAudioFilesPaths(dirPath: string): Promise<string[]> {
        const items = await readdir(dirPath, { withFileTypes: true, recursive: true });
        let files: string[] = [];

        for (const item of items) {
            if (!item.isFile() || !AUDIO_EXTENSIONS.includes(extname(item.name))) continue;
            const filePath = join(item.parentPath, item.name);
            files.push(filePath);
        }
        const metadatas = await this.metadatasService.findAll();
        const existingPaths = new Set(metadatas.map(m => m.filePath));
        const newFilePaths = files.filter(file_path => !existingPaths.has(file_path));

        return newFilePaths;
    }

    // Сканирование записаей из таблицы Metadata на наличие данных из них в БД
    private async metadataScan() {
        const metadatas = await this.metadatasService.findAll();

        for (const metadata of metadatas) {
            const artistName = metadata.albumArtist ?? 'Unkown Artist';
            const trackTitle = metadata.title ?? 'Unkown Title';
            const releaseTitle = metadata.releaseTitle ?? 'Unkown Album';

            const artist = await this.artistsService.findArtistByName(artistName);

            if(!artist) {
                const createArtistDto: CreateArtistDto = {
                    name: artistName
                };
                
                const artist = await this.artistsService.create(createArtistDto);
                
                this.logger.log(`Создан артист: ${artist.name}`);
            } else {
                this.logger.log(`Артист ${artist.name} уже есть в БД`);

                const artistId = artist.id;
                const release = await this.releasesService.findReleaseByTitleAndArtistId(releaseTitle, artistId);

                if(!release) {
                    const createReleaseDto: CreateReleaseDto = {
                        title: releaseTitle,
                        artistId: artistId,
                    };
    
                    const release = await this.releasesService.create(createReleaseDto);

                    this.logger.log(`Создан релиз: ${release.title}`);
                } else {
                    this.logger.log(`Релиз ${release.title} уже есть в БД`);

                    const track = await this.tracksService.findTrackByTitleAndArtistId(trackTitle, artistId);

                    if (!track) {
                        const createTrackDto: CreateTrackDto = {
                            artistId: artistId,
                            releaseId: release.id,
                            metadataId: metadata.id
                        };
    
                        const track = await this.tracksService.create(createTrackDto);
                        
                        this.logger.log(`Создан трек: ${trackTitle}`);
                    } else {
                        this.logger.log(`Трек ${trackTitle} уже есть в БД`);
                    }
                }
            }
        }
    }

    // async getReleaseCover(metadata: IAudioMetadata): Promise<string> {
    //     const picture = metadata.common.picture?.[0];
    //     let savePath = join(process.cwd(), 'public/covers');
    //     const ext = picture?.format.split('/')[1] || 'jpg'; // Определяем расширение картинки по её MIME-типу (image/jpeg → jpg)

    //     if (metadata.common.albumartists) savePath = join(savePath, metadata.common.albumartists.join(', '));
    //     if (metadata.common.album && ext) savePath = join(savePath, `${metadata.common.album}.${ext}`);
    //     const isFileExists = await this.fileExists(savePath);
    //     this.logger.log(savePath);
    //     if (isFileExists) {
    //         const urlPath = `/covers/${metadata.common.albumartists}/${metadata.common.album}.${ext}`;
    //         return urlPath;
    //     } else {
    //         savePath = await this.saveFile(metadata);
    //         return savePath;
    //     }
    // }

    // Сохранение картинок
    // async saveFile(metadata: IAudioMetadata): Promise<string> {
    //     const picture = metadata.common.picture?.[0];
    //     let savePath = join(process.cwd(), 'public/covers');
    //     const ext = picture?.format.split('/')[1] || 'jpg'; // Определяем расширение картинки по её MIME-типу (image/jpeg → jpg)

    //     if (metadata.common.albumartists) savePath = join(savePath, metadata.common.albumartists.join(', '));
    //     if (metadata.common.album && ext) savePath = join(savePath, `${metadata.common.album}.${ext}`);

    //     const isFileExists = await this.fileExists(savePath);
    //     // Формируем имя файла на основе имени аудиофайла
    //     if (picture && !isFileExists) {
    //         await mkdir(dirname(savePath), { recursive: true });
    //         await writeFile(savePath, Buffer.from(picture.data));
    //     } else {
    //         savePath = 'Файл с таким названием уже существует'
    //     }
    //     return savePath;
    // }



    // async fileExists(filePath: string): Promise<boolean> {
    //     try {
    //         await access(filePath);
    //         return true;
    //     } catch {
    //         return false;
    //     }
    // }

    // async unique(releases: ReleaseResponseDto[]): Promise<ReleaseResponseDto[]> {
    //     const map = new Map(releases.map(r => [`${r.artist}__${r.album}`, r]));
    //     return [...map.values()];
    // }
}