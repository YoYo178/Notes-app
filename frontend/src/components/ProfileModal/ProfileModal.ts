import { User, UserUpdateFields } from "../../types/user.types";
import { TMutation, TOptimisticMutation } from "../../types/react.types";

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

function deleteAccButtonOnClick(
    deleteUserMutation: TMutation<unknown>
) {
    const userAgrees = window.confirm("Are you sure you want to delete your account? All the notes associated with this account will be deleted!")

    if (userAgrees)
        deleteUserMutation.mutate({})
}

export const ButtonHandler = {
    profileModalOnSubmit,
    deleteAccButtonOnClick
}