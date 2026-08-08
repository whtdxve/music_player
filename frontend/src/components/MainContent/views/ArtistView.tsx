import { useEffect, useState } from 'react';
import placeholder from '../../../assets/images/placeholder.png';
import axios from 'axios';
import { API_URL } from '../../../config';
import type { Artist } from '../../../types/artists';
import type { Track } from '../../../types/track';
import type { Release } from '../../../types/release';
import { useApp } from '../../../context/AppContext';

function ArtistView({ artistId }: { artistId: number }) {
    const { setContentSource } = useApp();
    const [artist, setArtist] = useState<Artist | null>(null);
    const [tracks, setTracks] = useState<Track[] | []>([]);
    const [albums, setAlbums] = useState<Release[] | []>([]);
    const [singles, setSingles] = useState<Release[] | []>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setIsLoading(true);
        axios.get(`${API_URL}/artists/${artistId}`)
            .then((res) => {
                setArtist(res.data);
                setIsLoading(false);
            })
            .catch((err) => setError(err.message))
        axios.get(`${API_URL}/artists/${artistId}/tracks`)
            .then((res) => {
                setTracks(res.data);
            })
            .catch((err) => setError(err.message))
        axios.get(`${API_URL}/artists/${artistId}/albums`)
            .then((res) => {
                setAlbums(res.data);
            })
            .catch((err) => setError(err.message))
        axios.get(`${API_URL}/artists/${artistId}/singles`)
            .then((res) => {
                setSingles(res.data);
            })
            .catch((err) => setError(err.message))
    }, [artistId]);

    return (
        <div>
            {isLoading ? (
                <p>Загрузка...</p>
            ) : (
                <div className='flex flex-col'>
                    <div className='flex'>
                        <img src={placeholder} />
                        <div className='flex flex-col'>
                            <div>{artist?.name}</div>
                            <div>genre 1, genre 2</div>
                            <div>3 альбома</div>
                            <div>Play</div>
                        </div>
                    </div>
                    <div>
                        <div>
                            <div>Треки</div>
                            <div className='flex flex-col'>
                                {tracks?.map((track) => (
                                    <div className='flex' key={track.id}>
                                        <img className='w-20' src={track.release.cover} />
                                        <div>{track.metadata.title}</div>
                                        <div>{track.metadata.duration}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {albums.length > 0 && (
                            <div>
                                <div>Альбомы</div>
                                <div className='flex'>
                                    {albums?.map((album) => (
                                        <div onClick={() => setContentSource({ type: 'RELEASE', id: album.id })} className='flex flex-col' key={album.id}>
                                            <img className='w-20' src={album.cover} />
                                            <div>{album.title}</div>
                                            <div className='flex'>
                                                <div>{album.releasedAt}</div>
                                                <div>{album.tracksCount} треков</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {singles.length > 0 && (
                            <div>
                                <div>Синглы</div>
                                <div className='flex'>
                                    {singles?.map((single) => (
                                        <div onClick={() => setContentSource({ type: 'RELEASE', id: single.id })} className='flex flex-col' key={single.id}>
                                            <img className='w-20' src={single.cover} />
                                            <div>{single.title}</div>
                                            <div className='flex'>
                                                <div>{single.releasedAt}</div>
                                                <div>{single.tracksCount} треков</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {error}
        </div>
    );
}

export default ArtistView