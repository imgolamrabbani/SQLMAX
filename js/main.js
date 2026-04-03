// main.js — Entry point: decides which screen to show and boots up
document.addEventListener('DOMContentLoaded', async () => {
  const page = document.body.dataset.page;

  if (page === 'map') {
    initMapScreen();
  } else if (page === 'game') {
    await initGameScreen();
  }
});

// ─── MAP SCREEN ─────────────────────────────────────────────────────────────
function initMapScreen() {
  const container = document.getElementById('worlds-grid');
  if (!container) return;

  const state = Progress.getState();
  UI.updateXPBar(state.xp);

  container.innerHTML = WORLDS.map(world => {
    const unlocked = Progress.isWorldUnlocked(world.id);
    const levels = getWorldLevels(world.id);
    const totalLevels = levels.length;
    const completedLevels = levels.filter(l =>
      l.sublevels.some(s => Progress.getSublevelStatus(s.id))
    ).length;

    return `
      <div class="world-card ${unlocked ? 'world-unlocked' : 'world-locked'}"
           data-world="${world.id}"
           style="--world-color: ${world.color}; --world-gradient: ${world.gradient};"
           onclick="${unlocked ? `openWorld('${world.id}')` : 'showLockedToast()'}">
        <div class="world-bg"></div>
        <div class="world-number">World ${world.number}</div>
        <div class="world-icon">${world.icon}</div>
        <div class="world-title">${world.title}</div>
        <div class="world-subtitle">${world.subtitle}</div>
        <div class="world-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${totalLevels ? (completedLevels / totalLevels * 100) : 0}%"></div>
          </div>
          <span class="progress-text">${completedLevels}/${totalLevels} levels</span>
        </div>
        ${!unlocked ? `<div class="world-lock">🔒<br><small>${world.xpRequired} XP</small></div>` : ''}
        <div class="world-concepts">
          ${world.concepts.slice(0, 4).map(c => `<span class="concept-tag">${c}</span>`).join('')}
        </div>
      </div>
    `;
  }).join('');
}

function getWorldLevels(worldId) {
  const map = {
    world1: typeof WORLD1_LEVELS !== 'undefined' ? WORLD1_LEVELS : [],
    world2: typeof WORLD2_LEVELS !== 'undefined' ? WORLD2_LEVELS : [],
    world3: typeof WORLD3_LEVELS !== 'undefined' ? WORLD3_LEVELS : [],
    world4: typeof WORLD4_LEVELS !== 'undefined' ? WORLD4_LEVELS : [],
    world5: typeof WORLD5_LEVELS !== 'undefined' ? WORLD5_LEVELS : [],
  };
  return map[worldId] || [];
}

function openWorld(worldId) {
  const world = WORLDS.find(w => w.id === worldId);
  if (!world) return;

  const modal = document.getElementById('world-modal');
  const levels = getWorldLevels(worldId);

  document.getElementById('world-modal-title').textContent = `${world.icon} ${world.title}`;
  document.getElementById('world-modal-desc').textContent = world.description;

  const levelList = document.getElementById('world-levels-list');
  levelList.innerHTML = levels.map(level => {
    const anyCompleted = level.sublevels.some(s => Progress.getSublevelStatus(s.id));
    const allCompleted = level.sublevels.every(s => Progress.getSublevelStatus(s.id));
    const status = allCompleted ? 'complete' : anyCompleted ? 'inprogress' : 'new';
    const statusIcon = { complete: '✅', inprogress: '🔄', new: '🆕' }[status];

    return `
      <div class="level-item level-${status}" onclick="startGame('${worldId}', '${level.id}')">
        <div class="level-item-icon">${level.icon}</div>
        <div class="level-item-info">
          <div class="level-item-title">${level.title}</div>
          <div class="level-item-meta">${level.sublevels.length} challenges · ${level.xpReward} XP</div>
        </div>
        <div class="level-item-status">${statusIcon}</div>
        ${level.isBoss ? '<div class="boss-tag">BOSS</div>' : ''}
      </div>
    `;
  }).join('');

  modal.classList.add('modal-show');
}

function closeWorldModal() {
  document.getElementById('world-modal').classList.remove('modal-show');
}

function startGame(worldId, levelId) {
  window.location.href = `game.html?world=${worldId}&level=${levelId}`;
}

function showLockedToast() {
  UI.showToast('🔒 Earn more XP to unlock this world!', 'warning');
}

// ─── GAME SCREEN ─────────────────────────────────────────────────────────────
async function initGameScreen() {
  const params = new URLSearchParams(window.location.search);
  const worldId = params.get('world');
  const levelId = params.get('level');

  if (!worldId || !levelId) {
    window.location.href = 'index.html';
    return;
  }

  // Init SQL engine
  UI.showLoading('output-container', 'Loading SQL engine...');
  try {
    await Engine.init();
  } catch (e) {
    UI.renderError('Failed to load SQL engine. Check your internet connection.', 'output-container');
    return;
  }

  // Init CodeMirror editor
  const editorInstance = Editor.init('sql-editor');
  Game.editor = Editor;

  // Bind buttons
  document.getElementById('btn-run')?.addEventListener('click', () => Game.runQuery());
  document.getElementById('btn-hint')?.addEventListener('click', () => Game.showHint());
  document.getElementById('btn-solution')?.addEventListener('click', () => Game.showSolution());
  document.getElementById('btn-back')?.addEventListener('click', () => Game.goToMap());
  document.getElementById('btn-modal-continue')?.addEventListener('click', () => {
    document.getElementById('level-complete-modal')?.classList.remove('modal-show', 'modal-animate');
    Game.goToMap();
  });
  document.getElementById('btn-modal-next')?.addEventListener('click', () => {
    document.getElementById('level-complete-modal')?.classList.remove('modal-show', 'modal-animate');
    // Load next level in same world if possible
    const levels = Game.getLevelData(worldId);
    const idx = levels.findIndex(l => l.id === levelId);
    if (idx >= 0 && idx < levels.length - 1) {
      window.location.href = `game.html?world=${worldId}&level=${levels[idx + 1].id}`;
    } else {
      Game.goToMap();
    }
  });

  // Start the level
  await Game.startLevel(worldId, levelId);

  // Clear loading state
  const outputEl = document.getElementById('output-container');
  if (outputEl && outputEl.querySelector('.loading-state')) {
    outputEl.innerHTML = `
      <div class="output-placeholder">
        <div class="placeholder-icon">▶️</div>
        <div>Click <strong>Run Query</strong> to see results</div>
        <div class="hint-text">Shortcut: Ctrl+Enter</div>
      </div>
    `;
  }
}
