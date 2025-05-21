// auth.js
import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, SCOPES, SPOTIFY_AUTH_URL, SPOTIFY_TOKEN_URL } from './config.js'; //
import { generateRandomString } from './utils.js'; //

/**
 * ฟังก์ชันสำหรับล็อกอินผ่าน Spotify
 */
export function loginWithSpotify() { //
  const authUrl = new URL(SPOTIFY_AUTH_URL); //
  authUrl.searchParams.append('client_id', CLIENT_ID); //
  authUrl.searchParams.append('response_type', 'code'); //
  authUrl.searchParams.append('redirect_uri', REDIRECT_URI); //
  authUrl.searchParams.append('scope', SCOPES.join(' ')); //
  const state = generateRandomString(16); //
  localStorage.setItem('spotify_auth_state', state); //
  authUrl.searchParams.append('state', state); //
  window.location.href = authUrl.toString(); //
}

/**
 * ฟังก์ชันสำหรับรับ token หลังจากผู้ใช้ล็อกอิน
 * @param {string} code โค้ดที่ได้จาก Spotify callback
 * @returns {Promise<string|null>} Access token หรือ null หากเกิดข้อผิดพลาด
 */
export async function getAccessToken(code) { //
  try {
    const body = new URLSearchParams({ //
      grant_type: 'authorization_code', //
      code: code, //
      redirect_uri: REDIRECT_URI, //
      client_id: CLIENT_ID, //
      client_secret: CLIENT_SECRET //
    });
    const response = await fetch(SPOTIFY_TOKEN_URL, { //
      method: 'POST', //
      headers: { //
        'Content-Type': 'application/x-www-form-urlencoded' //
      },
      body: body //
    });
    const data = await response.json(); //
    if (data.access_token) { //
      localStorage.setItem('spotify_access_token', data.access_token); //
      localStorage.setItem('spotify_refresh_token', data.refresh_token); //
      localStorage.setItem('spotify_token_expires_at', Date.now() + (data.expires_in * 1000)); //
      return data.access_token; //
    } else {
      throw new Error('ไม่พบ access token ในการตอบกลับ'); //
    }
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการขอ access token:', error); //
    throw error; //
  }
}

/**
 * ฟังก์ชันสำหรับรีเฟรช token เมื่อหมดอายุ
 * @returns {Promise<string>} New access token
 */
export async function refreshAccessToken() { //
  try {
    const refreshToken = localStorage.getItem('spotify_refresh_token'); //
    if (!refreshToken) { //
      throw new Error('ไม่พบ refresh token ใน localStorage'); //
    }
    const body = new URLSearchParams({ //
      grant_type: 'refresh_token', //
      refresh_token: refreshToken, //
      client_id: CLIENT_ID, //
      client_secret: CLIENT_SECRET //
    });
    const response = await fetch(SPOTIFY_TOKEN_URL, { //
      method: 'POST', //
      headers: { //
        'Content-Type': 'application/x-www-form-urlencoded' //
      },
      body: body //
    });
    const data = await response.json(); //
    if (data.access_token) { //
      localStorage.setItem('spotify_access_token', data.access_token); //
      localStorage.setItem('spotify_token_expires_at', Date.now() + (data.expires_in * 1000)); //
      if (data.refresh_token) { //
        localStorage.setItem('spotify_refresh_token', data.refresh_token); //
      }
      return data.access_token; //
    } else {
      throw new Error('ไม่พบ access token ในการตอบกลับ'); //
    }
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการรีเฟรช token:', error); //
    localStorage.removeItem('spotify_access_token'); //
    localStorage.removeItem('spotify_refresh_token'); //
    localStorage.removeItem('spotify_token_expires_at'); //
    throw error; //
  }
}

/**
 * ฟังก์ชันตรวจสอบและดูแล token
 * @returns {Promise<string|null>} Valid access token หรือ null ถ้าไม่มี
 */
export async function getValidToken() { //
  const expiresAt = localStorage.getItem('spotify_token_expires_at'); //
  const accessToken = localStorage.getItem('spotify_access_token'); //
  if (accessToken && expiresAt && Date.now() < parseInt(expiresAt)) { //
    return accessToken; //
  }
  if (localStorage.getItem('spotify_refresh_token')) { //
    return await refreshAccessToken(); //
  }
  return null; //
}

/**
 * ฟังก์ชันสำหรับตรวจสอบการล็อกอินจาก URL callback
 * @returns {Promise<string|null>} Access token หรือ null
 */
export async function handleSpotifyCallback() { //
  const urlParams = new URLSearchParams(window.location.search); //
  const code = urlParams.get('code'); //
  const state = urlParams.get('state'); //
  const storedState = localStorage.getItem('spotify_auth_state'); //

  if (code && state === storedState) { //
    localStorage.removeItem('spotify_auth_state'); //
    try {
      const token = await getAccessToken(code); //
      // Redirect to remove query parameters from URL after successful login
      window.history.replaceState({}, document.title, REDIRECT_URI);
      return token; //
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการขอ token:', error); //
      return null; //
    }
  } else if (urlParams.get('error')) { //
    console.error('เกิดข้อผิดพลาดในการล็อกอิน:', urlParams.get('error')); //
     // Redirect to remove query parameters from URL after error
    window.history.replaceState({}, document.title, REDIRECT_URI);
    return null; //
  }
  return null; //
}

export function logout() { //
  localStorage.removeItem('spotify_access_token'); //
  localStorage.removeItem('spotify_refresh_token'); //
  localStorage.removeItem('spotify_token_expires_at'); //
  // Reset state variables if they are managed in a central store or auth module
  // For this example, we'll assume app.js handles resetting state and re-rendering
}