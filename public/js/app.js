const fab = document.getElementById('sp-fab');
const panel = document.getElementById('sp-panel');
const closeBtn = document.getElementById('sp-close');
const actionsWrap = document.getElementById('sp-actions');
const insightEl = document.getElementById('sp-insight');

async function loadSupportPlayer() {
  const response = await fetch('/api');
  const data = await response.json();
  const support = data.supportPlayer || {};

  insightEl.textContent = support.insight || 'Support recommendations ready.';
  actionsWrap.innerHTML = '';

  (support.nextActions || []).forEach((action) => {
    const button = document.createElement('a');
    button.className = 'support-action glow-btn';
    button.href = action.href;
    button.textContent = action.label;
    actionsWrap.appendChild(button);
  });
}

fab.addEventListener('click', async () => {
  panel.classList.toggle('hidden');
  if (!panel.classList.contains('hidden')) {
    await loadSupportPlayer();
  }
});

closeBtn.addEventListener('click', () => panel.classList.add('hidden'));

const socket = io();
socket.on('notification', (event) => {
  if (event.type === 'tournament_update') {
    fab.textContent = 'Support Player • Live Update';
  }
});
