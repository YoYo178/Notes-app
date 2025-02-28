import React from 'react'
import "./SidebarLogin.css"
import { Link } from 'react-router-dom'

export default function SidebarLogin() {
  return (
    <Link to="/login" className='sidebar-login-btn'>Login/Sign-up</Link>
  )
}
