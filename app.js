// app.js
import { handleSpotifyCallback, getValidToken, logout } from './auth.js';
import { getUserProfile, getCurrentlyPlaying, getRecentlyPlayed, getUserPlaylists, getPlaylistDetails, getPlaylistTracks, searchSpotify as performSpotifySearch, callSpotifyApi } from './api.js'; //
import { renderLoginScreen, renderDashboardLayout, renderViewContent, initializeUICallbacks, initializeTheme, applyTheme, setupResponsiveLayout as initialResponsiveLayoutSetup } from './ui.js'; //
import { showNotification } from './utils.js'; //

// App state
let currentUser = null; //
let currentlyPlaying = null; //
let recentlyPlayed = []; //
let userPlaylists = []; //
let currentView = 'home'; // Default view
let searchResults = null;
let playlistDetails = null; // For storing current playlist being viewed { playlist: {}, tracks: {} }

const appElement = document.getElementById('app');

async function loadUserData() { //
  try {
    currentUser = await getUserProfile(); //
    currentlyPlaying = await getCurrentlyPlaying(); //
    const recentlyPlayedData = await getRecentlyPlayed(); //
    recentlyPlayed = recentlyPlayedData?.items || []; //
    const playlistsData = await getUserPlaylists(); //
    userPlaylists = playlistsData?.items || []; //
    renderApp(); //
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการโหลดข้อมูลผู้ใช้:', error); //
    if (error.message.includes('Token หมดอายุ') || error.message.includes('ไม่มี token')) {
        handleLogout();
    } else {
        showNotification('เกิดข้อผิดพลาดในการโหลดข้อมูล: ' + error.message, 'error');
    }
  }
}

function renderApp() { //
  const accessToken = localStorage.getItem('spotify_access_token');
  if (!accessToken || !currentUser) { //
    renderLoginScreen(appElement); //
  } else {
    renderDashboardLayout(appElement, currentUser, currentView); //
    renderCurrentViewContent(); //
  }
}

function renderCurrentViewContent() {
  const mainContentElement = document.getElementById('main-content');
  if (mainContentElement) {
    renderViewContent(mainContentElement, currentView, { //
      currentUser,
      currentlyPlaying,
      recentlyPlayed,
      userPlaylists,
      searchResults,
      playlistDetails
    });
    // Re-apply responsive layout in case elements changed
    initialResponsiveLayoutSetup(currentView);
  }
}

function setCurrentView(viewName) { //
  currentView = viewName; //
  searchResults = null; // Clear search results when changing views
  // playlistDetails = null; // Clear playlist details if not viewing a playlist
  if (viewName !== 'playlist-detail') {
    playlistDetails = null;
  }
  renderApp(); // Re-render the whole dashboard for simplicity, or just the content + nav highlighting
}

async function handleSearch(query) { //
    try {
        searchResults = await performSpotifySearch(query); //
        currentView = 'search'; // Ensure view is search
        renderApp(); // Re-render to show results
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการค้นหา:', error); //
        showNotification('เกิดข้อผิดพลาดในการค้นหา: ' + error.message, 'error');
        searchResults = { error: true }; // Indicate error to UI
        renderApp();
    }
}

async function loadPlaylistDetails(playlistId) { //
    try {
        const playlist = await getPlaylistDetails(playlistId); //
        const tracksData = await getPlaylistTracks(playlistId); //
        playlistDetails = { playlist, tracks: tracksData }; //
        setCurrentView('playlist-detail'); //
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการโหลดเพลย์ลิสต์:', error); //
        showNotification('เกิดข้อผิดพลาดในการโหลดเพลย์ลิสต์: ' + error.message, 'error');
    }
}

function handleLogout() {
    logout(); // from auth.js
    currentUser = null;
    currentlyPlaying = null;
    recentlyPlayed = [];
    userPlaylists = [];
    currentView = 'login'; // Or 'home' which will redirect to login if no token
    searchResults = null;
    playlistDetails = null;
    renderApp();
    showNotification('ออกจากระบบเรียบร้อยแล้ว');
}


async function initializeApp() {
  initializeTheme(); //
  initializeUICallbacks(setCurrentView, loadPlaylistDetails, handleSearch); //

  const tokenFromCallback = await handleSpotifyCallback(); //

  if (tokenFromCallback || await getValidToken()) { //
    await loadUserData(); //
  } else {
    setCurrentView('login'); // Ensure login view if no token
    renderApp(); //
  }

  // Interval to refresh currently playing song
  setInterval(async () => { //
    if (await getValidToken() && currentUser) { //
      try {
        const newCurrentlyPlaying = await getCurrentlyPlaying(); //
        if (JSON.stringify(newCurrentlyPlaying) !== JSON.stringify(currentlyPlaying)) {
            currentlyPlaying = newCurrentlyPlaying;
            if (currentView === 'home') { //
                 // Only re-render content if on home and it changed
                const mainContentElement = document.getElementById('main-content');
                if (mainContentElement) {
                     renderViewContent(mainContentElement, 'home', { currentlyPlaying, recentlyPlayed, userPlaylists });
                }
            }
        }
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการอัพเดตเพลงที่กำลังเล่น:', error); //
        if (error.message.includes('Token หมดอายุ')) {
            handleLogout();
        }
      }
    }
  }, 30000); //

  window.addEventListener('resize', () => initialResponsiveLayoutSetup(currentView)); //
  // Initial call for responsive layout
  initialResponsiveLayoutSetup(currentView);
}

// Start the app
document.addEventListener('DOMContentLoaded', initializeApp);