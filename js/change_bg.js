function typeWriter(element, text) {
  if (!element) return;
  element.innerHTML = ""; 
  
  const letters = text.split("");
  letters.forEach((char, i) => {
    const span = document.createElement("span");
    span.textContent = char === " " ? "\u00A0" : char; 
    span.className = "letter";
    span.style.animationDelay = `${i * 0.07}s`; 
    element.appendChild(span);
  });
}

function changeBanner() {
  var schema = document.documentElement.getAttribute('data-user-color-scheme');
  var banner = document.querySelector('.banner-bg') || document.querySelector('#banner');
  
  // 嘗試抓取所有可能的標題位置
  var bannerTitle = document.querySelector('.index-header .h2') || 
                    document.querySelector('.banner-text') || 
                    document.querySelector('#subtitle');

  if (banner) {
    let targetText = "";
    if (schema === 'dark') {
      banner.style.backgroundImage = "url('/bg/dn.png')";
      targetText = "月下的楓德爾格：靜謐荒野中的不滅火光";
    } else {
      banner.style.backgroundImage = "url('/bg/mo.png')";
      targetText = "晨曦下的楓德爾格：築夢者的清晨，開拓者的起點";
    }
    
    if (bannerTitle) {
      // 如果文字不同，才觸發動畫
      if (bannerTitle.innerText !== targetText) {
         typeWriter(bannerTitle, targetText);
      }
    } else {
      console.log("錯誤：找不到標題元素！");
    }
  }
}

document.addEventListener("DOMContentLoaded", function() {
  // 給主題一點反應時間，延遲 300ms 執行
  setTimeout(changeBanner, 300);

  var btn = document.querySelector('#color-toggle-btn');
  if (btn) {
    btn.addEventListener('click', function() {
      setTimeout(changeBanner, 100);
    });
  }
});