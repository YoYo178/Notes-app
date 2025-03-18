import { QueryClient, UseMutationResult } from "@tanstack/react-query";

/***** Button handlers *****/
function dropdownButtonOnClick(setAngle: React.Dispatch<React.SetStateAction<number>>, angle: number, setIsDropdownMenuVisible: React.Dispatch<React.SetStateAction<boolean>>) {
    setAngle(180 - angle);
    setIsDropdownMenuVisible((180 - angle) === 180);
}

/***** Dropdown Option handlers (TODO) *****/
interface ProfileParameters {
    isProfileModalOpen: boolean,
    setIsProfileModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}
function profileOnClick(params: ProfileParameters) {
    const { isProfileModalOpen, setIsProfileModalOpen } = params;

    if (isProfileModalOpen === null || isProfileModalOpen === undefined || !setIsProfileModalOpen)
        return;

    setIsProfileModalOpen(!isProfileModalOpen);
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