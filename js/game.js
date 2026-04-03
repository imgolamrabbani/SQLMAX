// game.js — Core game engine: level loading, sublevel flow, validation orchestration
const Game = {
  currentWorld: null,
  currentLevel: null,
  currentSublevelIndex: 0,
  currentSublevel: null,
  editor: null,
  hintIndex: 0,
  isRunning: false,

  // Map world schema key to level array
  getLevelData(worldId) {
    const map = {
      world1: typeof WORLD1_LEVELS !== 'undefined' ? WORLD1_LEVELS : [],
      world2: typeof WORLD2_LEVELS !== 'undefined' ? WORLD2_LEVELS : [],
      world3: typeof WORLD3_LEVELS !== 'undefined' ? WORLD3_LEVELS : [],
      world4: typeof WORLD4_LEVELS !== 'undefined' ? WORLD4_LEVELS : [],
      world5: typeof WORLD5_LEVELS !== 'undefined' ? WORLD5_LEVELS : [],
    };
    return map[worldId] || [];
  },

  // Start a specific level (levelId within a world)
  async startLevel(worldId, levelId) {
    const world = WORLDS.find(w => w.id === worldId);
    if (!world) return;

    const levels = this.getLevelData(worldId);
    const level = levels.find(l => l.id === levelId);
    if (!level) return;

    this.currentWorld = world;
    this.currentLevel = level;
    this.currentSublevelIndex = 0;

    // Load schema into engine
    try {
      Engine.loadSchema(world.schema);
    } catch (e) {
      UI.showToast('Failed to load database schema', 'error');
      return;
    }

    this.loadSublevel(0);
    this.updateLevelProgress();
  },

  loadSublevel(index) {
    const sublevels = this.currentLevel.sublevels;
    if (index >= sublevels.length) {
      this.onLevelComplete();
      return;
    }

    this.currentSublevelIndex = index;
    this.currentSublevel = sublevels[index];
    this.hintIndex = 0;

    // Reset DB for DML levels
    if (this.currentSublevel.isDML) {
      Engine.resetSchema();
      Engine.loadSchema(this.currentWorld.schema);
    }

    this.renderSublevel(this.currentSublevel);
    this.updateSublevelNav();
  },

  renderSublevel(sublevel) {
    // Task card
    document.getElementById('task-title').textContent = sublevel.title;
    document.getElementById('task-body').innerHTML = sublevel.task;
    document.getElementById('task-concept').textContent = sublevel.concept;
    document.getElementById('task-difficulty').textContent = sublevel.difficulty;
    document.getElementById('task-difficulty').className = `difficulty-badge difficulty-${sublevel.difficulty.toLowerCase()}`;
    document.getElementById('task-narrative').textContent = sublevel.narrative;

    // XP display
    const xpEl = document.getElementById('task-xp');
    if (xpEl) xpEl.textContent = `+${sublevel.xp} XP`;

    // Tutorial card
    this.renderTutorial(sublevel.tutorial);

    // Editor
    if (this.editor) {
      this.editor.setValue(sublevel.starterCode || '-- Write your SQL here\n');
      this.editor.clearHistory();
    }

    // Clear output
    const outputEl = document.getElementById('output-container');
    if (outputEl) {
      outputEl.innerHTML = `
        <div class="output-placeholder">
          <div class="placeholder-icon">▶️</div>
          <div>Click <strong>Run Query</strong> to see results</div>
        </div>
      `;
    }

    // Update feedback area
    const feedbackEl = document.getElementById('feedback-area');
    if (feedbackEl) feedbackEl.innerHTML = '';

    // Clear hints
    const hintEl = document.getElementById('hint-display');
    if (hintEl) hintEl.innerHTML = '';
    this.hintIndex = 0;
    const hintBtn = document.getElementById('btn-hint');
    if (hintBtn) {
      hintBtn.disabled = !sublevel.hints || sublevel.hints.length === 0;
      hintBtn.textContent = `💡 Hint (${sublevel.hints ? sublevel.hints.length : 0} left)`;
    }

    // Sublevel badge
    const badgeEl = document.getElementById('sublevel-badge');
    if (badgeEl) badgeEl.textContent = sublevel.badge || '🟢';
  },

  renderTutorial(tutorial) {
    const el = document.getElementById('tutorial-card');
    if (!el) return;

    if (!tutorial) {
      el.style.display = 'none';
      return;
    }

    el.style.display = 'flex';

    // Concept
    const conceptEl = el.querySelector('.tutorial-concept-text');
    if (conceptEl) conceptEl.textContent = tutorial.concept;

    // Syntax
    const syntaxEl = el.querySelector('.tutorial-syntax-code');
    if (syntaxEl) syntaxEl.textContent = tutorial.syntax;

    // Example query
    const exQueryEl = el.querySelector('.tutorial-example-query');
    if (exQueryEl) exQueryEl.textContent = tutorial.example.query;

    // Example note
    const exNoteEl = el.querySelector('.tutorial-example-note-text');
    if (exNoteEl) exNoteEl.textContent = tutorial.example.note;
  },

  updateSublevelNav() {
    const sublevels = this.currentLevel.sublevels;
    const dots = document.getElementById('sublevel-dots');
    if (dots) {
      dots.innerHTML = sublevels.map((s, i) => {
        const isDone    = i < this.currentSublevelIndex;
        const isActive  = i === this.currentSublevelIndex;
        const cls = isDone ? 'dot-done' : isActive ? 'dot-active' : 'dot-pending';
        // FIX 1: done + active dots are clickable — pending dots are locked
        const clickable = isDone || isActive;
        return `<div class="sublevel-dot ${cls} ${clickable ? 'dot-clickable' : ''}"
                     title="${s.title}"
                     ${clickable ? `onclick="Game.jumpToSublevel(${i})"` : ''}></div>`;
      }).join('');
    }

    const current = document.getElementById('sublevel-current');
    const total   = document.getElementById('sublevel-total');
    if (current) current.textContent = this.currentSublevelIndex + 1;
    if (total)   total.textContent   = sublevels.length;

    // Prev / Next buttons
    const btnPrev = document.getElementById('btn-sublevel-prev');
    const btnNext = document.getElementById('btn-sublevel-next');
    if (btnPrev) btnPrev.disabled = this.currentSublevelIndex === 0;
    if (btnNext) {
      const hasNext = this.currentSublevelIndex < sublevels.length - 1;
      const nextDone = hasNext && this.currentSublevelIndex + 1 <= this.currentSublevelIndex;
      // Allow going next only if the next sublevel was already visited
      btnNext.disabled = !(this.currentSublevelIndex < sublevels.length - 1 &&
                           Progress.getSublevelStatus(sublevels[this.currentSublevelIndex].id));
    }

    const levelTitle = document.getElementById('level-title-game');
    if (levelTitle) levelTitle.textContent = this.currentLevel.title;
  },

  // FIX 1: Jump to any previously visited sublevel
  jumpToSublevel(index) {
    if (index === this.currentSublevelIndex) return;
    // Only allow jumping to completed or current sublevels
    const sublevels = this.currentLevel.sublevels;
    if (index > 0 && !Progress.getSublevelStatus(sublevels[index - 1].id) && index > this.currentSublevelIndex) {
      UI.showToast('Complete the current challenge first! 🔒', 'warning');
      return;
    }
    this.loadSublevel(index);
    UI.showToast(`↩ Revisiting: ${sublevels[index].title}`, 'info', 1500);
  },

  updateLevelProgress() {
    UI.updateXPBar(Progress.getTotalXP());
  },

  // Run the current editor query
  async runQuery() {
    if (this.isRunning) return;
    this.isRunning = true;

    const runBtn = document.getElementById('btn-run');
    if (runBtn) { runBtn.classList.add('running'); runBtn.textContent = '⏳ Running...'; }

    const sql = this.editor ? this.editor.getValue().trim() : '';
    if (!sql || sql === '-- Write your SQL here\n') {
      UI.showToast('Write a SQL query first!', 'warning');
      this.isRunning = false;
      if (runBtn) { runBtn.classList.remove('running'); runBtn.textContent = '▶ Run Query'; }
      return;
    }

    UI.showLoading('output-container', 'Executing query...');

    // Small delay for effect
    await new Promise(r => setTimeout(r, 300));

    let result;
    try {
      const raw = Engine.execute(sql);
      result = Engine.formatResult(raw);
      UI.renderTable(result, 'output-container');
    } catch (e) {
      result = { error: e.message };
      UI.renderError(e.message, 'output-container');
    }

    // Validate
    const validation = Validator.validate(this.currentSublevel, result);
    this.showFeedback(validation);

    if (validation.pass) {
      this.onSublevelComplete(validation.stars);
    }

    this.isRunning = false;
    if (runBtn) { runBtn.classList.remove('running'); runBtn.textContent = '▶ Run Query'; }
  },

  showFeedback(validation) {
    const feedbackEl = document.getElementById('feedback-area');
    if (!feedbackEl) return;

    feedbackEl.innerHTML = `
      <div class="feedback ${validation.pass ? 'feedback-pass' : 'feedback-fail'}">
        <span class="feedback-msg">${validation.message}</span>
        ${validation.detail ? `<div class="feedback-detail">${validation.detail}</div>` : ''}
        ${validation.pass ? `<div class="feedback-stars">${UI.renderStars(validation.stars)}</div>` : ''}
      </div>
    `;

    if (!validation.pass) {
      UI.shake(feedbackEl);
      // Also shake the editor wrapper for the "wrong answer" feel
      const ew = document.querySelector('.editor-wrapper');
      if (ew) {
        ew.classList.remove('editor-shake');
        void ew.offsetWidth; // force reflow
        ew.style.boxShadow = '0 0 0 2px rgba(247,37,133,0.7)';
        ew.classList.add('editor-shake');
        setTimeout(() => { ew.classList.remove('editor-shake'); ew.style.boxShadow = ''; }, 550);
      }
    }
  },

  onSublevelComplete(stars) {
    const sublevel = this.currentSublevel;
    const newState = Progress.completeSublevel(sublevel.id, stars, sublevel.xp);
    UI.updateXPBar(newState.xp);
    UI.showXPGain(sublevel.xp, document.getElementById('btn-run'));
    UI.showToast(`+${sublevel.xp} XP earned! 🎉`, 'xp', 2000);

    // Auto-advance after 1.8s
    setTimeout(() => {
      const nextIndex = this.currentSublevelIndex + 1;
      if (nextIndex < this.currentLevel.sublevels.length) {
        this.loadSublevel(nextIndex);
        UI.showToast('Next challenge loaded! 🚀', 'info', 1500);
      } else {
        this.onLevelComplete();
      }
    }, 1800);
  },

  onLevelComplete() {
    UI.triggerConfetti();
    const modal = document.getElementById('level-complete-modal');
    if (!modal) return;

    const xp = Progress.getTotalXP();
    const info = Progress.getPlayerLevel(xp);

    document.getElementById('modal-level-name').textContent = this.currentLevel.title;
    document.getElementById('modal-xp-total').textContent = xp;
    document.getElementById('modal-player-title').textContent = info.title;

    modal.classList.add('modal-show');
    setTimeout(() => modal.classList.add('modal-animate'), 50);
  },

  showHint() {
    const hints = this.currentSublevel?.hints;
    if (!hints || hints.length === 0) return;

    const hintEl = document.getElementById('hint-display');
    const hintBtn = document.getElementById('btn-hint');

    if (this.hintIndex < hints.length) {
      const hint = hints[this.hintIndex];
      const hintItem = document.createElement('div');
      hintItem.className = 'hint-item hint-reveal';
      hintItem.innerHTML = `<span class="hint-num">${this.hintIndex + 1}</span> ${hint}`;
      hintEl.appendChild(hintItem);
      this.hintIndex++;

      const remaining = hints.length - this.hintIndex;
      if (hintBtn) hintBtn.textContent = `💡 Hint${remaining > 0 ? ` (${remaining} left)` : ' (no more)'}`;
      if (this.hintIndex >= hints.length && hintBtn) hintBtn.disabled = true;
    }
  },

  showSolution() {
    if (!this.currentSublevel) return;
    const solution = this.currentSublevel.solution;
    if (this.editor) {
      this.editor.setValue(solution);
    }
    UI.showToast('Solution loaded — study it! 📚', 'info', 2500);
  },

  goToMap() {
    window.location.href = 'index.html';
  },
};
