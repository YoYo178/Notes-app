import APIEndpoints from '../../../config/APIEndpoints';
import { useQueryBase } from '../useQueryBase';

export const useAuthQuery = useQueryBase(APIEndpoints.AUTH_QUERY, ['auth'], true, false);