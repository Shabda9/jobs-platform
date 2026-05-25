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

  validateResumeFile(file: ResumeUploadFile): void {
    if (!file.buffer?.length) {
      throw new BadRequestException('Resume file is required');
    }

    if (file.size > RESUME_MAX_BYTES) {
      throw new BadRequestException('Resume must be 5MB or smaller');
    }

    if (!RESUME_ALLOWED_MIME_TYPES.has(file.mimetype)) {
      throw new BadRequestException(
        'Resume must be a PDF, DOC, or DOCX file',
      );
    }

    const extension = extname(file.originalname).toLowerCase();
    if (
      !RESUME_ALLOWED_EXTENSIONS.includes(
        extension as (typeof RESUME_ALLOWED_EXTENSIONS)[number],
      )
    ) {
      throw new BadRequestException(
        'Resume file extension must be .pdf, .doc, or .docx',
      );
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
