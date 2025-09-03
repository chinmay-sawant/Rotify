import axios from 'axios';

const apiUrl = 'https://api.spotify.com/v1';

// Generic request helper
const authHeaders = (token: string) => ({ headers: { Authorization: `Bearer ${token}` } });

export const getUserProfile = async (token: string) => {
  const { data } = await axios.get(`${apiUrl}/me`, authHeaders(token));
  return data;
};

export interface SpotifyImage { url: string; height?: number; width?: number }
export interface SpotifyExternal { spotify?: string }
export interface SpotifyArtist { id: string; name: string; external_urls?: SpotifyExternal; images?: SpotifyImage[] }
export interface SpotifyTrack { id: string; name: string; duration_ms: number; artists: SpotifyArtist[]; album?: { name?: string; images?: SpotifyImage[] }; external_urls?: SpotifyExternal }
export interface SpotifyPlaylist { id: string; name: string; images?: SpotifyImage[]; external_urls?: SpotifyExternal }

export const getRecentlyPlayed = async (token: string, limit: number = 10): Promise<SpotifyTrack[]> => {
  const { data } = await axios.get(`${apiUrl}/me/player/recently-played?limit=${limit}`, authHeaders(token));
  return data.items.map((item: { track: SpotifyTrack }) => item.track);
};

export const getTopTracks = async (token: string, timeRange: 'short_term' | 'medium_term' | 'long_term' = 'short_term', limit: number = 20): Promise<SpotifyTrack[]> => {
  const { data } = await axios.get(`${apiUrl}/me/top/tracks?time_range=${timeRange}&limit=${limit}`, authHeaders(token));
  return data.items as SpotifyTrack[];
};

export const getTopArtists = async (token: string, timeRange: 'short_term' | 'medium_term' | 'long_term' = 'short_term', limit: number = 20): Promise<SpotifyArtist[]> => {
  const { data } = await axios.get(`${apiUrl}/me/top/artists?time_range=${timeRange}&limit=${limit}`, authHeaders(token));
  return data.items as SpotifyArtist[];
};

export const getUserPlaylists = async (token: string, limit: number = 20): Promise<SpotifyPlaylist[]> => {
  const { data } = await axios.get(`${apiUrl}/me/playlists?limit=${limit}`, authHeaders(token));
  return data.items as SpotifyPlaylist[];
};

export const getTrack = async (token: string, trackId: string) => {
  const { data } = await axios.get(`${apiUrl}/tracks/${trackId}`, authHeaders(token));
  return data;
};

export const getPlaylistTracks = async (token: string, playlistId: string, limit: number = 100): Promise<SpotifyTrack[]> => {
  const { data } = await axios.get(`${apiUrl}/playlists/${playlistId}/tracks?limit=${limit}`, authHeaders(token));
  return data.items.map((i: { track: SpotifyTrack }) => i.track);
};

// Utility to format ms to mm:ss
export const formatDuration = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// Future: Add functions for audio features / recommendations as needed.
