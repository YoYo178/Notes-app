import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AuthProvider } from './contexts/AuthProvider';

import { RootLayout } from "./layouts/RootLayout/RootLayout";
import { AuthLayout } from "./layouts/AuthLayout/AuthLayout";

import { Home } from './pages/Home/Home';
import { Favorites } from './pages/Favorites/Favorites';

import { Login } from './pages/Login/Login';
import { Register } from './pages/Register/Register'

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
