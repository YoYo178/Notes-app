import { FC } from 'react'
import { AiOutlineHome, AiOutlineStar } from 'react-icons/ai'

import { SidebarButton } from './SidebarButton/SidebarButton'

import './SidebarLinks.css'

export const SidebarLinks: FC = () => {
  return (
    <div className="sidebar-links">
      <SidebarButton 
        icon={<AiOutlineHome className="sidebar-icon" />} 
        text="Home" 
        to="/"
      />
      <SidebarButton 
        icon={<AiOutlineStar className="sidebar-icon" />} 
        text="Favourites" 
        to="/favorites"
      />
    </div>
  )
} 