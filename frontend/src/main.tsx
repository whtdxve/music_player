import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AudioPlayerProvider } from './context/AudioPlayerContext';

createRoot(document.getElementById('root')!).render(
  <AudioPlayerProvider>
    <App />
  </AudioPlayerProvider>,
);
