import { useState, useEffect } from 'react';
import SpotifyAuth from './components/SpotifyAuth';
import { getUserProfile, getRecentlyPlayed } from './services/SpotifyService';
import './styles/App.css';

interface SpotifyUser {
  display_name: string;
  id: string;
  email?: string;
}

interface Track {
  name: string;
  artists?: { name: string }[];
  album?: { name?: string; images?: { url: string }[] };
}

function App() {
  const [user, setUser] = useState<SpotifyUser | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const token = localStorage.getItem('spotify_token');

  useEffect(() => {
    if (token) {
      getUserProfile(token).then(setUser);
      getRecentlyPlayed(token, 10).then(setTracks);
    }
  }, [token]);

  const logout = () => {
    localStorage.removeItem('spotify_token');
    sessionStorage.removeItem('code_verifier');
    window.location.reload();
  };

  return (
    <div className="app">
      {!token ? (
        <SpotifyAuth />
      ) : (
        <div>
          <button onClick={logout} className="logout-btn">Logout</button>
          <h1>Welcome, {user?.display_name}!</h1>
          <h2>Your Recently Played Tracks</h2>
          <div className="tracks-container">
            {tracks.map((track, index) => (
              <div key={index} className="track-card">
                {track.album?.images?.[0] && (
                  <img src={track.album.images[0].url} alt={track.album.name || 'Album'} className="track-image" />
                )}
                <div className="track-info">
                  <h3>{track.name}</h3>
                  <p>{track.artists?.map(artist => artist.name).join(', ') || 'Unknown Artist'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;