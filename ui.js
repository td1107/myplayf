// ui.js
import { formatDuration, formatDurationLong, formatRelativeTime, showNotification } from './utils.js'; //
import { loginWithSpotify, logout } from './auth.js'; //
// Import searchSpotify from api.js if search functionality is directly tied to UI events here
// import { searchSpotify } from './api.js';

// State (currentView) and data (currentUser, etc.) should ideally be passed from app.js
// For simplicity in this example, some might still reference them if app.js makes them available globally
// or if ui.js exports functions that app.js calls with the necessary state.

let setCurrentViewCallback; // Callback to app.js to change view
let loadPlaylistDetailsCallback; // Callback to app.js to load playlist details
let searchSpotifyCallback; // Callback to app.js to perform search

// ui.js
export function setupResponsiveLayout() {
    console.log("Responsive layout initialized.");
}


export function initializeUICallbacks(setCurrentViewFunc, loadPlaylistDetailsFunc, searchFunc) {
    setCurrentViewCallback = setCurrentViewFunc;
    loadPlaylistDetailsCallback = loadPlaylistDetailsFunc;
    searchSpotifyCallback = searchFunc;
}

export function renderLoginScreen(appElement) { //
  appElement.innerHTML = `
    <div class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black to-green-900 text-white p-6">
      <div class="bg-black bg-opacity-70 rounded-xl p-8 shadow-2xl max-w-md w-full flex flex-col items-center">
        <div class="mb-8 text-center">
          <h1 class="text-4xl font-bold mb-2">MyPlayF</h1>
          <p class="text-gray-300">ดูข้อมูลการฟังเพลงและเพลย์ลิสต์ของคุณ</p>
        </div>
        <div class="rounded-lg mb-8 w-full h-48 bg-gray-800 flex items-center justify-center">
          <svg class="w-24 h-24 text-green-500" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512">
            <path d="M248 8C111.1 8 0 119.1 0 256s111.1 248 248 248 248-111.1 248-248S384.9 8 248 8zm100.7 364.9c-4.2 0-6.8-1.3-10.7-3.6-62.4-37.6-135-39.2-206.7-24.5-3.9 1-9 2.6-11.9 2.6-9.7 0-15.8-7.7-15.8-15.8 0-10.3 6.1-15.2 13.6-16.8 81.9-18.1 165.6-16.5 237 26.2 6.1 3.9 9.7 7.4 9.7 16.5s-7.1 15.4-15.2 15.4zm26.9-65.6c-5.2 0-8.7-2.3-12.3-4.2-62.5-37-155.7-51.9-238.6-29.4-4.8 1.3-7.4 2.6-11.9 2.6-10.7 0-19.4-8.7-19.4-19.4s5.2-17.8 15.5-20.7c27.8-7.8 56.2-13.6 97.8-13.6 64.9 0 127.6 16.1 177 45.5 8.1 4.8 11.3 11 11.3 19.7-.1 10.8-8.5 19.5-19.4 19.5zm31-76.2c-5.2 0-8.4-1.3-12.9-3.9-71.2-42.5-198.5-52.7-280.9-29.7-3.6 1-8.1 2.6-12.9 2.6-13.2 0-23.3-10.3-23.3-23.6 0-13.6 8.4-21.3 17.4-23.9 35.2-10.3 74.6-15.2 117.5-15.2 73 0 149.5 15.2 205.4 47.8 7.8 4.5 12.9 10.7 12.9 22.6 0 13.6-11 23.3-23.2 23.3z"/>
          </svg>
        </div>
        <button id="login-button" class="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full flex items-center justify-center w-full transition duration-300">
          <span class="mr-2">เข้าสู่ระบบด้วย Spotify</span>
        </button>
        <p class="mt-6 text-sm text-gray-400 text-center">
          เข้าถึงประวัติการฟังเพลง เพลย์ลิสต์ และอื่นๆ อีกมากมาย
        </p>
      </div>
    </div>
  `;
  document.getElementById('login-button').addEventListener('click', loginWithSpotify); //
}

export function renderDashboardLayout(appElement, currentUser, currentView) { //
  appElement.innerHTML = `
    <div class="flex h-screen bg-gray-900 text-white">
      <div class="w-64 bg-black flex-col sidebar"> <div class="p-6">
          <h1 class="text-xl font-bold">MyPlayF</h1>
        </div>
        <nav class="flex-1">
          <ul>
            <li id="nav-home" class="flex items-center px-6 py-3 ${currentView === 'home' ? 'bg-gray-800' : 'hover:bg-gray-800'} cursor-pointer">
              <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
              <span>หน้าหลัก</span>
            </li>
            <li id="nav-search" class="flex items-center px-6 py-3 ${currentView === 'search' ? 'bg-gray-800' : 'hover:bg-gray-800'} cursor-pointer">
               <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path></svg>
              <span>ค้นหา</span>
            </li>
            <li id="nav-recent" class="flex items-center px-6 py-3 ${currentView === 'recent' ? 'bg-gray-800' : 'hover:bg-gray-800'} cursor-pointer">
              <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path></svg>
              <span>เพลงที่ฟังล่าสุด</span>
            </li>
            <li id="nav-playlists" class="flex items-center px-6 py-3 ${currentView === 'playlists' ? 'bg-gray-800' : 'hover:bg-gray-800'} cursor-pointer">
              <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path></svg>
              <span>เพลย์ลิสต์</span>
            </li>
            <li id="nav-profile" class="flex items-center px-6 py-3 ${currentView === 'profile' ? 'bg-gray-800' : 'hover:bg-gray-800'} cursor-pointer">
              <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
              <span>โปรไฟล์</span>
            </li>
          </ul>
        </nav>
        <div class="p-4">
          <div class="bg-gray-800 rounded-lg p-3 flex items-center">
            <img src="${currentUser?.images?.[0]?.url || '/placeholder.png'}" alt="Profile" class="w-8 h-8 rounded-full mr-2">
            <span class="text-sm">${currentUser?.display_name || 'ผู้ใช้ Spotify'}</span>
          </div>
        </div>
      </div>
      <div class="flex-1 overflow-auto main-content"> <header class="bg-gray-800 bg-opacity-90 p-4 sticky top-0 z-10 flex justify-between items-center">
          <div class="flex items-center">
            <h2 class="text-2xl font-bold">
              ${ currentView === 'home' ? 'หน้าหลัก' :
                 currentView === 'search' ? 'ค้นหา' :
                 currentView === 'recent' ? 'เพลงที่ฟังล่าสุด' :
                 currentView === 'playlists' ? 'เพลย์ลิสต์' :
                 currentView === 'profile' ? 'โปรไฟล์' :
                 currentView === 'playlist-detail' ? 'รายละเอียดเพลย์ลิสต์' : ''
              }
            </h2>
          </div>
        </header>
        <main id="main-content" class="p-6">
          </main>
      </div>
    </div>
  `;

  document.getElementById('nav-home').addEventListener('click', () => setCurrentViewCallback('home')); //
  document.getElementById('nav-search').addEventListener('click', () => setCurrentViewCallback('search')); //
  document.getElementById('nav-recent').addEventListener('click', () => setCurrentViewCallback('recent')); //
  document.getElementById('nav-playlists').addEventListener('click', () => setCurrentViewCallback('playlists')); //
  document.getElementById('nav-profile').addEventListener('click', () => setCurrentViewCallback('profile')); //

  setupResponsiveLayout(currentView); //
}

export function renderViewContent(mainContentElement, view, data) { //
  // data contains { currentUser, currentlyPlaying, recentlyPlayed, userPlaylists, searchResults, playlistDetails }
  switch (view) {
    case 'home':
      renderHomeView(mainContentElement, data.currentlyPlaying, data.recentlyPlayed, data.userPlaylists); //
      break;
    case 'search':
      renderSearchView(mainContentElement, data.searchResults); //
      break;
    case 'recent':
      renderRecentView(mainContentElement, data.recentlyPlayed); //
      break;
    case 'playlists':
      renderPlaylistsView(mainContentElement, data.userPlaylists); //
      break;
    case 'playlist-detail':
      if (data.playlistDetails) {
        renderPlaylistDetailsView(mainContentElement, data.playlistDetails.playlist, data.playlistDetails.tracks); //
      }
      break;
    case 'profile':
      renderProfileView(mainContentElement, data.currentUser, data.userPlaylists); //
      break;
    default:
      mainContentElement.innerHTML = '<p>Page not found</p>';
  }
}


function renderHomeView(container, currentlyPlaying, recentlyPlayed, userPlaylists) { //
  let currentlyPlayingHTML = ''; //
  if (currentlyPlaying?.item) { //
    const track = currentlyPlaying.item; //
    const progress = (currentlyPlaying.progress_ms / track.duration_ms) * 100; //
    currentlyPlayingHTML = `
      <section class="mb-8">
        <h3 class="text-xl font-bold mb-4">เพลงที่กำลังเล่น</h3>
        <div class="bg-gray-800 rounded-lg p-4 flex items-center">
          <img src="${track.album.images[0].url}" alt="Album cover" class="w-20 h-20 mr-4 rounded">
          <div class="flex-1">
            <h4 class="font-bold">${track.name}</h4>
            <p class="text-gray-400">${track.artists.map(a => a.name).join(', ')}</p>
            <div class="mt-2">
              <div class="h-1 bg-gray-600 rounded-full w-full mt-2">
                <div class="h-1 bg-green-500 rounded-full" style="width: ${progress}%"></div>
              </div>
            </div>
          </div>
          </div>
      </section>
    `;
  }

  let recentlyPlayedHTML = ''; //
  if (recentlyPlayed && recentlyPlayed.length > 0) { //
    const recentItems = recentlyPlayed.slice(0, 4).map(item => { //
      const track = item.track; //
      return `
        <div class="bg-gray-800 rounded-lg p-4 flex items-center hover:bg-gray-700 cursor-pointer">
          <img src="${track.album.images[0].url}" alt="Album cover" class="w-12 h-12 mr-4 rounded">
          <div class="flex-1">
            <h4 class="font-bold">${track.name}</h4>
            <p class="text-gray-400 text-sm">${track.artists.map(a => a.name).join(', ')}</p>
          </div>
          <div class="text-gray-400 text-sm">${formatDuration(track.duration_ms)}</div>
        </div>
      `;
    }).join(''); //
    recentlyPlayedHTML = `
      <section class="mb-8">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold">เพลงที่ฟังล่าสุด</h3>
          <a href="#" id="view-all-recent" class="text-green-500 hover:text-green-400">ดูทั้งหมด</a>
        </div>
        <div class="grid grid-cols-1 gap-4">${recentItems}</div>
      </section>
    `;
  }

  let playlistsHTML = ''; //
  if (userPlaylists && userPlaylists.length > 0) { //
    const playlistItems = userPlaylists.slice(0, 6).map(playlist => { //
      return `
        <div class="bg-gray-800 rounded-lg p-4 flex flex-col hover:bg-gray-700 cursor-pointer playlist-item" data-id="${playlist.id}">
          <img src="${playlist.images[0]?.url || '/placeholder.png'}" alt="Playlist cover" class="w-full h-40 object-cover rounded-md mb-3">
          <h4 class="font-bold truncate">${playlist.name}</h4>
          <p class="text-gray-400 text-sm">${playlist.tracks.total} เพลง</p>
        </div>
      `;
    }).join(''); //
    playlistsHTML = `
      <section>
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold">เพลย์ลิสต์ของคุณ</h3>
          <a href="#" id="view-all-playlists" class="text-green-500 hover:text-green-400">ดูทั้งหมด</a>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">${playlistItems}</div>
      </section>
    `;
  }
  container.innerHTML = `<div class="pb-8">${currentlyPlayingHTML}${recentlyPlayedHTML}${renderListeningStats(recentlyPlayed)}${playlistsHTML}</div>`; //

  document.getElementById('view-all-recent')?.addEventListener('click', (e) => { e.preventDefault(); setCurrentViewCallback('recent'); }); //
  document.getElementById('view-all-playlists')?.addEventListener('click', (e) => { e.preventDefault(); setCurrentViewCallback('playlists'); }); //
  document.querySelectorAll('.playlist-item').forEach(item => { //
    item.addEventListener('click', () => { loadPlaylistDetailsCallback(item.getAttribute('data-id')); }); //
  });
}

function renderSearchView(container, searchResultsData) { //
  container.innerHTML = `
    <div class="mb-6">
      <div class="relative">
        <input type="text" id="search-input" placeholder="ค้นหาเพลง ศิลปิน หรืออัลบั้ม" class="w-full bg-gray-800 text-white rounded-full py-3 px-6 pl-12 focus:outline-none focus:ring-2 focus:ring-green-500">
        <svg class="w-5 h-5 text-gray-400 absolute left-4 top-3.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path></svg>
      </div>
    </div>
    <div id="search-results-container" class="mt-6">
      </div>
  `;

  const searchInput = document.getElementById('search-input'); //
  const searchResultsContainer = document.getElementById('search-results-container'); //
  let searchTimeout; //

  if (searchResultsData) {
    renderSearchResultsContent(searchResultsContainer, searchResultsData);
  } else {
     searchResultsContainer.innerHTML = `
      <div class="text-center text-gray-400 py-12">
        <svg class="w-16 h-16 mx-auto text-gray-500 mb-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path></svg>
        <h3 class="text-xl font-bold mb-2">ค้นหาเพลง ศิลปิน หรืออัลบั้ม</h3>
        <p>ผลการค้นหาจะแสดงที่นี่</p>
      </div>`; //
  }

  searchInput.addEventListener('input', () => { //
    clearTimeout(searchTimeout); //
    searchTimeout = setTimeout(() => { //
      const query = searchInput.value.trim(); //
      if (query) { //
        searchSpotifyCallback(query); // This will trigger search and re-render via app.js
      } else {
         renderSearchResultsContent(searchResultsContainer, null); // Clear results or show initial message
      }
    }, 500); //
  });
}

function renderSearchResultsContent(container, results) { //
  if (!results) {
    container.innerHTML = `
      <div class="text-center text-gray-400 py-12">
        <svg class="w-16 h-16 mx-auto text-gray-500 mb-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path></svg>
        <h3 class="text-xl font-bold mb-2">ค้นหาเพลง ศิลปิน หรืออัลบั้ม</h3>
        <p>ผลการค้นหาจะแสดงที่นี่</p>
      </div>`;
    return;
  }
  let html = ''; //
  if (results.tracks && results.tracks.items.length > 0) { //
    html += `<section class="mb-8"><h3 class="text-xl font-bold mb-4">เพลง</h3><div class="grid grid-cols-1 gap-2">`; //
    results.tracks.items.forEach(track => { //
      html += `
        <div class="bg-gray-800 rounded-lg p-3 flex items-center hover:bg-gray-700 cursor-pointer">
          <img src="${track.album.images[0]?.url || '/placeholder.png'}" alt="Album cover" class="w-12 h-12 mr-4 rounded">
          <div class="flex-1">
            <h4 class="font-bold">${track.name}</h4>
            <p class="text-gray-400 text-sm">${track.artists.map(a => a.name).join(', ')}</p>
          </div>
          <div class="text-gray-400 text-sm">${formatDuration(track.duration_ms)}</div>
        </div>
      `;
    });
    html += `</div></section>`; //
  }
  // ... (similar for artists and albums) ...
   if (results.artists && results.artists.items.length > 0) { //
    html += `
      <section class="mb-8">
        <h3 class="text-xl font-bold mb-4">ศิลปิน</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
    `; //
    results.artists.items.forEach(artist => { //
      const image = artist.images[0]?.url || '/placeholder.png'; //
      html += `
        <div class="bg-gray-800 rounded-lg p-4 flex flex-col items-center hover:bg-gray-700 cursor-pointer">
          <img src="${image}" alt="Artist" class="w-24 h-24 rounded-full mb-3">
          <h4 class="font-bold text-center">${artist.name}</h4>
          <p class="text-gray-400 text-sm">ศิลปิน</p>
        </div>
      `;
    });
    html += `</div></section>`; //
  }

  if (results.albums && results.albums.items.length > 0) { //
    html += `
      <section class="mb-8">
        <h3 class="text-xl font-bold mb-4">อัลบั้ม</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
    `; //
    results.albums.items.forEach(album => { //
      html += `
        <div class="bg-gray-800 rounded-lg p-4 flex flex-col hover:bg-gray-700 cursor-pointer">
          <img src="${album.images[0]?.url || '/placeholder.png'}" alt="Album cover" class="w-full aspect-square object-cover rounded-md mb-3">
          <h4 class="font-bold truncate">${album.name}</h4>
          <p class="text-gray-400 text-sm truncate">${album.artists.map(a => a.name).join(', ')}</p>
        </div>
      `;
    });
    html += `</div></section>`; //
  }


  if (html === '') { //
    html = `
      <div class="text-center text-gray-400 py-12">
        <h3 class="text-xl font-bold mb-2">ไม่พบผลลัพธ์</h3>
        <p>ลองค้นหาด้วยคำอื่น</p>
      </div>
    `; //
  }
  container.innerHTML = html; //
}

function renderRecentView(container, recentlyPlayed) { //
  if (!recentlyPlayed || recentlyPlayed.length === 0) { //
    container.innerHTML = `
      <div class="text-center text-gray-400 py-12">
        <h3 class="text-xl font-bold mb-2">ยังไม่มีประวัติการฟังเพลง</h3>
        <p>เล่นเพลงใน Spotify เพื่อดูประวัติการฟังของคุณ</p>
      </div>
    `; //
    return;
  }
  const recentHTML = recentlyPlayed.map(item => { //
    // ... (เหมือนเดิม เพิ่มการ check item.track)
    if (!item.track) return ''; //
    const track = item.track; //
    const playedAt = new Date(item.played_at); //
    // ...
    return `
      <tr class="border-b border-gray-700 hover:bg-gray-800">
        <td class="py-4 px-4 flex items-center">
          <img src="${track.album.images[0]?.url || '/placeholder.png'}" alt="Album cover" class="w-12 h-12 mr-4 rounded">
          <div>
            <h4 class="font-bold">${track.name}</h4>
            <p class="text-gray-400 text-sm">${track.artists.map(a => a.name).join(', ')}</p>
          </div>
        </td>
        <td class="py-4 px-4 text-gray-400">${track.album.name}</td>
        <td class="py-4 px-4 text-gray-400">${formatRelativeTime(item.played_at)}</td>
        <td class="py-4 px-4 text-gray-400">${formatDuration(track.duration_ms)}</td>
      </tr>
    `; //
  }).join(''); //
  container.innerHTML = `
    <div class="flex justify-end mb-4">
        <button id="export-history-button" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            ส่งออกประวัติ (CSV)
        </button>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full text-left">
        <thead>
          <tr class="border-b border-gray-700">
            <th class="py-3 px-4 font-medium">เพลง</th>
            <th class="py-3 px-4 font-medium">อัลบั้ม</th>
            <th class="py-3 px-4 font-medium">ฟังเมื่อ</th>
            <th class="py-3 px-4 font-medium">ระยะเวลา</th>
          </tr>
        </thead>
        <tbody>${recentHTML}</tbody>
      </table>
    </div>
  `; //
  document.getElementById('export-history-button')?.addEventListener('click', () => exportListeningHistory(recentlyPlayed)); //
}


function renderPlaylistsView(container, userPlaylists) { //
  if (!userPlaylists || userPlaylists.length === 0) { //
    container.innerHTML = `
      <div class="text-center text-gray-400 py-12">
        <h3 class="text-xl font-bold mb-2">ยังไม่มีเพลย์ลิสต์</h3>
        <p>สร้างเพลย์ลิสต์ใน Spotify ของคุณ</p>
      </div>
    `; //
    return;
  }
  const playlistItems = userPlaylists.map(playlist => { //
    return `
      <div class="bg-gray-800 rounded-lg p-4 flex items-center hover:bg-gray-700 cursor-pointer playlist-item" data-id="${playlist.id}">
        <img src="${playlist.images[0]?.url || '/placeholder.png'}" alt="Playlist cover" class="w-16 h-16 mr-4 rounded">
        <div class="flex-1">
          <h4 class="font-bold">${playlist.name}</h4>
          <p class="text-gray-400 text-sm">${playlist.tracks.total} เพลง • โดย ${playlist.owner.display_name}</p>
        </div>
      </div>
    `; //
  }).join(''); //
  container.innerHTML = `<div class="grid grid-cols-1 gap-4">${playlistItems}</div>`; //
  document.querySelectorAll('.playlist-item').forEach(item => { //
    item.addEventListener('click', () => { loadPlaylistDetailsCallback(item.getAttribute('data-id')); }); //
  });
}

function renderPlaylistDetailsView(container, playlist, tracksData) { //
    const tracks = tracksData.items || []; //
    const totalTracks = tracks.length; //
    const totalDurationMs = tracks.reduce((total, item) => total + (item.track ? item.track.duration_ms : 0), 0); //
    const formattedTotalDuration = formatDurationLong(totalDurationMs); //

    let tracksHTML = tracks.map((item, index) => { //
        if (!item.track) return ''; //
        const track = item.track; //
        // ... (เหมือนเดิม)
        return `
          <tr class="border-b border-gray-700 hover:bg-gray-800">
            <td class="py-4 px-4 text-gray-400">${index + 1}</td>
            <td class="py-4 px-4 flex items-center">
              <img src="${track.album.images[0]?.url || '/placeholder.png'}" alt="Album cover" class="w-10 h-10 mr-4 rounded">
              <div>
                <h4 class="font-bold">${track.name}</h4>
                <p class="text-gray-400 text-sm">${track.artists.map(a => a.name).join(', ')}</p>
              </div>
            </td>
            <td class="py-4 px-4 text-gray-400">${track.album.name}</td>
            <td class="py-4 px-4 text-gray-400">${formatRelativeTime(item.added_at)}</td>
            <td class="py-4 px-4 text-gray-400">${formatDuration(track.duration_ms)}</td>
          </tr>
        `; //
    }).join(''); //

    container.innerHTML = `
        <div class="mb-6">
          <button id="back-to-playlists" class="flex items-center text-gray-400 hover:text-white">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
            กลับไปยังเพลย์ลิสต์
          </button>
        </div>
        <div class="flex flex-col md:flex-row mb-8">
          <img src="${playlist.images[0]?.url || '/placeholder.png'}" alt="Playlist cover" class="w-48 h-48 rounded-lg shadow-lg mb-4 md:mb-0 md:mr-6">
          <div class="flex flex-col justify-end">
            <p class="text-sm text-gray-400 uppercase">เพลย์ลิสต์</p>
            <h2 class="text-4xl font-bold mt-2 mb-4">${playlist.name}</h2>
            <p class="text-gray-400">${playlist.description || ''}</p>
            <div class="flex items-center mt-2">
              <img src="${playlist.owner.images?.[0]?.url || '/placeholder.png'}" alt="Owner" class="w-8 h-8 rounded-full mr-2">
              <span class="ml-2">${playlist.owner.display_name}</span>
              <span class="mx-2">•</span>
              <span>${totalTracks} เพลง, ${formattedTotalDuration}</span>
            </div>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="border-b border-gray-700">
                <th class="py-3 px-4 font-medium">#</th>
                <th class="py-3 px-4 font-medium">ชื่อ</th>
                <th class="py-3 px-4 font-medium">อัลบั้ม</th>
                <th class="py-3 px-4 font-medium">เพิ่มเมื่อ</th>
                <th class="py-3 px-4 font-medium">เวลา</th>
              </tr>
            </thead>
            <tbody>${tracksHTML}</tbody>
          </table>
        </div>
    `; //
    document.getElementById('back-to-playlists').addEventListener('click', () => setCurrentViewCallback('playlists')); //
}


function renderProfileView(container, currentUser, userPlaylists = []) { //
  if (!currentUser) { //
    container.innerHTML = `<div class="text-center text-gray-400 py-12"><h3 class="text-xl font-bold mb-2">ไม่สามารถโหลดข้อมูลโปรไฟล์</h3><p>โปรดลองรีเฟรชหน้าและล็อกอินใหม่</p></div>`; //
    return;
  }
  const profileImage = currentUser.images?.[0]?.url || '/placeholder.png'; //
  container.innerHTML = `
    <div class="flex flex-col items-center mb-8">
      <img src="${profileImage}" alt="Profile image" class="w-32 h-32 rounded-full mb-4">
      <h2 class="text-2xl font-bold">${currentUser.display_name || 'ผู้ใช้ Spotify'}</h2>
      <p class="text-gray-400">${currentUser.email || 'ไม่มีข้อมูลอีเมล'}</p>
      <div class="mt-4 flex items-center space-x-2">
        <div class="bg-gray-800 rounded-lg py-2 px-4"><p class="text-sm text-gray-400">ผู้ติดตาม</p><p class="font-bold">${currentUser.followers?.total || 0}</p></div>
        <div class="bg-gray-800 rounded-lg py-2 px-4"><p class="text-sm text-gray-400">เพลย์ลิสต์</p><p class="font-bold">${userPlaylists.length}</p></div>
      </div>
    </div>
    <div class="bg-gray-800 rounded-lg p-6 mb-8">
      <h3 class="text-xl font-bold mb-4">ข้อมูลบัญชี</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><p class="text-sm text-gray-400">ชื่อผู้ใช้</p><p class="font-bold">${currentUser.id}</p></div>
        <div><p class="text-sm text-gray-400">อีเมล</p><p class="font-bold">${currentUser.email || 'ไม่มีข้อมูล'}</p></div>
        <div><p class="text-sm text-gray-400">ประเทศ</p><p class="font-bold">${currentUser.country || 'ไม่มีข้อมูล'}</p></div>
        <div><p class="text-sm text-gray-400">ประเภทบัญชี</p><p class="font-bold">${currentUser.product ? (currentUser.product === 'premium' ? 'พรีเมียม' : 'ฟรี') : 'ไม่มีข้อมูล'}</p></div>
      </div>
    </div>
     <div class="bg-gray-800 rounded-lg p-6 mb-8">
        <h3 class="text-xl font-bold mb-4">การตั้งค่าธีม</h3>
        <div class="flex space-x-2">
            <button data-theme="dark" class="theme-button bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded">Dark</button>
            <button data-theme="light" class="theme-button bg-gray-200 hover:bg-gray-300 text-black py-2 px-4 rounded">Light</button>
            <button data-theme="blue" class="theme-button bg-blue-700 hover:bg-blue-600 text-white py-2 px-4 rounded">Blue</button>
        </div>
    </div>
    <div class="mb-8">
      <button id="logout-button" class="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full transition duration-300">ออกจากระบบ</button>
    </div>
  `; //
  document.getElementById('logout-button').addEventListener('click', () => { //
      logout(); //
      setCurrentViewCallback('login'); // Or trigger a full app reload via app.js
  });
  document.querySelectorAll('.theme-button').forEach(button => { //
      button.addEventListener('click', (e) => applyTheme(e.target.dataset.theme)); //
  });
}

export function applyTheme(theme) { //
  localStorage.setItem('app_theme', theme); //
  const root = document.documentElement; //
  // Define your themes here or in CSS variables
  if (theme === 'dark') { //
    root.style.setProperty('--bg-primary', '#121212'); root.style.setProperty('--text-primary', '#ffffff'); //
    // ... other dark theme vars
  } else if (theme === 'light') { //
    root.style.setProperty('--bg-primary', '#f8f8f8'); root.style.setProperty('--text-primary', '#121212'); //
    // ... other light theme vars
  } else if (theme === 'blue') { //
    root.style.setProperty('--bg-primary', '#0a192f'); root.style.setProperty('--text-primary', '#e6f1ff'); //
    // ... other blue theme vars
  }
   // Example: Change body background and text color directly for simplicity
   // A more robust solution uses CSS variables for all color aspects.
   if (theme === 'light') {
    document.body.classList.add('light-theme');
    document.body.classList.remove('dark-theme', 'blue-theme');
   } else if (theme === 'blue') {
    document.body.classList.add('blue-theme');
    document.body.classList.remove('dark-theme', 'light-theme');
   } else { // dark is default
    document.body.classList.add('dark-theme');
    document.body.classList.remove('light-theme', 'blue-theme');
   }
}

export function initializeTheme() { //
  const savedTheme = localStorage.getItem('app_theme') || 'dark'; //
  applyTheme(savedTheme); //
}

function setupMobileLayout(currentView) { //
  const isMobile = window.innerWidth < 768; //
  const sidebarElement = document.querySelector('.sidebar'); //
  const mainContentElement = document.querySelector('.main-content'); //
  let bottomNavElement = document.getElementById('bottom-nav'); //

  if (isMobile) { //
    if (sidebarElement) sidebarElement.style.display = 'none'; //
    if (mainContentElement) mainContentElement.style.paddingBottom = '60px'; //

    if (!bottomNavElement) { //
      bottomNavElement = document.createElement('div'); //
      bottomNavElement.id = 'bottom-nav'; //
      bottomNavElement.className = 'fixed bottom-0 left-0 right-0 bg-black flex justify-around items-center py-2 border-t border-gray-800 z-20'; //
      document.body.appendChild(bottomNavElement); //
    }
    bottomNavElement.innerHTML = `
      <button id="mobile-nav-home" class="flex flex-col items-center p-2 ${currentView === 'home' ? 'text-green-500' : 'text-gray-400'}">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
          <span class="text-xs">หน้าหลัก</span>
      </button>
      <button id="mobile-nav-search" class="flex flex-col items-center p-2 ${currentView === 'search' ? 'text-green-500' : 'text-gray-400'}">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path></svg>
          <span class="text-xs">ค้นหา</span>
      </button>
      <button id="mobile-nav-playlists" class="flex flex-col items-center p-2 ${currentView === 'playlists' ? 'text-green-500' : 'text-gray-400'}">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path></svg>
          <span class="text-xs">เพลย์ลิสต์</span>
      </button>
      <button id="mobile-nav-profile" class="flex flex-col items-center p-2 ${currentView === 'profile' ? 'text-green-500' : 'text-gray-400'}">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
          <span class="text-xs">โปรไฟล์</span>
      </button>
    `; //
    document.getElementById('mobile-nav-home').addEventListener('click', () => setCurrentViewCallback('home')); //
    document.getElementById('mobile-nav-search').addEventListener('click', () => setCurrentViewCallback('search')); //
    document.getElementById('mobile-nav-playlists').addEventListener('click', () => setCurrentViewCallback('playlists')); //
    document.getElementById('mobile-nav-profile').addEventListener('click', () => setCurrentViewCallback('profile')); //
  } else {
    if (sidebarElement) sidebarElement.style.display = 'flex'; //
    if (mainContentElement) mainContentElement.style.paddingBottom = '0'; //
    if (bottomNavElement) bottomNavElement.remove(); //
  }
}


function renderListeningStats(recentlyPlayed) { //
  if (!recentlyPlayed || recentlyPlayed.length === 0) { //
    return `
      <div class="bg-gray-800 rounded-lg p-6 mb-6">
        <h3 class="text-xl font-bold mb-4">ข้อมูลการฟังล่าสุด</h3>
        <p class="text-gray-400">ยังไม่มีประวัติการฟังเพลง</p>
      </div>
    `; //
  }
  // ... (logic for artistCounts, genreCounts)
  const artistCounts = {}; //
  const genreCounts = {}; // // Note: Spotify API for recently played doesn't directly provide genres per track in the basic response.
                         // This might require additional API calls or a different approach if genres are crucial.
                         // For now, we'll assume genres might come from album info if available or simplify.

  recentlyPlayed.forEach(item => { //
    if (!item.track) return; //
    item.track.artists.forEach(artist => { //
      artistCounts[artist.id] = artistCounts[artist.id] || { count: 0, name: artist.name }; //
      artistCounts[artist.id].count++; //
    });
    // Genre collection would be more complex as it's usually tied to artist or album, not directly on track item
    // For simplicity, this example might not have rich genre data from /recently-played
  });
  const topArtists = Object.values(artistCounts).sort((a, b) => b.count - a.count).slice(0, 3); //
  // ... (HTML generation for stats)
  return `
    <div class="bg-gray-800 rounded-lg p-6 mb-6">
      <h3 class="text-xl font-bold mb-4">ข้อมูลการฟังล่าสุด</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 class="font-bold mb-2">ศิลปินที่ฟังบ่อย (จาก ${recentlyPlayed.length} เพลงล่าสุด)</h4>
          <ul class="space-y-2">
            ${topArtists.map((artist, index) => `
              <li class="flex items-center">
                <span class="text-green-500 font-bold mr-2">${index + 1}.</span>
                <span>${artist.name}</span>
                <span class="ml-auto text-gray-400">${artist.count} ครั้ง</span>
              </li>
            `).join('') || '<li>ไม่มีข้อมูลศิลปิน</li>'}
          </ul>
        </div>
        </div>
    </div>
  `; //
}

function exportListeningHistory(recentlyPlayed) { //
  if (!recentlyPlayed || recentlyPlayed.length === 0) { //
    showNotification('ไม่มีประวัติการฟังที่จะส่งออก', 'error'); //
    return;
  }
  let csvContent = 'ชื่อเพลง,ศิลปิน,อัลบั้ม,เวลาที่ฟัง\n'; //
  recentlyPlayed.forEach(item => { //
    if (!item.track) return; //
    const trackName = item.track.name.replace(/"/g, '""'); //
    const artists = item.track.artists.map(a => a.name).join(' & ').replace(/"/g, '""'); //
    const album = item.track.album.name.replace(/"/g, '""'); //
    const playedAt = new Date(item.played_at).toLocaleString(); //
    csvContent += `"${trackName}","${artists}","${album}","${playedAt}"\n`; //
  });
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' }); //
  const url = URL.createObjectURL(blob); //
  const link = document.createElement('a'); //
  link.setAttribute('href', url); //
  link.setAttribute('download', `spotify-listening-history-${new Date().toISOString().slice(0, 10)}.csv`); //
  link.style.visibility = 'hidden'; //
  document.body.appendChild(link); //
  link.click(); //
  document.body.removeChild(link); //
  showNotification('ส่งออกประวัติการฟังเรียบร้อยแล้ว'); //
}

// Add this to your CSS or a <style> tag in HTML for theme support
/*
body.light-theme {
    --bg-primary: #f8f8f8; --bg-secondary: #ffffff; --bg-tertiary: #e8e8e8;
    --text-primary: #121212; --text-secondary: #575757;
    --accent: #1db954; --accent-hover: #1ed760;
    background-color: var(--bg-primary);
    color: var(--text-primary);
}
body.dark-theme {
    --bg-primary: #121212; --bg-secondary: #181818; --bg-tertiary: #282828;
    --text-primary: #ffffff; --text-secondary: #b3b3b3;
    --accent: #1db954; --accent-hover: #1ed760;
    background-color: var(--bg-primary);
    color: var(--text-primary);
}
body.blue-theme {
    --bg-primary: #0a192f; --bg-secondary: #112240; --bg-tertiary: #1d3557;
    --text-primary: #e6f1ff; --text-secondary: '#a8b2d1';
    --accent: #64ffda; --accent-hover: '#7effdd';
    background-color: var(--bg-primary);
    color: var(--text-primary);
}
.sidebar { background-color: var(--bg-secondary); }
.main-content header { background-color: var(--bg-tertiary); }
.bg-gray-800 { background-color: var(--bg-tertiary); } // Adjust tailwind mappings or override
.text-white { color: var(--text-primary); }
.text-gray-400 { color: var(--text-secondary); }
.bg-green-500 { background-color: var(--accent); }
.hover\:bg-green-600:hover { background-color: var(--accent-hover); }
*/