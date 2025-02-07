import { FC } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import './SearchBox.css'

export const SearchBox: FC = () => {
  return (
    <div className="search-box">
      <AiOutlineSearch className="search-icon" />
      <input type="text" placeholder="Search" className="search-input" />
    </div>
  )
} 