/** Normalised resume payload used by uploadResume (from Multer or future sources). */
export interface ResumeUploadFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}
