import { useContext, useEffect } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AxiosError } from "axios"

import AuthContext from "./contexts/AuthProvider"
import { useAuthQuery } from "./hooks/network/auth/useAuthQuery"

import { AuthLayout } from "./layouts/AuthLayout/AuthLayout"
import { RootLayout } from "./layouts/RootLayout/RootLayout"
import { PublicRouteLayout } from "./layouts/PublicRouteLayout/PublicRouteLayout"
import { ProtectedRouteLayout } from "./layouts/ProtectedRouteLayout/ProtectedRouteLayout"

import { Dashboard } from "./pages/Dashboard"
import { Favorites } from "./pages/Favorites"

import { Home } from "./pages/Home"
import { Login } from "./pages/Login"
import { Register } from "./pages/Register"

export const App = () => {
  const { setAuth } = useContext(AuthContext);
  const { data, isLoading, error } = useAuthQuery();

  useEffect(() => {
    if (!data || !setAuth)
      return;

    const { id, username, displayName } = data.user;
    setAuth({ id, username, displayName });
  }, [data])

  if (error) {
    if ((error as AxiosError).status !== 401)
      return <div>Error!</div>
  }

  if (isLoading) {
    return <div>Loading...</div>
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRouteLayout />}>
          <Route element={<RootLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/favorites" element={<Favorites />} />
          </Route>
        </Route>

        <Route element={<PublicRouteLayout />}>
          <Route element={<AuthLayout />}>
            <Route index element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/reset' element={<h1>TODO: Reset password page</h1>} />
          </Route>
        </Route>

        <Route path="*" element={<h1>TODO: Not found page</h1>} />
      </Routes>
    </BrowserRouter>
  )
}
