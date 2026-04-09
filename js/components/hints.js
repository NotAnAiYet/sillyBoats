const generalHint = document.getElementById('site-hint');
export function showHint(message) {
    if (!generalHint)
        return;
    generalHint.textContent = message;
    generalHint.classList.remove('d-none');
}
export function hideHint() {
    if (!generalHint)
        return;
    generalHint.classList.add('d-none');
    generalHint.textContent = '';
}
export function isHintHidden() {
    return generalHint?.classList.contains('d-none') ?? true;
}
