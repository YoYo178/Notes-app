import AuthValidator from '@src/middleware/AuthValidator';
import { Router } from 'express';
import notesController from '@src/controllers/notesController';

const { getAllNotes, createNote, updateNote, deleteNote } = notesController;

const NotesRouter = Router();

NotesRouter.use(AuthValidator);

NotesRouter.route('/')
  .get(getAllNotes)
  .post(createNote)
  .patch(updateNote)
  .delete(deleteNote);

export default NotesRouter;
