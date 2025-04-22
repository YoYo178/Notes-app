import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom"

import { AuthLayout } from "./layouts/AuthLayout/AuthLayout"
import { RootLayout } from "./layouts/RootLayout/RootLayout"
import { PublicRouteLayout } from "./layouts/PublicRouteLayout/PublicRouteLayout"
import { ProtectedRouteLayout } from "./layouts/ProtectedRouteLayout/ProtectedRouteLayout"

import { Dashboard } from "./pages/Dashboard"

import { Home } from "./pages/Home"
import { Login } from "./pages/Login"
import { Register } from "./pages/Register"
import { NotFound } from "./pages/NotFound"
import { ResetPassword } from "./pages/ResetPassword"

export const App = () => {
  return (
    <BrowserRouter basename="/Notes-app">
      <Routes>
        <Route element={<ProtectedRouteLayout />}>
          <Route element={<RootLayout />}>
            <Route path="/dashboard" element={<Outlet />}>
              <Route index element={<Dashboard />} />
              <Route path="favorites" element={<Dashboard />} />
            </Route>
          </Route>
        </Route>

        <Route element={<PublicRouteLayout />}>
          <Route element={<AuthLayout />}>
            <Route index element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/reset' element={<ResetPassword />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
