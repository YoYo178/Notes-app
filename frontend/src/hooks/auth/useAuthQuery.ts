import { useNetworkBase } from '../base/useNetworkBase';
import APIEndpoints from "../../config/APIEndpoints";

export const useAuthQuery = useNetworkBase(APIEndpoints.AUTH_QUERY, ['authQuery'], "Getting auth status", true);