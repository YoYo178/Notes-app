import { Note } from "../../../types/note.types"
import { ReactSetState, TOptimisticMutation } from "../../../types/react.types";

function favoriteOnClick(useUpdateNoteMutation: TOptimisticMutation<Partial<Note>>, id: string, isFavorite: boolean | undefined) {
    useUpdateNoteMutation.mutate({
        payload: {
            id,
            isFavorite: !isFavorite
        }
    });
}

function deleteOnClick(deleteNoteMutation: TOptimisticMutation<{ id: string }>, note: Note) {

    if (note.audio) {
        // TODO
    }

    if (note.images?.length) {
        note.images.forEach(async imageFile => {
            // TODO
        })
    }

    deleteNoteMutation.mutate({
        payload: {
            id: note.id
        }
    });
}

function copyOnClick(title: string, description: string, setIsCopied: ReactSetState<boolean>, timeoutRef: React.MutableRefObject<number>) {
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