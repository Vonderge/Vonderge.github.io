/**
 * Hexo Fluid 背景隨機預加載腳本
 * 功能：隨機背景預加載、日/夜模式切換、打字機效果
 */

// 圖片組配置
const bgPairs = [
  { day: "url('/bg/mo.png')", night: "url('/bg/dn.png')" },
  { day: "url('/bg/mo2.png')", night: "url('/bg/dn2.png')" },
];

let currentIdx = 0;
let bgTimeout = null;
window.isClickPending = false; // 暴露到全局，讓 color-schema.js 可訪問

// 隨機抽取背景索引
function pickRandomIndex() {
  const totalSets = bgPairs.length;
  return totalSets <= 1 ? 0 : Math.floor(Math.random() * totalSets);
}

// 設置 CSS 變數
function setBgVariable(type, value) {
  document.documentElement.style.setProperty(`--${type}-bg`, value);
}

// 打字機動畫效果
function typeWriter(element, text) {
  if (!element) return;
  
  if (element.getAttribute('data-current-text') === text) {
    element.classList.add('js-typed');
    return;
  }
  
  element.setAttribute('data-current-text', text);
  element.innerHTML = '';
  element.classList.add('js-typed');
  
  const letters = text.split('');
  letters.forEach((char, i) => {
    const span = document.createElement('span');
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.className = 'letter';
    span.style.animationDelay = `${i * 0.05}s`;
    element.appendChild(span);
  });
}

// 更新標題文字
function updateBannerText() {
  const schema = document.documentElement.getAttribute('data-user-color-scheme');
  const bannerTitle = document.querySelector('.index-header .h2') || 
                      document.querySelector('.banner-text') || 
                      document.querySelector('#subtitle');
  
  if (!bannerTitle) return;
  
  if (!bannerTitle.hasAttribute('data-orig-text')) {
    bannerTitle.setAttribute('data-orig-text', bannerTitle.innerText.trim());
  }
  
  const isHomePage = window.location.pathname === '/' || window.location.pathname === '/index.html';
  const targetText = isHomePage 
    ? (schema === 'dark' ? '月下的楓德爾格：靜謐荒野中的不滅火光' : '楓德爾格：築夢者的清晨，開拓者的起點')
    : bannerTitle.getAttribute('data-orig-text');
  
  typeWriter(bannerTitle, targetText);
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
  const btn = document.querySelector('#color-toggle-btn');
  const banners = document.querySelectorAll('.banner, .banner-bg, #banner, .header-inner');

  // 恢復過渡效果
  document.documentElement.setAttribute('data-page-loaded', '');

  // 初始化背景
  currentIdx = Math.floor(Math.random() * bgPairs.length);
  setBgVariable('day', bgPairs[currentIdx].day);
  setBgVariable('night', bgPairs[currentIdx].night);

  // 應用初始主題 - 立即應用，不需延遲
  const initSchema = document.documentElement.getAttribute('data-user-color-scheme');
  if (initSchema === 'dark') {
    banners.forEach(el => el.classList.add('is-dark-fade'));
  }
  updateBannerText();

  if (!btn) return;

  // 點擊切換事件
  btn.addEventListener('click', function() {
    // 防止多次快速切換
    if (window.isClickPending) return;
    window.isClickPending = true;

    // 禁用按鈕，防止圖標在背景未改變時就改變
    btn.disabled = true;

    if (bgTimeout) {
      clearTimeout(bgTimeout);
      bgTimeout = null;
    }

    setTimeout(() => {
      const newSchema = document.documentElement.getAttribute('data-user-color-scheme');

      if (newSchema === 'dark') {
        banners.forEach(el => el.classList.add('is-dark-fade'));
        currentIdx = pickRandomIndex();
        bgTimeout = setTimeout(() => {
          setBgVariable('day', bgPairs[currentIdx].day);
          window.isClickPending = false;
          btn.disabled = false;
        }, 850);
      } else {
        banners.forEach(el => el.classList.remove('is-dark-fade'));
        bgTimeout = setTimeout(() => {
          setBgVariable('night', bgPairs[currentIdx].night);
          window.isClickPending = false;
          btn.disabled = false;
        }, 850);
      }
    }, 50);

    setTimeout(updateBannerText, 50);

    // 安全鎖：2秒後強制解除，防止永久鎖死
    setTimeout(() => { 
      window.isClickPending = false; 
      btn.disabled = false;
    }, 2000);
  });
});