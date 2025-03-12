import { PartialType } from '@nestjs/swagger';
import { CreateLotDto } from './create-lot.dto';

export class UpdateLotDto extends PartialType(CreateLotDto) {
  // All properties from CreateLotDto are made optional by PartialType
  // We don't need to include lot_id here as it's not part of CreateLotDto
} 