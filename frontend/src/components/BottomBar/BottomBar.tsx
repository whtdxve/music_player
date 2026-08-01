// PlayerBar.tsx
import { useAudioPlayer } from '../../context/AudioPlayerContext';

function BottomBar() {
    const { currentTrack, isPlaying, togglePlay, next, prev, currentTime, duration, seek, volume, setVolume } = useAudioPlayer();

    if (!currentTrack) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 flex items-center gap-4">
            <div className="flex-1">
                <p className="font-bold">{currentTrack.metadata.title}</p>
                <p className="text-sm text-gray-400">{currentTrack.metadata.artist}</p>
            </div>

            <div className="flex items-center gap-3">
                <button onClick={prev}>⏮</button>
                <button onClick={togglePlay}>{isPlaying ? '⏸' : '▶'}</button>
                <button onClick={next}>⏭</button>
            </div>

            <input
                type="range"
                min={0}
                max={duration || 0}
                value={currentTime}
                onChange={(e) => seek(Number(e.target.value))}
                className="flex-1"
            />

            <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-24"
            />
        </div>
    );
}

export default BottomBar;
