import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios';
import { API_URL } from './config';

function App() {
  const [releases, setReleases] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3000/library')
      .then((res) => setReleases(res.data))
      .catch((err) => setError(err.message))
  }, []);

  return (
    <body>
      <div className='flex w-200 flex-wrap gap-2'>
        {releases.map((releases) => (
          <div className='flex flex-col gap-2'>
            <img className='w-40' src={`${API_URL}${releases.img}`} />
            <h2>{releases.album}</h2>
            <h1>{releases.artist}</h1>
          </div>
        ))}
        {error}
      </div>
      <div>

      </div>
    </body>
  );
}

export default App
