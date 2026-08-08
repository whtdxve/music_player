import { useEffect, useState } from "react";
import { useAudioPlayer } from "../../../context/AudioPlayerContext";
import axios from "axios";
import { API_URL } from "../../../config";
import type { Release } from "../../../types/release";
import type { Track } from "../../../types/track";
import type { TrackSource } from "../../../types/trackSource";
import { useApp } from "../../../context/AppContext";
import type { ContentSource } from "../../../types/contentSource";

function ReleaseView({ releaseId }: { releaseId: number }) {
    const { setContentSource } = useApp();
    const { playTrack } = useAudioPlayer();
    const [release, setRelease] = useState<Release | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setIsLoading(true);
        axios.get(`${API_URL}/releases/${releaseId}`)
            .then((res) => {
                setRelease(res.data);
                setIsLoading(false);
            })
            .catch((err) => setError(err.message))
    }, [releaseId]);

    const handlePlayClick = (track: Track, release: Release) => {
        const trackSource: TrackSource = {
            type: 'RELEASE',
            name: release.title,
            id: release.id,
            tracks: release.tracks
        };
        playTrack(track, trackSource);
    }

    const handleArtistClick = (artistId: number) => {
        const contentSource: ContentSource = {
            type: 'ARTIST',
            id: artistId
        }
        setContentSource(contentSource);
    }

    return (
        <div>
            {isLoading ? (
                <p>Загрузка...</p>
            ) : (
                <div>
                    <img src={release?.cover} />
                    <p>{release?.title}</p>
                    <div className="link" onClick={() => handleArtistClick(release?.artist?.id)}>{release?.artist?.name}</div>
                    <div className='flex flex-col gap-2'>
                        {release?.tracks?.map((track) => (
                            <div key={track.id} onClick={() => handlePlayClick(track, release)} className='cursor-pointer bg-gray-200 hover:bg-gray-300 rounded-md p-2 grid grid-cols-[2rem_1fr_1fr] grid-rows-2 h-14'>
                                <div className='row-span-2'>{track.metadata.trackNo}</div>
                                <div className=''>{track.metadata.title}</div>
                                <div className='row-span-2'>{track.metadata.duration}</div>
                                <div className=''>{track.metadata.artist}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {error}
        </div>
    );
}

export default ReleaseView
