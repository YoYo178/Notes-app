import { Note } from "../../../../types/note.types";
import { TMutation } from "../../../../types/react.types";

function saveNoteOnClick(
    fields: Partial<Note>
    createNoteMutation: TMutation<Partial<Note>>,
) {
    const { id, title, description, isText, isFavorite, images, duration } = fields;

    if (!title || !description) {
        console.error("Title or description fields cannot be empty!")
        return;
    }

    createNoteMutation.mutate({
        payload: {
            id,
            title,
            description,
            isText,
            duration,
            isFavorite,
            images
        }
    })
}

export const ButtonHandler = {
    saveNoteOnClick
}