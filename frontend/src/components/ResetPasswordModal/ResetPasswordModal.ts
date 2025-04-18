import React, { RefObject } from "react";
import { ResetAccountStages } from "../../types/modal.types";
import { ReactSetState, TMutation } from "../../types/react.types";
import { AccountRecoveryRequest } from "../../hooks/network/auth/useRecoverAccountMutation";
import { VerifyCodeRequest } from "../../hooks/network/auth/useVerifyCodeMutation";
import { ResetPasswordRequest } from "../../hooks/network/auth/useResetPasswordMutation";
import { ResendVerificationCodeRequest } from "../../hooks/network/auth/useResendCodeMutation";
import { startCodeTimer } from "../../util/code.utils";

function onKeyDown(e: React.KeyboardEvent<HTMLFormElement>, buttonRef: RefObject<HTMLButtonElement | null>) {
    if (e.key === "Enter" && buttonRef.current) {
        e.preventDefault();
        buttonRef.current.click()
    }
}

export const EventHandler = {
    onKeyDown
}

async function continueButtonOnClick(
    recoverAccountMutation: TMutation<AccountRecoveryRequest>,
    verifyCodeMutation: TMutation<VerifyCodeRequest>,
    resetPasswordMutation: TMutation<ResetPasswordRequest>,
    successMessage: string, setSuccessMessage: ReactSetState<string>,
    errorMessage: string, setErrorMessage: ReactSetState<string>,
    currentStage: ResetAccountStages,
    input: string,
    OTP: string,
    newPassword: string,
    confirmNewPassword: string,
    userID: string
) {
    switch (currentStage) {
        case ResetAccountStages.FIND_ACCOUNT:
            if (!input) {
                setErrorMessage("Email/Username is required!")
                return;
            }

            await recoverAccountMutation.mutateAsync({
                payload: {
                    input
                }
            });

            break;
        case ResetAccountStages.VERIFY_ACCOUNT:
            if (!OTP) {
                setErrorMessage("Verification code is required!")
                return;
            }

            await verifyCodeMutation.mutateAsync({
                payload: {
                    id: userID,
                    purpose: 'reset-password',
                    code: OTP
                }
            });
            break;
        case ResetAccountStages.SET_PASSWORD:
            if (!newPassword || !confirmNewPassword) {
                setErrorMessage("Both fields are required!")
                return;
            }

            if (newPassword !== confirmNewPassword) {
                setErrorMessage("Passwords do not match!")
                return;
            }

            await resetPasswordMutation.mutateAsync({
                payload: {
                    password: newPassword,
                    confirmPassword: confirmNewPassword
                }
            });
            break;
    }

    if (errorMessage)
        setErrorMessage('');

    if (successMessage)
        setSuccessMessage('');
}

async function resendCodeOnClick(timerRef: RefObject<number | null>, setResendTime: ReactSetState<number>, resendCodeMutation: TMutation<ResendVerificationCodeRequest>, userID: string) {
    
    await resendCodeMutation.mutateAsync({
        payload: {
            id: userID,
            purpose: 'reset-password'
        }
    })
    startCodeTimer(timerRef, setResendTime);
}

export const ButtonHandler = {
    continueButtonOnClick,
    resendCodeOnClick
}