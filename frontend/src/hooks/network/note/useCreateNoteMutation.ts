import { useMutationBase } from "../useMutationBase";
import APIEndpoints from "../../../config/APIEndpoints";

import { NotePayload, ServerNote } from "../../../types/note.types";

export const useCreateNoteMutation = useMutationBase<NotePayload>(
    APIEndpoints.CREATE_NOTE,
    "Creating note",
    true,
    {
        optimisticUpdate: ({ payload }, oldData: { notes: ServerNote[] }) => {
            if (!oldData || !oldData.notes || !payload) return oldData;
            return {
                notes: [{ ...payload, _id: crypto.randomUUID(), createdAt: Date.now() }, ...oldData.notes]
            };
        }
    }
);