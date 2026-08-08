import { plainToInstance } from "class-transformer";
import { IsNumber, IsString, IsOptional } from "class-validator";
import { Prisma } from "generated/prisma/client";

export class MetadataResponseDto {
    @IsNumber()
    id!: number;

    @IsString()
    fileName!: string;

    @IsString()
    filePath!: string;

    @IsString()
    title!: string;

    @IsString()
    artist!: string;

    @IsNumber()
    fileSize!: number;

    @IsString()
    albumArtist!: string;

    @IsString()
    releaseTitle!: string;

    @IsString()
    trackNo!: number;

    @IsString()
    releasedAt!: string;

    @IsString()
    genre!: string;

    @IsString()
    duration!: string;

    @IsString()
    @IsOptional()
    trackOf?: number | null;

    @IsString()
    @IsOptional()
    comment?: string | null;

    @IsString()
    @IsOptional()
    composer?: string | null;

    @IsString()
    @IsOptional()
    diskNo?: number | null;

    @IsString()
    @IsOptional()
    diskOf?: number | null;

    @IsOptional()
    coverData?: Uint8Array<ArrayBuffer> | null;

    @IsString()
    @IsOptional()
    coverType?: string | null;

    static fromEntity(metadata: {
        id: number;
        fileName: string;
        filePath: string;
        fileSize: number;
        title: string;
        artist: string;
        albumArtist: string;
        releaseTitle: string;
        releasedAt: string;
        genre: string;
        duration: string;
        trackNo: number;
        trackOf?: number | null;
        diskNo?: number | null;
        diskOf?: number | null;
        comment?: string | null;
        composer?: string | null;
        diskNumber?: string | null;
        coverData?: Uint8Array<ArrayBuffer> | null;
        coverType?: string | null;
    }): MetadataResponseDto {
        return {
            id: metadata.id,
            fileName: metadata.fileName,
            filePath: metadata.filePath,
            fileSize: metadata.fileSize,
            coverData: metadata.coverData,
            coverType: metadata.coverType,
            title: metadata.title,
            artist: metadata.artist,
            albumArtist: metadata.albumArtist,
            releaseTitle: metadata.releaseTitle,
            trackNo: metadata.trackNo,
            releasedAt: metadata.releasedAt,
            genre: metadata.genre,
            trackOf: metadata.trackOf ?? null,
            diskNo: metadata.diskNo ?? null,
            diskOf: metadata.diskOf ?? null,
            comment: metadata.comment ?? null,
            composer: metadata.composer ?? null,
            duration: metadata.duration ?? null
        };
    }
}
