import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { v4 as uuid } from 'uuid';

export const ASSETS_PATH = path.resolve(import.meta.dirname, '..', '..', 'assets');

export const IMAGES_PATH = path.join(ASSETS_PATH, 'images');
export const AUDIO_PATH = path.join(ASSETS_PATH, 'audio');

// Multer setup
export const multerStorageConfig = multer.diskStorage({
  destination: (req, _file, callback) => {
    if (!fs.existsSync(IMAGES_PATH))
      fs.mkdirSync(IMAGES_PATH, { recursive: true });

    if (!fs.existsSync(AUDIO_PATH))
      fs.mkdirSync(AUDIO_PATH, { recursive: true });

    const userId = req.user.id;
    const isImage = req.path === '/upload/image';

    const uploadPath = isImage ? path.join(IMAGES_PATH, userId) : path.join(AUDIO_PATH, userId);

    if (!fs.existsSync(uploadPath))
      fs.mkdirSync(uploadPath, { recursive: true });

    if (fs.readdirSync(uploadPath).length >= 50)
      return callback(new Error('Upload limit reached. Please delete some files before uploading new ones.'), uploadPath);

    return callback(null, uploadPath);
  },
  filename: (_req, file, callback) => {
    callback(null, `${uuid()}${path.extname(file.originalname)}`);
  },
});
export const allowedMimeTypes = [
  'image/jpeg', 'image/png', 'image/webp',
  'audio/webm',
];

export const multerFileFilter: multer.Options['fileFilter'] = (_, file, callback) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(new Error('Only JPEG, PNG, and WEBP images, and WEBM audio files are allowed!'));
  }
};

export const multerLimits: multer.Options['limits'] = {
  fileSize: 2 * 1024 * 1024, // 2MB,
};

