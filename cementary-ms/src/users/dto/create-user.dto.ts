import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, IsNumber, IsOptional, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'The tenant ID this user belongs to' })
  @IsNotEmpty()
  @IsNumber()
  tenant_id: number;

  @ApiProperty({ description: 'The username for login' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ description: 'The email address of the user' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'The password for the user' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'The first name of the user' })
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @ApiProperty({ description: 'The last name of the user' })
  @IsNotEmpty()
  @IsString()
  last_name: string;

  @ApiProperty({ description: 'The role of the user', required: false })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiProperty({ description: 'Whether the user is active', required: false })
  @IsOptional()
  is_active?: boolean;
} 