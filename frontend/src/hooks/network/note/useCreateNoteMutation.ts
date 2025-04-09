import { useMutationBase } from "../useMutationBase";
import APIEndpoints from "../../../config/APIEndpoints";

import { NotePayload, ServerNote } from "../../../types/note.types";

export const useCreateNoteMutation = useMutationBase<NotePayload>(
    APIEndpoints.CREATE_NOTE,
    "Creating note",
    true,
    {
        optimisticUpdate: (newNote, oldData: { notes: ServerNote[] }) => {
            if (!oldData || !oldData.notes || !newNote) return oldData;
            return {
                notes: [{ ...newNote, _id: crypto.randomUUID(), createdAt: Date.now() }, ...oldData.notes]
            };
        }
    }
);