/**
 * Since `window.top` is the original window,
 * using `window.top` is NOT the way we want to get the real top.
 *
 * We want to get the top window of the proxied iframe.
 * To do that, we'll navigate up the parent chain until we find the proxied top window.
 */
export default function getProxiedIframeTop (win: Window = window): Window {
    let proxiedTopWindow: Window = win.self;

    while (proxiedTopWindow.parent !== win.top && proxiedTopWindow.name !== 'surferhead_top_proxied_iframe')
        proxiedTopWindow = proxiedTopWindow.parent;

    return proxiedTopWindow;
}
