import { IsDateString, IsNumber, IsOptional, IsString } from "class-validator";

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

    static fromEntity(track: { id: number; artistId: number; releaseId: number; metadataId: number; createdAt: Date;}): TrackResponseDto {
        return {
            id: track.id,
            artistId: track.artistId,
            releaseId: track.releaseId,
            metadataId: track.metadataId,
            createdAt: track.createdAt,
        };
    }
}