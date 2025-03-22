import { UseMutationResult } from "@tanstack/react-query";
import { User, UserUpdateFields } from "../../types/user.types";

function profileModalOnSubmit(
    updateUserMutation: UseMutationResult<any, Error, Partial<UserUpdateFields> | undefined, unknown>,
    currentAuthFields: Partial<User> | null,
    fields: Partial<UserUpdateFields>
) {
    if(!currentAuthFields)
        return true;

    const { displayName, email } = currentAuthFields;
    const { displayName: newDisplayName, email: newEmail, currentPassword, newPassword, confirmNewPassword } = fields;

    if (displayName === newDisplayName && email === newEmail && !currentPassword && !newPassword && !confirmNewPassword)
        return true;

    updateUserMutation.mutate(fields);
}

export const ButtonHandler = {
    profileModalOnSubmit
}