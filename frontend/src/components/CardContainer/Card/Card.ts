import { UseMutationResult } from "@tanstack/react-query"
import { Note } from "../../../types/NoteTypes"

function favoriteOnClick(useUpdateNoteMutation: UseMutationResult<any, Error, Partial<Note> | undefined, unknown>, id: string, isFavorite: boolean | undefined) {
    useUpdateNoteMutation.mutate({
        id,
        isFavorite: !isFavorite
    });
}

function deleteOnClick(useDeleteNoteMutation: UseMutationResult<any, Error, { id: string } | undefined, unknown>, id: string) {
    useDeleteNoteMutation.mutate({
        id
    });
}

function copyOnClick(title: string, description: string, setIsCopied: React.Dispatch<React.SetStateAction<boolean>>, timeoutRef: React.MutableRefObject<number>) {
    navigator.clipboard.writeText(`${title}\n${description}`);

    setIsCopied(true);

    if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
        setIsCopied(false);
    }, 2000);
}

export const ButtonHandler = {
    favoriteOnClick,
    deleteOnClick,
    copyOnClick,
}