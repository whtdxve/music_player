import { useEffect, useState } from "react";
import { API_URL } from "../../config";
import axios from "axios";
import type { Release } from "../../types/release";

function Sidebar({ setIsLoading, setSelectedRelease }: { setIsLoading: (value: boolean) => void, setSelectedRelease: (value: Release | null) => void }) {
    const [releases, setReleases] = useState<Release[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get(`${API_URL}/releases`)
            .then((res) => setReleases(res.data))
            .catch((err) => setError(err.message))
    }, []);

    const openReleaseInfo = (releaseId) => {
        setIsLoading(true);
        axios.get(`${API_URL}/releases/${releaseId}`)
            .then((res) => {
                setSelectedRelease(res.data);
                setIsLoading(false);
            })
            .catch((err) => setError(err.message))
    };

    return (
        <div className='flex w-200 flex-wrap gap-2'>
            {releases.map((release) => (
                <div
                    key={release.id}
                    onClick={() => openReleaseInfo(release.id)}
                    className='cursor-pointer bg-gray-200 hover:bg-gray-300 rounded-md p-2 flex flex-col gap-2'
                >
                    <img className='w-40' src={release.cover} />
                    <h2>{release.title}</h2>
                    <h1>{release.artist?.name}</h1>
                </div>
            ))}
            {error}
        </div>
    );
}

export default Sidebar