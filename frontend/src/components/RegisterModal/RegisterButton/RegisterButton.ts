import { RegisterFields } from "../../../types/auth.types";
import { TMutation } from "../../../types/react.types";

async function registerButtonOnClick(
    registerData: RegisterFields,
    registerMutation: TMutation<RegisterFields>
) {
    const { username, password, confirmPassword, displayName, email } = registerData;

    if (!username || !password || !confirmPassword || !displayName || !email)
        return;

    registerMutation.mutate({
        payload: {
            username,
            password,
            confirmPassword,
            email,
            displayName
        }
    });
}

export const ButtonHandler = {
    registerButtonOnClick
}