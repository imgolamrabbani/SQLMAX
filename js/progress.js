// progress.js — XP, stars, level completion, localStorage
const Progress = {
  KEY: 'sqlmax_progress_v2',

  defaultState() {
    return {
      xp: 0,
      level: 1,
      unlockedWorlds: ['world1'],
      completedSublevels: {},  // sublevelId -> { stars, xp }
      completedLevels: {},     // levelId -> { stars }
      worldStars: {},          // worldId -> totalStars
    };
  },

  load() {
    try {
      const raw = localStorage.getItem(this.KEY);
      if (!raw) return this.defaultState();
      return { ...this.defaultState(), ...JSON.parse(raw) };
    } catch (e) {
      return this.defaultState();
    }
  },

  save(state) {
    localStorage.setItem(this.KEY, JSON.stringify(state));
  },

  getState() {
    return this.load();
  },

  getTotalXP() {
    return this.load().xp;
  },

  getSublevelStatus(sublevelId) {
    const state = this.load();
    return state.completedSublevels[sublevelId] || null;
  },

  getLevelStatus(levelId) {
    const state = this.load();
    return state.completedLevels[levelId] || null;
  },

  isWorldUnlocked(worldId) {
    const state = this.load();
    return state.unlockedWorlds.includes(worldId);
  },

  completeSublevel(sublevelId, stars, xpEarned) {
    const state = this.load();
    const existing = state.completedSublevels[sublevelId];

    // Only update if better performance
    if (!existing || stars > existing.stars) {
      state.completedSublevels[sublevelId] = { stars, xp: xpEarned };
      if (!existing) {
        state.xp += xpEarned;
      } else {
        state.xp += Math.max(0, xpEarned - existing.xp);
      }
    }

    // Check XP thresholds for world unlocks
    const thresholds = [
      { worldId: 'world2', xp: 400 },
      { worldId: 'world3', xp: 800 },
      { worldId: 'world4', xp: 1200 },
    ];
    for (const t of thresholds) {
      if (state.xp >= t.xp && !state.unlockedWorlds.includes(t.worldId)) {
        state.unlockedWorlds.push(t.worldId);
      }
    }

    this.save(state);
    return state;
  },

  getPlayerLevel(xp) {
    if (xp < 200)  return { level: 1, title: 'SELECT Novice',  next: 200 };
    if (xp < 500)  return { level: 2, title: 'WHERE Warrior',  next: 500 };
    if (xp < 900)  return { level: 3, title: 'JOIN Journeyman', next: 900 };
    if (xp < 1400) return { level: 4, title: 'GROUP BY Guru',   next: 1400 };
    if (xp < 2000) return { level: 5, title: 'HAVING Hero',     next: 2000 };
    return { level: 6, title: 'SQL Master', next: null };
  },

  resetAll() {
    localStorage.removeItem(this.KEY);
  },
};
