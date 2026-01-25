import HTTP_STATUS_CODES from '@src/common/HTTP_STATUS_CODES';
import { ASSETS_PATH, multerFileFilter, multerLimits, multerStorageConfig } from '@src/config/multerConfig';
import { Router, Request, Response } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const FilesRouter = Router();

const upload = multer({ storage: multerStorageConfig, fileFilter: multerFileFilter, limits: multerLimits });

FilesRouter.post('/upload/image', upload.array('images[]', 5), (req: Request, res: Response) => {
  if (!req.files)
    return;

  const filenames = (req.files as Express.Multer.File[]).map(file => file.filename);

  res.status(HTTP_STATUS_CODES.Ok).json({ filenames });
});

FilesRouter.post('/upload/audio', upload.single('audio'), (req: Request, res: Response) => {
  if (!req.file)
    return;

  res.status(HTTP_STATUS_CODES.Ok).json({ filename: req.file.filename });
});

FilesRouter.delete('/', (req: Request, res: Response) => {
  const { files } = req.body as { files: string[] };

  if (!Array.isArray(files))
    return res.status(HTTP_STATUS_CODES.BadRequest).json({ message: 'files must be an array!' });

  const deletedFilenames: string[] = [];
  const unableToDelete: string[] = [];

  for (const filename of files) {
    if (!filename)
      continue;

    const isAudio = filename.endsWith('.webm');

    const filePath = path.join(ASSETS_PATH, isAudio ? 'audio' : 'images', req.user.id, filename);

    if (!fs.existsSync(filePath)) {
      unableToDelete.push(filename);
      continue;
    }

    fs.unlinkSync(filePath);
    deletedFilenames.push(filename);
  }

  res.status(HTTP_STATUS_CODES.Ok).json({ deletedFilenames, unableToDelete });
});

export default FilesRouter;