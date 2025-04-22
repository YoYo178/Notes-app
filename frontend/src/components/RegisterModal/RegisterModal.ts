import { RefObject } from "react";
import { isEmail, isStrongPassword, StrongPasswordOptions } from 'validator';

import { RegisterFields } from "../../types/auth.types";
import { RegisterStages } from "../../types/modal.types";
import { ReactSetState, TMutation } from "../../types/react.types";
import { VerifyCodeRequest } from "../../hooks/network/auth/useVerifyCodeMutation";
import { startCodeTimer } from "../../util/code.utils";
import { ResendVerificationCodeRequest } from "../../hooks/network/auth/useResendCodeMutation";

const passwordCriteria: StrongPasswordOptions & { returnScore?: false | undefined; } = {
    minLength: 8,
    minNumbers: 2,
    minSymbols: 1,
    minUppercase: 0,
}

function onKeyDown(e: React.KeyboardEvent<HTMLFormElement>, buttonRef: RefObject<HTMLButtonElement | null>) {
    if (e.key === "Enter") {
        e.preventDefault();
        buttonRef.current?.click();
    }
}

export const EventHandler = {
    onKeyDown
}

async function continueButtonOnClick(
    registerMutation: TMutation<RegisterFields>,
    verifyCodeMutation: TMutation<VerifyCodeRequest>,
    successMessage: string, setSuccessMessage: ReactSetState<string>,
    errorMessage: string, setErrorMessage: ReactSetState<string>,
    currentStage: RegisterStages,
    registerData: RegisterFields,
    OTP: string,
    userID: string
) {

    switch (currentStage) {
        case RegisterStages.INPUT_DETAILS:

            const { username, password, confirmPassword, displayName, email } = registerData;

            if (!displayName.trim()) {
                setErrorMessage("First name and last name are required!");
                return;
            }

            const firstName = displayName.split(" ")[0];
            const lastName = displayName.split(" ")[1];

            if (!firstName) {
                setErrorMessage("First name is required!");
                return;
            }

            if (!lastName) {
                setErrorMessage("Last name is required!");
                return;
            }

            if (!username) {
                setErrorMessage("Username is required!");
                return;
            }

            if (!email) {
                setErrorMessage("Email is required!");
                return;
            }

            if (!isEmail(email)) {
                setErrorMessage("Invalid email");
                return;
            }

            if (!password || !confirmPassword) {
                setErrorMessage("Both Password fields are required!");
                return;
            }

            if (password !== confirmPassword) {
                setErrorMessage('Passwords do not match');
                return;
            }

            if (!isStrongPassword(password, passwordCriteria)) {
                setErrorMessage(`Password not strong enough.\nThe password must have a minimum length of ${passwordCriteria.minLength}, at least ${passwordCriteria.minNumbers} numbers, and ${passwordCriteria.minSymbols} symbol.`);
                return;
            }

            await registerMutation.mutateAsync({
                payload: {
                    username,
                    password,
                    confirmPassword,
                    email,
                    displayName
                }
            });
            break;
        case RegisterStages.VERIFY_ACCOUNT:
            if (!OTP) {
                setErrorMessage("Verification code is required!");
                return;
            }

            await verifyCodeMutation.mutateAsync({
                payload: {
                    id: userID,
                    purpose: 'user-verification',
                    code: OTP
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
            purpose: 'user-verification'
        }
    })
    startCodeTimer(timerRef, setResendTime);
}

export const ButtonHandler = {
    continueButtonOnClick,
    resendCodeOnClick
}