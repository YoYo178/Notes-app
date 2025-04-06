import { FC, Fragment, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";

import { IoPersonCircleSharp } from "react-icons/io5";
import { IoMdArrowDropdown } from "react-icons/io";

import { useLogoutMutation } from "../../../hooks/network/auth/useLogoutMutation";
import { useLostFocus } from "../../../hooks/ui/useLostFocus.ts";
import { useAuthContext } from "../../../contexts/AuthProvider.tsx";

import { ButtonHandler, clearCachedData, DropdownOptionHandler } from "./SidebarUser";
import { ProfileModal } from "../../ProfileModal/ProfileModal.tsx";

import "./SidebarUser.css";

interface SidebarUserProps {
    displayName: string | undefined;
};

const dropdownMenuOptions = {
    "Profile": DropdownOptionHandler.profileOnClick,
    "Log out": DropdownOptionHandler.logOutOnClick
};

const dropdownMenuArr = Array.from(Object.entries(dropdownMenuOptions));

export const SidebarUser: FC<SidebarUserProps> = ({ displayName }) => {
    const queryClient = useQueryClient();
    const { setAuth } = useAuthContext();

    const [angle, setAngle] = useState(0);
    const [isDropdownMenuVisible, setIsDropdownMenuVisible] = useState(angle === 180);

    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    const sidebarItemsRef = useRef<HTMLDivElement>(null);

    const logoutMutation = useLogoutMutation({ queryKey: ['auth'] });
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (logoutMutation.isSuccess) {
            setAuth({});
            clearCachedData(queryClient);

            // Need to delay this slightly
            setTimeout(() => {
                navigate('/', {
                    replace: true,
                    state: { from: location }
                });
            }, 0)
        }

    }, [logoutMutation.isSuccess]);

    useLostFocus(sidebarItemsRef, isDropdownMenuVisible, () => {
        setIsDropdownMenuVisible(false);
        setAngle(0);
    })

    return (
        <div className="sidebar-user">
            <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
            <IoPersonCircleSharp className="sidebar-user-profile-photo" />
            <div ref={sidebarItemsRef} className="sidebar-user-items">
                <p className="sidebar-user-name" onClick={() => ButtonHandler.dropdownButtonOnClick(setAngle, angle, setIsDropdownMenuVisible)}>
                    {displayName}
                </p>
                <button className="sidebar-user-dropdown-button" onClick={() => ButtonHandler.dropdownButtonOnClick(setAngle, angle, setIsDropdownMenuVisible)}>
                    <ul className={`sidebar-dropdown-menu ${isDropdownMenuVisible ? 'visible' : 'hidden'}`} onClick={e => e.stopPropagation()} >
                        {dropdownMenuArr.map((pair, i) => {
                            const [optionTitle, optionCallbackFn] = pair;
                            return (
                                <Fragment key={"dmo-f-" + i}>
                                    <li key={"dmo-" + i} className="sidebar-user-dropdown-option" onClick={() => optionCallbackFn({ logoutMutation, isProfileModalOpen, setIsProfileModalOpen })}>{optionTitle}</li>
                                    {i < (dropdownMenuArr.length - 1) ? (
                                        <div key={"dmo-s-" + i} className="sidebar-dropdown-menu-separator" />
                                    ) : (
                                        null
                                    )}
                                </Fragment>
                            )
                        })}
                    </ul>
                    <IoMdArrowDropdown className="arrow" style={{ transform: `rotateZ(${angle}deg)` }} />
                </button>
            </div>
        </div>
    )
}