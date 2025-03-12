import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCemeteryDto {
  @ApiProperty({ description: 'The name of the cemetery' })
  @IsString()
  cemetery_name: string;

  @ApiProperty({ description: 'The address of the cemetery', required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ description: 'The city where the cemetery is located', required: false })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ description: 'The state where the cemetery is located', required: false })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiProperty({ description: 'The country where the cemetery is located', required: false })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({ description: 'The date when the cemetery was established', required: false })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  established_date?: Date;
} 