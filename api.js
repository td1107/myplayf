// api.js
import { getValidToken, refreshAccessToken } from './auth.js'; //
import { SPOTIFY_API_BASE_URL } from './config.js'; //

/**
 * ฟังก์ชันสำหรับการเรียกใช้ Spotify API
 * @param {string} endpoint Endpoint ของ API (เช่น '/me')
 * @param {string} method HTTP method (GET, POST, PUT, DELETE)
 * @param {object} options ตัวเลือกเพิ่มเติมสำหรับ fetch
 * @returns {Promise<object>} ข้อมูล JSON ที่ได้จาก API
 */
export async function callSpotifyApi(endpoint, method = 'GET', options = {}) { //
  try {
    let token = await getValidToken(); //
    if (!token) { //
      throw new Error('ไม่มี token ที่ใช้งานได้'); //
    }

    const url = `${SPOTIFY_API_BASE_URL}${endpoint}`; //
    const headers = { //
      'Authorization': `Bearer ${token}`, //
      ...options.headers //
    };
    const config = { //
      method, //
      headers, //
      ...options, //
    };

    if (options.body) { //
      config.body = JSON.stringify(options.body); //
      headers['Content-Type'] = 'application/json'; //
    }

    let response = await fetch(url, config); //

    if (response.status === 401) { //
      localStorage.removeItem('spotify_access_token'); //
      localStorage.removeItem('spotify_token_expires_at'); //
      try {
        token = await refreshAccessToken(); //
        headers['Authorization'] = `Bearer ${token}`; //
        config.headers = headers; //
        response = await fetch(url, config); // Re-fetch with new token
      } catch (refreshError) {
        console.error('ไม่สามารถรีเฟรช token ได้:', refreshError); //
        throw new Error('Token หมดอายุและไม่สามารถรีเฟรชได้ กรุณาล็อกอินใหม่'); //
      }
    }

    if (!response.ok) { //
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(`Spotify API ส่งข้อผิดพลาด: ${response.status} - ${errorData.message || response.statusText}`); //
    }
    // For endpoints that don't return JSON (e.g., 204 No Content)
    if (response.status === 204) {
        return null;
    }
    return await response.json(); //
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการเรียกใช้ Spotify API:', error); //
    if (error.message.includes('Token หมดอายุ')) {
        // Handle logout or redirect to login in app.js
    }
    throw error; //
  }
}

// ฟังก์ชันเฉพาะสำหรับดึงข้อมูลต่างๆ จาก Spotify
export async function getCurrentlyPlaying() { //
  return await callSpotifyApi('/me/player/currently-playing'); //
}

export async function getRecentlyPlayed(limit = 20) { //
  return await callSpotifyApi(`/me/player/recently-played?limit=${limit}`); //
}

export async function getUserPlaylists(limit = 20) { //
  return await callSpotifyApi(`/me/playlists?limit=${limit}`); //
}

export async function getUserProfile() { //
  return await callSpotifyApi('/me'); //
}

export async function getPlaylistTracks(playlistId, limit = 100) { //
  return await callSpotifyApi(`/playlists/${playlistId}/tracks?limit=${limit}`); //
}

export async function getPlaylistDetails(playlistId) { //
    return await callSpotifyApi(`/playlists/${playlistId}`); //
}

export async function searchSpotify(query, types = ['track', 'artist', 'album'], limit = 5) { //
  const typeString = types.join(',');
  return await callSpotifyApi(`/search?q=${encodeURIComponent(query)}&type=${typeString}&limit=${limit}`); //
}