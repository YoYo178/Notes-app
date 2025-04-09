import { FC, useRef } from 'react'

import { AiOutlineSearch } from 'react-icons/ai'

import { useNotesContext } from '../../contexts/NotesContext';

import { useLostFocus } from '../../hooks/ui/useLostFocus';

import { ReactSetState } from '../../types/react.types';

import './SearchBox.css'

interface SearchBoxProps {
  isSearchBoxOpen: boolean;
  setIsSearchBoxOpen: ReactSetState<boolean>;
  isMediaQueryActive: boolean;
}

export const SearchBox: FC<SearchBoxProps> = ({ isSearchBoxOpen, setIsSearchBoxOpen, isMediaQueryActive }) => {
  const { setFilter } = useNotesContext();
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
          onChange={(e) => { setFilter(e.target.value) }}
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