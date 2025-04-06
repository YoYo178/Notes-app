import { useMutationBase } from '../useMutationBase';
import APIEndpoints from "../../../config/APIEndpoints";

import { LoginFields } from '../../../types/auth.types';

export const useLoginMutation = useMutationBase<LoginFields>(APIEndpoints.LOGIN, "Login", true);