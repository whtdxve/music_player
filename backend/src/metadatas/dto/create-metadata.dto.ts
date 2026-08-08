import { IsString, IsNumber, IsOptional } from "class-validator"

export class CreateMetadataDto {
    @IsString()
    fileName!: string;

    @IsString()
    filePath!: string;

    @IsNumber()
    fileUpdatedAt!: Date;

    @IsNumber()
    fileSize!: number;

    @IsString()
    duration!: string;

    @IsNumber()
    trackNo!: number;

    @IsString()
    title!: string;

    @IsString()
    artist!: string;

    @IsString()
    albumArtist!: string;

    @IsString()
    releaseTitle!: string;

    @IsString()
    releasedAt!: string;

    @IsString()
    @IsOptional()
    genre!: string;

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
}
