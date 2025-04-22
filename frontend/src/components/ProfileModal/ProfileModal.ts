import { User, UserUpdateFields } from "../../types/user.types";
import { TOptimisticMutation } from "../../types/react.types";

function profileModalOnSubmit(
    updateUserMutation: TOptimisticMutation<Partial<UserUpdateFields>>,
    currentAuthFields: Partial<User> | null,
    fields: Partial<UserUpdateFields>
) {
    if (!currentAuthFields)
        return true;

    const { displayName, email } = currentAuthFields;
    const { displayName: newDisplayName, email: newEmail, currentPassword, newPassword, confirmNewPassword } = fields;

    if (displayName === newDisplayName && email === newEmail && !currentPassword && !newPassword && !confirmNewPassword)
        return true;

    updateUserMutation.mutate({
        payload: fields
    });
}

export const ButtonHandler = {
    profileModalOnSubmit
}