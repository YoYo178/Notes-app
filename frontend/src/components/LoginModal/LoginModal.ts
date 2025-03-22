import { UseMutationResult } from "@tanstack/react-query";

import { LoginFields } from "../../types/auth.types";

import { ButtonHandler as LoginButtonHandler } from "./LoginButton/LoginButton";

function onKeyDown(e: React.KeyboardEvent<HTMLFormElement>, username: string, password: string, loginMutation: UseMutationResult<any, Error, LoginFields | undefined, unknown>) {
    if (e.key === "Enter") {
        e.preventDefault();
        LoginButtonHandler.loginButtonOnClick(username, password, loginMutation)
    }
}

export const ButtonHandler = {
    onKeyDown
}