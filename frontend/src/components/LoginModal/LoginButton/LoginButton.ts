import { LoginFields } from "../../../types/auth.types";
import { TMutation } from "../../../types/react.types";

function loginButtonOnClick(
    username: string,
    password: string,
    loginMutation: TMutation<LoginFields>
) {
    if (!username || !password)
        return;

    loginMutation.mutate({
        payload: {
            username,
            password
        }
    });
}

export const ButtonHandler = {
    loginButtonOnClick
}