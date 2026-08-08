import { IsString, IsOptional, IsNumber, IsDateString, IsBoolean } from "class-validator";

export class CreateReleaseDto {
    @IsString()
    title!: string;

    @IsNumber()
    artistId!: number;

    coverData?: Uint8Array<ArrayBuffer> | null;

    @IsString()
    coverType?: string | null;
}
