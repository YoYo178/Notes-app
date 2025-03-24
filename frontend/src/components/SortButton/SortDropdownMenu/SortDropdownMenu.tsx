import { FC, Fragment, RefObject } from "react";

import { FaSortAlphaDown, FaSortAlphaDownAlt, FaSortAmountDown, FaSortAmountDownAlt } from "react-icons/fa";

import { useLostFocus } from "../../../hooks/ui/useLostFocus.ts";

import { DropdownOptionHandler } from "./SortDropdownMenu";

import "./SortDropdownMenu.css";

interface SortDropdownMenuProps {
    sortButtonRef: RefObject<HTMLButtonElement | null>;
    isOpen: boolean;
    onClose: () => any
};

const dropdownMenuOptions = {
    "A to Z": {
        callbackFn: DropdownOptionHandler.sortByNameAscending,
        icon: <FaSortAlphaDown />
    },
    "Z to A": {
        callbackFn: DropdownOptionHandler.sortByNameDescending,
        icon: <FaSortAlphaDownAlt />
    },
    "Newest to Oldest": {
        callbackFn: DropdownOptionHandler.sortByDateAscending,
        icon: <FaSortAmountDownAlt />
    },
    "Oldest to Newest": {
        callbackFn: DropdownOptionHandler.sortByDateDescending,
        icon: <FaSortAmountDown />
    }
};

const dropdownMenuArr = Array.from(Object.entries(dropdownMenuOptions));

export const SortDropdownMenu: FC<SortDropdownMenuProps> = ({ sortButtonRef, isOpen, onClose }) => {

    useLostFocus(sortButtonRef, isOpen, () => onClose())

    return (
        <ul className={`sort-dropdown-menu ${isOpen ? 'visible' : 'hidden'}`} onClick={e => e.stopPropagation()} >
            {dropdownMenuArr.map((pair, i) => {
                const [optionTitle, optionDetails] = pair;
                const { callbackFn, icon } = optionDetails
                return (
                    <Fragment key={"dmo-f-" + i}>
                        <div className={"sort-dropdown-option-container"} onClick={() => callbackFn({})}>
                            <div className="sort-dropdown-option-icon">{icon}</div>
                            <li key={"dmo-c-option" + i} className="sort-dropdown-option">{optionTitle}</li>
                        </div>
                        {i < (dropdownMenuArr.length - 1) ? (
                            <div key={"dmo-s-" + i} className="sort-dropdown-menu-separator" />
                        ) : (
                            null
                        )}
                    </Fragment>
                )
            })}
        </ul>
    )
}