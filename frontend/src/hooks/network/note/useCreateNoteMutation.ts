import { useMutationBase } from "../useMutationBase";
import APIEndpoints from "../../../config/APIEndpoints";

import { INote } from "../../../types/note.types";

export const useCreateNoteMutation = useMutationBase<Partial<INote>>(
    APIEndpoints.CREATE_NOTE,
    "Creating note",
    true,
    {
        onMutate: (variables, data: { notes?: INote[] }) => {
            if (!data.notes?.length || !variables.payload) return data.notes;

            return {
                notes: [...data.notes, { ...variables.payload, _id: crypto.randomUUID(), createdAt: Date.now() }]
            }
        },
        onSettled: (data: { message?: string, data?: { note: INote } }, error, _, context: { previousData: { notes?: INote[] } } | undefined, queryClient) => {
            if (error) {
                console.error('An error occured while handling optimistic updates! More info below:');
                console.error(error.message);

                queryClient.invalidateQueries({ queryKey: ['notes'] });
                return;
            }

            return {
                notes: [...context?.previousData?.notes || [], data?.data?.note]
            }
        }
    }
);