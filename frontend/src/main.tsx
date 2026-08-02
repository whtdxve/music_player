import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GlobalProviders } from './providers/AppProviders.tsx';

createRoot(document.getElementById('root')!).render(
  <GlobalProviders>
    <App />
  </GlobalProviders>,
);
