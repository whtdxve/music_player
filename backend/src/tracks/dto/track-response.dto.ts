import { plainToInstance, Type } from "class-transformer";
import { IsDateString, IsNumber, IsOptional, ValidateNested } from "class-validator";
import { Prisma } from "generated/prisma/client";
import { MetadataResponseDto } from "src/metadatas/dto/metadata-response.dto";
import { ReleaseResponseDto } from "src/releases/dto/release-response.dto";

export class TrackResponseDto {
    @IsNumber()
    id!: number;

    @IsNumber()
    artistId!: number;

    @IsNumber()
    releaseId!: number;

    @IsNumber()
    metadataId!: number;

    @IsDateString()
    createdAt!: Date;

    @ValidateNested()
    @Type(() => MetadataResponseDto)
    @IsOptional()
    metadata!: MetadataResponseDto;

    @ValidateNested()
    @Type(() => ReleaseResponseDto)
    @IsOptional()
    release?: ReleaseResponseDto | null;

    static fromEntity(track: {
        id: number;
        artistId: number;
        releaseId: number;
        metadataId: number;
        createdAt: Date;
        metadata: any;
        release?: any;
    }): TrackResponseDto {
        return {
            id: track.id,
            artistId: track.artistId,
            releaseId: track.releaseId,
            metadataId: track.metadataId,
            createdAt: track.createdAt,
            metadata: MetadataResponseDto.fromEntity(track.metadata),
            release: track.release ? ReleaseResponseDto.fromEntity(track.release) : null
        }
    }
}