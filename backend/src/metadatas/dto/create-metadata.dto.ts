import { IsString, IsOptional, IsNumber } from "class-validator"

export class CreateMetadataDto {
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
    trackNumber!: string;

    @IsString()
    releasedAt!: string;

    @IsString()
    comment!: string;

    @IsString()
    genre!: string;

    @IsString()
    composer!: string;

    @IsString()
    diskNumber!: string;

    @IsNumber()
    fileUpdatedAt!: Date;

    @IsNumber()
    fileSize!: number;
}
