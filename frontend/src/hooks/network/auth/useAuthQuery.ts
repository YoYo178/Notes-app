import { useNetworkBase } from '../useNetworkBase';
import APIEndpoints from "../../../config/APIEndpoints";

export const useAuthQuery = useNetworkBase(APIEndpoints.AUTH_QUERY, ['authQuery'], "Getting auth status", true);