import { useMutationBase } from '../useMutationBase';
import APIEndpoints from '../../../config/APIEndpoints';

export const useDeleteFileMutation = useMutationBase(APIEndpoints.DELETE_FILE, 'Deleting file', true);