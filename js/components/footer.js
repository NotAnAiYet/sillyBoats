import { getConfig } from './api.js';
const yearEl = document.getElementById('year');
const lastUpdatedEl = document.getElementById('last-updated');
const easterLink = document.getElementById('easter-egg-link');
export function initYear() {
    if (yearEl) {
        yearEl.textContent = String(new Date().getFullYear());
    }
}
export function initLastUpdated() {
    if (!lastUpdatedEl)
        return;
    const cfg = getConfig();
    if (!cfg.lastUpdated)
        return;
    const iso = cfg.lastUpdated;
    lastUpdatedEl.setAttribute('datetime', iso);
    const d = new Date(iso);
    if (!isNaN(d.getTime())) {
        lastUpdatedEl.textContent = d.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }
    else {
        lastUpdatedEl.textContent = iso;
    }
}
export function initEasterEgg() {
    if (!easterLink)
        return;
    let clicks = 0;
    easterLink.addEventListener('click', (e) => {
        e.preventDefault();
        clicks += 1;
        if (clicks === 3) {
            window.alert('You found it!\n\nReal title of this page: "Yannicks Silly Paradise of horses and all other great things"');
            clicks = 0;
        }
    });
}
