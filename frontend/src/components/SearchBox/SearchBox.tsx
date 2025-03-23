import { FC, useEffect, useRef } from 'react'

import { AiOutlineSearch } from 'react-icons/ai'

import './SearchBox.css'

interface SearchBoxProps {
  setFilterText: React.Dispatch<React.SetStateAction<string>>;
  isSearchBoxOpen: boolean;
  setIsSearchBoxOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isMediaQueryActive: boolean;
}

export const SearchBox: FC<SearchBoxProps> = ({ setFilterText, isSearchBoxOpen, setIsSearchBoxOpen, isMediaQueryActive }) => {
  const searchBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target as Node)) {
        setIsSearchBoxOpen(false);
      }
    };

    if (isSearchBoxOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchBoxOpen]);

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