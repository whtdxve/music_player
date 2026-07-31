import { IsNumber, IsOptional, IsString } from "class-validator";

export class ArtistResponseDto {
    @IsNumber()
    id!: number;

    @IsString()
    name!: string;

    @IsString()
    @IsOptional()
    image?: string;

    static fromEntity(artist: { id: number; name: string; imagePath: string | null }): ArtistResponseDto {
    return {
      id: artist.id,
      name: artist.name,
      image: artist.imagePath ?? undefined,
    };
  }
}