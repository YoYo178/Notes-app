import { RefObject } from "react";

function togglePasswordVisibility(passwordField: RefObject<HTMLInputElement>) {
    if (!passwordField.current)
        return;

    passwordField.current.type = passwordField.current.type === "password" ? "text" : "password";
}

export const ButtonHandler = {
    togglePasswordVisibility
}