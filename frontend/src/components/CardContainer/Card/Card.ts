import { UseMutationResult } from "@tanstack/react-query"
import { Note } from "../../../types/NoteTypes"

function favoriteOnClick(useUpdateNoteMutation: UseMutationResult<any, Error, Partial<Note> | undefined, unknown>, id: string, isFavorite: boolean | undefined) {
    useUpdateNoteMutation.mutate({
        id: id,
        isFavorite: !isFavorite
    })
}

export const ButtonHandler = {
    favoriteOnClick
}