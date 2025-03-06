import { useMutationBase } from "../useMutationBase";
import APIEndpoints from "../../../config/APIEndpoints";

import { RegisterFields } from '../../../types/AuthTypes';

export const useRegisterMutation = useMutationBase<RegisterFields>(APIEndpoints.REGISTER, [], "Register");