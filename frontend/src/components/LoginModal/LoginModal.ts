import { LoginFields } from "../../types/auth.types";
import { TMutation } from "../../types/react.types";

import { ButtonHandler as LoginButtonHandler } from "./LoginButton/LoginButton";

function onKeyDown(e: React.KeyboardEvent<HTMLFormElement>, username: string, password: string, loginMutation: TMutation<LoginFields>) {
    if (e.key === "Enter") {
        e.preventDefault();
        LoginButtonHandler.loginButtonOnClick(username, password, loginMutation)
    }
}

export const ButtonHandler = {
    onKeyDown
}