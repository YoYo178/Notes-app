import { UseMutationResult } from "@tanstack/react-query";

import { Note } from "../../../../types/note.types";

function saveNoteOnClick(
    createNoteMutation: UseMutationResult<any, Error, Partial<Note> | undefined, unknown>,
    fields: Partial<Note>
) {
    const { id, title, description, isText, isFavorite, images, duration } = fields;

    if (!title || !description) {
        console.error("Title or description fields cannot be empty!")
        return;
    }

    createNoteMutation.mutate({
        id,
        title,
        description,
        isText,
        duration,
        isFavorite,
        images
    })
}

export const ButtonHandler = {
    saveNoteOnClick
}