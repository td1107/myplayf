// utils.js

/**
 * ฟังก์ชันสร้างสตริงแบบสุ่มสำหรับ state parameter
 * @param {number} length ความยาวของสตริงที่ต้องการ
 * @returns {string} สตริงที่สุ่มได้
 */
export function generateRandomString(length) { //
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; //
  let text = ''; //
  for (let i = 0; i < length; i++) { //
    text += possible.charAt(Math.floor(Math.random() * possible.length)); //
  }
  return text; //
}

/**
 * ฟังก์ชันแปลงมิลลิวินาทีเป็นนาทีและวินาที
 * @param {number} ms จำนวนมิลลิวินาที
 * @returns {string} สตริงในรูปแบบ "นาที:วินาที"
 */
export function formatDuration(ms) { //
  const minutes = Math.floor(ms / 60000); //
  const seconds = Math.floor((ms % 60000) / 1000); //
  return `${minutes}:${seconds.toString().padStart(2, '0')}`; //
}

/**
 * ฟังก์ชันแปลงมิลลิวินาทีเป็นชั่วโมง นาที
 * @param {number} ms จำนวนมิลลิวินาที
 * @returns {string} สตริงในรูปแบบ "X ชั่วโมง Y นาที" หรือ "Y นาที"
 */
export function formatDurationLong(ms) { //
  const minutes = Math.floor((ms / 60000) % 60); //
  const hours = Math.floor(ms / 3600000); //
  if (hours > 0) { //
    return `${hours} ชั่วโมง ${minutes} นาที`; //
  } else {
    return `${minutes} นาที`; //
  }
}

/**
 * ฟังก์ชันสำหรับแปลงเวลา ISO เป็น format ที่อ่านง่าย
 * @param {string} timestamp เวลาในรูปแบบ ISO
 * @returns {string} สตริงเวลาที่อ่านง่าย
 */
export function formatRelativeTime(timestamp) { //
  const now = new Date(); //
  const date = new Date(timestamp); //
  const diffSeconds = Math.floor((now - date) / 1000); //

  if (diffSeconds < 60) { //
    return 'เมื่อสักครู่'; //
  } else if (diffSeconds < 3600) { //
    const minutes = Math.floor(diffSeconds / 60); //
    return `${minutes} นาทีที่แล้ว`; //
  } else if (diffSeconds < 86400) { //
    const hours = Math.floor(diffSeconds / 3600); //
    return `${hours} ชั่วโมงที่แล้ว`; //
  } else if (diffSeconds < 2592000) { //
    const days = Math.floor(diffSeconds / 86400); //
    return `${days} วันที่แล้ว`; //
  } else {
    return date.toLocaleDateString(undefined, { //
      year: 'numeric', //
      month: 'short', //
      day: 'numeric' //
    });
  }
}

/**
 * ฟังก์ชันสำหรับแสดงข้อความแจ้งเตือน
 * @param {string} message ข้อความที่ต้องการแสดง
 * @param {string} type ประเภทการแจ้งเตือน ('info' หรือ 'error')
 */
export function showNotification(message, type = 'info') { //
  const notification = document.createElement('div'); //
  notification.className = `fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${ //
    type === 'error' ? 'bg-red-500' : 'bg-green-500' //
  } text-white`; //
  notification.textContent = message; //
  document.body.appendChild(notification); //
  setTimeout(() => { //
    notification.classList.add('opacity-0', 'transition-opacity', 'duration-500'); //
    setTimeout(() => { //
      document.body.removeChild(notification); //
    }, 500);
  }, 3000);
}