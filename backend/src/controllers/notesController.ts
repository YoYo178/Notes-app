import { User } from "@src/models/User";
import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";
import HttpStatusCodes from "@src/common/HttpStatusCodes";
import { isObjectIdOrHexString, ObjectId } from "mongoose";
import { INote, Note } from "@src/models/Note";

/**
 * @route GET /notes
 * @description Returns all notes.
 * @returns HTTP 200, 404
 */
const getAllNotes = expressAsyncHandler(async (req: Request, res: Response) => {
    const user = await User.findById(req.user?.id).select('-password').lean().exec();

    if (!user) {
        res.status(HttpStatusCodes.NOT_FOUND).send({ message: "User not found" });
        return;
    }

    const notes = await Note.find({ user: (user._id as ObjectId).toString() }).lean().exec() || [];

    res.status(HttpStatusCodes.OK).send({ notes });
})

/**
 * @route POST /notes
 * @description Creates a new note.
 * @returns HTTP 200, 400, 404
 */
const createNote = expressAsyncHandler(async (req: Request, res: Response) => {
    const user = await User.findById(req.user?.id).select('-password').lean().exec();

    if (!user) {
        res.status(HttpStatusCodes.NOT_FOUND).send({ message: "User not found" });
        return;
    }

    const { title, description, images, isText, isFavorite, duration, audioKey } = req.body as INote;

    if (
        !title || !description || duration === undefined ||
        (isText === undefined || isText === null)
    ) {
        res.status(HttpStatusCodes.BAD_REQUEST).send({ message: "All fields except images and isFavorite are required" });
        return;
    }

    const note = await Note.create({
        user: (user._id as ObjectId).toString(),
        title,
        description,
        images: images ?? [],
        isText,
        isFavorite: isFavorite ?? false,
        duration: duration ?? null,
        audioKey
    })

    res.status(HttpStatusCodes.OK).send({ message: "Note created successfully", id: (note._id as ObjectId).toString() });
})

/**
 * @route PATCH /notes
 * @description Updates an existing note.
 * @returns HTTP 200, 404
 */
const updateNote = expressAsyncHandler(async (req: Request, res: Response) => {
    const user = await User.findById(req.user?.id).select('-password').lean().exec();

    if (!user) {
        res.status(HttpStatusCodes.NOT_FOUND).send({ message: "User not found" });
        return;
    }

    const { id, title, description, images, isFavorite } = req.body;

    if (!id) {
        res.status(HttpStatusCodes.BAD_REQUEST).send({ message: "Note ID is required" });
        return;
    }

    if (!isObjectIdOrHexString(id)) {
        res.status(HttpStatusCodes.BAD_REQUEST).send({ message: "Invalid ID provided" });
        return;
    }

    const note = await Note.findById(id).exec();

    if (!note) {
        res.status(HttpStatusCodes.NOT_FOUND).send({ message: "No note found with the specified ID" });
        return;
    }

    note.title = title || note.title;
    note.description = description || note.description;
    note.images = images ?? note.images;
    note.isFavorite = isFavorite ?? note.isFavorite;

    await note.save();

    res.status(HttpStatusCodes.OK).send({ message: "Note updated successfully" });

})

/**
 * @route DELETE /notes
 * @description Deletes a note.
 * @returns HTTP 200, 404
 */
const deleteNote = expressAsyncHandler(async (req: Request, res: Response) => {
    const user = await User.findById(req.user?.id).select('-password').lean().exec();

    if (!user) {
        res.status(HttpStatusCodes.NOT_FOUND).send({ message: "User not found" });
        return;
    }

    const { id } = req.body;

    if (!id) {
        res.status(HttpStatusCodes.BAD_REQUEST).send({ message: "Note ID is required" });
        return;
    }

    if (!isObjectIdOrHexString(id)) {
        res.status(HttpStatusCodes.BAD_REQUEST).send({ message: "Invalid ID provided" });
        return;
    }

    const note = await Note.findById(id).lean().exec();

    if (!note) {
        res.status(HttpStatusCodes.NOT_FOUND).send({ message: "No note found with the specified ID" });
        return;
    }

    await Note.deleteOne({ _id: id });

    res.status(HttpStatusCodes.OK).send({ message: "Note deleted successfully" });
})

export default {
    getAllNotes,
    createNote,
    updateNote,
    deleteNote
}