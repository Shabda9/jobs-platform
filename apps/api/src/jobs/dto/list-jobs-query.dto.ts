import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ListJobsQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  keyword?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  location?: string;

  /** Job category slug, e.g. hospitality */
  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  employmentType?: string;
}
