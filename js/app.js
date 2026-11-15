/* Điều hướng giữa các màn hình theo địa chỉ dạng #/lop/<lớp>/<môn>/<bài>/... */
(() => {
  const app = document.getElementById('app');
  const btnBack = document.getElementById('btnBack');
  const btnSound = document.getElementById('btnSound');

  const GRADES = [
    { n: 1, icon: '🐣', color: '#ff6b6b' },
    { n: 2, icon: '🐥', color: '#ffa94d' },
    { n: 3, icon: '🦊', color: '#51cf66' },
    { n: 4, icon: '🐬', color: '#339af0' },
    { n: 5, icon: '🦉', color: '#9775fa' },
  ];
  const SUBJECTS = [
    { id: 'tapviet', name: 'Tập viết', icon: '✏️', desc: 'Tô chữ theo mẫu trên vở ô li', color: '#ff7aa2', prefix: 'tv' },
    { id: 'toan', name: 'Toán', icon: '🔢', desc: 'Đếm, tính toán, hình học', color: '#3a86ff', prefix: 'toan' },
    { id: 'tienganh', name: 'Tiếng Anh', icon: '🔤', desc: 'Từ vựng có hình và giọng đọc', color: '#2ec4b6', prefix: 'ta' },
  ];
  const lessonCount = (g, id) => ({ tapviet: TV_DATA[g], toan: Toan.topics[g], tienganh: TA_DATA[g] }[id].length);
  const gradeStars = (g) => SUBJECTS.reduce((s, x) => s + U.totalStars(`${x.prefix}/${g}/`), 0);

  let cleanup = null;
  const parse = () => location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
  const go = (parts) => { location.hash = `#/${parts.join('/')}`; };

  /* Lùi một cấp. Riêng Tập viết: từ màn luyện chữ về thẳng danh sách bài. */
  function up() {
    const p = parse();
    if (!p.length) return;
    p.pop();
    if (p[2] === 'tapviet' && p.length === 4) p.length = 3;
    if (p.length === 1) p.length = 0;
    go(p);
  }

  function frame(crumbs, title) {
    const nav = crumbs
      .map(([t, href], i) => (href && i < crumbs.length - 1 ? `<a href="${href}">${t}</a>` : `<span>${t}</span>`))
      .join('<span class="sep">›</span>');
    app.innerHTML = `<nav class="crumbs">${nav}</nav>${title ? `<h2 class="screen-title">${title}</h2>` : ''}<div class="screen"></div>`;
    return app.querySelector('.screen');
  }

  function home() {
    app.innerHTML = `
      <section class="hero">
        <div class="mascot">🦉</div>
        <h1>Bé Vui Học</h1>
        <p>Tập viết · Toán · Tiếng Anh — chọn lớp của bé để bắt đầu nhé!</p>
      </section>
      <div class="grid grades">${GRADES.map((g) => `
        <a class="card" href="#/lop/${g.n}" style="--c:${g.color}">
          <div class="big">${g.icon}</div>
          <div class="title">Lớp ${g.n}</div>
          <div class="sub">⭐ ${gradeStars(g.n)} sao</div>
        </a>`).join('')}</div>`;
  }

  function gradeScreen(g) {
    const screen = frame([['🏠 Trang chủ', '#/'], [`Lớp ${g}`]], `${GRADES[g - 1].icon} Lớp ${g} – Bé muốn học môn gì?`);
    screen.innerHTML = `<div class="grid subjects">${SUBJECTS.map((s) => `
      <a class="card" href="#/lop/${g}/${s.id}" style="--c:${s.color}">
        <div class="big">${s.icon}</div>
        <div class="title">${s.name}</div>
        <div class="sub">${s.desc}</div>
        <div class="sub">${lessonCount(g, s.id)} bài · ⭐ ${U.totalStars(`${s.prefix}/${g}/`)}</div>
      </a>`).join('')}</div>`;
  }

  function toanList(screen, g) {
    screen.innerHTML = `<div class="grid">${Toan.topics[g].map((t) => `
      <a class="card" href="#/lop/${g}/toan/${t.id}" style="--c:#3a86ff">
        <div class="big">${t.icon}</div>
        <div class="title">${t.name}</div>
        <div class="sub">${t.desc}</div>
        <div class="stars">${U.starsHtml(U.getStars(`toan/${g}/${t.id}`))}</div>
      </a>`).join('')}</div>`;
  }

  function render() {
    if (cleanup) { try { cleanup(); } catch (e) { /* bỏ qua */ } cleanup = null; }
    U.stopSpeak();
    window.scrollTo(0, 0);
    U.updateStarTotal();

    const p = parse();
    btnBack.style.visibility = p.length ? 'visible' : 'hidden';
    const g = +p[1];
    if (p[0] !== 'lop' || !GRADES.some((x) => x.n === g)) return home();
    if (!p[2]) return gradeScreen(g);

    const subj = SUBJECTS.find((s) => s.id === p[2]);
    if (!subj) return gradeScreen(g);
    const base = [['🏠 Trang chủ', '#/'], [`Lớp ${g}`, `#/lop/${g}`], [`${subj.icon} ${subj.name}`, `#/lop/${g}/${subj.id}`]];

    if (subj.id === 'tapviet') {
      const lesson = TV_DATA[g].find((l) => l.id === p[3]);
      if (!lesson) return TapViet.list(frame(base, `✏️ Tập viết – Lớp ${g}`), g);
      const idx = Math.min(Math.max(0, parseInt(p[4], 10) || 0), lesson.items.length - 1);
      cleanup = TapViet.practice(frame([...base, [lesson.name]]), g, lesson, idx);
      return;
    }

    if (subj.id === 'toan') {
      const topic = Toan.topics[g].find((t) => t.id === p[3]);
      if (!topic) return toanList(frame(base, `🔢 Toán – Lớp ${g}`), g);
      cleanup = Quiz.run({
        container: frame([...base, [topic.name]]),
        title: `${topic.icon} ${topic.name}`,
        lessonId: `toan/${g}/${topic.id}`,
        total: 10,
        makeQuestion: () => topic.gen(),
        onExit: () => go(['lop', g, 'toan']),
      });
      return;
    }

    const topic = TA_DATA[g].find((t) => t.id === p[3]);
    if (!topic) return TiengAnh.list(frame(base, `🔤 Tiếng Anh – Lớp ${g}`), g);
    const topicCrumb = [`${topic.icon} ${U.esc(topic.name)}`, `#/lop/${g}/tienganh/${topic.id}`];
    const mode = TiengAnh.MODES.find((m) => m.id === p[4]);
    if (!mode) {
      TiengAnh.topicScreen(frame([...base, topicCrumb], `${topic.icon} ${U.esc(topic.name)} – ${U.esc(topic.vi)}`), g, topic);
      return;
    }
    const [modeName] = TiengAnh.modeText(topic, mode);
    cleanup = TiengAnh.run(frame([...base, topicCrumb, [modeName]]), g, topic, mode.id, () => go(['lop', g, 'tienganh', topic.id]));
  }

  const paintSound = () => { btnSound.textContent = U.get('sound', true) ? '🔊' : '🔇'; };
  btnSound.onclick = () => { U.set('sound', !U.get('sound', true)); paintSound(); };
  btnBack.onclick = up;
  window.addEventListener('hashchange', render);
  paintSound();
  render();
})();
