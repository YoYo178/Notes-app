import { Outlet } from "react-router-dom"
import "./AuthLayout.css"

const AuthLayout = () => {
  return (
    <div className="auth-form-container">
        <Outlet />
    </div>
  )
}

export default AuthLayout