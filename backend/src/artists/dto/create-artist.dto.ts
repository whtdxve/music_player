import { IsString, IsOptional } from "class-validator";

export class CreateArtistDto {
    @IsString()
    name!: string;

    @IsOptional()
    @IsString()
    imagePath?: string | null;
}
