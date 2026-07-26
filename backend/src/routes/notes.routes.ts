import { Router } from 'express';
import notesController from '@src/controllers/notes.controller.js';

const { getAllNotes, getNoteById, createNote, updateNote, deleteNote } = notesController;

const NotesRouter = Router();

NotesRouter.get('/', getAllNotes);
NotesRouter.get('/', getNoteById);
NotesRouter.post('/', createNote);
NotesRouter.patch('/:noteId', updateNote);
NotesRouter.delete('/:noteId', deleteNote);

export default NotesRouter;
