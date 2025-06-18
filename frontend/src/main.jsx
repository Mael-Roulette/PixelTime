import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './i18n';
import { PixeltimeProvider } from './stores/PixeltimeProvider.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PixeltimeProvider>
      <App />
    </PixeltimeProvider>
  </StrictMode>,
)
