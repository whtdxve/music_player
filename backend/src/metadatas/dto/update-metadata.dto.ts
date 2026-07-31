import { PartialType } from '@nestjs/mapped-types';
import { CreateMetadataDto } from './create-metadata.dto';

export class UpdateMetadataDto extends PartialType(CreateMetadataDto) {}
