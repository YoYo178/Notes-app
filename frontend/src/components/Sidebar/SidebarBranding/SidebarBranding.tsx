import { FC } from 'react'

import './SidebarBranding.css'

export const SidebarBranding: FC = () => {
  return (
    <div className="sidebar-branding">
      <img src="/vite.svg" alt="Logo" className="sidebar-branding-logo" />
      <span className="sidebar-branding-text">AI Notes</span>
    </div>
  )
} 