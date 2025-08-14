import AuthValidator from '@src/middleware/AuthValidator';
import { Router } from 'express';
import notesController from '@src/controllers/notesController';

const { getAllNotes, getNoteById, createNote, updateNote, deleteNote } = notesController;

const NotesRouter = Router();

NotesRouter.use(AuthValidator);

NotesRouter.get('/', getAllNotes);
NotesRouter.get('/', getNoteById);
NotesRouter.post('/', createNote);
NotesRouter.patch('/:noteId', updateNote);
NotesRouter.patch('/:noteId', deleteNote);

export default NotesRouter;
