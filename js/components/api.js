import { SB_SITE_CONFIG } from '../config.js';
export function getConfig() {
    return SB_SITE_CONFIG;
}
export function isBackendConfigured() {
    const c = getConfig();
    return !!(c.supabaseUrl && c.supabasePublishableKey);
}
export function isTurnstileConfigured() {
    return !!String(getConfig().turnstileSiteKey || '').trim();
}
export function supabaseBaseUrl() {
    return String(getConfig().supabaseUrl || '').replace(/\/$/, '');
}
export function supabaseHeaders() {
    const key = getConfig().supabasePublishableKey;
    return {
        apikey: key,
        'Content-Type': 'application/json',
    };
}
