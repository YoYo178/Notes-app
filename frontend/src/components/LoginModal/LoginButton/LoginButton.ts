import { UseMutationResult } from "@tanstack/react-query";

async function loginButtonOnClick(
    username: string,
    password: string,
    loginMutation: UseMutationResult<any, Error, { username: string, password: string }, unknown>
) {
    if (!username|| !password)
        return;

    loginMutation.mutate({ username, password });
}

export const ButtonHandler = {
    loginButtonOnClick
}