import { useMutationBase } from '../useMutationBase';
import APIEndpoints from "../../../config/APIEndpoints";

export const useLogoutMutation = useMutationBase(APIEndpoints.LOGOUT, ['auth'], "Logout", true);