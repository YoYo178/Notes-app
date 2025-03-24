import { FC, useEffect, useState } from 'react'
import { Outlet, useOutletContext } from 'react-router-dom'

import { SearchBox } from '../../components/SearchBox/SearchBox'
import { Sidebar } from '../../components/Sidebar/Sidebar'
import { SortButton } from '../../components/SortButton/SortButton'

import './RootLayout.css'
import { NoteSortMethods } from '../../types/note.types'

interface RootLayoutContext {
  filterText: string;
  setFilterText: React.Dispatch<React.SetStateAction<string>>;
  sortOrder: NoteSortMethods;
  setSortOrder: React.Dispatch<React.SetStateAction<NoteSortMethods>>;
}

export const RootLayout: FC = () => {
  const [filterText, setFilterText] = useState('');
  const [sortOrder, setSortOrder] = useState<NoteSortMethods>(NoteSortMethods.SORT_BY_DATE_ASC);

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
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

      <main className="main-content">
        <Outlet context={{ filterText, setFilterText, sortOrder, setSortOrder }} />
      </main>
    </div>
  )
}

export function useRootLayoutContext() {
  return useOutletContext<RootLayoutContext>();
}