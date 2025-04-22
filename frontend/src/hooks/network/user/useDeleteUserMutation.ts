import { useMutationBase } from '../useMutationBase';
import APIEndpoints from "../../../config/APIEndpoints";

export const useDeleteUserMutation = useMutationBase(APIEndpoints.DELETE_USER, "Delete user", true);