import { useMutationBase } from "../useMutationBase";
import APIEndpoints from "../../../config/APIEndpoints";

import { Note, ServerNote } from "../../../types/note.types";

type NotePartial = Partial<Note>;

export const useUpdateNoteMutation = useMutationBase<NotePartial>(
    APIEndpoints.UPDATE_NOTE,
    "Updating Notes",
    true,
    {
        optimisticUpdate: (variables, oldData) => {
            if (!oldData || !oldData.notes || !variables?.id) return oldData;

            return {
                notes: oldData.notes.map((note: ServerNote) =>
                    note._id === variables.id
                        ? { ...note, ...variables }
                        : note
                )
            }
        }
    }
);