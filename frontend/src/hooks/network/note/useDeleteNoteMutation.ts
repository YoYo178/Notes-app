import { useMutationBase } from "../useMutationBase";
import APIEndpoints from "../../../config/APIEndpoints";

import { ServerNote } from "../../../types/note.types";

export const useDeleteNoteMutation = useMutationBase<{ id: string }>(
    APIEndpoints.DELETE_NOTE,
    "Deleting Notes",
    true,
    {
        optimisticUpdate: ({ payload }, oldData: { notes: ServerNote[] }) => {
            if (!oldData || !oldData.notes || !payload?.id) return oldData;

            return {
                notes: oldData.notes.map((note: ServerNote) =>
                    note._id === payload.id
                        ? null
                        : note
                ).filter(note => !!note)
            }
        }
    }
);