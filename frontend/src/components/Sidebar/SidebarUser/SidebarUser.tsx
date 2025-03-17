import { FC, useEffect, useState } from "react";

import { IoPersonCircleSharp } from "react-icons/io5";
import { IoMdArrowDropdown } from "react-icons/io";

import { useLogoutMutation } from "../../../hooks/network/auth/useLogoutMutation";

import { ButtonHandler, DropdownOptionHandler } from "./SidebarUser";

import "./SidebarUser.css";

interface SidebarUserProps {
    displayName: string | undefined;
};

const dropdownMenuOptions = {
    "Profile": DropdownOptionHandler.profileOnClick,
    "Log out": DropdownOptionHandler.logOutOnClick
};

const dropdownMenuArr = Array.from(Object.entries(dropdownMenuOptions));

const SidebarUser: FC<SidebarUserProps> = ({ displayName }) => {
    const [angle, setAngle] = useState(0);
    const [isDropdownMenuVisible, setIsDropdownMenuVisible] = useState(angle === 180);

    const logoutMutation = useLogoutMutation();

    useEffect(() => {
        if (logoutMutation.isSuccess)
            window.location.reload();

    }, [logoutMutation.isSuccess])

    return (
        <div className="sidebar-user">
            <IoPersonCircleSharp className="sidebar-user-profile-photo" />
            <div className="sidebar-user-items">
                <p className="sidebar-user-name" onClick={() => ButtonHandler.dropdownButtonOnClick(setAngle, angle, setIsDropdownMenuVisible)}>
                    {displayName}
                </p>
                <button className="sidebar-user-dropdown-button" onClick={() => ButtonHandler.dropdownButtonOnClick(setAngle, angle, setIsDropdownMenuVisible)}>
                    <ul className={`sidebar-dropdown-menu ${isDropdownMenuVisible ? 'visible' : 'hidden'}`} onClick={e => e.stopPropagation()} >
                        {dropdownMenuArr.map((pair, i) => {
                            const [optionTitle, optionCallbackFn] = pair;
                            return (
                                <>
                                    {/* TODO: Function parameters */}
                                    <li key={i} className="sidebar-user-dropdown-option" onClick={() => optionCallbackFn({ logoutMutation })}>{optionTitle}</li>
                                    {i < (dropdownMenuArr.length - 1) ? (
                                        <div className="sidebar-dropdown-menu-separator" />
                                    ) : (
                                        null
                                    )}
                                </>
                            )
                        })}
                    </ul>
                    <IoMdArrowDropdown className="arrow" style={{ transform: `rotateZ(${angle}deg)` }} />
                </button>
            </div>
        </div>
    )
}

export default SidebarUser