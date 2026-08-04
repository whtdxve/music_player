import './App.css'
import BottomBar from './components/BottomBar/BottomBar';
import Sidebar from './components/Sidebar/Sidebar';
import AdditionalSidebar from './components/AdditionalSidebar/AdditionalSidebar';
import { useAudioPlayer } from './context/AudioPlayerContext';
import MainContent from './components/MainContent/MainContent';
import { useApp } from './context/AppContext';


function App() {
  const { queue } = useAudioPlayer();
  const { isAdditionalSidebarOpen, setIsAdditionalSidebarOpen } = useApp();
  /* 
  TODO: 
  - сделать общий тип/интерфейс (понять в чем разница) mainContent для отображения контента 
  в главном блоке, который будет объединять выбранный сейчас релиз, плейлист или артиста.
  - сделать правильную логику с выбором текущего источника треков, сделать так чтобы при нажатии на трек
  в источнике треков, формировался объект trackSource и сохранялся в состояние и при переключении трека
  очередь не сохранялась в состояние заново, а чтобы была правильная логика понимания какой трек из очереди сейчас играет.
  */
  return (
    <div>
      <button onClick={() => setIsAdditionalSidebarOpen(true)}>Очередь</button>
      <Sidebar />
      <MainContent />
      <AdditionalSidebar
        isOpen={isAdditionalSidebarOpen}
        onClose={() => setIsAdditionalSidebarOpen(false)}
      >
        {queue.map((track) => (
          <div>{track.metadata.title}</div>
        ))}
      </AdditionalSidebar>
      <BottomBar />
    </div>
  );
}

export default App
