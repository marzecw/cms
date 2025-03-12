import { PartialType } from '@nestjs/swagger';
import { CreateSpaceDto } from './create-space.dto';

export class UpdateSpaceDto extends PartialType(CreateSpaceDto) {
  // All properties from CreateSpaceDto are made optional by PartialType
  // We don't need to include space_id here as it's not part of CreateSpaceDto
} 