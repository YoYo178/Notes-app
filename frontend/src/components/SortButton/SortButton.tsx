import { FC } from "react";

import { GrSort } from "react-icons/gr";

import "./SortButton.css"

interface SortButtonProps {
  isSearchBoxOpen: boolean;
  isMediaQueryActive: boolean;
}

export const SortButton: FC<SortButtonProps> = ({ isSearchBoxOpen, isMediaQueryActive }) => {

  if (isMediaQueryActive && isSearchBoxOpen)
    return null;

  return (
    <button className="sort-button">
      <GrSort className='sort-button-icon' />
      <span className='sort-button-text'>Sort</span>
    </button>
  )
}