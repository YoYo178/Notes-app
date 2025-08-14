import { useMutationBase } from "../useMutationBase";
import APIEndpoints from "../../../config/APIEndpoints";

import { INote } from "../../../types/note.types";

export const useUpdateNoteMutation = useMutationBase<Partial<INote>>(
    APIEndpoints.UPDATE_NOTE,
    "Updating Notes",
    true,
    {
        optimisticUpdate: ({ payload }, oldData) => {
            if (!oldData || !oldData.notes || !payload?._id) return oldData;

            return {
                notes: oldData.notes.map((note: INote) =>
                    note._id === payload._id
                        ? { ...note, ...payload }
                        : note
                )
            }
        }
    }
);