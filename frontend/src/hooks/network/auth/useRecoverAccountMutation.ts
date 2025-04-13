import { useMutationBase } from "../useMutationBase";
import APIEndpoints from "../../../config/APIEndpoints";

export interface AccountRecoveryRequest {
    /** Email or Username */
    input: string;
}

export const useRecoverAccountMutation = useMutationBase<AccountRecoveryRequest>(APIEndpoints.RECOVER_ACCOUNT, "Account recovery");