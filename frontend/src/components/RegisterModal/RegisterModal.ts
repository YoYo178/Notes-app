import { RefObject } from "react";

import { ButtonHandler as RegisterButtonHandler } from "./RegisterButton/RegisterButton";
import { RegisterFields } from "../../types/AuthTypes";
import { UseMutationResult } from "@tanstack/react-query";

function togglePasswordVisibility(
    passwordField: RefObject<HTMLInputElement>,
    confirmPasswordField: RefObject<HTMLInputElement>
) {
    if (!passwordField.current || !confirmPasswordField.current || (!passwordField.current.value && !confirmPasswordField.current.value) )
        return;

    confirmPasswordField.current.type = passwordField.current.type = passwordField.current.type === "password" ? "text" : "password";

}

function onKeyDown(e: React.KeyboardEvent<HTMLFormElement>, registerData: RegisterFields, registerMutation: UseMutationResult<any, Error, RegisterFields | undefined, unknown>) {
    if (e.key === "Enter") {
        e.preventDefault();
        RegisterButtonHandler.registerButtonOnClick(registerData, registerMutation)
    }
}

export const ButtonHandler = {
    togglePasswordVisibility,
    onKeyDown
}