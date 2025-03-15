import { FC } from 'react'

import { AiOutlineSearch } from 'react-icons/ai'

import './SearchBox.css'

interface SearchBoxProps {
  setFilterText: React.Dispatch<React.SetStateAction<string>>;
}

export const SearchBox: FC<SearchBoxProps> = ({ setFilterText }) => {
  return (
    <>
      <div className="search-box">
        <AiOutlineSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search"
          className="search-input"
          onChange={(e) => { setFilterText(e.target.value) }}
        />
      </div>
      <button className="search-button">
        <AiOutlineSearch />
      </button>
    </>
  )
} 