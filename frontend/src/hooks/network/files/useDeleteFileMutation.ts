import { useMutationBase } from '../useMutationBase';
import APIEndpoints from "../../../config/APIEndpoints";

export const useDeleteFileMutation = useMutationBase<{ files: string[] }>(APIEndpoints.DELETE_FILES, "Deleting files", true);