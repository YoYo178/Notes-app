import { Note } from "../../../types/note.types"
import { ReactSetState, TMutation, TOptimisticMutation } from "../../../types/react.types";

function favoriteOnClick(useUpdateNoteMutation: TOptimisticMutation<Partial<Note>>, id: string, isFavorite: boolean | undefined) {
    useUpdateNoteMutation.mutate({
        payload: {
            id,
            isFavorite: !isFavorite
        }
    });
}

async function deleteOnClick(deleteNoteMutation: TOptimisticMutation<{ id: string }>, deleteFileMutation: TMutation<unknown>, note: Note) {

    await deleteNoteMutation.mutateAsync({
        payload: {
            id: note.id
        }
    });

    if (note.audio) {
        await deleteFileMutation.mutateAsync({ pathParams: { fileKey: note.audio.key } });
    }

    if (note.images?.length) {
        note.images.forEach(async imageFile => {
            await deleteFileMutation.mutateAsync({ pathParams: { fileKey: imageFile.key } });
        })
    }
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