import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

/** Treat empty multipart text fields as omitted. */
function emptyToUndefined({ value }: { value: unknown }) {
  if (value === '' || value === null || value === undefined) {
    return undefined;
  }
  return typeof value === 'string' ? value : String(value);
}

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
  @Transform(emptyToUndefined)
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  @Transform(emptyToUndefined)
  coverMessage?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @Transform(emptyToUndefined)
  availability?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @Transform(emptyToUndefined)
  workRights?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  @Transform(emptyToUndefined)
  experienceSummary?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @Transform(emptyToUndefined)
  licenceOrCertificate?: string;
}
