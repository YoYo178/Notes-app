import { Link } from 'react-router-dom'

import "./SidebarLogin.css"

export default function SidebarLogin() {
  return (
    <Link to="/login" className='sidebar-login-btn'>Login/Sign-up</Link>
  )
}
