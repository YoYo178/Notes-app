import { useNetworkBase } from "../useNetworkBase";
import APIEndpoints from "../../../config/APIEndpoints";

import { RegisterFields } from '../../../types/AuthTypes';

export const useRegister = useNetworkBase<RegisterFields>(APIEndpoints.REGISTER, ['sign-up'], "Register");