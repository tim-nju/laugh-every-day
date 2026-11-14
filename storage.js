const STORAGE_KEYS = {
  PROFILE: 'laugh_humor_profile',
  STREAK: 'laugh_streaks',
  FAVORITES: 'laugh_favorites',
  HISTORY: 'laugh_daily_history'
};

const StorageService = {
  getProfile() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  saveProfile(profile) {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
      return true;
    } catch (e) {
      return false;
    }
  },

  getStreak() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STREAK);
      if (!data) return { count: 1, lastDate: new Date().toISOString().slice(0, 10) };
      return JSON.parse(data);
    } catch (e) {
      return { count: 1, lastDate: new Date().toISOString().slice(0, 10) };
    }
  },

  incrementStreak() {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const current = this.getStreak();
      if (current.lastDate !== today) {
        const next = { count: current.count + 1, lastDate: today };
        localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(next));
        return next;
      }
      return current;
    } catch (e) {
      return { count: 1, lastDate: new Date().toISOString().slice(0, 10) };
    }
  },

  getFavorites() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  toggleFavorite(item) {
    try {
      const list = this.getFavorites();
      const idx = list.findIndex(x => x.id === item.id);
      let isFav = false;
      if (idx >= 0) {
        list.splice(idx, 1);
        isFav = false;
      } else {
        list.unshift(item);
        isFav = true;
      }
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(list));
      return { isFav, list };
    } catch (e) {
      return { isFav: false, list: [] };
    }
  },

  isFavorite(itemId) {
    const list = this.getFavorites();
    return list.some(x => x.id === itemId);
  },

  updateWeights(category, delta) {
    const profile = this.getProfile();
    if (!profile || !profile.weights) return null;
    const current = profile.weights[category] || 15;
    const updated = Math.max(5, Math.min(60, current + delta));
    profile.weights[category] = updated;
    this.saveProfile(profile);
    return profile;
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { StorageService };
}
