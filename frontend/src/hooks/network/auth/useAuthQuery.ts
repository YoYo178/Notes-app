import { useQueryBase } from '../useQueryBase';
import APIEndpoints from '../../../config/APIEndpoints';

export const useAuthQuery = useQueryBase(APIEndpoints.AUTH_QUERY, true, false);