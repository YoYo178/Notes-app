import { useMutationBase } from "../useMutationBase";
import APIEndpoints from "../../../config/APIEndpoints";

import { INote } from "../../../types/note.types";

export const useCreateNoteMutation = useMutationBase<Partial<INote>>(
    APIEndpoints.CREATE_NOTE,
    "Creating note",
    true,
    {
        optimisticUpdate: ({ payload }, oldData: { notes: INote[] }) => {
            if (!oldData || !oldData.notes || !payload) return oldData;
            return {
                notes: [{ ...payload, _id: crypto.randomUUID(), createdAt: Date.now() }, ...oldData.notes]
            };
        }
    }
);