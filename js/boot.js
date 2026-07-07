/* global Fluid */

Fluid.boot = {};

Fluid.boot.registerEvents = function() {
  Fluid.events.billboard();
  Fluid.events.registerNavbarEvent();
  Fluid.events.registerParallaxEvent();
  Fluid.events.registerScrollDownArrowEvent();
  Fluid.events.registerScrollTopArrowEvent();
  Fluid.events.registerImageLoadedEvent();
  // register navigation preloader (show preloader on category link clicks)
  if (Fluid.events.registerPreloaderOnNavigation) {
    Fluid.events.registerPreloaderOnNavigation();
  }
};

Fluid.boot.refresh = function() {
  Fluid.plugins.fancyBox();
  Fluid.plugins.codeWidget();
  Fluid.events.refresh();
};

document.addEventListener('DOMContentLoaded', function() {
  Fluid.boot.registerEvents();
});
