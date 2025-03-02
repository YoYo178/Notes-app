import { UseMutationResult } from "@tanstack/react-query";
import { RegisterFields } from "../../../types/AuthTypes";

async function registerButtonOnClick(
    registerData: RegisterFields,
    registerMutation: UseMutationResult<any, Error, RegisterFields, unknown>
) {
    const { username, password, confirmPassword, displayName, email } = registerData;

    if (!username || !password || !confirmPassword || !displayName || !email)
        return;

    registerMutation.mutate({ username, password, confirmPassword, email, displayName });
}

export const ButtonHandler = {
    registerButtonOnClick
}