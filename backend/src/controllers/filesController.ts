import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import logger from 'jet-logger';
import { s3Service } from '../services/s3Service';
import { S3_CONFIG } from '../config/s3Config';
import HTTP_STATUS_CODES from '@src/common/HTTP_STATUS_CODES';

interface UploadRequestBody {
  fileName: string;
  fileType: 'image' | 'audio';
  contentType: string;
  fileSize: number;
  audioDuration?: number;
}

const getUploadURL = asyncHandler(async (req: Request, res: Response) => {
  const { fileName, fileType, contentType, fileSize, audioDuration } = req.body as UploadRequestBody;
  const userId = req.user.id;

  if (!fileName || !fileType || !contentType || !fileSize) {
    res.status(HTTP_STATUS_CODES.BadRequest).json({ message: 'All fields are required' });
    return;
  }

  if (!userId) {
    res.status(HTTP_STATUS_CODES.Unauthorized).json({ message: 'Unauthorized' });
    return;
  }

  // Validate file size
  const maxSize = fileType === 'image' ? S3_CONFIG.maxImageSize : S3_CONFIG.maxAudioSize;
  if (fileSize > maxSize) {
    res.status(HTTP_STATUS_CODES.BadRequest).json({ message: `File size exceeds maximum allowed size of ${maxSize / (1024 * 1024)}MB` });
    return;
  }

  // File metadata checks
  switch (fileType) {
  case 'image':
    // TODO
    break;

  case 'audio':
    if (!audioDuration) {
      res.status(HTTP_STATUS_CODES.BadRequest).json({ message: 'audioDuration field is required' });
      return;
    }

    if (audioDuration > 60) {
      res.status(HTTP_STATUS_CODES.BadRequest).json({ message: 'Given audio file exceeds maximum duration of 60s' });
      return;
    }
    break;

  default:
    logger.err('File type not supported:', fileType);
    res.status(HTTP_STATUS_CODES.BadRequest).json({ message: 'File type not supported.' });
    return;
  }

  try {
    const key = s3Service.generateKey(userId, fileType, fileName);
    const uploadUrl = await s3Service.generateUploadUrl(key, contentType, fileType);

    res.status(HTTP_STATUS_CODES.Ok).json({
      uploadUrl,
      key,
      expiresIn: S3_CONFIG.urlExpirationTime,
    });
  } catch (error) {
    if (error instanceof Error)
      res.status(HTTP_STATUS_CODES.InternalServerError).json({ message: error.message });
    else
      res.send(HTTP_STATUS_CODES.InternalServerError);

    return;
  }
});

const getURL = asyncHandler(async (req: Request, res: Response) => {
  const { fileKey } = req.query;
  const userId = req.user.id;

  if (!userId) {
    res.status(HTTP_STATUS_CODES.Unauthorized).json({ message: 'Unauthorized' });
    return;
  }

  if (!fileKey || typeof fileKey != 'string') {
    res.status(HTTP_STATUS_CODES.BadRequest).json({ message: 'Invalid payload, fileKey must be a string!' });
    return;
  }

  // Verify that the file belongs to the user
  if (!fileKey.includes(`/${userId}/`)) {
    res.status(HTTP_STATUS_CODES.Forbidden).json({ message: 'Forbidden' });
    return;
  }

  try {
    const url = await s3Service.generateFileUrl(fileKey);

    res.status(HTTP_STATUS_CODES.Ok).json({
      url,
      expiresIn: S3_CONFIG.urlExpirationTime,
    });
  } catch (error) {
    if (error instanceof Error)
      res.status(HTTP_STATUS_CODES.InternalServerError).json({ message: error.message });
    else
      res.send(HTTP_STATUS_CODES.InternalServerError);

    return;
  }
});

const getMultipleURL = asyncHandler(async (req: Request, res: Response) => {
  const { fileKeys }: Record<string, string[]> = req.body;
  const userId = req.user.id;

  if (!fileKeys || !Array.isArray(fileKeys) || !fileKeys?.length) {
    res.status(HTTP_STATUS_CODES.BadRequest).json({ message: 'Invalid payload, fileKeys must be a non-empty array!' });
    return;
  }

  const urlArray = await Promise.all(
    fileKeys.map(async key => {
      // Verify that the file belongs to the user
      if (!key.includes(`/${userId}/`)) {
        res.status(HTTP_STATUS_CODES.Forbidden).json({ message: 'Forbidden' });
        return;
      }

      try {
        return await s3Service.generateFileUrl(key);
      } catch (error) {
        if (error instanceof Error)
          res.status(HTTP_STATUS_CODES.InternalServerError).json({ message: error.message });
        else
          res.send(HTTP_STATUS_CODES.InternalServerError);

        return;
      }
    }),
  );

  res.status(HTTP_STATUS_CODES.Ok).json({
    urlArray,
    expiresIn: S3_CONFIG.urlExpirationTime,
  });
});

const deleteFile = asyncHandler(async (req: Request, res: Response) => {
  const { fileKey } = req.params;
  const userId = req.user.id;

  if (!userId) {
    res.status(HTTP_STATUS_CODES.Unauthorized).json({ message: 'Unauthorized' });
    return;
  }

  // Verify that the file belongs to the user
  if (!fileKey.includes(`/${userId}/`)) {
    res.status(HTTP_STATUS_CODES.Forbidden).json({ message: 'Forbidden' });
    return;
  }

  try {
    await s3Service.deleteFile(fileKey);
    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    if (error instanceof Error)
      res.status(HTTP_STATUS_CODES.InternalServerError).json({ message: error.message });
    else
      res.send(HTTP_STATUS_CODES.InternalServerError);

    return;
  }
});

export default {
  getUploadURL,
  getURL,
  getMultipleURL,
  deleteFile,
};