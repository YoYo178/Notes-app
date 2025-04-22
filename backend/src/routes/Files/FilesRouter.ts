import { Router } from 'express';
import filesController from '../../controllers/filesController';
import AuthValidator from '../../middleware/AuthValidator';

const { getUploadURL, getURL, getMultipleURL, deleteFile } = filesController;

const FilesRouter = Router();

FilesRouter.use(AuthValidator);

FilesRouter.post('/getUploadURL', getUploadURL);
FilesRouter.post('/getMultipleURL', getMultipleURL);

FilesRouter.get('/getURL/', getURL);
FilesRouter.delete('/delete/:fileKey', deleteFile);

export default FilesRouter;