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
    
    @IsString()
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
    trackOf?: number;
    
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

    coverData?: Uint8Array<ArrayBuffer>;
    
    @IsString()
    @IsOptional()
    coverType?: string;
}
