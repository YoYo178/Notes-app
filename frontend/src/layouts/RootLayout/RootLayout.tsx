import { FC, useEffect, useState } from 'react'
import { Outlet, useOutletContext } from 'react-router-dom'

import { SearchBox } from '../../components/SearchBox/SearchBox'
import { Sidebar } from '../../components/Sidebar/Sidebar'
import { SortButton } from '../../components/SortButton/SortButton'

import './RootLayout.css'

interface RootLayoutContext {
  filterText: string;
  setFilterText: React.Dispatch<React.SetStateAction<string>>;
}

export const RootLayout: FC = () => {
  const [filterText, setFilterText] = useState('');

  // Search box media query: (max-width: 425px)
  // See SearchBox.css, Sidebar.css, and SortButton.css
  const [isMediaQueryActive, setIsMediaQueryActive] = useState(window.matchMedia("(max-width: 425px)").matches)
  const [isSearchBoxOpen, setIsSearchBoxOpen] = useState(false);

  useEffect(() => {
    window.matchMedia("(max-width: 425px)").addEventListener('change', (e) => setIsMediaQueryActive(e.matches))
  }, [])

  return (
    <div className="app-container">

      <Sidebar
        isSearchBoxOpen={isSearchBoxOpen}
        isMediaQueryActive={isMediaQueryActive}
      />

      <SearchBox
        setFilterText={setFilterText}
        isSearchBoxOpen={isSearchBoxOpen}
        setIsSearchBoxOpen={setIsSearchBoxOpen}
        isMediaQueryActive={isMediaQueryActive}
      />

      <SortButton
        isSearchBoxOpen={isSearchBoxOpen}
        isMediaQueryActive={isMediaQueryActive}
      />

      <main className="main-content">
        <Outlet context={{ filterText, setFilterText }} />
      </main>
    </div>
  )
}

export function useRootLayoutContext() {
  return useOutletContext<RootLayoutContext>();
}