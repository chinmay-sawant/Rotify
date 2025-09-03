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
  const [selectedFont, setSelectedFont] = useState('VT323');
  const [exportBusy, setExportBusy] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const token = localStorage.getItem('spotify_token');

  const exportImage = async () => {
    if (exportBusy) return;
    setExportBusy(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const el = document.querySelector('.paper') as HTMLElement | null;
      if (!el) return;

      // Get computed styles to understand padding
      const computedStyle = window.getComputedStyle(el);
      const paddingLeft = parseInt(computedStyle.paddingLeft);
      const paddingRight = parseInt(computedStyle.paddingRight);
      const paddingTop = parseInt(computedStyle.paddingTop);
      const paddingBottom = parseInt(computedStyle.paddingBottom);

      const canvas = await html2canvas(el, {
        backgroundColor: '#fff',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        height: el.scrollHeight,
        width: el.scrollWidth
      });

      // Get the actual content dimensions (excluding padding)
      const contentWidth = el.scrollWidth - paddingLeft - paddingRight;
      const contentHeight = el.scrollHeight - paddingTop - paddingBottom;

      // Add some padding back (same as right padding)
      const finalPadding = paddingRight; // Use right padding as reference
      const finalWidth = contentWidth + finalPadding;
      const finalHeight = contentHeight + finalPadding;

      // Create trimmed canvas with content dimensions plus padding
      const trimmedCanvas = document.createElement('canvas');
      const trimmedCtx = trimmedCanvas.getContext('2d');
      if (!trimmedCtx) return;

      trimmedCanvas.width = finalWidth * 2; // scale factor
      trimmedCanvas.height = finalHeight * 2; // scale factor

      // Draw content area with some padding on left/top to match right/bottom
      trimmedCtx.drawImage(
        canvas,
        (paddingLeft - finalPadding) * 2, // source x (accounting for scale) - add padding back
        (paddingTop - finalPadding) * 2,  // source y (accounting for scale) - add padding back
        finalWidth * 2, // source width
        finalHeight * 2, // source height
        0, 0, // destination x, y
        finalWidth * 2, // destination width
        finalHeight * 2 // destination height
      );

      const link = document.createElement('a');
      link.download = 'rotify-receipt.png';
      link.href = trimmedCanvas.toDataURL('image/png');
      link.click();
    } finally {
      setExportBusy(false);
    }
  };

  const exportPdf = async () => {
    if (exportBusy) return; 
    setExportBusy(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;
      const el = document.querySelector('.paper') as HTMLElement | null;
      if (!el) return;
      const canvas = await html2canvas(el, { backgroundColor: '#fff', scale: 2, useCORS: true, allowTaint: true, height: el.scrollHeight, width: el.scrollWidth });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth - 80;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 40;

      pdf.addImage(imgData, 'PNG', 40, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 40, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('rotify-receipt.pdf');
    } finally { 
      setExportBusy(false); 
    }
  };

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
              selectedFont={selectedFont}
              onFontChange={setSelectedFont}
              onExportImage={exportImage}
              onExportPdf={exportPdf}
              exportBusy={exportBusy}
            />
            {showReceipt && (
              <Receipt
                user={user}
                timeRange={timeRange}
                sections={{
                  recent: show.recent ? recentTracks : [],
                  topTracks: show.topTracks ? topTracks : [],
                  topArtists: show.topArtists ? topArtists : [],
                  playlists: show.playlists ? playlists : []
                }}
                selectedFont={selectedFont}
              />
            )}
            {loading && <LoadingSpinner message="Loading music data..." />}
            {!loading && !showReceipt && (
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