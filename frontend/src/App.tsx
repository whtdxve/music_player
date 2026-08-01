import { useState } from 'react'
import './App.css'
import BottomBar from './components/BottomBar/BottomBar';
import type { Release } from './types/release';
import Sidebar from './components/Sidebar/Sidebar';
import ReleaseInfo from './components/ReleaseInfo/ReleaseInfo';
import AdditionalSidebar from './components/AdditionalSidebar/AdditionalSidebar';
import { useAudioPlayer } from './context/AudioPlayerContext';


function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRelease, setSelectedRelease] = useState<Release | null>(null);
  const [isAdditionalSidebarOpen, setIsAdditionalSidebarOpen] = useState(false);
  const { queue } = useAudioPlayer();

  return (
    <div>
      <button onClick={() => setIsAdditionalSidebarOpen(true)}>Очередь</button>
      <Sidebar setIsLoading={setIsLoading} setSelectedRelease={setSelectedRelease} />
      <ReleaseInfo isLoading={isLoading} selectedRelease={selectedRelease} />
      <AdditionalSidebar isOpen={isAdditionalSidebarOpen} onClose={() => setIsAdditionalSidebarOpen(false)}>
        {queue.map((track) => (
          <div>{track.metadata.title}</div>
        ))}
      </AdditionalSidebar>
      <BottomBar />
    </div>
  );
}

export default App
