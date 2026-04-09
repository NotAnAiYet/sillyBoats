const confettiBtn = document.getElementById('confetti-btn');
const confettiLayer = document.getElementById('confetti-layer');
const CONFETTI_COLORS = [
    '#ff006e',
    '#8338ec',
    '#3a86ff',
    '#ffbe0b',
    '#fb5607',
    '#06ffa5',
    '#ff69eb',
];
const CONFETTI_COUNT = 48;
function spawnConfetti() {
    if (!confettiLayer)
        return;
    for (let i = 0; i < CONFETTI_COUNT; i++) {
        const piece = document.createElement('span');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + '%';
        piece.style.background = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
        piece.style.animationDuration = 2.5 + Math.random() * 2 + 's';
        piece.style.animationDelay = Math.random() * 0.3 + 's';
        piece.style.setProperty('--dx', (Math.random() - 0.5) * 200 + 'px');
        piece.addEventListener('animationend', (e) => {
            const target = e.target;
            target?.parentNode?.removeChild(target);
        });
        confettiLayer.appendChild(piece);
    }
}
export function initConfetti() {
    confettiBtn?.addEventListener('click', spawnConfetti);
}
