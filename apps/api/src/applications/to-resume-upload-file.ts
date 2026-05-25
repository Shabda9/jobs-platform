import type { ResumeUploadFile } from '../files/types/resume-upload-file';

/** Maps a Multer file to the shared resume upload shape used by FilesService. */
export function toResumeUploadFile(file: Express.Multer.File): ResumeUploadFile {
  return {
    buffer: file.buffer,
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
  };
}
