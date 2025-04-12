import { useQueryBase } from '../useQueryBase';
import APIEndpoints from '../../../config/APIEndpoints';

export const useGetLoggedInUser = useQueryBase(APIEndpoints.GET_LOGGED_IN_USER, true, false);