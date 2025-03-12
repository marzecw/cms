import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsOptional, IsDecimal } from 'class-validator';

export class CreateSpaceLevelDto {
  @ApiProperty({ description: 'The name of the space level' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'The description of the space level', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'The price of the space level' })
  @IsNotEmpty()
  @IsDecimal()
  price: number;

  @ApiProperty({ description: 'The status of the space level', default: 'available' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ description: 'The ID of the space this level belongs to' })
  @IsNotEmpty()
  @IsNumber()
  space_id: number;
} 