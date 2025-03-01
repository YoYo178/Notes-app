import { FC, RefObject } from 'react'

import { CreateNoteBar } from '../components/CreateNoteBar/CreateNoteBar'
import { SearchBox } from '../components/SearchBox/SearchBox'
import { Sidebar } from '../components/Sidebar/Sidebar'
import SortButton from '../components/SortButton/SortButton'

import './RootLayout.css'

interface RootLayoutProps {
  cardContainer: RefObject<HTMLDivElement>;
  children: React.ReactNode;
}

export const RootLayout: FC<RootLayoutProps> = ({ cardContainer, children }) => {
  return (
    <div className="app-container">
      <Sidebar />
      <SearchBox />
      <SortButton />
      <main className="main-content">
        {children}
      </main>
      <CreateNoteBar cardContainer={cardContainer} />
    </div>
  )
}