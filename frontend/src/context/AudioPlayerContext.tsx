// context/AudioPlayerContext.tsx
import { createContext, useContext, useRef, useState, useEffect, type ReactNode } from 'react';
import type { Track } from '../types/track';
import { API_URL } from '../config';
import type { TrackSource } from '../types/trackSource';
import { Player } from '../lib/Player';

interface AudioPlayerContextType {
    currentTrack: Track | null;
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    queue: Track[];
    trackSource: TrackSource | null;
    setTrackSource: (source: TrackSource | null) => void;
    playTrack: (track: Track, source: TrackSource) => Promise<void>;
    togglePlay: () => void;
    next: () => Promise<void>;
    prev: () => Promise<void>;
    seek: (time: number) => void;
    setVolume: (value: number) => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | null>(null);

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
    const playerRef = useRef<Player | null>(null);
    const [queue, setQueue] = useState<Track[]>([]);
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolumeState] = useState(1);
    const [trackSource, setTrackSource] = useState<TrackSource | null>(null);

    useEffect(() => {
        const player = new Player();
        player.setVolume(volume);
        playerRef.current = player;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Опрос состояния плеера каждые 250мс — обновляем currentTime/duration/currentTrack
    useEffect(() => {
        const interval = setInterval(() => {
            const player = playerRef.current;
            if (!player) return;

            setCurrentTime(player.getCurrentTime());
            setDuration(player.getDuration());

            const index = player.getCurrentIndex();
            if (queue[index] && queue[index].id !== currentTrack?.id) {
                setCurrentTrack(queue[index]);
            }
        }, 250);

        return () => clearInterval(interval);
    }, [queue, currentTrack]);

    const playTrack = async (track: Track, source: TrackSource) => {
        setTrackSource(source);
        setQueue(source.tracks);

        const urls = source.tracks.map(t => `${API_URL}/tracks/${t.id}/stream`);
        playerRef.current?.setQueue(urls);

        const index = source.tracks.findIndex(t => t.id === track.id);
        await playerRef.current?.playAt(index);

        setCurrentTrack(track);
        setIsPlaying(true);
    };

    const next = async () => {
        await playerRef.current?.next();
    };

    const prev = async () => {
        await playerRef.current?.prev();
    };

    const togglePlay = () => {
        if (isPlaying) {
            playerRef.current?.pause();
        } else {
            playerRef.current?.resume();
        }
        setIsPlaying(!isPlaying);
    };

    const seek = (time: number) => {
        playerRef.current?.seek(time);
        setCurrentTime(time); // сразу обновляем UI, не дожидаясь следующего опроса
    };

    const setVolume = (value: number) => {
        playerRef.current?.setVolume(value);
        setVolumeState(value);
    };

    return (
        <AudioPlayerContext.Provider
            value={{
                currentTrack,
                currentTime,
                duration,
                isPlaying,
                queue,
                volume,
                trackSource,
                setTrackSource,
                playTrack,
                next,
                prev,
                togglePlay,
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