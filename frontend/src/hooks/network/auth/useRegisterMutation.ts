import { useMutationBase } from "../useMutationBase";
import APIEndpoints from "../../../config/APIEndpoints";

import { RegisterFields } from '../../../types/auth.types';

export const useRegisterMutation = useMutationBase<RegisterFields>(APIEndpoints.REGISTER, "Register");