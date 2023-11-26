export default function getProxiedIframeParent (win: Window = window): Window {
    // If the parent window is the original window, then we're "not in an iframe".
    // So return current window.
    if (win.parent === win.top)
        return win.self;

    return win.parent;
}
