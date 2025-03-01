import { FC, ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'

import './SidebarButton.css'

interface SidebarButtonProps {
  icon: ReactNode
  text: string
  to: string
}

export const SidebarButton: FC<SidebarButtonProps> = ({ icon, text, to }) => {
  const location = useLocation()
  const isActive = location.pathname === to

  return (
    <Link to={to} className={`sidebar-button ${isActive ? 'active' : ''}`}>
      {icon}
      <span>{text}</span>
    </Link>
  )
}