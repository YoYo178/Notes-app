import { useMutationBase } from "../useMutationBase";
import APIEndpoints from "../../../config/APIEndpoints";

export interface VerifyCodeRequest {
    /** User ID */
    id: string,
    /** The purpose of the verification code */
    purpose: 'user-verification' | 'reset-password',
    /** Verification code */
    code: string
}

export const useVerifyCodeMutation = useMutationBase<VerifyCodeRequest>(APIEndpoints.VERIFY, "Mail Verification", true);