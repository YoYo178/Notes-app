import { FC, RefObject, useContext, useEffect } from 'react'

import { useAuthQuery } from '../../hooks/auth/useAuthQuery'
import AuthContext from '../../contexts/AuthProvider'

import { CreateNoteBar } from '../../components/CreateNoteBar/CreateNoteBar'
import { SearchBox } from '../../components/SearchBox/SearchBox'
import { Sidebar } from '../../components/Sidebar/Sidebar'
import SortButton from '../../components/SortButton/SortButton'

import './RootLayout.css'

interface RootLayoutProps {
  cardContainer: RefObject<HTMLDivElement>;
  children: React.ReactNode;
}

export const RootLayout: FC<RootLayoutProps> = ({ cardContainer, children }) => {
  const { auth, setAuth } = useContext(AuthContext);
  const authStatusMutation = useAuthQuery();

  useEffect(() => {
    if (!auth && authStatusMutation.isIdle) {
      authStatusMutation.mutate({});
    }

    if (!auth && !!setAuth && authStatusMutation.isSuccess && authStatusMutation.data) {
      const { data: { user: { id, username, displayName } } } = authStatusMutation; // 3-Layer destructured properties

      setAuth({ id, username, displayName });
    }
  }, [auth, authStatusMutation.isSuccess])

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