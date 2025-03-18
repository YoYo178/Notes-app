import { UseMutationResult } from "@tanstack/react-query";

import { RegisterFields } from "../../types/AuthTypes";

import { ButtonHandler as RegisterButtonHandler } from "./RegisterButton/RegisterButton";

function onKeyDown(e: React.KeyboardEvent<HTMLFormElement>, registerData: RegisterFields, registerMutation: UseMutationResult<any, Error, RegisterFields | undefined, unknown>) {
    if (e.key === "Enter") {
        e.preventDefault();
        RegisterButtonHandler.registerButtonOnClick(registerData, registerMutation)
    }
}

export const ButtonHandler = {
    onKeyDown
}