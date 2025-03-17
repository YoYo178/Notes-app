import { UseMutationResult } from "@tanstack/react-query";

function dropdownButtonOnClick(setAngle: React.Dispatch<React.SetStateAction<number>>, angle: number, setIsDropdownMenuVisible: React.Dispatch<React.SetStateAction<boolean>>) {
    setAngle(180 - angle);
    setIsDropdownMenuVisible((180 - angle) === 180);
}

export const ButtonHandler = {
    dropdownButtonOnClick
}

// Dropdown options (TODO)
interface ProfileParameters {
}
function profileOnClick(params: ProfileParameters) {
    console.log("Profile")
}

interface LogoutParameters {
    logoutMutation: UseMutationResult<any, Error, unknown, unknown>
}
function logOutOnClick(params: LogoutParameters) {
    const { logoutMutation } = params;

    if (!logoutMutation)
        return;
    
    logoutMutation.mutate({});
}

export const DropdownOptionHandler = {
    profileOnClick,
    logOutOnClick
}