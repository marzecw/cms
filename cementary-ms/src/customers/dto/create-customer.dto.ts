import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({ description: 'The first name of the customer' })
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @ApiProperty({ description: 'The last name of the customer' })
  @IsNotEmpty()
  @IsString()
  last_name: string;

  @ApiProperty({ description: 'The email address of the customer', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'The phone number of the customer', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'The address of the customer', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ description: 'The city of the customer', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ description: 'The state of the customer', required: false })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ description: 'The country of the customer', required: false })
  @IsOptional()
  @IsString()
  country?: string;
} 