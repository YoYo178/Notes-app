import { useMutationBase } from "../useMutationBase";
import APIEndpoints from "../../../config/APIEndpoints";
import { INote } from "../../../types/note.types";

export const useDeleteNoteMutation = useMutationBase(
    APIEndpoints.DELETE_NOTE,
    "Deleting Notes",
    true,
    {
        onMutate: (variables, data: { notes?: INote[] }) => {
            if (!data.notes?.length || !variables.pathParams?.noteId) return data.notes;

            return {
                notes: data.notes?.filter(note => note._id !== variables.pathParams?.noteId)
            }
        },
    }
);