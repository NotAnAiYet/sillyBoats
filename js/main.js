import { initHitCounter, initGuestbook, loadGuestbook, initWebring, initConfetti, initYear, initLastUpdated, initEasterEgg, } from './components/index.js';
// Initialize all components
initYear();
initLastUpdated();
initGuestbook();
initWebring();
initConfetti();
initEasterEgg();
// Load data from backend
initHitCounter().then(() => loadGuestbook());
