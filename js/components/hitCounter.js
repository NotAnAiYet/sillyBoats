import { isBackendConfigured, supabaseBaseUrl, supabaseHeaders } from './api.js';
import { showHint, hideHint } from './hints.js';
const counterEl = document.getElementById('hit-counter');
const cloneContainers = document.querySelectorAll('.hit-counter-clone');
const HIT_ALREADY_COUNTED = 'sb_homepage_hit_counted_v1';
const DEFAULT_HITS = 1337;
function padHits(n) {
    let s = String(Math.max(0, Math.floor(Number(n))));
    while (s.length < 7) {
        s = '0' + s;
    }
    return s.slice(-7);
}
function setCounterDisplay(n) {
    const display = padHits(n);
    if (counterEl) {
        counterEl.textContent = display;
    }
    cloneContainers.forEach((el) => {
        el.textContent = display;
    });
}
async function incrementHitCounterRemote() {
    const res = await fetch(supabaseBaseUrl() + '/rest/v1/rpc/increment_hit_counter', {
        method: 'POST',
        headers: supabaseHeaders(),
        body: '{}',
    });
    if (!res.ok) {
        const t = await res.text();
        throw new Error(t || String(res.status));
    }
    return res.json();
}
async function fetchCurrentCount() {
    const res = await fetch(supabaseBaseUrl() + '/rest/v1/hit_counter', {
        headers: supabaseHeaders(),
    });
    if (!res.ok) {
        const t = await res.text();
        throw new Error(t || String(res.status));
    }
    const arr = await res.json();
    const n = Array.isArray(arr) && arr.length && typeof arr[0].count === 'number'
        ? arr[0].count
        : null;
    if (n === null || !Number.isFinite(n)) {
        throw new Error('bad counter payload');
    }
    return n;
}
export async function initHitCounter() {
    const alreadyCounted = localStorage.getItem(HIT_ALREADY_COUNTED);
    if (!isBackendConfigured()) {
        setCounterDisplay(DEFAULT_HITS);
        showHint('Demo mode: Connection to backend not working!');
        return;
    }
    hideHint();
    try {
        if (alreadyCounted) {
            const count = await fetchCurrentCount();
            setCounterDisplay(count);
        }
        else {
            localStorage.setItem(HIT_ALREADY_COUNTED, '1');
            const value = await incrementHitCounterRemote();
            const n = typeof value === 'number' ? value : parseInt(String(value), 10);
            if (!Number.isFinite(n)) {
                throw new Error('bad counter payload');
            }
            setCounterDisplay(n);
        }
    }
    catch {
        setCounterDisplay(DEFAULT_HITS);
        showHint('Could not reach Backend — showing default hits.');
    }
}
