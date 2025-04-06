import APIEndpoints from '../../../config/APIEndpoints';
import { useMutationBase } from '../useMutationBase';

export const useDeleteFileMutation = useMutationBase(APIEndpoints.DELETE_FILE, 'Deleting file', true);