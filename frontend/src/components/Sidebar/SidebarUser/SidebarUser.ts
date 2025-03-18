import { QueryClient, UseMutationResult } from "@tanstack/react-query";

/***** Button handlers *****/
function dropdownButtonOnClick(setAngle: React.Dispatch<React.SetStateAction<number>>, angle: number, setIsDropdownMenuVisible: React.Dispatch<React.SetStateAction<boolean>>) {
    setAngle(180 - angle);
    setIsDropdownMenuVisible((180 - angle) === 180);
}

/***** Dropdown Option handlers (TODO) *****/
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

/***** Miscellaneous *****/
export function clearCachedData(queryClient: QueryClient) {
    queryClient.invalidateQueries({ queryKey: ['notes'] });
    queryClient.invalidateQueries({ queryKey: ['auth'] });
}

export const ButtonHandler = {
    dropdownButtonOnClick
}

export const DropdownOptionHandler = {
    profileOnClick,
    logOutOnClick
}