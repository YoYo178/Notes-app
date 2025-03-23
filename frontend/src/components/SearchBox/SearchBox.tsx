import { FC, useRef } from 'react'

import { AiOutlineSearch } from 'react-icons/ai'

import { useLostFocus } from '../../hooks/ui/useLostFocus';

import './SearchBox.css'

interface SearchBoxProps {
  setFilterText: React.Dispatch<React.SetStateAction<string>>;
  isSearchBoxOpen: boolean;
  setIsSearchBoxOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isMediaQueryActive: boolean;
}

export const SearchBox: FC<SearchBoxProps> = ({ setFilterText, isSearchBoxOpen, setIsSearchBoxOpen, isMediaQueryActive }) => {
  const searchBoxRef = useRef<HTMLDivElement>(null);

  useLostFocus(searchBoxRef, isSearchBoxOpen, () => setIsSearchBoxOpen(false));

  return (
    <>
      <div
        ref={searchBoxRef}
        className="search-box"
        style={{
          display: (isSearchBoxOpen && isMediaQueryActive) || !isMediaQueryActive ? 'flex' : 'none',
          margin: isSearchBoxOpen && isMediaQueryActive ? '1rem' : ''
        }}>
        <AiOutlineSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search"
          className="search-input"
          onChange={(e) => { setFilterText(e.target.value) }}
        />
      </div>
      <button
        className="search-button"
        onClick={() => setIsSearchBoxOpen(true)}
        style={{
          display: isSearchBoxOpen ? 'none' : isMediaQueryActive ? 'flex' : ''
        }}>
        <AiOutlineSearch />
      </button>
    </>
  )
} 