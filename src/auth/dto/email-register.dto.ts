import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class EmailRegisterDto {
  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiProperty()
  @IsString()
  readonly password: string;
}
