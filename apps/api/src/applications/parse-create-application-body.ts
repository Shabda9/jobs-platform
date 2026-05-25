import { BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateApplicationDto } from './dto/create-application.dto';

/**
 * Validates multipart/form-data text fields into CreateApplicationDto.
 * (Nest ValidationPipe does not run on individual form fields by default.)
 */
export async function parseCreateApplicationBody(
  body: Record<string, unknown>,
): Promise<CreateApplicationDto> {
  const dto = plainToInstance(CreateApplicationDto, body, {
    enableImplicitConversion: false,
  });

  const errors = await validate(dto, {
    whitelist: true,
    forbidNonWhitelisted: false,
  });

  if (errors.length > 0) {
    const messages = errors.flatMap((error) =>
      error.constraints ? Object.values(error.constraints) : [],
    );

    throw new BadRequestException({
      message: 'Validation failed',
      errors: messages,
    });
  }

  return dto;
}
