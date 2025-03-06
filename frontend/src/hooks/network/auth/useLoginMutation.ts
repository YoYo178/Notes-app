import { useMutationBase } from '../useMutationBase';
import APIEndpoints from "../../../config/APIEndpoints";

import { LoginFields } from '../../../types/AuthTypes';

export const useLoginMutation = useMutationBase<LoginFields>(APIEndpoints.LOGIN, ['auth'], "Login", true);