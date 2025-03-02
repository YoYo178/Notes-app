import { FC, useContext } from 'react'

import AuthContext from '../../contexts/AuthProvider'

import { SidebarBranding } from './SidebarBranding/SidebarBranding'
import { SidebarLinks } from './SidebarLinks/SidebarLinks'
import SidebarLogin from './SidebarLogin/SidebarLogin'

import './Sidebar.css'

export const Sidebar: FC = () => {
  const { auth } = useContext(AuthContext);

  return (
    <nav className="sidebar">
      <SidebarBranding />
      <div className="separator" />
      <SidebarLinks />
      {!!auth ? (
        null
      ) : (
        <SidebarLogin />
      )}
    </nav>
  )
} 