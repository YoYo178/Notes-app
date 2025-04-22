import { useMutationBase } from "../useMutationBase";
import APIEndpoints from "../../../config/APIEndpoints";

import { NotePayload, ServerNote } from "../../../types/note.types";

export const useUpdateNoteMutation = useMutationBase<Partial<NotePayload> & { id: string }>(
    APIEndpoints.UPDATE_NOTE,
    "Updating Notes",
    true,
    {
        optimisticUpdate: ({ payload }, oldData) => {
            if (!oldData || !oldData.notes || !payload?.id) return oldData;

            return {
                notes: oldData.notes.map((note: ServerNote) =>
                    note._id === payload.id
                        ? { ...note, ...payload }
                        : note
                )
            }
        }
    }
);