import { useNetworkBase } from "../useNetworkBase";
import APIEndpoints from "../../../config/APIEndpoints";

export const useGetNotes = useNetworkBase(APIEndpoints.GET_ALL_NOTES, ['user-notes'], "Fetching Notes", true);