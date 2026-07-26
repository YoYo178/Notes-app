import { User } from '@src/models/user.model.js';
import type { Request, Response } from 'express';
import HTTP_STATUS_CODES from '@src/common/HttpStatusCodes.js';
import mongoose from 'mongoose';
import { type INote, Note } from '@src/models/note.model.js';

/**
 * @route GET /notes
 * @description Returns all notes.
 * @returns HTTP 200, 404
 */
const getAllNotes = async (req: Request, res: Response) => {
  const user = await User.findById(req.user.id).select('-password').lean().exec();

  if (!user) {
    res.status(HTTP_STATUS_CODES.NotFound).send({ message: 'User not found' });
    return;
  }

  const notes = await Note.find({ user: user._id.toString() }).lean().exec();

  res.status(HTTP_STATUS_CODES.Ok).send({ notes });
};

/**
 * @route GET /notes/:noteId
 * @description Returns all notes.
 * @returns HTTP 200, 404
 */
const getNoteById = async (req: Request, res: Response) => {
  const user = await User.findById(req.user.id).select('-password').lean().exec();

  if (!user) {
    res.status(HTTP_STATUS_CODES.NotFound).send({ message: 'User not found' });
    return;
  }

  const noteId = req.params['noteId'];

  if (!noteId) {
    res.status(HTTP_STATUS_CODES.BadRequest).send({ message: 'Note ID is required!' });
    return;
  }

  const note = await Note.findOne({ user: user._id.toString(), _id: noteId }).lean().exec();

  if (!note) {
    res.status(HTTP_STATUS_CODES.NotFound).send({ message: 'Note not found' });
    return;
  }

  res.status(HTTP_STATUS_CODES.Ok).send({ data: { note } });
};

/**
 * @route POST /notes
 * @description Creates a new note.
 * @returns HTTP 200, 400, 404
 */
const createNote = async (req: Request, res: Response) => {
  const user = await User.findById(req.user.id).select('-password').lean().exec();

  if (!user) {
    res.status(HTTP_STATUS_CODES.NotFound).send({ message: 'User not found' });
    return;
  }

  const {
    title,
    description,
    images,
    isText,
    isFavorite,
    duration,
    audio = '',
  } = req.body as INote;

  if (!title || !description || duration === undefined || isText === undefined || isText === null) {
    res
      .status(HTTP_STATUS_CODES.BadRequest)
      .send({ message: 'All fields except images and isFavorite are required' });
    return;
  }

  const note = await Note.create({
    user: user._id.toString(),
    title,
    description,
    images: images ?? [],
    isText,
    isFavorite: isFavorite ?? false,
    duration: duration ?? null,
    audio,
  });

  res.status(HTTP_STATUS_CODES.Ok).send({ message: 'Note created successfully', data: { note } });
};

/**
 * @route PATCH /notes/:noteId
 * @description Updates an existing note.
 * @returns HTTP 200, 404
 */
const updateNote = async (req: Request, res: Response) => {
  const user = await User.findById(req.user.id).select('-password').lean().exec();

  if (!user) {
    res.status(HTTP_STATUS_CODES.NotFound).send({ message: 'User not found' });
    return;
  }

  const noteId = req.params['noteId'];

  if (!noteId) {
    res.status(HTTP_STATUS_CODES.BadRequest).send({ message: 'Note ID is required!' });
    return;
  }

  if (Array.isArray(noteId)) {
    res.status(HTTP_STATUS_CODES.BadRequest).send({ message: 'Invalid note ID format' });
    return;
  }

  const { title, description, images, isFavorite } = req.body as {
    title?: string;
    description?: string;
    images?: string[];
    isFavorite?: boolean;
  };

  if (!mongoose.Types.ObjectId.isValid(noteId)) {
    res.status(HTTP_STATUS_CODES.BadRequest).send({ message: 'Invalid ID provided' });
    return;
  }

  const note = await Note.findById(noteId).exec();

  if (!note) {
    res.status(HTTP_STATUS_CODES.NotFound).send({ message: 'No note found with the specified ID' });
    return;
  }

  note.title = title ?? note.title;
  note.description = description ?? note.description;
  note.images = (images || note.images) ?? [];
  note.isFavorite = isFavorite ?? note.isFavorite;

  await note.save();

  res.status(HTTP_STATUS_CODES.Ok).send({ message: 'Note updated successfully', data: { note } });
};

/**
 * @route DELETE /notes/:noteId
 * @description Deletes a note.
 * @returns HTTP 200, 404
 */
const deleteNote = async (req: Request, res: Response) => {
  const user = await User.findById(req.user.id).select('-password').lean().exec();

  if (!user) {
    res.status(HTTP_STATUS_CODES.NotFound).send({ message: 'User not found' });
    return;
  }

  const noteId = req.params['noteId'];

  if (!noteId) {
    res.status(HTTP_STATUS_CODES.BadRequest).send({ message: 'Note ID is required!' });
    return;
  }

  if (Array.isArray(noteId)) {
    res.status(HTTP_STATUS_CODES.BadRequest).send({ message: 'Invalid note ID format' });
    return;
  }

  if (!mongoose.Types.ObjectId.isValid(noteId)) {
    res.status(HTTP_STATUS_CODES.BadRequest).send({ message: 'Invalid ID provided' });
    return;
  }

  const note = await Note.findById(noteId).exec();

  if (!note) {
    res.status(HTTP_STATUS_CODES.NotFound).send({ message: 'No note found with the specified ID' });
    return;
  }

  await note.deleteOne();

  res.status(HTTP_STATUS_CODES.Ok).send({ message: 'Note deleted successfully' });
};

export default {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
};
