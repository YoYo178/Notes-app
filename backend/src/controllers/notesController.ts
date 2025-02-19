import { User } from "@src/models/User";
import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";
import HttpStatusCodes from "@src/common/HttpStatusCodes";
import { ObjectId } from "mongoose";
import { Note } from "@src/models/Note";

/**
 * @route GET /notes
 * @description Returns all notes.
 * @returns HTTP 200, 404
 */
const getAllNotes = expressAsyncHandler(async (req: Request, res: Response) => {
    const user = await User.findOne({ username: req.user?.username }).select('-password').lean().exec();

    if (!user) {
        res.status(HttpStatusCodes.NOT_FOUND).send({ message: "User not found" });
        return;
    }

    const notes = await Note.find({ user: (user._id as ObjectId).toString() }).lean().exec() || [];

    if (!notes.length) {
        res.status(HttpStatusCodes.NOT_FOUND).send({ message: "No notes found for this user" });
        return;
    }

    res.status(HttpStatusCodes.OK).send({ notes });
})

/**
 * @route POST /notes
 * @description Creates a new note.
 * @returns HTTP 200, 400, 404
 */
const createNote = expressAsyncHandler(async (req: Request, res: Response) => {
    const user = await User.findOne({ username: req.user?.username }).select('-password').lean().exec();

    if (!user) {
        res.status(HttpStatusCodes.NOT_FOUND).send({ message: "User not found" });
        return;
    }

    const { title, description, images } = req.body;

    if (!title || !description) {
        res.status(HttpStatusCodes.BAD_REQUEST).send({ message: "Title and description fields are required" });
        return;
    }

    const note = await Note.create({
        user: (user._id as ObjectId).toString(),
        title,
        description,
        images: (images && images.length) ? images : [],
    })

    res.status(HttpStatusCodes.OK).send({ message: "Note created successfully", id: (note._id as ObjectId).toString() });
})

/**
 * @route PATCH /notes
 * @description Updates an existing note.
 * @returns HTTP 200, 404
 */
const updateNote = expressAsyncHandler(async (req: Request, res: Response) => {
    const user = await User.findOne({ username: req.user?.username }).select('-password').lean().exec();

    if (!user) {
        res.status(HttpStatusCodes.NOT_FOUND).send({ message: "User not found" });
        return;
    }

    const { id, title, description, images } = req.body;

    const note = await Note.findById(id).exec();

    if (!note) {
        res.status(HttpStatusCodes.NOT_FOUND).send({ message: "No note found with the specified ID" });
        return;
    }

    note.title = title || note.title;
    note.description = description || note.description;
    note.images = (images && images.length) ? images : note.images;

    await note.save();

    res.status(HttpStatusCodes.OK).send({ message: "Note updated successfully" });

})

/**
 * @route DELETE /notes
 * @description Deletes a note.
 * @returns HTTP 200, 404
 */
const deleteNote = expressAsyncHandler(async (req: Request, res: Response) => {
    const user = await User.findOne({ username: req.user?.username }).select('-password').lean().exec();

    if (!user) {
        res.status(HttpStatusCodes.NOT_FOUND).send({ message: "User not found" });
        return;
    }

    const { id } = req.body;

    await Note.deleteOne({ _id: id });

    res.status(HttpStatusCodes.OK).send({ message: "Note deleted successfully" });
})

export default {
    getAllNotes,
    createNote,
    updateNote,
    deleteNote
}