import axios from 'axios';

const apiUrl = 'https://api.spotify.com/v1';

export const getUserProfile = async (token: string) => {
  const response = await axios.get(`${apiUrl}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getRecentlyPlayed = async (token: string, limit: number = 10) => {
  const response = await axios.get(`${apiUrl}/me/player/recently-played?limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.items.map((item: any) => item.track);
};

// Add more functions for tracks, playlists, etc.
