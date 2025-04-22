import { FC, Fragment, RefObject } from "react";

import { FaSortAlphaDown, FaSortAlphaDownAlt, FaSortAmountDown, FaSortAmountDownAlt } from "react-icons/fa";

import { useLostFocus } from "../../../hooks/ui/useLostFocus.ts";

import { NoteSortMethods } from "../../../types/note.types.ts";
import { ReactSetState } from "../../../types/react.types.ts";

import "./SortDropdownMenu.css";

interface SortDropdownMenuProps {
    sortButtonRef: RefObject<HTMLButtonElement | null>;
    isOpen: boolean;
    onClose: () => void;
    sortOrder: NoteSortMethods;
    setSortOrder: ReactSetState<NoteSortMethods>;
};

const dropdownMenuOptions = {
    "A to Z": {
        icon: <FaSortAlphaDown />,
        value: NoteSortMethods.SORT_BY_NAME_ASC
    },
    "Z to A": {
        icon: <FaSortAlphaDownAlt />,
        value: NoteSortMethods.SORT_BY_NAME_DESC
    },
    "Newest to Oldest": {
        icon: <FaSortAmountDownAlt />,
        value: NoteSortMethods.SORT_BY_DATE_ASC
    },
    "Oldest to Newest": {
        icon: <FaSortAmountDown />,
        value: NoteSortMethods.SORT_BY_DATE_DESC
    }
};

const dropdownMenuArr = Array.from(Object.entries(dropdownMenuOptions));

export const SortDropdownMenu: FC<SortDropdownMenuProps> = ({ sortButtonRef, isOpen, onClose, sortOrder, setSortOrder }) => {

    useLostFocus(sortButtonRef, isOpen, () => onClose())

    return (
        <ul className={`sort-dropdown-menu ${isOpen ? 'visible' : 'hidden'}`} onClick={e => e.stopPropagation()} >
            {dropdownMenuArr.map((pair, i) => {
                const [optionTitle, optionDetails] = pair;
                const { icon, value } = optionDetails;

                return (
                    <Fragment key={"dmo-f-" + i}>
                        <div
                            className={`sort-dropdown-option-container ${value === sortOrder ? 'selected' : ''}`}
                            onClick={() => {
                                setSortOrder(value);
                                onClose();
                            }}
                        >
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