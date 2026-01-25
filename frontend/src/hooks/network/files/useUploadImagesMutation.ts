import { useMutationBase } from '../useMutationBase';
import APIEndpoints from "../../../config/APIEndpoints";

export const useUploadImagesMutation = useMutationBase<FormData>(APIEndpoints.UPLOAD_IMAGES, "Uploading images", true);