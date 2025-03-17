import { FC, useContext, useEffect, useState } from 'react'
import { AxiosError } from 'axios'

import { useAuthQuery } from '../../hooks/network/auth/useAuthQuery'
import AuthContext from '../../contexts/AuthProvider'

import { SearchBox } from '../../components/SearchBox/SearchBox'
import { Sidebar } from '../../components/Sidebar/Sidebar'
import SortButton from '../../components/SortButton/SortButton'

import './RootLayout.css'
import { Outlet, useOutletContext } from 'react-router-dom'

interface RootLayoutContext {
  filterText: string;
  setFilterText: React.Dispatch<React.SetStateAction<string>>;
}

export const RootLayout: FC = () => {
  const { setAuth } = useContext(AuthContext);
  const { data, isLoading, error } = useAuthQuery();

  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    if (!data || !setAuth)
      return;

    const { id, username, displayName } = data.user;
    setAuth({ id, username, displayName });
  }, [data])

  if (error) {
    if ((error as AxiosError).status !== 401)
      return <div>Error!</div>
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

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