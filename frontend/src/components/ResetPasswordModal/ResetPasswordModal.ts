import { RefObject } from "react";
import { ResetAccountStages } from "../../types/modal.types";
import { ReactSetState } from "../../types/react.types";


function onKeyDown(e: React.KeyboardEvent<HTMLFormElement>, buttonRef: RefObject<HTMLButtonElement | null>) {
    if (e.key === "Enter" && buttonRef.current) {
        e.preventDefault();
        buttonRef.current.click()
    }
}

export const EventHandler = {
    onKeyDown
}

function continueButtonOnClick(
    successMessage: string, setSuccessMessage: ReactSetState<string>,
    errorMessage: string, setErrorMessage: ReactSetState<string>,
    currentStage: ResetAccountStages, setCurrentStage: ReactSetState<ResetAccountStages>,
    input: string,
    OTP: string,
    newPassword: string,
    confirmNewPassword: string,
) {
    switch (currentStage) {
        case ResetAccountStages.FIND_ACCOUNT:
            if (!input) {
                setErrorMessage("Email/Username is required!")
                return;
            }
            break;
        case ResetAccountStages.VERIFY_ACCOUNT:
            if (!OTP) {
                setErrorMessage("Verification code is required!")
                return;
            }
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
            break;
        default:
            break;
    }

    setCurrentStage((prev) => {
        if (prev === ResetAccountStages.REDIRECT)
            return prev;

        return prev + 1;
    })

    if (errorMessage)
        setErrorMessage('');

    if (successMessage)
        setSuccessMessage('');
}

export const ButtonHandler = {
    continueButtonOnClick
}