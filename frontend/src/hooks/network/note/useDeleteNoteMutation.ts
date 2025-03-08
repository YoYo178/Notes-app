import { useMutationBase } from "../useMutationBase";
import APIEndpoints from "../../../config/APIEndpoints";

export const useDeleteNoteMutation = useMutationBase<{ id: string }>(APIEndpoints.DELETE_NOTE, ['notes'], "Deleting Notes", true);