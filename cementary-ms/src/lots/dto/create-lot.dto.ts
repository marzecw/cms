import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateLotDto {
  @ApiProperty({ description: 'The lot number' })
  @IsString()
  lot_number: string;

  @ApiProperty({ description: 'The garden ID this lot belongs to' })
  @IsNumber()
  garden_id: number;

  @ApiProperty({ description: 'The status of the lot', required: false })
  @IsString()
  @IsOptional()
  status?: string;
} 