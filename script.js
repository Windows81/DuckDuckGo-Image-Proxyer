// ==UserScript==
// @name         DuckDuckGo Image Proxyer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Replace all images in a page with proxied versions
// @author       VisualPlugin
// @match        https://www.google.com/search?*
// @grant        none
// ==/UserScript==
 
(function() {
    'use strict';
 
    function replaceImages() {
        const observerCallback = (mutationsList, observer) => {

          // Loops through each mutation record.
          for (const mutation of mutationsList) {

            if (mutation.type !== 'childList') continue;

            // Processes added nodes.
            mutation.addedNodes.forEach(img => {

              if (img.nodeType !== Node.ELEMENT_NODE) return;
              if (img.tagName !== "IMG") return;
              if (!img.dataset.originalSrc) img.dataset.originalSrc = img.src;
              let replacementUrl = 'https://external-content.duckduckgo.com/iu/?w=200&u=' + encodeURIComponent(img.dataset.originalSrc);
              img.src = replacementUrl;
              img.srcset = "";

            });
          }
        };
    }
 
    // Keeps replacing images as more load.
    const observer = new MutationObserver(replaceImages);
    observer.observe(document.body, { childList: true, subtree: true });
})();
