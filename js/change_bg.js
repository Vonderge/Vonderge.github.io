// 1. 逐字打出動畫函數
function typeWriter(element, text) {
  if (!element) return;
  element.innerHTML = ""; // 清空舊文字
  
  const letters = text.split("");
  letters.forEach((char, i) => {
    const span = document.createElement("span");
    // 處理空白字元，確保空格正常顯示
    span.textContent = char === " " ? "\u00A0" : char; 
    span.className = "letter";
    // 設定每個字的出現延遲時間 (0.07秒 * 第幾個字)
    span.style.animationDelay = `${i * 0.07}s`; 
    element.appendChild(span);
  });
}

// 2. 切換背景與文字的主函數
function changeBanner() {
  var schema = document.documentElement.getAttribute('data-user-color-scheme');
  
  // 抓取背景區塊 (Fluid 主題常用的幾個標籤)
  var banner = document.querySelector('.banner-bg') || 
               document.querySelector('#banner') || 
               document.querySelector('.header-inner');
  
  // 抓取文字區塊 (首頁大標題)
  var bannerTitle = document.querySelector('.index-header .h2') || 
                    document.querySelector('.banner-text') || 
                    document.querySelector('#subtitle');

  if (banner) {
    // 確保 JS 執行時也帶有過渡效果 (雙重保險)
    banner.style.transition = "background-image 0.5s ease-in-out";

    let targetText = "";

    if (schema === 'dark') {
      /* 🌙 夜晚模式設定 */
      banner.style.backgroundImage = "url('/bg/dn.png')";
      targetText = "月下的楓德爾格：靜謐荒野中的不滅火光";
    } else {
      /* ☀️ 白天模式設定 */
      banner.style.backgroundImage = "url('/bg/mo.png')";
      targetText = "楓德爾格：築夢者的清晨，開拓者的起點";
    }

    // 3. 觸發文字動畫 (只有在文字內容改變時才執行)
    if (bannerTitle && bannerTitle.innerText !== targetText) {
      typeWriter(bannerTitle, targetText);
    }
  }
}

// 4. 監聽事件
document.addEventListener("DOMContentLoaded", function() {
  // 網頁開啟後稍微延遲，等主題初始化完畢再跑
  setTimeout(changeBanner, 300);

  // 監聽右上角的切換按鈕
  var btn = document.querySelector('#color-toggle-btn');
  if (btn) {
    btn.addEventListener('click', function() {
      // 點擊後延遲 100ms，等 data-user-color-scheme 屬性變更後再抓取
      setTimeout(changeBanner, 100);
    });
  }
});