import { useEffect, useState } from "react";
import { useAudioPlayer } from "../../../context/AudioPlayerContext";
import axios from "axios";
import { API_URL } from "../../../config";
import type { Release } from "../../../types/release";
import type { Track } from "../../../types/track";

function ReleaseView({ releaseId }: { releaseId: number }) {
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
        playTrack(track, release);
    }

    return (
        <div>
            {isLoading ? (
                <p>Загрузка...</p>
            ) : (
                <div>
                    <img src={release?.cover} />
                    <p>{release?.title}</p>
                    <div>{release?.artist?.name}</div>
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

function setCurrentTrack(track: Track) {
    throw new Error("Function not implemented.");
}
