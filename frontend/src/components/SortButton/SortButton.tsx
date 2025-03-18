import { GrSort } from "react-icons/gr";

import "./SortButton.css"

export const SortButton = () => {
  return (
    <button className="sort-button">
      <GrSort className='sort-button-icon' />
      <span className='sort-button-text'>Sort</span>
      </button>
  )
}