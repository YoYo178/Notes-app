import { useQueryBase } from "../useQueryBase";
import APIEndpoints from "../../../config/APIEndpoints";

export const useGetNotesQuery = useQueryBase(APIEndpoints.GET_ALL_NOTES, ['notes'], true, true);