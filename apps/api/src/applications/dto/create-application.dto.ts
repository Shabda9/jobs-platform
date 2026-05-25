import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  fullName: string;

  @IsEmail()
  @MaxLength(320)
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  coverMessage?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  availability?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  workRights?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  experienceSummary?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  licenceOrCertificate?: string;
}
