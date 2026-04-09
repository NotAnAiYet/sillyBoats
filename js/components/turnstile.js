import { isBackendConfigured, getConfig } from './api.js';
let turnstileWidgetId = null;
export function getTurnstileToken() {
    const ts = window.turnstile;
    if (!ts || turnstileWidgetId === null) {
        return '';
    }
    return ts.getResponse(turnstileWidgetId) || '';
}
export function resetTurnstile() {
    const ts = window.turnstile;
    if (!ts || turnstileWidgetId === null) {
        return;
    }
    try {
        ts.reset(turnstileWidgetId);
    }
    catch {
        /* ignore */
    }
}
export function initTurnstile() {
    const container = document.getElementById('turnstile-container');
    if (!container)
        return;
    container.style.display = 'block';
    if (!isBackendConfigured()) {
        return;
    }
    const siteKey = String(getConfig().turnstileSiteKey || '').trim();
    if (!siteKey) {
        return;
    }
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => {
        const ts = window.turnstile;
        if (!ts)
            return;
        turnstileWidgetId = ts.render(container, {
            sitekey: siteKey,
        });
    };
    script.onerror = () => {
        container.innerHTML =
            '<p class="small text-center text-danger mb-0">Could not load captcha script (network/adblock).</p>';
    };
    document.head.appendChild(script);
}
