function changeBanner() {
  var schema = document.documentElement.getAttribute('data-user-color-scheme');
  // 抓取 Fluid 主題可能的大圖區塊
  var banner = document.querySelector('.banner-bg') || document.querySelector('#banner') || document.querySelector('.header-inner');
  
  if (banner) {
    // 先設定漸變動畫，0.5s 是時間，你可以改成 0.8s 會更慢更優雅
    banner.style.transition = "background-image 0.5s ease-in-out, background 0.5s ease-in-out";
    
    if (schema === 'dark') {
      banner.style.backgroundImage = "url('/bg/dn.png')";
    } else {
      banner.style.backgroundImage = "url('/bg/mo.png')";
    }
  }
}

// 監聽載入與點擊
document.addEventListener("DOMContentLoaded", function() {
  // 網頁一打開先跑一次，確保圖片跟當前模式對齊
  changeBanner();

  // 監聽 Fluid 的顏色切換按鈕
  var btn = document.querySelector('#color-toggle-btn');
  if (btn) {
    btn.addEventListener('click', function() {
      // 延遲一點點時間，等主題切換完標籤後再執行圖片更換
      setTimeout(changeBanner, 50);
    });
  }
});