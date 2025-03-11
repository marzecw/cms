import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'The username for login' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ description: 'The password for login' })
  @IsNotEmpty()
  @IsString()
  password: string;
} 