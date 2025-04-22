import { useMutationBase } from "../useMutationBase";
import APIEndpoints from "../../../config/APIEndpoints";

export interface ResetPasswordRequest {
    /** New password */
    password: string,
    /** New password confirmation */
    confirmPassword: string,
}

export const useResetPasswordMutation = useMutationBase<ResetPasswordRequest>(APIEndpoints.RESET_PASSWORD, "Password reset", true);