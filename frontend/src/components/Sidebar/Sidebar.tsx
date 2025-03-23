import { FC, useContext } from 'react'

import { GiHamburgerMenu } from 'react-icons/gi'

import AuthContext from '../../contexts/AuthProvider'

import { SidebarBranding } from './SidebarBranding/SidebarBranding'
import { SidebarLinks } from './SidebarLinks/SidebarLinks'
import { SidebarLogin } from './SidebarLogin/SidebarLogin'
import { SidebarUser } from './SidebarUser/SidebarUser.tsx'

import './Sidebar.css'

interface SidebarProps {
  isSearchBoxOpen: boolean;
  isMediaQueryActive: boolean;
}

export const Sidebar: FC<SidebarProps> = ({ isSearchBoxOpen, isMediaQueryActive }) => {
  const { auth } = useContext(AuthContext);

  return (
    <>
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
      {((isMediaQueryActive && !isSearchBoxOpen) || !isMediaQueryActive) &&
        <button className="sidebar-hamburger-button">
          <GiHamburgerMenu />
        </button>
      }
    </>
  )
} 