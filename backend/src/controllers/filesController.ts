import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { s3Service } from '../services/s3Service';
import { S3_CONFIG } from '../config/s3Config';
import HttpStatusCodes from '@src/common/HttpStatusCodes';

interface UploadRequestBody {
  fileName: string;
  fileType: 'image' | 'audio';
  contentType: string;
  fileSize: number;
  audioDuration?: number
}

const getUploadURL = asyncHandler(async (req: Request, res: Response) => {
  const { fileName, fileType, contentType, fileSize, audioDuration } = req.body as UploadRequestBody;
  const userId = req.user?.id;

  if (!fileName || !fileType || !contentType || !fileSize) {
    res.status(HttpStatusCodes.BAD_REQUEST).json({ message: 'All fields are required' });
    return;
  }

  if (!userId) {
    res.status(HttpStatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
    return;
  }

  // Validate file size
  const maxSize = fileType === 'image' ? S3_CONFIG.maxImageSize : S3_CONFIG.maxAudioSize;
  if (fileSize > maxSize) {
    res.status(HttpStatusCodes.BAD_REQUEST).json({ message: `File size exceeds maximum allowed size of ${maxSize / (1024 * 1024)}MB` });
    return;
  }

  // File metadata checks
  switch (fileType) {
    case 'image':
      // TODO
      break;

    case 'audio':
      if (!audioDuration) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({ message: 'audioDuration field is required' });
        return;
      }

      if (audioDuration > 60) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({ message: 'Given audio file exceeds maximum duration of 60s' });
        return;
      }
      break;

    default:
      console.error('File type not supported:', fileType);
      res.status(HttpStatusCodes.BAD_REQUEST).json({ message: 'File type not supported.' })
      return;
  }

  try {
    const key = s3Service.generateKey(userId, fileType, fileName);
    const uploadUrl = await s3Service.generateUploadUrl(key, contentType, fileType);

    res.status(HttpStatusCodes.OK).json({
      uploadUrl,
      key,
      expiresIn: S3_CONFIG.urlExpirationTime
    });
  } catch (error) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
});

const getURL = asyncHandler(async (req: Request, res: Response) => {
  const { fileKey } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    res.status(HttpStatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
    return;
  }

  // Verify that the file belongs to the user
  if (!fileKey.includes(`/${userId}/`)) {
    res.status(HttpStatusCodes.FORBIDDEN).json({ message: 'Forbidden' });
    return;
  }

  try {
    const url = await s3Service.generateFileUrl(fileKey);

    res.status(HttpStatusCodes.OK).json({
      url,
      expiresIn: S3_CONFIG.urlExpirationTime
    })
  } catch (error) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
});

const deleteFile = asyncHandler(async (req: Request, res: Response) => {
  const { fileKey } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    res.status(HttpStatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
    return;
  }

  // Verify that the file belongs to the user
  if (!fileKey.includes(`/${userId}/`)) {
    res.status(HttpStatusCodes.FORBIDDEN).json({ message: 'Forbidden' });
    return;
  }

  try {
    await s3Service.deleteFile(fileKey);
    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
});

export default {
  getUploadURL,
  getURL,
  deleteFile,
}