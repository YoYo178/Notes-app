import { RefObject } from "react";
import { UseMutationResult } from "@tanstack/react-query";

import { ButtonHandler as LoginButtonHandler } from "./LoginButton/LoginButton";
import { LoginFields } from "../../types/AuthTypes";

function togglePasswordVisibility(passwordField: RefObject<HTMLInputElement>) {
    if (!passwordField.current)
        return;

    passwordField.current.type = passwordField.current.type === "password" ? "text" : "password";
}

function onKeyDown(e: React.KeyboardEvent<HTMLFormElement>, username: string, password: string, loginMutation: UseMutationResult<any, Error, LoginFields | undefined, unknown>) {
    if (e.key === "Enter") {
        e.preventDefault();
        LoginButtonHandler.loginButtonOnClick(username, password, loginMutation)
    }
}

export const ButtonHandler = {
    togglePasswordVisibility,
    onKeyDown
}