import { Router } from 'express';
import filesController from '../../controllers/filesController';
import AuthValidator from '../../middleware/AuthValidator';

const { getUploadURL, getURL, deleteFile } = filesController;

const FilesRouter = Router();

FilesRouter.use(AuthValidator);

FilesRouter.post('/getUploadURL', getUploadURL);

FilesRouter.get('/getURL/:fileKey', getURL);
FilesRouter.delete('/delete/:fileKey', deleteFile)

export default FilesRouter;