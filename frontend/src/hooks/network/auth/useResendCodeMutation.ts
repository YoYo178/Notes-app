import { useMutationBase } from "../useMutationBase";
import APIEndpoints from "../../../config/APIEndpoints";

export interface ResendVerificationCodeRequest {
    /** User ID */
    id: string,
    /** The purpose of the verification code */
    purpose: 'user-verification' | 'reset-password',
}

export const useResendCodeMutation = useMutationBase<ResendVerificationCodeRequest>(APIEndpoints.RESEND_CODE, "New verification code request");