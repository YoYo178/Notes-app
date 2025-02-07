import { FC } from 'react'
import { Sidebar } from '../components/Sidebar/Sidebar'
import { SearchBox } from '../components/SearchBox/SearchBox'
import './RootLayout.css'
import SortButton from '../components/SortButton/SortButton'
import CreateNoteBar from '../components/CreateNoteBar/CreateNoteBar'

export const RootLayout: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="app-container">
      <Sidebar />
        <SearchBox />
        <SortButton />
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}