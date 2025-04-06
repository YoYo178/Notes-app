import { useMutationBase } from '../useMutationBase';
import { UserUpdateFields } from '../../../types/user.types';
import APIEndpoints from "../../../config/APIEndpoints";

export const useUpdateUserMutation = useMutationBase<Partial<UserUpdateFields>>(APIEndpoints.UPDATE_USER, "Update user", true);