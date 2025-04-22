import { QueryClient } from "@tanstack/react-query";

import { ReactSetState, TMutation } from "../../../types/react.types";

/***** Button handlers *****/
function dropdownButtonOnClick(setAngle: ReactSetState<number>, angle: number, setIsDropdownMenuVisible: ReactSetState<boolean>) {
    setAngle(180 - angle);
    setIsDropdownMenuVisible((180 - angle) === 180);
}

/***** Dropdown option handlers *****/
interface ProfileParameters {
    isProfileModalOpen: boolean,
    setIsProfileModalOpen: ReactSetState<boolean>
}
function profileOnClick(params: ProfileParameters) {
    const { isProfileModalOpen, setIsProfileModalOpen } = params;

    if (isProfileModalOpen === null || isProfileModalOpen === undefined || !setIsProfileModalOpen)
        return;

    setIsProfileModalOpen(!isProfileModalOpen);
}

interface LogoutParameters {
    logoutMutation: TMutation<unknown>
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

/***** Handler exports *****/
export const ButtonHandler = {
    dropdownButtonOnClick
}

export const DropdownOptionHandler = {
    profileOnClick,
    logOutOnClick
}