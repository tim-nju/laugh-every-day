const App = {
  currentView: 'quiz',
  activeCapsule: null,
  timerInterval: null,
  remainingSeconds: 600,
  currentItemIndex: 0,
  isPaused: false,

  async init() {
    window.App = this;
    this.bindNav();
    const profile = StorageService.getProfile();
    if (!profile || !profile.completedQuiz) {
      this.switchView('quiz');
      QuizEngine.init(document.getElementById('quiz-view-container'), (newProfile) => {
        this.updateHeaderProfileBadge(newProfile);
      });
    } else {
      this.updateHeaderProfileBadge(profile);
      this.switchView('capsule');
      await this.prepareDailyCapsule(profile);
    }
  },

  bindNav() {
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.getAttribute('data-view');
        this.switchView(view);
      });
    });

    document.getElementById('btn-header-retake')?.addEventListener('click', () => {
      this.switchView('quiz');
      QuizEngine.init(document.getElementById('quiz-view-container'), (newProfile) => {
        this.updateHeaderProfileBadge(newProfile);
      });
    });
  },

  switchView(viewName) {
    this.currentView = viewName;
    document.querySelectorAll('.view-panel').forEach(p => p.classList.add('hidden'));
    document.querySelectorAll('.nav-tab-btn').forEach(b => b.classList.remove('active'));

    const targetPanel = document.getElementById(`view-${viewName}`);
    const targetNav = document.querySelector(`.nav-tab-btn[data-view="${viewName}"]`);
    if (targetPanel) targetPanel.classList.remove('hidden');
    if (targetNav) targetNav.classList.add('active');

    if (viewName === 'radar') {
      this.renderRadarDashboard();
    } else if (viewName === 'favorites') {
      this.renderFavorites();
    }
  },

  updateHeaderProfileBadge(profile) {
    const badgeEl = document.getElementById('header-profile-tag');
    if (badgeEl && profile) {
      badgeEl.innerHTML = `🎯 ${profile.title}`;
      badgeEl.classList.remove('hidden');
    }
    const streak = StorageService.getStreak();
    const streakEl = document.getElementById('header-streak-badge');
    if (streakEl) {
      streakEl.innerHTML = `🔥 连续开心 ${streak.count} 天`;
    }
  },

  async prepareDailyCapsule(profile) {
    let items = [];
    try {
      const res = await fetch('./daily_capsule.json');
      if (res.ok) {
        const huntedData = await res.json();
        if (huntedData && Array.isArray(huntedData.items) && huntedData.items.length > 0) {
          items = huntedData.items;
        }
      }
    } catch (e) {}

    if (items.length === 0) {
      const weights = profile?.weights || {};
      const textPool = LAUGH_LIBRARY.filter(x => x.type === 'text');
      const imagePool = LAUGH_LIBRARY.filter(x => x.type === 'image');
      const videoPool = LAUGH_LIBRARY.filter(x => x.type === 'video');

      const scoreItem = (item) => {
        const w = weights[item.category] || 20;
        return w + Math.random() * 20;
      };

      const sortedText = [...textPool].sort((a, b) => scoreItem(b) - scoreItem(a));
      const sortedImage = [...imagePool].sort((a, b) => scoreItem(b) - scoreItem(a));
      const sortedVideo = [...videoPool].sort((a, b) => scoreItem(b) - scoreItem(a));

      items = [
        ...sortedText.slice(0, 5),
        ...sortedImage.slice(0, 3),
        ...sortedVideo.slice(0, 2)
      ];
    }

    this.activeCapsule = {
      date: new Date().toISOString().slice(0, 10),
      items: items,
      totalCount: items.length,
      timeSpent: 0
    };

    this.currentItemIndex = 0;
    this.remainingSeconds = 600;
    this.renderCapsulePlayer();
  },

  async startDailyCapsule() {
    const profile = StorageService.getProfile();
    this.switchView('capsule');
    await this.prepareDailyCapsule(profile);
    this.startTimer();
  },

  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (!this.isPaused && this.remainingSeconds > 0) {
        this.remainingSeconds -= 1;
        this.updateTimerDisplay();
        if (this.remainingSeconds <= 0) {
          this.completeCapsule();
        }
      }
    }, 1000);
  },

  updateTimerDisplay() {
    const timerTextEl = document.getElementById('capsule-timer-val');
    const timerFillEl = document.getElementById('capsule-timer-fill');
    if (!timerTextEl || !timerFillEl) return;

    const mins = Math.floor(this.remainingSeconds / 60);
    const secs = this.remainingSeconds % 60;
    const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    timerTextEl.textContent = formatted;

    const percent = ((600 - this.remainingSeconds) / 600) * 100;
    timerFillEl.style.width = `${percent}%`;
  },

  renderCapsulePlayer() {
    const container = document.getElementById('capsule-player-container');
    if (!container || !this.activeCapsule) return;

    const item = this.activeCapsule.items[this.currentItemIndex];
    if (!item) {
      this.completeCapsule();
      return;
    }

    const catMeta = HUMOR_CATEGORIES[item.category] || { name: '杨波冷面一句话', color: '#4D96FF', icon: '🧊' };
    const isFav = StorageService.isFavorite(item.id);

    let contentHtml = '';
    if (item.type === 'text') {
      contentHtml = `
        <div class="capsule-text-card">
          <div class="text-stage-tag">环节一：冷面连环炮 · 暴击一句话 (${this.currentItemIndex + 1}/${this.activeCapsule.totalCount})</div>
          <h2 class="capsule-content-title">${item.title}</h2>
          <div class="capsule-content-body">${item.body.replace(/\n/g, '<br/>')}</div>
          ${item.punchline ? `<div class="capsule-punchline-box">${item.punchline}</div>` : ''}
          <div class="capsule-source-meta">来源：${item.authorOrSource} · 建议品味时长 25-35秒</div>
        </div>
      `;
    } else if (item.type === 'image') {
      contentHtml = `
        <div class="capsule-image-card">
          <div class="text-stage-tag">环节二：多巴胺充能 · 绝妙神图 (${this.currentItemIndex + 1}/${this.activeCapsule.totalCount})</div>
          <h2 class="capsule-content-title">${item.title}</h2>
          <div class="capsule-image-viewport">
            <img src="${item.mediaUrl}" alt="${item.title}" class="capsule-media-img" />
          </div>
          <div class="capsule-content-body image-caption">${item.body}</div>
          ${item.punchline ? `<div class="capsule-punchline-box">${item.punchline}</div>` : ''}
        </div>
      `;
    } else if (item.type === 'video') {
      contentHtml = `
        <div class="capsule-video-card">
          <div class="text-stage-tag">环节三：笑穴失守 · 高能舞台微视频 (${this.currentItemIndex + 1}/${this.activeCapsule.totalCount})</div>
          <h2 class="capsule-content-title">${item.title}</h2>
          <div class="capsule-video-player-wrap">
            <div class="interactive-stage-sim" id="video-sim-${item.id}">
              <div class="sim-overlay-badge">🎬 高能脱口秀短片</div>
              <div class="sim-visual-canvas">
                ${this.renderVideoSimulationVisual(item)}
              </div>
              <div class="sim-caption">${item.interactiveSimulation?.caption || item.title}</div>
            </div>
          </div>
          <div class="capsule-content-body">${item.body}</div>
        </div>
      `;
    }

    container.innerHTML = `
      <div class="capsule-play-shell fade-in">
        <div class="capsule-meta-bar">
          <div class="meta-cat-badge" style="background-color: ${catMeta.color}22; color: ${catMeta.color}; border: 1px solid ${catMeta.color}55;">
            ${catMeta.icon} ${catMeta.name}
          </div>
          <div class="meta-step-indicator">
            ${this.activeCapsule.items.map((it, idx) => `
              <span class="step-dot ${idx === this.currentItemIndex ? 'active' : (idx < this.currentItemIndex ? 'done' : '')}"></span>
            `).join('')}
          </div>
        </div>

        <div class="capsule-main-card">
          ${contentHtml}
        </div>

        <div class="capsule-reaction-bar">
          <button class="reaction-btn react-laugh" id="btn-react-laugh">
            <span class="btn-emoji">🤣</span>
            <span class="btn-text">笑出声了 (+5%)</span>
          </button>
          <button class="reaction-btn react-neutral" id="btn-react-neutral">
            <span class="btn-emoji">🙂</span>
            <span class="btn-text">还行</span>
          </button>
          <button class="reaction-btn react-dislike" id="btn-react-dislike">
            <span class="btn-emoji">🙅</span>
            <span class="btn-text">少推此类 (-15%)</span>
          </button>
          <button class="reaction-btn react-fav ${isFav ? 'is-favorited' : ''}" id="btn-react-fav">
            <span class="btn-emoji">${isFav ? '★' : '☆'}</span>
            <span class="btn-text">${isFav ? '已收藏' : '收藏'}</span>
          </button>
        </div>

        <div class="capsule-flow-controls">
          <button class="nav-flow-btn" id="btn-capsule-prev" ${this.currentItemIndex === 0 ? 'disabled' : ''}>
            上一条
          </button>
          <button class="nav-flow-btn primary-next" id="btn-capsule-next">
            ${this.currentItemIndex === this.activeCapsule.totalCount - 1 ? '完成今日药方 🎉' : '下一条 ➔'}
          </button>
        </div>
      </div>
    `;

    document.getElementById('btn-react-laugh')?.addEventListener('click', () => {
      this.handleReaction(item, 'laugh');
    });

    document.getElementById('btn-react-neutral')?.addEventListener('click', () => {
      this.handleReaction(item, 'neutral');
    });

    document.getElementById('btn-react-dislike')?.addEventListener('click', () => {
      this.handleReaction(item, 'dislike');
    });

    document.getElementById('btn-react-fav')?.addEventListener('click', () => {
      const res = StorageService.toggleFavorite(item);
      const favBtn = document.getElementById('btn-react-fav');
      if (favBtn) {
        favBtn.classList.toggle('is-favorited', res.isFav);
        favBtn.querySelector('.btn-emoji').textContent = res.isFav ? '★' : '☆';
        favBtn.querySelector('.btn-text').textContent = res.isFav ? '已收藏' : '收藏';
      }
    });

    document.getElementById('btn-capsule-prev')?.addEventListener('click', () => {
      if (this.currentItemIndex > 0) {
        this.currentItemIndex -= 1;
        this.renderCapsulePlayer();
      }
    });

    document.getElementById('btn-capsule-next')?.addEventListener('click', () => {
      this.nextItem();
    });
  },

  renderVideoSimulationVisual(item) {
    return `
      <svg viewBox="0 0 500 240" class="sim-svg">
        <rect width="500" height="240" fill="#11131A"/>
        <circle cx="250" cy="110" r="40" fill="#FBD38D"/>
        <path d="M 210 160 L 290 160 L 280 230 L 220 230 Z" fill="#2E384D"/>
        <rect x="235" y="75" width="30" height="15" rx="5" fill="#1A202C"/>
        <line x1="240" y1="112" x2="260" y2="112" stroke="#1A202C" stroke-width="3" stroke-linecap="round"/>
        <line x1="320" y1="90" x2="320" y2="230" stroke="#718096" stroke-width="4"/>
        <circle cx="320" cy="90" r="10" fill="#A0AEC0"/>
        <text x="250" y="40" fill="#FFD93D" font-size="16" font-weight="bold" text-anchor="middle">🎙️ 杨波经典冷面现场实录</text>
        <rect x="80" y="190" width="340" height="35" rx="6" fill="#1A1D27" stroke="#FF6B6B" stroke-width="1.5"/>
        <text x="250" y="213" fill="#FFF" font-size="13" font-weight="600" text-anchor="middle">“波儿，下来吧，树上风大，回家喝汤了。”</text>
      </svg>
    `;
  },

  handleReaction(item, type) {
    if (type === 'laugh') {
      StorageService.updateWeights(item.category, 5);
      this.triggerConfetti();
      this.showToast('🤣 笑点精准击中！已增加此类幽默权重 +5%');
    } else if (type === 'neutral') {
      this.showToast('🙂 记录反馈：平稳吸收');
    } else if (type === 'dislike') {
      StorageService.updateWeights(item.category, -15);
      this.showToast('🙅 已降低此类幽默权重 -15%，为您切换下一条');
      setTimeout(() => this.nextItem(), 500);
    }
  },

  nextItem() {
    if (this.currentItemIndex < this.activeCapsule.items.length - 1) {
      this.currentItemIndex += 1;
      this.renderCapsulePlayer();
    } else {
      this.completeCapsule();
    }
  },

  completeCapsule() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    const streak = StorageService.incrementStreak();
    this.triggerConfetti();

    const container = document.getElementById('capsule-player-container');
    if (!container) return;

    container.innerHTML = `
      <div class="completion-card fade-in">
        <div class="completion-icon">🎉</div>
        <h2 class="completion-title">今日份 10 分钟开心药方吸收完毕！</h2>
        <div class="completion-subtitle">
          恭喜你！高能量电池已充至 100%。有边界的主动欢笑，没有虚无的信息流负罪感。
        </div>

        <div class="completion-streak-banner">
          <span class="streak-fire">🔥</span>
          <span class="streak-text">已连续打卡 <strong>${streak.count}</strong> 天 · 快乐增量持续复利</span>
        </div>

        <div class="completion-actions">
          <button class="primary-capsule-btn" id="btn-re-read">
            再看一遍今日收藏
          </button>
          <button class="secondary-btn" id="btn-view-radar">
            查看我的笑点画像
          </button>
        </div>
      </div>
    `;

    document.getElementById('btn-re-read')?.addEventListener('click', () => {
      this.switchView('favorites');
    });

    document.getElementById('btn-view-radar')?.addEventListener('click', () => {
      this.switchView('radar');
    });
  },

  renderRadarDashboard() {
    const container = document.getElementById('radar-view-container');
    if (!container) return;

    const profile = StorageService.getProfile();
    if (!profile) {
      container.innerHTML = `
        <div class="empty-state">
          <p>尚未进行笑点校准，请先完成评测。</p>
          <button class="primary-capsule-btn" onclick="App.switchView('quiz')">去评测</button>
        </div>
      `;
      return;
    }

    const radarSvg = QuizEngine.generateRadarSvg(profile.weights);
    const breakdownHtml = Object.entries(profile.weights).map(([cat, percent]) => {
      const meta = HUMOR_CATEGORIES[cat] || { name: cat, color: '#4D96FF', icon: '🧊' };
      return `
        <div class="result-breakdown-row">
          <span class="row-icon">${meta.icon}</span>
          <span class="row-name">${meta.name}</span>
          <div class="row-bar-track">
            <div class="row-bar-fill" style="width: ${percent}%; background-color: ${meta.color};"></div>
          </div>
          <span class="row-val">${percent}%</span>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="radar-dashboard-card fade-in">
        <div class="dashboard-header">
          <div class="result-pretitle">📊 个人笑点雷达全景</div>
          <h2 class="result-title">${profile.title}</h2>
          <p class="result-subtitle">校准时间：${profile.calibratedAt.slice(0, 10)} · 持续根据你的每日点赞与跳过动态演进</p>
        </div>

        <div class="result-body-grid">
          <div class="result-radar-box">${radarSvg}</div>
          <div class="result-breakdown-box">${breakdownHtml}</div>
        </div>

        <div class="radar-actions">
          <button class="primary-capsule-btn" onclick="App.startDailyCapsule()">开启今日胶囊</button>
          <button class="secondary-btn" id="btn-recalibrate">重新完整测算</button>
        </div>
      </div>
    `;

    document.getElementById('btn-recalibrate')?.addEventListener('click', () => {
      this.switchView('quiz');
      QuizEngine.init(document.getElementById('quiz-view-container'), (p) => {
        this.updateHeaderProfileBadge(p);
      });
    });
  },

  renderFavorites() {
    const container = document.getElementById('favorites-view-container');
    if (!container) return;

    const list = StorageService.getFavorites();
    if (!list || list.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">⭐</div>
          <h3>笑点弹药库暂时为空</h3>
          <p>在每日开心胶囊中点击“收藏”，随时回顾能让你真正笑出声的高能瞬间。</p>
          <button class="primary-capsule-btn" onclick="App.startDailyCapsule()">去体验今日胶囊</button>
        </div>
      `;
      return;
    }

    const cardsHtml = list.map(item => {
      const meta = HUMOR_CATEGORIES[item.category] || { name: '杨波冷面一句话', color: '#4D96FF', icon: '🧊' };
      return `
        <div class="fav-card">
          <div class="fav-badge" style="color: ${meta.color};">${meta.icon} ${meta.name}</div>
          <h4 class="fav-title">${item.title}</h4>
          <div class="fav-body">${item.body}</div>
          ${item.punchline ? `<div class="fav-punchline">${item.punchline}</div>` : ''}
          <div class="fav-footer">
            <span class="fav-source">${item.authorOrSource || ''}</span>
            <button class="unfav-btn" data-id="${item.id}">移除收藏</button>
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="favorites-shell fade-in">
        <div class="fav-header">
          <h2>⭐ 我的笑点弹药库 (${list.length} 条珍藏)</h2>
          <p>专治一切不开心与内耗的私人高能储备</p>
        </div>
        <div class="fav-list-grid">
          ${cardsHtml}
        </div>
      </div>
    `;

    container.querySelectorAll('.unfav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const item = list.find(x => x.id === id);
        if (item) {
          StorageService.toggleFavorite(item);
          this.renderFavorites();
        }
      });
    });
  },

  triggerConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#FF6B6B', '#4D96FF', '#FFD93D', '#6BCB77', '#9D4EDD', '#FF9234'];
    for (let i = 0; i < 70; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.7) * 16,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vr: (Math.random() - 0.5) * 10,
        alpha: 1
      });
    }

    let frames = 0;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3;
        p.rotation += p.vr;
        p.alpha -= 0.015;
        if (p.alpha > 0) {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });
      frames++;
      if (frames < 70) {
        requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
    requestAnimationFrame(render);
  },

  showToast(message) {
    let toast = document.getElementById('app-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'app-toast';
      toast.className = 'app-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2400);
  }
};

window.addEventListener('DOMContentLoaded', () => {
  App.init();
});
