import type { Release } from "../../types/release";
import { useAudioPlayer } from "../../context/AudioPlayerContext";

function ReleaseInfo({ isLoading, selectedRelease }: { isLoading: boolean, selectedRelease: Release | null }) {
    const { playTrack } = useAudioPlayer();

    return (
        <div>
            {isLoading ? (
                <p>Загрузка...</p>
            ) : (
                <div>
                    <img src={selectedRelease?.cover} />
                    <p>{selectedRelease?.title}</p>
                    <div>{selectedRelease?.artist?.name}</div>
                    <div className='flex flex-col gap-2'>
                        {selectedRelease?.tracks?.map((track) => (
                            <div key={track.id} onClick={() => playTrack(track, selectedRelease?.tracks)} className='cursor-pointer bg-gray-200 hover:bg-gray-300 rounded-md p-2 grid grid-cols-[2rem_1fr_1fr] grid-rows-2 h-14'>
                                <div className='row-span-2'>{track.metadata.trackNo}</div>
                                <div className=''>{track.metadata.title}</div>
                                <div className='row-span-2'>{track.metadata.duration}</div>
                                <div className=''>{track.metadata.artist}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ReleaseInfo;