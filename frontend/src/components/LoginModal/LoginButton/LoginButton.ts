import { UseMutationResult } from "@tanstack/react-query";
import { LoginFields } from "../../../types/auth.types";

function loginButtonOnClick(
    username: string,
    password: string,
    loginMutation: UseMutationResult<any, Error, LoginFields | undefined, unknown>
) {    
    if (!username|| !password)
        return;

    loginMutation.mutate({ username, password });
}

export const ButtonHandler = {
    loginButtonOnClick
}