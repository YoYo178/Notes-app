import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { ProviderLayout } from './layouts/ProviderLayout/ProviderLayout';

import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ProviderLayout>
      <App />
    </ProviderLayout>
  </StrictMode>
)
