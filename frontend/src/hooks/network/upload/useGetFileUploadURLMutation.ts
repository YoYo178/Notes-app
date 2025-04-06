import { useMutationBase } from '../useMutationBase';
import APIEndpoints from '../../../config/APIEndpoints';

import { GetFileUploadURLParameters } from '../../../types/file.types';

export const useGetFileUploadURLMutation = useMutationBase<GetFileUploadURLParameters>(APIEndpoints.GET_FILE_UPLOAD_URL, 'Fetching pre-signed URL for file upload', true);