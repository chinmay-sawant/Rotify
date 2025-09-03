import axios from 'axios';

const apiUrl = 'https://api.spotify.com/v1';

export const getUserProfile = async (token: string) => {
  const response = await axios.get(`${apiUrl}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
// Add more functions for tracks, playlists, etc.

export const getUserPlaylists = async (token: string) => {
  const response = await axios.get(`${apiUrl}/me/playlists`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getTrack = async (token: string, trackId: string) => {
  const response = await axios.get(`${apiUrl}/tracks/${trackId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getPlaylistTracks = async (token: string, playlistId: string) => {
  const response = await axios.get(`${apiUrl}/playlists/${playlistId}/tracks`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};