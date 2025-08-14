import { useMutationBase } from "../useMutationBase";
import APIEndpoints from "../../../config/APIEndpoints";

export const useDeleteNoteMutation = useMutationBase(
    APIEndpoints.DELETE_NOTE,
    "Deleting Notes",
    true
);