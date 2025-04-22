import { useMutationBase } from '../useMutationBase';
import APIEndpoints from "../../../config/APIEndpoints";

import { UserUpdateFields } from '../../../types/user.types';

export const useUpdateUserMutation = useMutationBase<Partial<UserUpdateFields>>(APIEndpoints.UPDATE_USER, "Update user", true);