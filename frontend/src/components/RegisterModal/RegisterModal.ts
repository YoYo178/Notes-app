import { RegisterFields } from "../../types/auth.types";

import { ButtonHandler as RegisterButtonHandler } from "./RegisterButton/RegisterButton";

import { TMutation } from "../../types/react.types";

function onKeyDown(e: React.KeyboardEvent<HTMLFormElement>, registerData: RegisterFields, registerMutation: TMutation<RegisterFields>) {
    if (e.key === "Enter") {
        e.preventDefault();
        RegisterButtonHandler.registerButtonOnClick(registerData, registerMutation)
    }
}

export const ButtonHandler = {
    onKeyDown
}