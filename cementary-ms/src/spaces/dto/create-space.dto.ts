import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsDecimal } from 'class-validator';

export class CreateSpaceDto {
  @ApiProperty({ description: 'The space number' })
  @IsString()
  space_number: string;

  @ApiProperty({ description: 'The lot ID this space belongs to' })
  @IsNumber()
  lot_id: number;

  @ApiProperty({ description: 'The type of space (standard, premium, mausoleum, etc.)', required: false, default: 'standard' })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({ description: 'The price of the space', required: false, default: 0 })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({ description: 'The status of the space', required: false, default: 'available' })
  @IsString()
  @IsOptional()
  status?: string;
} 