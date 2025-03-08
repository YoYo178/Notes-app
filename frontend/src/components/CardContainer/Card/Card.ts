import { UseMutationResult } from "@tanstack/react-query"
import { Note } from "../../../types/NoteTypes"

function favoriteOnClick(useUpdateNoteMutation: UseMutationResult<any, Error, Partial<Note> | undefined, unknown>, id: string, isFavorite: boolean | undefined) {
    useUpdateNoteMutation.mutate({
        id,
        isFavorite: !isFavorite
    })
}

function deleteOnClick(useDeleteNoteMutation: UseMutationResult<any, Error, { id: string } | undefined, unknown>, id: string) {
    useDeleteNoteMutation.mutate({
        id
    })
}

export const ButtonHandler = {
    favoriteOnClick,
    deleteOnClick
}