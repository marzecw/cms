import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateGardenDto {
  @ApiProperty({ description: 'The name of the garden' })
  @IsString()
  garden_name: string;

  @ApiProperty({ description: 'The cemetery ID this garden belongs to' })
  @IsNumber()
  cemetery_id: number;

  @ApiProperty({ description: 'The description of the garden', required: false })
  @IsString()
  @IsOptional()
  description?: string;
} 