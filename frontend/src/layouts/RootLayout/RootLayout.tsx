import { FC, useState } from 'react'
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

  return (
    <div className="app-container">
      <Sidebar />
      <SearchBox setFilterText={setFilterText} />
      <SortButton />
      <main className="main-content">
        <Outlet context={{ filterText, setFilterText }} />
      </main>
    </div>
  )
}

export function useRootLayoutContext() {
  return useOutletContext<RootLayoutContext>();
}