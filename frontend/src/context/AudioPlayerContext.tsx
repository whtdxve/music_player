// context/AudioPlayerContext.tsx
import { createContext, useContext, useRef, useState, useEffect, type ReactNode } from 'react';
import type { Track } from '../types/track';
import { API_URL } from '../config';
import type { TrackSource } from '../types/trackSource';
import type { TrackSourceType } from '../types/trackSource';
import type { Release } from '../types/release';

interface AudioPlayerContextType {
    currentTrack: Track | null;
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    queue: Track[];
    trackSource: TrackSource | null;
    setTrackSource: (source: TrackSource | null) => void;
    playTrack: (track: Track, release: Release) => void;
    togglePlay: () => void;
    next: () => void;
    prev: () => void;
    seek: (time: number) => void;
    setVolume: (value: number) => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | null>(null);

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
    const currentAudioRef = useRef<HTMLAudioElement | null>(null);
    const nextAudioRef = useRef<HTMLAudioElement | null>(null);

    const currentIndexRef = useRef(0);
    const queueRef = useRef<Track[]>([]);
    const nextTrackRef = useRef<Track | null>(null);
    const trackSourceRef = useRef<TrackSource | null>(null);

    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [queue, setQueue] = useState<Track[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolumeState] = useState(1);
    const [trackSource, setTrackSource] = useState<TrackSource | null>(null);

    // Создаем два аудио элемента при рендере компонента
    useEffect(() => {
        const currentAudio = new Audio();
        const nextAudio = new Audio();
        currentAudioRef.current = currentAudio;
        nextAudioRef.current = nextAudio;

        currentAudio.addEventListener('timeupdate', () => setCurrentTime(currentAudio.currentTime));
        currentAudio.addEventListener('loadedmetadata', () => setDuration(currentAudio.duration));
        currentAudio.addEventListener('ended', () => next());

        return () => {
            currentAudio.pause();
            currentAudio.src = '';
        };
    }, []);

    const playTrack = (track: Track, release: Release = null) => {
        if (release) {
            const newTrackSource = {
                type: 'RELEASE' as const,
                name: release.title,
                id: release.id,
                tracks: release.tracks!
            };
            setTrackSource(newTrackSource);
            trackSourceRef.current = newTrackSource;
            queueRef.current = newTrackSource.tracks;
            console.log('Установлена новая очередь: ', queueRef.current);
        };

        console.log('Текущий трек: ', track);
        const currentQueue = queueRef.current;
        const audio = currentAudioRef.current;

        const index = currentQueue.indexOf(track);
        console.log('Индекс текущего трека в массиве очереди: ', index);
        setCurrentTrack(track);
        console.log('Текущий индекс в состоянии: ', currentIndex);

        currentIndexRef.current = index;

        if (currentIndex < currentQueue.length - 1) {
            nextTrackRef.current = currentQueue[index + 1];
            preloadNextTrack();
        } else {
            nextTrackRef.current = null;
        }

        // if (nextAudioRef.current) {
        //     audio.pause();
        //     audio.src = nextAudioRef.current.src;
        //     audio.currentTime = nextAudioRef.current.currentTime; // подхватываем позицию буферизации
        //     nextAudioRef.current = null; // сброс — использовали предзагруженный
        // } else {
        audio.src = `${API_URL}/tracks/${track.id}/stream`;
        // }

        audio.play();
        setIsPlaying(true);
    };

    const preloadNextTrack = () => {
        const preloadAudio = new Audio();
        preloadAudio.src = `${API_URL}/tracks/${nextTrackRef.current!.id}/stream`;
        preloadAudio.preload = 'auto'; // явно просим браузер загружать сразу
        nextAudioRef.current = preloadAudio;
    };

    const togglePlay = () => {
        const audio = currentAudioRef.current;
        if (!audio || !currentTrack) return;

        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    const next = () => {
        const audio = nextAudioRef.current;
        audio?.play();
        if (audio) {
            console.log('readyState:', audio.readyState); // 0-4, где 4 = полностью готов
            console.log('buffered:', audio.buffered.length > 0 ? audio.buffered.end(0) : 0);
            console.log('duration:', audio.duration);
            audio.play();
        }
        // const nextIndex = currentIndexRef.current + 1;
        // const nextTrack = queueRef.current[nextIndex];
        // if (nextTrack) {
        //     playTrack(nextTrack);
        // } else {
        //     setIsPlaying(false);
        // }
    };

    const prev = () => {
        if (!currentTrack) return;
        const prevIndex = currentIndexRef.current - 1;
        const prevTrack = queueRef.current[prevIndex];
        if (prevTrack) {
            playTrack(prevTrack);
        }
    };

    const seek = (time: number) => {
        if (currentAudioRef.current) {
            currentAudioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const setVolume = (value: number) => {
        if (currentAudioRef.current) {
            currentAudioRef.current.volume = value;
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
                trackSource,
                setTrackSource
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