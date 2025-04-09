import { Note } from "../../../../types/note.types";
import { TOptimisticMutation } from "../../../../types/react.types";

function saveNoteOnClick(
    editNoteMutation: TOptimisticMutation<Partial<Note>>,
    fields: Partial<Note>
) {
    const { id, title, description, isText, isFavorite, images, duration } = fields;

    if (!title || !description) {
        console.error("Title or description fields cannot be empty!")
        return;
    }

    editNoteMutation.mutate({
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