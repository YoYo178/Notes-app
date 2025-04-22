import { useMutationBase } from '../useMutationBase';
import APIEndpoints from '../../../config/APIEndpoints';

interface MultipleFileQueryRequest {
    fileKeys: string[];
}

export interface MultipleFileQueryResponse {
    urlArray: string[];
    expiresIn: number;
}

export const useGetMultipleFileURLMutation = useMutationBase<MultipleFileQueryRequest>(APIEndpoints.GET_MULTIPLE_FILES_URL, 'Fetching multiple pre-signed GET URL of files', true);