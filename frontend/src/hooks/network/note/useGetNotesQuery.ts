import { useQueryBase } from "../useQueryBase";
import APIEndpoints from "../../../config/APIEndpoints";

export const useGetNotesQuery = useQueryBase(APIEndpoints.GET_ALL_NOTES, ['notes'], true, true, 5 * 60 * 1000);