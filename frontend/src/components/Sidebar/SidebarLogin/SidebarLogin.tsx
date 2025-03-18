import { Link } from 'react-router-dom'

import "./SidebarLogin.css"

export const SidebarLogin = () => {
  return (
    <Link to="/login" className='sidebar-login-btn'>Login/Sign-up</Link>
  )
}
