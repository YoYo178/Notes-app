import APIEndpoints from '../../../config/APIEndpoints';
import { GetFileUploadURLParameters } from '../../../types/file.types';
import { useMutationBase } from '../useMutationBase';

export const useGetFileUploadURLMutation = useMutationBase<GetFileUploadURLParameters>(APIEndpoints.GET_FILE_UPLOAD_URL, 'Fetching pre-signed URL for file upload', true);