import { IsDateString, IsNumber } from "class-validator";
import { MetadataResponseDto } from "src/metadatas/dto/metadata-response.dto";

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

    metadata?: any;

    static fromEntity(track: { id: number; artistId: number; releaseId: number; metadataId: number; createdAt: Date; metadata?: any }): TrackResponseDto {
        return {
            id: track.id,
            artistId: track.artistId,
            releaseId: track.releaseId,
            metadataId: track.metadataId,
            createdAt: track.createdAt,
            metadata: track.metadata
        };
    }
}