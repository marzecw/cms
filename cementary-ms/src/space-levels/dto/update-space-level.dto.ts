import { PartialType } from '@nestjs/swagger';
import { CreateSpaceLevelDto } from './create-space-level.dto';

export class UpdateSpaceLevelDto extends PartialType(CreateSpaceLevelDto) {} 