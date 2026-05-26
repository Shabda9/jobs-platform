import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import type { SupabaseClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';
import {
  RESUME_ALLOWED_EXTENSIONS,
  RESUME_ALLOWED_MIME_TYPES,
  RESUME_BUCKET,
  RESUME_MAX_BYTES,
} from './files.constants';
import { RESUME_VALIDATION_MESSAGES } from './files.messages';
import type { ResumeUploadFile } from './types/resume-upload-file';

export interface UploadedResumeResult {
  fileId: string;
  bucket: string;
  path: string;
  originalFileName: string;
  mimeType: string;
  size: number;
}

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly supabaseService: SupabaseService,
  ) {}

  /**
   * Validates, uploads to private Supabase Storage, and records metadata in UploadedFile.
   */
  async uploadResume(file: ResumeUploadFile): Promise<UploadedResumeResult> {
    this.validateResumeFile(file);

    const storagePath = this.buildStoragePath(file.originalname);
    const supabase = this.supabaseService.getAdminClient();

    const { error: uploadError } = await supabase.storage
      .from(RESUME_BUCKET)
      .upload(storagePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      this.logger.error(
        `Supabase upload failed for ${storagePath}: ${uploadError.message}`,
      );

      const hint = uploadError.message.includes('row-level security')
        ? ' Use SUPABASE_SERVICE_ROLE_KEY (service_role secret) in apps/api/.env — not the anon/publishable key. See apps/api/supabase/storage-resumes-policies.sql if policies are required.'
        : '';

      throw new InternalServerErrorException(
        `Failed to upload resume file: ${uploadError.message}${hint}`,
      );
    }

    try {
      const record = await this.prisma.uploadedFile.create({
        data: {
          bucket: RESUME_BUCKET,
          path: storagePath,
          originalFileName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
        },
      });

      return {
        fileId: record.id,
        bucket: record.bucket,
        path: record.path,
        originalFileName: record.originalFileName,
        mimeType: record.mimeType,
        size: record.size,
      };
    } catch (dbError) {
      await this.removeStorageObject(supabase, storagePath);
      throw dbError;
    }
  }

  /**
   * Removes an uploaded resume from Storage and the UploadedFile table (rollback).
   */
  async deleteUploadedResume(fileId: string): Promise<void> {
    const record = await this.prisma.uploadedFile.findUnique({
      where: { id: fileId },
      select: { id: true, bucket: true, path: true },
    });

    if (!record) {
      return;
    }

    const supabase = this.supabaseService.getAdminClient();
    await this.removeStorageObject(supabase, record.path);

    await this.prisma.uploadedFile.delete({ where: { id: fileId } });
  }

  validateResumeFile(file: ResumeUploadFile): void {
    if (!file.buffer?.length) {
      throw new BadRequestException({
        message: RESUME_VALIDATION_MESSAGES.required,
        errors: [RESUME_VALIDATION_MESSAGES.required],
      });
    }

    if (file.size > RESUME_MAX_BYTES) {
      throw new BadRequestException({
        message: RESUME_VALIDATION_MESSAGES.maxSize,
        errors: [RESUME_VALIDATION_MESSAGES.maxSize],
      });
    }

    const extension = extname(file.originalname).toLowerCase();
    const extensionAllowed = RESUME_ALLOWED_EXTENSIONS.includes(
      extension as (typeof RESUME_ALLOWED_EXTENSIONS)[number],
    );
    const mimeAllowed = RESUME_ALLOWED_MIME_TYPES.has(file.mimetype);

    if (!extensionAllowed || !mimeAllowed) {
      throw new BadRequestException({
        message: RESUME_VALIDATION_MESSAGES.fileType,
        errors: [RESUME_VALIDATION_MESSAGES.fileType],
      });
    }
  }

  private buildStoragePath(originalFileName: string): string {
    const safeName = this.sanitizeFileName(originalFileName);
    return `${randomUUID()}/${safeName}`;
  }

  private sanitizeFileName(fileName: string): string {
    const base = fileName.replace(/[/\\]/g, '').trim();
    const sanitized = base.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 200);
    return sanitized || 'resume';
  }

  private async removeStorageObject(
    supabase: SupabaseClient,
    path: string,
  ): Promise<void> {
    const { error } = await supabase.storage.from(RESUME_BUCKET).remove([path]);

    if (error) {
      this.logger.warn(
        `Failed to remove orphaned storage object ${path}: ${error.message}`,
      );
    }
  }
}
