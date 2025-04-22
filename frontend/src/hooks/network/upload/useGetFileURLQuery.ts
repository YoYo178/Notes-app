import { useQueryBase } from '../useQueryBase';
import APIEndpoints from '../../../config/APIEndpoints';

export const useGetFileURLQuery = useQueryBase(APIEndpoints.GET_FILE_URL, true, true);