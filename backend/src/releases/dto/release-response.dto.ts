import { IsString, IsOptional, IsNumber, IsDateString, IsBoolean } from "class-validator";

export class ReleaseResponseDto {
    @IsNumber()
    id!: number;

    @IsString()
    title!: string;

    @IsNumber()
    artistId!: number;

    coverData?: Uint8Array<ArrayBuffer>;

    @IsString()
    cover?: string;

    artist: any

    tracks: any

    static fromEntity(release: {
        id: number;
        title: string;
        artistId: number,
        coverData?: Uint8Array<ArrayBuffer> | null,
        coverType?: string | null,
        artist?: any,
        tracks?: any
    }): ReleaseResponseDto {
        return {
            id: release.id,
            title: release.title,
            artistId: release.artistId,
            cover: release.coverData
                ? `data:${release.coverType};base64,${Buffer.from(release.coverData).toString('base64')}`
                : undefined,
            artist: release.artist,
            tracks: release.tracks
        };
    }
}
