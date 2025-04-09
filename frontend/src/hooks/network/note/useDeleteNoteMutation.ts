import { useMutationBase } from "../useMutationBase";
import APIEndpoints from "../../../config/APIEndpoints";

import { ServerNote } from "../../../types/note.types";

export const useDeleteNoteMutation = useMutationBase<{ id: string }>(
    APIEndpoints.DELETE_NOTE,
    "Deleting Notes",
    true,
    {
        optimisticUpdate: ({ id }, oldData: { notes: ServerNote[] }) => {
            if (!oldData || !oldData.notes || !id) return oldData;

            return {
                notes: oldData.notes.map((note: ServerNote) =>
                    note._id === id
                        ? null
                        : note
                ).filter(note => !!note)
            }
        }
    }
);