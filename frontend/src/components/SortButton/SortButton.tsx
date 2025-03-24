import { FC, useRef, useState } from "react";

import { GrSort } from "react-icons/gr";

import { SortDropdownMenu } from './SortDropdownMenu/SortDropdownMenu.tsx'

import "./SortButton.css"

interface SortButtonProps {
  isSearchBoxOpen: boolean;
  isMediaQueryActive: boolean;
}

export const SortButton: FC<SortButtonProps> = ({ isSearchBoxOpen, isMediaQueryActive }) => {
  const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false)

  const sortButtonRef = useRef<HTMLButtonElement>(null);

  if (isMediaQueryActive && isSearchBoxOpen)
    return null;

  return (
    <button ref={sortButtonRef} className="sort-button" onClick={() => setIsDropdownMenuOpen(true)}>
      <GrSort className='sort-button-icon' />
      <span className='sort-button-text'>Sort</span>
      <SortDropdownMenu sortButtonRef={sortButtonRef} isOpen={isDropdownMenuOpen} onClose={() => setIsDropdownMenuOpen(false)} />
    </button>
  )
}