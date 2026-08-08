import { Type } from "class-transformer";
import { IsString, IsOptional, IsNumber, IsDateString, IsBoolean, ValidateNested } from "class-validator";
import { Prisma } from "generated/prisma/client";
import { ArtistResponseDto } from "src/artists/dto/artist-response.dto";
import { TrackResponseDto } from "src/tracks/dto/track-response.dto";
import { plainToInstance } from 'class-transformer';

export class ReleaseResponseDto {
    @IsNumber()
    id!: number;

    @IsString()
    title!: string;

    @IsNumber()
    artistId!: number;

    @IsString()
    @IsOptional()
    cover?: string | null;

    @ValidateNested()
    @Type(() => ArtistResponseDto)
    @IsOptional()
    artist?: ArtistResponseDto | null

    @ValidateNested({ each: true })
    @Type(() => TrackResponseDto)
    @IsOptional()
    tracks?: TrackResponseDto[] | null

    static fromEntity(release: {
        id: number;
        title: string;
        artistId: number;
        coverData?: Uint8Array<ArrayBuffer> | null;
        coverType?: string | null;
        artist?: any;
        tracks?: any;
    }) {
        const cover = release.coverData
            ? `data:${release.coverType};base64,${Buffer.from(release.coverData).toString('base64')}`
            : undefined;

        return {
            id: release.id,
            title: release.title,
            artistId: release.artistId,
            cover,
            artist: release.artist ? ArtistResponseDto.fromEntity(release.artist) : null,
            tracks: release.tracks ? release.tracks.map(t => TrackResponseDto.fromEntity(t)) : null
        }
    }
}
