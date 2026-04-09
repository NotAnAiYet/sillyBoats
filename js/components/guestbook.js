import { isBackendConfigured, isTurnstileConfigured, supabaseBaseUrl, supabaseHeaders } from './api.js';
import { showHint, isHintHidden } from './hints.js';
import { getTurnstileToken, resetTurnstile, initTurnstile } from './turnstile.js';
const guestForm = document.getElementById('guestbook-form');
const guestToast = document.getElementById('guestbook-toast');
const guestbookList = document.getElementById('guestbook-entries');
const guestbookLoading = document.getElementById('guestbook-loading');
const GUESTBOOK_LIMIT = 35;
function formatGuestWhen(iso) {
    try {
        const d = new Date(iso);
        if (Number.isNaN(d.getTime()))
            return '';
        return d.toLocaleString(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short',
        });
    }
    catch {
        return '';
    }
}
function renderGuestbook(rows) {
    if (!guestbookList)
        return;
    guestbookList.innerHTML = '';
    if (!rows || !rows.length) {
        const empty = document.createElement('li');
        empty.className = 'guestbook-entry guestbook-empty small text-center';
        empty.textContent = 'No approved entries yet — say hi below (shows after moderation).';
        guestbookList.appendChild(empty);
        return;
    }
    rows.forEach((row) => {
        const li = document.createElement('li');
        li.className = 'guestbook-entry';
        const meta = document.createElement('div');
        meta.className = 'guestbook-entry-meta';
        const nameSpan = document.createElement('strong');
        nameSpan.className = 'guestbook-name';
        nameSpan.textContent = row.name || 'Anonymous';
        const when = document.createElement('span');
        when.className = 'guestbook-when';
        when.textContent = formatGuestWhen(row.created_at);
        meta.appendChild(nameSpan);
        if (when.textContent) {
            meta.appendChild(document.createTextNode(' · '));
            meta.appendChild(when);
        }
        const msg = document.createElement('p');
        msg.className = 'guestbook-message mb-0';
        msg.textContent = row.message || '';
        li.appendChild(meta);
        li.appendChild(msg);
        guestbookList.appendChild(li);
    });
}
function setGuestbookLoading(on) {
    if (!guestbookLoading)
        return;
    guestbookLoading.classList.toggle('d-none', !on);
}
async function fetchGuestbook() {
    const q = `select=name,message,created_at&order=created_at.desc&limit=${GUESTBOOK_LIMIT}`;
    const res = await fetch(supabaseBaseUrl() + '/rest/v1/guestbook?' + q, {
        headers: supabaseHeaders(),
    });
    if (!res.ok) {
        const t = await res.text();
        throw new Error(t || String(res.status));
    }
    return res.json();
}
async function submitGuestbookEdge(name, message, turnstileToken, website) {
    const res = await fetch(supabaseBaseUrl() + '/functions/v1/submit-guestbook', {
        method: 'POST',
        headers: supabaseHeaders(),
        body: JSON.stringify({ name, message, turnstileToken, website }),
    });
    const t = await res.text();
    let body = {};
    try {
        body = t ? JSON.parse(t) : {};
    }
    catch {
        body = {};
    }
    if (!res.ok) {
        const errMsg = body.error ||
            (t && t.length < 200 ? t : null) ||
            res.statusText ||
            'Request failed';
        throw new Error(errMsg);
    }
    return body;
}
export async function loadGuestbook() {
    if (!guestbookList)
        return;
    if (!isBackendConfigured()) {
        renderGuestbook([]);
        return;
    }
    setGuestbookLoading(true);
    try {
        const rows = await fetchGuestbook();
        renderGuestbook(rows);
    }
    catch {
        renderGuestbook([]);
        if (isHintHidden()) {
            showHint('Guestbook could not load.');
        }
    }
    finally {
        setGuestbookLoading(false);
    }
}
function showToast(message) {
    if (!guestToast)
        return;
    guestToast.textContent = message;
    guestToast.classList.add('visible');
}
export function initGuestbook() {
    if (!guestForm || !guestToast)
        return;
    // Lazy-load Turnstile when user starts typing
    let turnstileInitialized = false;
    const maybeInitTurnstile = () => {
        if (!turnstileInitialized) {
            initTurnstile();
            turnstileInitialized = true;
        }
    };
    const nameInput = document.getElementById('guest-name');
    const msgInput = document.getElementById('guest-msg');
    [nameInput, msgInput].forEach((input) => {
        input?.addEventListener('input', maybeInitTurnstile, { once: true });
    });
    guestForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const hpInput = document.getElementById('guest-website');
        if (!nameInput || !msgInput)
            return;
        const name = nameInput.value.trim();
        const msg = msgInput.value.trim();
        const website = hpInput ? String(hpInput.value).trim() : '';
        if (!name || !msg) {
            showToast('Please fill in both fields, cool visitor!');
            return;
        }
        if (!isBackendConfigured()) {
            showToast('Guestbook needs Backend');
            return;
        }
        if (!isTurnstileConfigured()) {
            showToast('Captcha not configured');
            return;
        }
        const token = getTurnstileToken();
        if (!token) {
            showToast('Complete the captcha challenge first.');
            return;
        }
        showToast('Sending your message…');
        try {
            await submitGuestbookEdge(name, msg, token, website);
            showToast(`Thanks, ${name}! Your note is pending review — it will show here after approval.`);
            guestForm.reset();
            resetTurnstile();
            await loadGuestbook();
        }
        catch {
            showToast('Could not save — Error in Backend');
            resetTurnstile();
        }
    });
}
