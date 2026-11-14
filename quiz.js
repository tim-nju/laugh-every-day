const QuizEngine = {
  currentQuestionIndex: 0,
  answers: {},

  init(containerElement, onCompletedCallback) {
    this.container = containerElement;
    this.onCompleted = onCompletedCallback;
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.renderQuestion();
  },

  renderQuestion() {
    if (!this.container) return;
    const q = QUIZ_QUESTIONS[this.currentQuestionIndex];
    if (!q) {
      this.finishQuiz();
      return;
    }

    const categoryMeta = HUMOR_CATEGORIES[q.category] || {};
    const progressPercent = Math.round(((this.currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100);

    this.container.innerHTML = `
      <div class="quiz-card fade-in">
        <div class="quiz-header">
          <div class="quiz-badge">${q.badge} · ${categoryMeta.name || ''}</div>
          <div class="quiz-progress-text">${this.currentQuestionIndex + 1} / ${QUIZ_QUESTIONS.length}</div>
        </div>

        <div class="quiz-progress-bar-wrap">
          <div class="quiz-progress-bar-fill" style="width: ${progressPercent}%;"></div>
        </div>

        <div class="quiz-question-box">
          <h3 class="quiz-sample-title">${q.title}</h3>
          <div class="quiz-sample-body">${q.content.replace(/\n/g, '<br/>')}</div>
          ${q.punchline ? `<div class="quiz-sample-punchline">${q.punchline}</div>` : ''}
        </div>

        <div class="quiz-reaction-prompt">
          <span class="prompt-icon">🧪</span>
          <span class="prompt-text">测测你的笑穴：这个段子戳中你了吗？</span>
        </div>

        <div class="quiz-options-grid">
          <button class="quiz-btn" data-score="0">
            <span class="btn-emoji">😐</span>
            <span class="btn-label">毫无波澜</span>
            <span class="btn-sub">略显尴尬 / 不感冒</span>
          </button>
          <button class="quiz-btn" data-score="1">
            <span class="btn-emoji">🙂</span>
            <span class="btn-label">嘴角微扬</span>
            <span class="btn-sub">有点意思 / 挺巧妙</span>
          </button>
          <button class="quiz-btn" data-score="2">
            <span class="btn-emoji">😄</span>
            <span class="btn-label">噗嗤一笑</span>
            <span class="btn-sub">哈哈戳中 / 真实搞到</span>
          </button>
          <button class="quiz-btn" data-score="3">
            <span class="btn-emoji">🤣</span>
            <span class="btn-label">拍大腿笑出声</span>
            <span class="btn-sub">绝了！就是这味！</span>
          </button>
        </div>
      </div>
    `;

    const buttons = this.container.querySelectorAll('.quiz-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const score = parseInt(btn.getAttribute('data-score'), 10);
        this.handleAnswer(q.category, score);
      });
    });
  },

  handleAnswer(category, score) {
    this.answers[category] = score;
    this.currentQuestionIndex += 1;
    if (this.currentQuestionIndex < QUIZ_QUESTIONS.length) {
      this.renderQuestion();
    } else {
      this.finishQuiz();
    }
  },

  calculateProfile(answers) {
    const rawScores = {};
    for (const key of Object.keys(HUMOR_CATEGORIES)) {
      rawScores[key] = (answers[key] !== undefined ? answers[key] : 1) + 1;
    }

    const total = Object.values(rawScores).reduce((a, b) => a + b, 0) || 1;
    const weights = {};
    for (const [cat, val] of Object.entries(rawScores)) {
      weights[cat] = Math.round((val / total) * 100);
    }

    const sorted = Object.entries(weights).sort((a, b) => b[1] - a[1]);
    const primaryType = sorted[0][0];
    const secondaryType = sorted[1][0];

    const titleMap = {
      self_deprecation: '坦诚硬核哲学家',
      deadpan_wit: '冷面笑匠 · 降维打击者',
      social_satire: '人间真实解构大师',
      absurdist: '四维脑洞漫游家',
      animal_chaos: '纯氧治愈星人',
      visual_fails: '物理法则逆行观察家'
    };

    const title = titleMap[primaryType] || '全能乐天派';

    const profile = {
      calibratedAt: new Date().toISOString(),
      weights,
      primaryType,
      secondaryType,
      title,
      completedQuiz: true
    };

    StorageService.saveProfile(profile);
    return profile;
  },

  finishQuiz() {
    const profile = this.calculateProfile(this.answers);
    this.renderResult(profile);
    if (typeof this.onCompleted === 'function') {
      this.onCompleted(profile);
    }
  },

  renderResult(profile) {
    if (!this.container) return;
    const radarSvg = this.generateRadarSvg(profile.weights);

    const breakdownHtml = Object.entries(profile.weights).map(([cat, percent]) => {
      const meta = HUMOR_CATEGORIES[cat] || {};
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

    this.container.innerHTML = `
      <div class="quiz-result-card fade-in">
        <div class="result-header">
          <div class="result-pretitle">🎯 专属笑点雷达已生成</div>
          <h2 class="result-title">${profile.title}</h2>
          <p class="result-subtitle">
            你的第一大笑点是 <strong>${HUMOR_CATEGORIES[profile.primaryType].name}</strong>，
            辅以 <strong>${HUMOR_CATEGORIES[profile.secondaryType].name}</strong>。
            你的幽默品味追求真实与智慧，抗拒低俗与虚假罐头笑声。
          </p>
        </div>

        <div class="result-body-grid">
          <div class="result-radar-box">
            ${radarSvg}
          </div>
          <div class="result-breakdown-box">
            ${breakdownHtml}
          </div>
        </div>

        <div class="result-action-bar">
          <button id="btn-start-capsule" class="primary-capsule-btn">
            <span class="pill-icon">💊</span>
            <span class="pill-text">开启今日专属 10 分钟开心胶囊</span>
          </button>
          <button id="btn-retake-quiz" class="secondary-btn">
            重新校准笑点
          </button>
        </div>
      </div>
    `;

    document.getElementById('btn-start-capsule')?.addEventListener('click', () => {
      if (window.App) {
        window.App.startDailyCapsule();
      }
    });

    document.getElementById('btn-retake-quiz')?.addEventListener('click', () => {
      this.init(this.container, this.onCompleted);
    });
  },

  generateRadarSvg(weights) {
    const size = 320;
    const center = size / 2;
    const radius = 105;
    const categories = Object.keys(HUMOR_CATEGORIES);
    const totalPoints = categories.length;

    const angleStep = (Math.PI * 2) / totalPoints;
    const getPoint = (valRatio, index) => {
      const angle = index * angleStep - Math.PI / 2;
      const r = radius * valRatio;
      return {
        x: center + r * Math.cos(angle),
        y: center + r * Math.sin(angle)
      };
    };

    let gridLevels = [0.25, 0.5, 0.75, 1.0];
    let gridPolygons = gridLevels.map(level => {
      let pts = [];
      for (let i = 0; i < totalPoints; i++) {
        let p = getPoint(level, i);
        pts.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`);
      }
      return `<polygon points="${pts.join(' ')}" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>`;
    }).join('');

    let axisLines = [];
    let labels = [];
    for (let i = 0; i < totalPoints; i++) {
      let pOuter = getPoint(1.0, i);
      axisLines.push(`<line x1="${center}" y1="${center}" x2="${pOuter.x.toFixed(1)}" y2="${pOuter.y.toFixed(1)}" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>`);

      let pLabel = getPoint(1.28, i);
      let cat = categories[i];
      let meta = HUMOR_CATEGORIES[cat] || {};
      labels.push(`
        <text x="${pLabel.x.toFixed(1)}" y="${pLabel.y.toFixed(1)}" 
          fill="#E2E8F0" font-size="11" font-weight="600" text-anchor="middle" dominant-baseline="central">
          ${meta.icon} ${meta.name.slice(0, 4)}
        </text>
      `);
    }

    let dataPoints = [];
    for (let i = 0; i < totalPoints; i++) {
      let cat = categories[i];
      let val = weights[cat] || 15;
      let ratio = Math.max(0.2, Math.min(1.0, val / 45));
      let p = getPoint(ratio, i);
      dataPoints.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`);
    }

    return `
      <svg viewBox="0 0 ${size} ${size}" class="radar-svg" width="100%" height="auto">
        <circle cx="${center}" cy="${center}" r="${radius}" fill="rgba(255,255,255,0.02)"/>
        ${gridPolygons}
        ${axisLines.join('')}
        <polygon points="${dataPoints.join(' ')}" fill="rgba(255, 107, 107, 0.35)" stroke="#FF6B6B" stroke-width="2.5"/>
        ${dataPoints.map(pt => {
          let [x, y] = pt.split(',');
          return `<circle cx="${x}" cy="${y}" r="4" fill="#FFD93D" stroke="#1A1C23" stroke-width="2"/>`;
        }).join('')}
        ${labels.join('')}
      </svg>
    `;
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { QuizEngine };
}
