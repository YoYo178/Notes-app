import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';

import { AuthProvider } from './contexts/AuthProvider';

import { Favorites } from './pages/Favorites/Favorites';
import { Register } from './pages/Register/Register'
import { Login } from './pages/Login/Login';
import { Home } from './pages/Home/Home';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Outlet />}>
              <Route index element={<Home />} />
              <Route path="favorites" element={<Favorites />} />
              <Route path="login" element={<Login />} />
              <Route path='register' element={<Register />} />
              <Route path='reset' element={<h1>TODO: Reset password page</h1>} />

              <Route path="*" element={<h1>TODO: Not found page</h1>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
)
