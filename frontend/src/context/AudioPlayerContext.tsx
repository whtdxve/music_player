// context/AudioPlayerContext.tsx
import { createContext, useContext, useRef, useState, useEffect, type ReactNode } from 'react';
import type { Track } from '../types/track';
import { API_URL } from '../config';

interface AudioPlayerContextType {
    currentTrack: Track | null;
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    queue: Track[];
    playTrack: (track: Track, queue: Track[]) => void;
    togglePlay: () => void;
    next: () => void;
    prev: () => void;
    seek: (time: number) => void;
    setVolume: (value: number) => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | null>(null);

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const nextAudioRef = useRef<HTMLAudioElement | null>(null);

    const currentIndexRef = useRef(0);
    const queueRef = useRef<Track[]>([]);

    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const [nextTrack, setNextTrack] = useState<Track | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [queue, setQueue] = useState<Track[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolumeState] = useState(1);

    useEffect(() => {
        queueRef.current = queue;
    }, [queue]);

    useEffect(() => {
        currentIndexRef.current = currentIndex;
    }, [currentIndex]);

    // Создаём ОДИН audio-элемент один раз на всё приложение
    useEffect(() => {
        const audio = new Audio();
        audioRef.current = audio;

        audio.addEventListener('timeupdate', () => setCurrentTime(audio.currentTime));
        audio.addEventListener('loadedmetadata', () => setDuration(audio.duration));
        audio.addEventListener('ended', () => next());

        return () => {
            audio.pause();
            audio.src = '';
        };
    }, []);

    const playTrack = (track: Track, list: Track[]) => {
        const audio = audioRef.current;
        if (!audio) return;

        const index = list.indexOf(track);
        setQueue(list);
        setCurrentTrack(track);
        setCurrentIndex(index);

        queueRef.current = list;
        currentIndexRef.current = index;

        if (nextAudioRef.current) {
            audio.pause();
            audio.src = nextAudioRef.current.src;
            audio.currentTime = nextAudioRef.current.currentTime; // подхватываем позицию буферизации
            nextAudioRef.current = null; // сброс — использовали предзагруженный
        } else {
            audio.src = `${API_URL}/tracks/${track.id}/stream`;
        }

        audio.play();
        setIsPlaying(true);

        if (currentIndex < list.length - 1) {
            setNextTrack(list[index + 1]);
            preloadNextTrack();
        } else {
            setNextTrack(null);
        }
    };

    const preloadNextTrack = () => {
        const preloadAudio = new Audio();
        preloadAudio.src = `${API_URL}/tracks/${nextTrack.id}/stream`;
        preloadAudio.preload = 'auto'; // явно просим браузер загружать сразу
        nextAudioRef.current = preloadAudio;
    };

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio || !currentTrack) return;

        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    const next = () => {
        const nextIndex = currentIndexRef.current + 1;
        const nextTrack = queueRef.current[nextIndex];
        if (nextTrack) {
            playTrack(nextTrack, queue);
        } else {
            setIsPlaying(false);
        }
    };

    const prev = () => {
        if (!currentTrack) return;
        const prevIndex = currentIndexRef.current - 1;
        const prevTrack = queueRef.current[prevIndex];
        if (prevTrack) {
            playTrack(prevTrack, queue);
        }
    };

    const seek = (time: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const setVolume = (value: number) => {
        if (audioRef.current) {
            audioRef.current.volume = value;
        }
        setVolumeState(value);
    };

    return (
        <AudioPlayerContext.Provider
            value={{
                currentTrack,
                isPlaying,
                currentTime,
                duration,
                queue,
                volume,
                playTrack,
                togglePlay,
                next,
                prev,
                seek,
                setVolume,
            }}
        >
            {children}
        </AudioPlayerContext.Provider>
    );
}

export function useAudioPlayer() {
    const context = useContext(AudioPlayerContext);
    if (!context) throw new Error('useAudioPlayer должен использоваться внутри AudioPlayerProvider');
    return context;
}