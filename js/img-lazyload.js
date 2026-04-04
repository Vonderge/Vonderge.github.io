/* global Fluid, CONFIG */

(function(window, document) {
  for (const each of document.querySelectorAll('img[lazyload]')) {
    Fluid.utils.waitElementVisible(each, function() {
      var dataSrc = each.getAttribute('data-src');
      var dataSrcset = each.getAttribute('data-srcset');

      if (dataSrc) {
        each.setAttribute('src', dataSrc);
        each.removeAttribute('data-src');

        // Update parent fancybox link href if exists
        var parentLink = each.closest('a.fancybox');
        if (parentLink) {
          parentLink.setAttribute('href', dataSrc);
        }
      }

      if (dataSrcset) {
        each.setAttribute('srcset', dataSrcset);
        each.removeAttribute('data-srcset');
      }

      each.removeAttribute('lazyload');
    }, CONFIG.lazyload.offset_factor);
  }
})(window, document);
