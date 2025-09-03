import { useState, useEffect } from 'react';
import SpotifyAuth from './components/SpotifyAuth';
import Header from './components/Header';
import ThemeToggle from './components/ThemeToggle';
import LoadingSpinner from './components/LoadingSpinner';
import { getUserProfile, getRecentlyPlayed } from './services/SpotifyService';
import { useTheme } from './hooks/useTheme';
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
  const [loading, setLoading] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const token = localStorage.getItem('spotify_token');

  useEffect(() => {
    if (token) {
      setLoading(true);
      Promise.all([
        getUserProfile(token).then(setUser),
        getRecentlyPlayed(token, 10).then(setTracks)
      ]).finally(() => setLoading(false));
    }
  }, [token]);

  const logout = () => {
    localStorage.removeItem('spotify_token');
    sessionStorage.removeItem('code_verifier');
    window.location.reload();
  };

  const themeToggle = <ThemeToggle theme={theme} onToggle={toggleTheme} />;

  return (
    <div className="app">
      {!token ? (
        <div className="auth-wrapper">
          <div className="theme-toggle-container">
            {themeToggle}
          </div>
          <SpotifyAuth />
        </div>
      ) : (
        <div className="main-content">
          <Header 
            user={user} 
            onLogout={logout} 
            themeToggle={themeToggle}
          />
          <div className="content">
            <h2 className="section-title">Your Recently Played Tracks</h2>
            {loading ? (
              <LoadingSpinner message="Loading your recently played tracks..." />
            ) : (
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
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;