import { useMutationBase } from "../useMutationBase";
import APIEndpoints from "../../../config/APIEndpoints";

import { INote } from "../../../types/note.types";

export const useUpdateNoteMutation = useMutationBase<Partial<INote>>(
    APIEndpoints.UPDATE_NOTE,
    "Updating Notes",
    true,
    {
        onMutate: (variables, data: { notes?: INote[] }) => {
            if (!data.notes?.length || !variables.payload || !variables.pathParams?.noteId) return data.notes;

            return {
                notes: data.notes?.map(note => note._id === variables.pathParams?.noteId ? { ...note, ...variables.payload } : note)
            }
        },
    }
);