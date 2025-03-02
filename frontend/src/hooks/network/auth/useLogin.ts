import { useNetworkBase } from '../useNetworkBase';
import APIEndpoints from "../../../config/APIEndpoints";

import { LoginFields } from '../../../types/AuthTypes';

export const useLogin = useNetworkBase<LoginFields>(APIEndpoints.LOGIN, ['auth'], "Login", true);