import { FC } from 'react'
import { SidebarBranding } from './SidebarBranding/SidebarBranding'
import { SidebarLinks } from './SidebarLinks/SidebarLinks'
import './Sidebar.css'
import SidebarLogin from './SidebarLogin/SidebarLogin'

export const Sidebar: FC = () => {
  return (
    <nav className="sidebar">
      <SidebarBranding />
      <div className="separator" />
      <SidebarLinks />
      <SidebarLogin />
    </nav>
  )
} 