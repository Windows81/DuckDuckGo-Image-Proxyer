// ==UserScript==
// @name         DuckDuckGo Image Proxyer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Replace all images in a page with proxied versions
// @author       VisualPlugin
// @run-at       document-start
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const shouldReplace = (url) => {
        // if (/\/image\/upload\//.test(url)) return url.replace(/q_[^\/,]+/, 'q_1');
        if (/^.*:\/\/.*\/.*/i.test(url)) return 'https://external-content.duckduckgo.com/iu/?o=7&rm=3&h=200&u=' + encodeURIComponent(url);
    }

    const replace = (img) => {
        let replacementUrl = shouldReplace(img.src);
        if (!replacementUrl) return;
        console.log(img);
        img.src = img.dataset.currentSrc = replacementUrl;
        img.srcset = "";
    }

    const replaceImages = (mutationsList, observer) => {

        // Loops through each mutation record.
        for (const mutation of mutationsList) {

            if (mutation.type === 'childList') {
                // Processes added nodes.
                mutation.addedNodes.forEach(img => {

                    if (img.nodeType !== Node.ELEMENT_NODE) return;
                    if (img.tagName !== "IMG") return;
                    replace(img);
                    if (!img.dataset.originalSrc) img.dataset.originalSrc = img.src;

                });
            }
            else if (mutation.type === "attributes") {
                let img = mutation.target;
                if (img.nodeType !== Node.ELEMENT_NODE) return;
                if (img.tagName !== "IMG") return;
                if (img.dataset.currentSrc === img.src) return;
                if (mutation.attributeName !== "src") return;
                replace(img);
            }
        }
    };

    // Keeps replacing images as more load.
    const observer = new MutationObserver(replaceImages);
    observer.observe(document, { childList: true, subtree: true, attributes: true });
})();
