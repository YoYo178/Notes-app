import APIEndpoints from '../../../config/APIEndpoints';
import { useMutationBase } from '../useMutationBase';

interface GetFileUploadURLParameters {
    fileName: string;
    fileType: 'image' | 'audio';
    contentType: string;
    fileSize: number;
}

export const useGetFileUploadURLMutation = useMutationBase<GetFileUploadURLParameters>(APIEndpoints.GET_FILE_UPLOAD_URL, 'Fetching pre-signed URL for file upload', true);