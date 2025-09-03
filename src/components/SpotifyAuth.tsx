import { useEffect, useCallback, useState } from 'react';
import './SpotifyAuth.css';

// Generate a random string for code_verifier
const generateRandomString = (length: number) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
};

// Generate code_challenge from code_verifier
const generateCodeChallenge = async (codeVerifier: string) => {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
};

const SpotifyAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;

  const login = async () => {
    setIsLoading(true);
    try {
      const codeVerifier = generateRandomString(64);
      const codeChallenge = await generateCodeChallenge(codeVerifier);
      const scope = [
        'user-read-private',
        'user-read-email',
        'user-read-recently-played',
        'user-top-read',
        'playlist-read-private',
        'playlist-read-collaborative'
      ].join(' ');
      const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&code_challenge_method=S256&code_challenge=${codeChallenge}`;
      sessionStorage.setItem('code_verifier', codeVerifier);
      window.location.href = authUrl;
    } catch (error) {
      console.error('Error during login:', error);
      setIsLoading(false);
    }
  };

  const exchangeCodeForToken = useCallback(async (code: string) => {
    const codeVerifier = sessionStorage.getItem('code_verifier');
    if (!codeVerifier) return;

    setIsLoading(true);
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      client_id: clientId,
      code_verifier: codeVerifier,
    });

    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body,
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('spotify_token', data.access_token);
        sessionStorage.removeItem('code_verifier');
        window.location.reload(); // Reload to update the app state
      } else {
        console.error('Failed to exchange code for token');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      setIsLoading(false);
    }
  }, [clientId, redirectUri]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    if (error) {
      console.error('Spotify auth error:', error);
    } else if (code) {
      exchangeCodeForToken(code);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [exchangeCodeForToken]);

  return (
    <div className="spotify-auth">
      <div className="auth-container">
        <div className="auth-header">
          <div className="brand-logo-wrapper">
            <img src="/rotify_500x500.png" alt="Rotify" className="brand-logo" />
          </div>
          <h1 className="auth-title brand-text">Rotify</h1>
          <p className="auth-subtitle">Connect your Spotify account to discover your music journey</p>
        </div>
        
        <div className="auth-features">
          <div className="feature">
            <span className="feature-icon">🎧</span>
            <span>Recently Played Tracks</span>
          </div>
          <div className="feature">
            <span className="feature-icon">📊</span>
            <span>Music Analytics</span>
          </div>
          <div className="feature">
            <span className="feature-icon">🔍</span>
            <span>Discover New Music</span>
          </div>
        </div>

        <button 
          onClick={login} 
          className={`spotify-login-btn ${isLoading ? 'loading' : ''}`}
          disabled={isLoading}
        >
          <span className="btn-content">
            <span className="spotify-logo">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.062 14.455c-.167.273-.542.361-.875.2-2.4-1.467-5.422-1.8-8.988-.988-.341.078-.691-.137-.769-.477-.078-.341.137-.691.477-.769 3.91-.89 7.28-.508 10.033 1.142.333.162.442.537.275.809zm1.25-2.78c-.209.341-.656.449-.997.24-2.75-1.689-6.944-2.178-10.194-1.192-.413.125-.849-.108-.974-.521-.125-.413.108-.849.521-.974 3.719-1.125 8.375-.579 11.405 1.364.341.209.449.656.24.997zm.107-2.895C14.694 8.615 9.757 8.4 6.67 9.402c-.49.159-1.007-.109-1.166-.599-.159-.49.109-1.007.599-1.166 3.549-1.152 9.077-.916 12.966 1.305.415.237.553.757.316 1.172-.237.415-.757.553-1.172.316z"/>
              </svg>
            </span>
            {isLoading ? 'Connecting...' : 'Connect with Spotify'}
          </span>
          {isLoading && (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          )}
        </button>

        <p className="auth-disclaimer">
          Secure connection powered by Spotify OAuth 2.0
        </p>
      </div>
    </div>
  );
};

export default SpotifyAuth;