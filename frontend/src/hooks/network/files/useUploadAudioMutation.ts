import { useMutationBase } from '../useMutationBase';
import APIEndpoints from '../../../config/APIEndpoints';

export const useUploadAudioMutation = useMutationBase<FormData>(
  APIEndpoints.UPLOAD_AUDIO,
  'Uploading audio',
  true,
);
