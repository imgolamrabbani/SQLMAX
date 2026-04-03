// ui.js — UI helpers: modals, toasts, animations, result table rendering
const UI = {
  // Toast notification system
  showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${this.getToastIcon(type)}</span>
      <span class="toast-msg">${message}</span>
    `;
    container.appendChild(toast);
    // Trigger entrance
    requestAnimationFrame(() => toast.classList.add('toast-show'));
    setTimeout(() => {
      toast.classList.remove('toast-show');
      toast.classList.add('toast-hide');
      setTimeout(() => toast.remove(), 400);
    }, duration);
  },

  getToastIcon(type) {
    return { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️', xp: '⭐' }[type] || 'ℹ️';
  },

  // Render result table
  renderTable(result, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const { columns, rows } = result;

    if (!columns || columns.length === 0) {
      container.innerHTML = `<div class="empty-result">
        <div class="empty-icon">📭</div>
        <div>No results returned</div>
      </div>`;
      return;
    }

    if (rows.length === 0) {
      container.innerHTML = `<div class="empty-result">
        <div class="empty-icon">🔍</div>
        <div>Query ran successfully — 0 rows returned</div>
        <div class="hint-text">Check your WHERE condition</div>
      </div>`;
      return;
    }

    const tableHTML = `
      <div class="result-meta">
        <span class="result-count">${rows.length} row${rows.length !== 1 ? 's' : ''} returned</span>
        <span class="result-columns">${columns.length} column${columns.length !== 1 ? 's' : ''}</span>
      </div>
      <div class="table-scroll">
        <table class="result-table">
          <thead>
            <tr>${columns.map(c => `<th>${c}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${rows.map((row, i) => `
              <tr class="row-animate" style="animation-delay:${i * 0.04}s">
                ${row.map(cell => `<td>${cell === null ? '<span class="null-val">NULL</span>' : cell}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    container.innerHTML = tableHTML;
  },

  // Show error in result pane
  renderError(errorMsg, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = `
      <div class="error-result">
        <div class="error-icon">⚠️</div>
        <div class="error-title">SQL Error</div>
        <div class="error-message">${errorMsg}</div>
      </div>
    `;
  },

  // XP popup animation
  showXPGain(amount, targetEl) {
    const popup = document.createElement('div');
    popup.className = 'xp-popup';
    popup.textContent = `+${amount} XP`;
    document.body.appendChild(popup);

    const rect = targetEl ? targetEl.getBoundingClientRect() : { top: 200, left: window.innerWidth / 2 };
    popup.style.left = `${rect.left + rect.width / 2}px`;
    popup.style.top = `${rect.top}px`;

    requestAnimationFrame(() => popup.classList.add('xp-popup-show'));
    setTimeout(() => popup.remove(), 1200);
  },

  // Star rating display
  renderStars(count, max = 3) {
    return Array.from({ length: max }, (_, i) =>
      `<span class="star ${i < count ? 'star-filled' : 'star-empty'}">★</span>`
    ).join('');
  },

  // Loading spinner
  showLoading(containerId, message = 'Running query...') {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = `
      <div class="loading-state">
        <div class="spinner"></div>
        <div>${message}</div>
      </div>
    `;
  },

  // Confetti burst for level complete
  triggerConfetti() {
    const colors = ['#FF6B35', '#F7931E', '#7209B7', '#00B4D8', '#F72585', '#FFBE0B'];
    for (let i = 0; i < 80; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.cssText = `
        left: ${Math.random() * 100}vw;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        animation-duration: ${0.8 + Math.random() * 1.5}s;
        animation-delay: ${Math.random() * 0.5}s;
        width: ${6 + Math.random() * 8}px;
        height: ${6 + Math.random() * 8}px;
        transform: rotate(${Math.random() * 360}deg);
      `;
      document.body.appendChild(piece);
      setTimeout(() => piece.remove(), 2500);
    }
  },

  // Shake animation for wrong answer
  shake(el) {
    el.classList.remove('shake');
    void el.offsetWidth; // reflow
    el.classList.add('shake');
    setTimeout(() => el.classList.remove('shake'), 600);
  },

  // Update XP bar
  updateXPBar(xp) {
    const info = Progress.getPlayerLevel(xp);
    const bar = document.getElementById('xp-bar-fill');
    const xpText = document.getElementById('xp-display');
    const levelBadge = document.getElementById('level-badge');
    const levelTitle = document.getElementById('level-title');

    if (bar) {
      const pct = info.next ? Math.min(100, ((xp - this.levelFloor(info.level)) / (info.next - this.levelFloor(info.level))) * 100) : 100;
      bar.style.width = `${pct}%`;
    }
    if (xpText) xpText.textContent = `${xp} XP`;
    if (levelBadge) levelBadge.textContent = `LVL ${info.level}`;
    if (levelTitle) levelTitle.textContent = info.title;
  },

  levelFloor(level) {
    return [0, 0, 200, 500, 900, 1400, 2000][level] || 0;
  },
};
