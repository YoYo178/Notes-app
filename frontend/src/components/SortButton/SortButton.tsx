import React from 'react'
import "./SortButton.css"
import { MdOutlineSort } from "react-icons/md";

export default function SortButton() {
  return (
    <button className="sort-button">
      <MdOutlineSort className='sort-button-icon' />
      <span className='sort-button-text'>Sort</span>
      </button>
  )
}
