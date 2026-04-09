const ringButtons = document.querySelectorAll('[data-ring]');
const ringStatus = document.getElementById('ring-status');
let fakeSitesCache = null;
async function loadFakeSites() {
    if (fakeSitesCache) {
        return fakeSitesCache;
    }
    const res = await fetch('textFiles/fakeSites.txt');
    const txt = await res.text();
    fakeSitesCache = txt.split(/\r?\n/).filter(Boolean);
    return fakeSitesCache;
}
async function getRandomSite(direction) {
    const sites = await loadFakeSites();
    let i = Math.floor(Math.random() * sites.length);
    if (direction === 'prev') {
        i = (i + sites.length - 1) % sites.length;
    }
    else if (direction === 'next') {
        i = (i + 1) % sites.length;
    }
    return sites[i];
}
export function initWebring() {
    if (!ringStatus)
        return;
    ringButtons.forEach((btn) => {
        btn.addEventListener('click', async () => {
            const dir = btn.getAttribute('data-ring') || 'random';
            const label = await getRandomSite(dir);
            ringStatus.textContent = `Transporting you to… "${label}" (okay, it's pretend — but enjoy the thought!)`;
        });
    });
}
