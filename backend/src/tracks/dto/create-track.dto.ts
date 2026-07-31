import { IsNumber, IsOptional, IsDateString, IsString } from "class-validator";

export class CreateTrackDto {
    @IsOptional()
    @IsNumber()
    artistId!: number;
    
    @IsOptional()
    @IsNumber()
    releaseId!: number;
    
    @IsOptional()
    @IsNumber()
    metadataId!: number;
}
