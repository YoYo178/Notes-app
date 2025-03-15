import { FC, useContext } from 'react'

import AuthContext from '../../contexts/AuthProvider'

import { SidebarBranding } from './SidebarBranding/SidebarBranding'
import { SidebarLinks } from './SidebarLinks/SidebarLinks'
import SidebarLogin from './SidebarLogin/SidebarLogin'
import SidebarUser from './SidebarUser/SidebarUser'

import './Sidebar.css'

export const Sidebar: FC = () => {
  const { auth } = useContext(AuthContext);

  return (
    <nav className="sidebar">
      <SidebarBranding />
      <div className="separator" />
      <SidebarLinks />
      {!!auth ? (
        <SidebarUser displayName={auth?.displayName} />
      ) : (
        <SidebarLogin />
      )}
    </nav>
  )
} 