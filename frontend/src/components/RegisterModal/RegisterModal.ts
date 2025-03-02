import { RefObject } from "react";

function togglePasswordVisibility(
    passwordField: RefObject<HTMLInputElement>,
    confirmPasswordField: RefObject<HTMLInputElement>
) {
    if (!passwordField.current || !confirmPasswordField.current || (!passwordField.current.value && !confirmPasswordField.current.value) )
        return;

    confirmPasswordField.current.type = passwordField.current.type = passwordField.current.type === "password" ? "text" : "password";

}

export const ButtonHandler = {
    togglePasswordVisibility
}