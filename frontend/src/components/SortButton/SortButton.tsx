import { MdOutlineSort } from "react-icons/md";

import "./SortButton.css"

export default function SortButton() {
  return (
    <button className="sort-button">
      <MdOutlineSort className='sort-button-icon' />
      <span className='sort-button-text'>Sort</span>
      </button>
  )
}
