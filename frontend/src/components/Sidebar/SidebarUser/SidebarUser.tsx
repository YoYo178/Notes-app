import { FC } from "react";

import { IoPersonCircleSharp } from "react-icons/io5";
import { IoMdArrowDropdown } from "react-icons/io";

import "./SidebarUser.css"

interface SidebarUserProps {
    displayName: string | undefined;
}

const SidebarUser: FC<SidebarUserProps> = ({ displayName }) => {
    return (
        <div className="sidebar-user">
            <IoPersonCircleSharp className="sidebar-user-profile-photo" />
            <div className="sidebar-user-items">
                <p className="sidebar-user-name">{displayName}</p>
                <button className="sidebar-user-dropdown-button">
                    <IoMdArrowDropdown />
                </button>
            </div>
        </div>
    )
}

export default SidebarUser