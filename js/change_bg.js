function changeBanner() {
  var schema = document.documentElement.getAttribute('data-user-color-scheme');
  // 抓取背景區塊
  var banner = document.querySelector('.banner-bg') || document.querySelector('#banner') || document.querySelector('.header-inner');
  
  // 抓取文字區塊 (Fluid 主題的首頁大標題通常在這個位置)
  var bannerTitle = document.querySelector('.index-header .h2') || document.querySelector('.banner-text') || document.querySelector('#subtitle');

  if (banner) {
    banner.style.transition = "background-image 0.5s ease-in-out, background 0.5s ease-in-out";
    
    // --- 判斷早晚模式 ---
    if (schema === 'dark') {
      /* 🌙 這裡改夜晚的設定 */
      banner.style.backgroundImage = "url('/bg/dn.png')";
      if (bannerTitle) {
        bannerTitle.innerText = "月下的楓德爾格：靜謐荒野中的不滅火光";
      }
    } else {
      /* ☀️ 這裡改白天的設定 */
      banner.style.backgroundImage = "url('/bg/mo.png')";
      if (bannerTitle) {
        bannerTitle.innerText = "楓德爾格：築夢者的清晨，開拓者的起點";
      }
    }
  }
}

// 監聽載入與點擊 (這部分與原本相同)
document.addEventListener("DOMContentLoaded", function() {
  setTimeout(changeBanner, 100); // 稍微延遲確保主題載入完成

  var btn = document.querySelector('#color-toggle-btn');
  if (btn) {
    btn.addEventListener('click', function() {
      setTimeout(changeBanner, 50);
    });
  }
});