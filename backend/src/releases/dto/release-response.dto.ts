import { IsString, IsOptional, IsNumber, IsDateString } from "class-validator";

export class ReleaseResponseDto {
    @IsNumber()
    id!: number;

    @IsString()
    title!: string;

    @IsNumber()
    artistId!: number;

    static fromEntity(release: { id: number; title: string; artistId: number }): ReleaseResponseDto {
        return {
            id: release.id,
            title: release.title,
            artistId: release.artistId,
        };
    }
}
