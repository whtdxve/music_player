import { IsString, IsOptional, IsNumber, IsDateString } from "class-validator";

export class CreateReleaseDto {
    @IsString()
    title!: string;

    @IsNumber()
    artistId!: number;
}
