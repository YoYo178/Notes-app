import { FC, Fragment, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { IoPersonCircleSharp } from "react-icons/io5";
import { IoMdArrowDropdown } from "react-icons/io";

import { useLogoutMutation } from "../../../hooks/network/auth/useLogoutMutation";
import AuthContext from "../../../contexts/AuthProvider";

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
    const { setAuth } = useContext(AuthContext);

    const [angle, setAngle] = useState(0);
    const [isDropdownMenuVisible, setIsDropdownMenuVisible] = useState(angle === 180);

    const sidebarItemsRef = useRef<HTMLDivElement>(null);

    const logoutMutation = useLogoutMutation();
    const navigate = useNavigate();

    useEffect(() => {
        if (logoutMutation.isSuccess) {
            navigate('/')

            // Need to delay this slightly
            setTimeout(() => {
                if (!!setAuth)
                    setAuth({});

            }, 0)
        }

    }, [logoutMutation.isSuccess]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sidebarItemsRef.current && !sidebarItemsRef.current.contains(event.target as Node)) {
                setIsDropdownMenuVisible(false);
                setAngle(0); // Reset arrow angle
            }
        };

        if (isDropdownMenuVisible) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isDropdownMenuVisible]);

    return (
        <div className="sidebar-user">
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
                                    {/* TODO: Function parameters */}
                                    <li key={"dmo-" + i} className="sidebar-user-dropdown-option" onClick={() => optionCallbackFn({ logoutMutation })}>{optionTitle}</li>
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

export default SidebarUser