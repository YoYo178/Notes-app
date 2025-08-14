import { INote } from "../../../types/note.types"
import { ReactSetState, TMutation, TOptimisticMutation } from "../../../types/react.types";

function favoriteOnClick(useUpdateNoteMutation: TOptimisticMutation<Partial<INote>>, id: string, isFavorite: boolean | undefined) {
    useUpdateNoteMutation.mutate({
        pathParams: {
            noteId: id
        },
        payload: {
            isFavorite: !isFavorite
        }
    });
}

async function deleteOnClick(deleteNoteMutation: TMutation<unknown>, deleteFileMutation: TMutation<unknown>, note: INote) {

    await deleteNoteMutation.mutateAsync({
        pathParams: {
            noteId: note._id
        }
    });

    if (note.audio) {
        await deleteFileMutation.mutateAsync({ pathParams: { fileKey: note.audio } });
    }

    if (note.images?.length) {
        note.images.forEach(async imageKey => {
            await deleteFileMutation.mutateAsync({ pathParams: { fileKey: imageKey } });
        })
    }
}

function copyOnClick(title: string, description: string, setIsCopied: ReactSetState<boolean>, timeoutRef: React.RefObject<number>) {
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