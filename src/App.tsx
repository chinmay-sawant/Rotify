import { useState, useEffect, useCallback } from 'react';
import SpotifyAuth from './components/SpotifyAuth';
import Header from './components/Header';
import ThemeToggle from './components/ThemeToggle';
import LoadingSpinner from './components/LoadingSpinner';
import {
  getUserProfile,
  getRecentlyPlayed,
  getTopTracks,
  getTopArtists,
  getUserPlaylists,
  formatDuration
} from './services/SpotifyService';
import type { SpotifyTrack, SpotifyArtist, SpotifyPlaylist } from './services/SpotifyService';
import DataToggles from './components/DataToggles';
import Receipt from './components/Receipt';
import { useTheme } from './hooks/useTheme';
import './styles/App.css';

interface SpotifyUser {
  display_name: string;
  id: string;
  email?: string;
}

type Track = SpotifyTrack;

function App() {
  const [user, setUser] = useState<SpotifyUser | null>(null);
  const [recentTracks, setRecentTracks] = useState<Track[]>([]);
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [topArtists, setTopArtists] = useState<SpotifyArtist[]>([]);
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [show, setShow] = useState<{ recent: boolean; topTracks: boolean; topArtists: boolean; playlists: boolean }>({ recent: true, topTracks: false, topArtists: false, playlists: false });
  const [showReceipt, setShowReceipt] = useState(false);
  const [timeRange, setTimeRange] = useState<'short_term' | 'medium_term' | 'long_term'>('short_term');
  const [loading, setLoading] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const token = localStorage.getItem('spotify_token');

  const loadData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
  const [profile, recent, topT, topA, pls] = await Promise.all([
        getUserProfile(token),
        show.recent ? getRecentlyPlayed(token, 10) : Promise.resolve([]),
        show.topTracks ? getTopTracks(token, timeRange, 15) : Promise.resolve([]),
        show.topArtists ? getTopArtists(token, timeRange, 15) : Promise.resolve([]),
        show.playlists ? getUserPlaylists(token, 10) : Promise.resolve([])
      ]);
      setUser(profile);
  setRecentTracks(recent as Track[]);
  setTopTracks(topT as Track[]);
  setTopArtists(topA as SpotifyArtist[]);
  setPlaylists(pls as SpotifyPlaylist[]);
    } finally {
      setLoading(false);
    }
  }, [token, show, timeRange]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
            <DataToggles
              show={show}
              onChange={(next: typeof show) => setShow(next)}
              timeRange={timeRange}
              onTimeRangeChange={setTimeRange}
              onRefresh={loadData}
              onToggleReceipt={() => setShowReceipt(r => !r)}
              receiptActive={showReceipt}
            />
            {showReceipt && (
              <Receipt
                user={user}
                tracks={show.topTracks && topTracks.length ? topTracks.slice(0, 10) : recentTracks.slice(0, 10)}
                timeRange={timeRange}
              />
            )}
            {loading && <LoadingSpinner message="Loading music data..." />}
            {!loading && (
              <div className="data-sections">
                {show.recent && recentTracks.length > 0 && (
                  <section>
                    <h2 className="section-title plain">Recently Played</h2>
                    <div className="tracks-container minimal">
                      {recentTracks.map((track, i) => (
                        <a key={i} className="track-row" href={track.external_urls?.spotify} target="_blank" rel="noreferrer">
                          {track.album?.images?.[0] && <img src={track.album.images[0].url} alt="" className="thumb" />}
                          <div className="t-meta">
                            <span className="t-name">{track.name}</span>
                            <span className="t-artist">{track.artists?.map(a => a.name).join(', ')}</span>
                          </div>
                        </a>
                      ))}
                    </div>
                  </section>
                )}
                {show.topTracks && topTracks.length > 0 && (
                  <section>
                    <h2 className="section-title plain">Top Tracks ({timeRange.replace('_', ' ')})</h2>
                    <div className="tracks-container minimal">
                      {topTracks.map((track, i) => (
                        <a key={i} className="track-row" href={track.external_urls?.spotify} target="_blank" rel="noreferrer">
                          <span className="index">{i + 1}</span>
                          <div className="t-meta grow">
                            <span className="t-name">{track.name}</span>
                            <span className="t-artist">{track.artists?.map(a => a.name).join(', ')}</span>
                          </div>
                          <span className="duration">{formatDuration(track.duration_ms)}</span>
                        </a>
                      ))}
                    </div>
                  </section>
                )}
                {show.topArtists && topArtists.length > 0 && (
                  <section>
                    <h2 className="section-title plain">Top Artists ({timeRange.replace('_', ' ')})</h2>
                    <div className="artists-grid">
                      {topArtists.map((artist, i) => (
                        <a key={i} className="artist-card" href={artist.external_urls?.spotify} target="_blank" rel="noreferrer">
                          {artist.images?.[0] && <img src={artist.images[0].url} alt={artist.name} />}
                          <span className="artist-name">{artist.name}</span>
                        </a>
                      ))}
                    </div>
                  </section>
                )}
                {show.playlists && playlists.length > 0 && (
                  <section>
                    <h2 className="section-title plain">Playlists</h2>
                    <div className="playlists-grid">
                      {playlists.map((pl, i) => (
                        <a key={i} className="playlist-card" href={pl.external_urls?.spotify} target="_blank" rel="noreferrer">
                          {pl.images?.[0] && <img src={pl.images[0].url} alt={pl.name} />}
                          <span className="playlist-name">{pl.name}</span>
                        </a>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;