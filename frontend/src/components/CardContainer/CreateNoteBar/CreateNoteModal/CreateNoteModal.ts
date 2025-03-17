import { UseMutationResult } from "@tanstack/react-query"
import { BaseNote } from "../../../hooks/network/note/useCreateNoteMutation";

function addNoteOnClick(
    createNoteMutation: UseMutationResult<any, Error, BaseNote | undefined, unknown>,
    fields: BaseNote
) {
    const { title, description, isText, isFavorite, images, duration } = fields;

    if (!title || !description) {
        console.error("Title or description fields cannot be empty!")
        return;
    }

    createNoteMutation.mutate({
        title,
        description,
        isText,
        duration,
        isFavorite,
        images
    })
}
export const ButtonHandler = {
    addNoteOnClick
}