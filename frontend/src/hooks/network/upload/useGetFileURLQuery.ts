import APIEndpoints from '../../../config/APIEndpoints';
import { useQueryBase } from '../useQueryBase';

export const useGetFileURLQuery = useQueryBase(APIEndpoints.GET_FILE_URL, true, true);