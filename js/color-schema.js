/* global Fluid */

/**
 * Modified from https://blog.skk.moe/post/hello-darkmode-my-old-friend/
 */
(function(window, document) {
  var rootElement = document.documentElement;
  var colorSchemaStorageKey = 'Fluid_Color_Scheme';
  var timeModeStorageKey = 'Fluid_Time_Mode';
  var colorSchemaMediaQueryKey = '--color-mode';
  var userColorSchemaAttributeName = 'data-user-color-scheme';
  var defaultColorSchemaAttributeName = 'data-default-color-scheme';
  var colorToggleButtonSelector = '#color-toggle-btn';
  var colorToggleIconSelector = '#color-toggle-icon';
  var timeToggleButtonSelector = '#time-toggle-btn';
  var timeToggleIconSelector = '#time-toggle-icon';
  var mobileColorToggleButtonSelector = '#mobile-color-toggle-btn';
  var mobileColorToggleIconSelector = '#mobile-color-toggle-icon';
  var mobileTimeToggleButtonSelector = '#mobile-time-toggle-btn';
  var mobileTimeToggleIconSelector = '#mobile-time-toggle-icon';
  var mobileTimeToggleLabelSelector = '#mobile-time-toggle-label';
  var iframeSelector = 'iframe';

  function setLS(k, v) {
    try {
      localStorage.setItem(k, v);
    } catch (e) {}
  }

  function removeLS(k) {
    try {
      localStorage.removeItem(k);
    } catch (e) {}
  }

  function getLS(k) {
    try {
      return localStorage.getItem(k);
    } catch (e) {
      return null;
    }
  }

  function getSchemaFromHTML() {
    var res = rootElement.getAttribute(defaultColorSchemaAttributeName);
    if (typeof res === 'string') {
      return res.replace(/["'\s]/g, '');
    }
    return null;
  }

  function getSchemaFromCSSMediaQuery() {
    var res = getComputedStyle(rootElement).getPropertyValue(
      colorSchemaMediaQueryKey
    );
    if (typeof res === 'string') {
      return res.replace(/["'\s]/g, '');
    }
    return null;
  }

  function resetSchemaAttributeAndLS() {
    rootElement.setAttribute(userColorSchemaAttributeName, getDefaultColorSchema());
    removeLS(colorSchemaStorageKey);
  }

  var validColorSchemaKeys = {
    dark : true,
    light: true
  };

  function getDefaultColorSchema() {
    // 取默认字段的值
    var schema = getSchemaFromHTML();
    // 如果明确指定了 schema 则返回
    if (validColorSchemaKeys[schema]) {
      return schema;
    }
    // 返回固定的暗色模式，禁用时间自动切换
    return 'dark';
  }

  var validTimeModeKeys = {
    morning: true,
    evening: true
  };

  function isMorningNow() {
    var hour = new Date().getHours();
    return hour >= 6 && hour < 12;
  }

  function getDefaultTimeMode() {
    return isMorningNow() ? 'morning' : 'evening';
  }

  function setTimeButton(mode) {
    var icon = mode === 'morning' ? 'icon-sun' : 'icon-moon';
    var timeIcon = document.querySelector(timeToggleIconSelector);
    if (timeIcon) {
      timeIcon.setAttribute('class', 'iconfont ' + icon);
    }
    var mobileIcon = document.querySelector(mobileTimeToggleIconSelector);
    if (mobileIcon) {
      mobileIcon.setAttribute('class', 'iconfont ' + icon);
    }
    var mobileLabel = document.querySelector(mobileTimeToggleLabelSelector);
    if (mobileLabel) {
      mobileLabel.textContent = mode === 'morning' ? '早' : '晚';
    }
  }

  function applyTimeMode(mode) {
    var current = mode || getLS(timeModeStorageKey) || getDefaultTimeMode();
    if (current === getDefaultTimeMode()) {
      removeLS(timeModeStorageKey);
    } else if (validTimeModeKeys[current]) {
      setLS(timeModeStorageKey, current);
    } else {
      removeLS(timeModeStorageKey);
      current = getDefaultTimeMode();
    }
    var body = document.body;
    rootElement.classList.remove('time-mode-morning', 'time-mode-evening');
    if (body) {
      body.classList.remove('time-mode-morning', 'time-mode-evening');
    }
    rootElement.classList.add('time-mode-' + current);
    if (body) {
      body.classList.add('time-mode-' + current);
    }
    setTimeButton(current);
    
    // Update GIF preloader background based on time mode
    var dayBg = "url('/bg/mo.png')";
    var nightBg = "url('/bg/dn2.png')";
    if (current === 'morning') {
      rootElement.style.setProperty('--day-bg', dayBg);
    } else if (current === 'evening') {
      rootElement.style.setProperty('--day-bg', nightBg);
    }
    
    // Show/recreate preloader to display the new background
    var preloader = document.getElementById('preloader');
    if (!preloader && body) {
      // 如果预加载器不存在，重新创建一个
      preloader = document.createElement('div');
      preloader.id = 'preloader';
      preloader.className = 'preloader';
      preloader.innerHTML = '<img src="/img/loading.gif" alt="Loading" class="preloader-spinner">';
      body.insertBefore(preloader, body.firstChild);
      
      // 显示 2 秒后淡出
      setTimeout(function() {
        if (preloader) {
          preloader.classList.add('preloader--hide');
          setTimeout(function() {
            if (preloader && preloader.parentNode) {
              preloader.parentNode.removeChild(preloader);
            }
          }, 900);
        }
      }, 2000);
    }
  }

  function toggleTimeMode() {
    var currentSetting = getLS(timeModeStorageKey);
    if (validTimeModeKeys[currentSetting]) {
      currentSetting = currentSetting === 'morning' ? 'evening' : 'morning';
    } else {
      currentSetting = getDefaultTimeMode() === 'morning' ? 'evening' : 'morning';
    }
    setLS(timeModeStorageKey, currentSetting);
    return currentSetting;
  }

  function applyCustomColorSchemaSettings(schema) {
    // 接受从「开关」处传来的模式，或者从 localStorage 读取，否则按默认设置值
    var current = schema || getLS(colorSchemaStorageKey) || getDefaultColorSchema();

    if (current === getDefaultColorSchema()) {
      // 当用户切换的显示模式和默认模式相同时，则恢复为自动模式
      resetSchemaAttributeAndLS();
    } else if (validColorSchemaKeys[current]) {
      rootElement.setAttribute(
        userColorSchemaAttributeName,
        current
      );
    } else {
      // 特殊情况重置
      resetSchemaAttributeAndLS();
      return;
    }

    // 根据当前模式设置图标
    setButtonIcon(current);

    // 设置代码高亮
    setHighlightCSS(current);

    // 设置其他应用
    setApplications(current);
  }

  var invertColorSchemaObj = {
    dark : 'light',
    light: 'dark'
  };

  function getIconClass(scheme) {
    return 'icon-' + scheme;
  }

  function toggleCustomColorSchema() {
    var currentSetting = getLS(colorSchemaStorageKey);

    if (validColorSchemaKeys[currentSetting]) {
      // 从 localStorage 中读取模式，并取相反的模式
      currentSetting = invertColorSchemaObj[currentSetting];
    } else if (currentSetting === null) {
      // 当 localStorage 中没有相关值，或者 localStorage 抛了 Error
      // 先按照按钮的状态进行切换
      var iconElement = document.querySelector(colorToggleIconSelector);
      if (iconElement) {
        currentSetting = iconElement.getAttribute('data');
      }
      if (!iconElement || !validColorSchemaKeys[currentSetting]) {
        // 当 localStorage 中没有相关值，或者 localStorage 抛了 Error，则读取默认值并切换到相反的模式
        currentSetting = invertColorSchemaObj[getSchemaFromCSSMediaQuery()];
      }
    } else {
      return;
    }
    // 将相反的模式写入 localStorage
    setLS(colorSchemaStorageKey, currentSetting);

    return currentSetting;
  }

  function setButtonIcon(schema) {
    if (validColorSchemaKeys[schema]) {
      // 切换图标
      var icon = getIconClass('dark');
      if (schema) {
        icon = getIconClass(schema);
      }
      var iconElement = document.querySelector(colorToggleIconSelector);
      if (iconElement) {
        iconElement.setAttribute('class', 'iconfont ' + icon);
        iconElement.setAttribute('data', invertColorSchemaObj[schema]);
      } else {
        Fluid.utils.waitElementLoaded(colorToggleIconSelector, function() {
          var iconElement = document.querySelector(colorToggleIconSelector);
          if (iconElement) {
            iconElement.setAttribute('class', 'iconfont ' + icon);
            iconElement.setAttribute('data', invertColorSchemaObj[schema]);
          }
        });
      }

      // 同步更新移动端按钮文字：light 状态显示"关灯"，dark 状态显示"开灯"
      var mobileBtn = document.querySelector('#mobile-color-toggle-btn');
      if (mobileBtn) {
        var label = document.querySelector('#mobile-color-toggle-label');
        if (label) {
          // schema 是当前模式：light→显示 dark 标签（关灯），dark→显示 light 标签（开灯）
          label.textContent = schema === 'dark'
            ? (mobileBtn.getAttribute('data-label-light') || '')
            : (mobileBtn.getAttribute('data-label-dark') || '');
        }
        // 同步图标
        var mobileIcon = document.querySelector('#mobile-color-toggle-icon');
        if (mobileIcon) {
          mobileIcon.setAttribute('class', 'iconfont ' + icon);
        }
      }

      if (document.documentElement.getAttribute('data-user-color-scheme')) {
        var color = getComputedStyle(document.documentElement).getPropertyValue('--navbar-bg-color').trim();
        document.querySelector('meta[name="theme-color"]').setAttribute('content', color);
      }
    }
  }

  function setHighlightCSS(schema) {
    // 启用对应的代码高亮的样式
    var lightCss = document.getElementById('highlight-css');
    var darkCss = document.getElementById('highlight-css-dark');
    if (schema === 'dark') {
      if (darkCss) {
        darkCss.removeAttribute('disabled');
      }
      if (lightCss) {
        lightCss.setAttribute('disabled', '');
      }
    } else {
      if (lightCss) {
        lightCss.removeAttribute('disabled');
      }
      if (darkCss) {
        darkCss.setAttribute('disabled', '');
      }
    }

    setTimeout(function() {
      // 设置代码块组件样式
      document.querySelectorAll('.markdown-body pre').forEach((pre) => {
        var cls = Fluid.utils.getBackgroundLightness(pre) >= 0 ? 'code-widget-light' : 'code-widget-dark';
        var widget = pre.querySelector('.code-widget-light, .code-widget-dark');
        if (widget) {
          widget.classList.remove('code-widget-light', 'code-widget-dark');
          widget.classList.add(cls);
        }
      });
    }, 200);
  }

  function setApplications(schema) {
    // 设置 remark42 评论主题
    if (window.REMARK42) {
      window.REMARK42.changeTheme(schema);
    }

    // 设置 cusdis 评论主题
    if (window.CUSDIS) {
      window.CUSDIS.setTheme(schema);
    }

    // 设置 utterances 评论主题
    var utterances = document.querySelector('.utterances-frame');
    if (utterances) {
      var utterancesTheme = schema === 'dark' ? window.UtterancesThemeDark : window.UtterancesThemeLight;
      const message = {
        type : 'set-theme',
        theme: utterancesTheme
      };
      utterances.contentWindow.postMessage(message, 'https://utteranc.es');
    }

    // 设置 giscus 评论主题
    var giscus = document.querySelector('iframe.giscus-frame');
    if (giscus) {
      var giscusTheme = schema === 'dark' ? window.GiscusThemeDark : window.GiscusThemeLight;
      const message = {
        setConfig: {
          theme: giscusTheme,
        }
      };
      // giscus.style.cssText += 'color-scheme: normal;';
      giscus.contentWindow.postMessage({ 'giscus': message }, 'https://giscus.app');
    }
  }

  // 当页面加载时，将显示模式设置为 localStorage 中自定义的值（如果有的话）
  applyCustomColorSchemaSettings();
  applyTimeMode();

  Fluid.utils.listenDOMLoaded(function() {
    // 再次刷新按钮状态，确保时间按钮在 DOM 准备后正确显示当前状态
    applyCustomColorSchemaSettings();
    applyTimeMode();

    var button = document.querySelector(colorToggleButtonSelector);
    if (button) {
      button.addEventListener('click', function() {
        if (typeof window.isClickPending !== 'undefined' && window.isClickPending) {
          return;
        }
        applyCustomColorSchemaSettings(toggleCustomColorSchema());
      });

      var icon = document.querySelector(colorToggleIconSelector);
      if (icon) {
        button.addEventListener('mouseenter', function() {
          var current = icon.getAttribute('data');
          icon.classList.replace(getIconClass(invertColorSchemaObj[current]), getIconClass(current));
        });
        button.addEventListener('mouseleave', function() {
          var current = icon.getAttribute('data');
          icon.classList.replace(getIconClass(current), getIconClass(invertColorSchemaObj[current]));
        });
      }
    }

    var mobileButton = document.querySelector('#mobile-color-toggle-btn');
    if (mobileButton) {
      mobileButton.addEventListener('click', function() {
        if (typeof window.isClickPending !== 'undefined' && window.isClickPending) {
          return;
        }
        applyCustomColorSchemaSettings(toggleCustomColorSchema());
      });
    }

    var timeButton = document.querySelector(timeToggleButtonSelector);
    if (timeButton) {
      timeButton.addEventListener('click', function() {
        if (typeof window.isClickPending !== 'undefined' && window.isClickPending) {
          return;
        }
        applyTimeMode(toggleTimeMode());
      });
    }

    var mobileTimeButton = document.querySelector(mobileTimeToggleButtonSelector);
    if (mobileTimeButton) {
      mobileTimeButton.addEventListener('click', function() {
        if (typeof window.isClickPending !== 'undefined' && window.isClickPending) {
          return;
        }
        applyTimeMode(toggleTimeMode());
      });
    }
  });

  Fluid.utils.waitElementLoaded(iframeSelector, function() {
    applyCustomColorSchemaSettings();
  });

})(window, document);
