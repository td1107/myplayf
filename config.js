// config.js
export const CLIENT_ID = '82c3bf5c3c5e4ccab0e478447843671a';
export const CLIENT_SECRET = 'c0e1d849b5774f669ee79465b67478e5';
export const REDIRECT_URI = 'https://myplayf.netlify.app/callback';
export const SCOPES = [
  'user-read-currently-playing',
  'user-read-recently-played',
  'playlist-read-private',
  'playlist-read-collaborative',
  'user-read-private'
];
export const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize'; // Derived from function loginWithSpotify
export const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token'; // Derived from functions getAccessToken, refreshAccessToken
export const SPOTIFY_API_BASE_URL = 'https://api.spotify.com/v1$'; // Derived from function callSpotifyApi