import { IsNumber, IsString, IsOptional } from "class-validator";

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

    @IsString()
    albumArtist!: string;

    @IsString()
    releaseTitle!: string;

    @IsString()
    trackNo!: number;

    @IsString()
    @IsOptional()
    trackOf?: number;

    @IsString()
    releasedAt!: string;

    @IsString()
    genre!: string;

    @IsString()
    @IsOptional()
    comment?: string;

    @IsString()
    @IsOptional()
    composer?: string;

    @IsString()
    @IsOptional()
    diskNo?: number;

    @IsString()
    @IsOptional()
    diskOf?: number;

    @IsString()
    @IsOptional()
    duration?: string;

    @IsOptional()
    coverData?: Uint8Array<ArrayBuffer>;

    @IsString()
    @IsOptional()
    coverType?: string;

    static fromEntity(metadata: {
        id: number;
        fileName: string;
        filePath: string;
        title: string;
        artist: string;
        albumArtist: string;
        releaseTitle: string;
        releasedAt: string;
        genre: string;
        duration: string;
        trackNo: number;
        trackOf?: number;
        diskNo?: number;
        diskOf?: number;
        comment?: string | null;
        composer?: string | null;
        diskNumber?: string | null;
        coverData?: Uint8Array<ArrayBuffer>;
        coverType?: string;
    }): MetadataResponseDto {
        return {
            id: metadata.id,
            fileName: metadata.fileName,
            filePath: metadata.filePath,
            coverData: metadata.coverData,
            coverType: metadata.coverType,
            title: metadata.title,
            artist: metadata.artist,
            albumArtist: metadata.albumArtist,
            releaseTitle: metadata.releaseTitle,
            trackNo: metadata.trackNo,
            releasedAt: metadata.releasedAt,
            genre: metadata.genre,
            trackOf: metadata.trackOf ?? undefined,
            diskNo: metadata.diskNo ?? undefined,
            diskOf: metadata.diskOf ?? undefined,
            comment: metadata.comment ?? undefined,
            composer: metadata.composer ?? undefined,
            duration: metadata.duration ?? undefined
        };
    }
}
