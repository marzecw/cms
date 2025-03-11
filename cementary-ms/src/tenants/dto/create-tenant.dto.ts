import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateTenantDto {
  @ApiProperty({ description: 'The name of the tenant' })
  @IsNotEmpty()
  @IsString()
  tenant_name: string;

  @ApiProperty({ description: 'The database name for the tenant' })
  @IsNotEmpty()
  @IsString()
  db_name: string;

  @ApiProperty({ description: 'The contact email for the tenant', required: false })
  @IsOptional()
  @IsEmail()
  contact_email?: string;

  @ApiProperty({ description: 'The contact phone for the tenant', required: false })
  @IsOptional()
  @IsString()
  contact_phone?: string;
} 