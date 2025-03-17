import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';

import { AuthProvider } from './contexts/AuthProvider';

import { RootLayout } from "./layouts/RootLayout/RootLayout";
import { Favorites } from './pages/Favorites/Favorites';
import { Register } from './pages/Register/Register'
import { Login } from './pages/Login/Login';
import { Home } from './pages/Home/Home';
import AuthLayout from "./layouts/AuthLayout/AuthLayout";

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>

            <Route element={<RootLayout />}>
              <Route index element={<Home />} />
              <Route path="/favorites" element={<Favorites />} />
            </Route>

            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/reset' element={<h1>TODO: Reset password page</h1>} />
            </Route>

            <Route path="*" element={<h1>TODO: Not found page</h1>} />

          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
)
