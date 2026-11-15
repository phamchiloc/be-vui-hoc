/* Điều hướng giữa các màn hình theo địa chỉ dạng #/lop/<lớp>/<môn>/<bài>/...
   Bài học cô Lan có địa chỉ riêng #/colan/<bé>/<tuần>/..., xem js/colan.js. */
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
    { id: 'tapviet', name: 'Tập viết', icon: '✏️', desc: 'Chép đoạn văn, có hướng dẫn gõ dấu', color: '#ff7aa2', prefix: 'tv' },
    { id: 'toan', name: 'Toán', icon: '🔢', desc: 'Đếm, tính toán, hình học', color: '#3a86ff', prefix: 'toan' },
    { id: 'tienganh', name: 'Tiếng Anh', icon: '🔤', desc: 'Từ vựng có hình và giọng đọc', color: '#2ec4b6', prefix: 'ta' },
  ];
  const lessonCount = (g, id) => ({ tapviet: DOANVAN_DATA[g], toan: Toan.topics[g], tienganh: TA_DATA[g] }[id].length);
  const gradeStars = (g) => SUBJECTS.reduce((s, x) => s + U.totalStars(`${x.prefix}/${g}/`), 0);

  let cleanup = null;
  const parse = () => location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
  const go = (parts) => { location.hash = `#/${parts.join('/')}`; };

  /* Lùi một cấp. Riêng Tập viết (vào thẳng bài chép văn) thì về màn chọn môn. */
  function up() {
    const p = parse();
    if (!p.length) return;
    if (p[2] === 'tapviet') { go(['lop', p[1]]); return; }
    p.pop();
    if (p.length === 1 && p[0] === 'lop') p.length = 0;
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
        </a>`).join('')}
        <a class="card colan" href="#/colan" style="--c:#e64980">
          <div class="big">👩‍🏫</div>
          <div class="title">Bài học cô Lan</div>
          <div class="sub">${COLAN_DATA.students.map((s) => s.name).join(' · ')}</div>
          <div class="sub">⭐ ${U.totalStars('colan/')} sao</div>
        </a></div>`;
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
    if (p[0] === 'colan') { cleanup = CoLan.render(p.slice(1), { frame, go }) || null; return; }
    const g = +p[1];
    if (p[0] !== 'lop' || !GRADES.some((x) => x.n === g)) return home();
    if (!p[2]) return gradeScreen(g);

    const subj = SUBJECTS.find((s) => s.id === p[2]);
    if (!subj) return gradeScreen(g);
    const base = [['🏠 Trang chủ', '#/'], [`Lớp ${g}`, `#/lop/${g}`], [`${subj.icon} ${subj.name}`, `#/lop/${g}/${subj.id}`]];

    if (subj.id === 'tapviet') {
      const idx = Math.min(Math.max(0, parseInt(p[3], 10) || 0), DOANVAN_DATA[g].length - 1);
      cleanup = ChepVan.practice(frame([...base.slice(0, 2), ['✏️ Tập viết – Chép đoạn văn']]), g, idx);
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

  /* Nếu có lỗi thì báo và cho tải lại, thay vì để màn hình trống. */
  function safeRender() {
    try {
      render();
    } catch (e) {
      console.error(e);
      app.innerHTML = `<div class="crash"><div class="big">😵</div>
        <p>Trang chưa tải xong bản mới. Bấm nút dưới đây (hoặc <b>Ctrl + F5</b>) để tải lại nhé!</p>
        <button class="btn" onclick="location.reload()">🔄 Tải lại trang</button></div>`;
    }
  }

  const paintSound = () => { btnSound.textContent = U.get('sound', true) ? '🔊' : '🔇'; };
  btnSound.onclick = () => { U.set('sound', !U.get('sound', true)); paintSound(); };
  btnBack.onclick = up;
  U.dropStars((k) => k.startsWith('tv/') && !k.includes('/chepvan/')); // sao của phần tô chữ cũ đã bỏ
  window.addEventListener('hashchange', safeRender);
  paintSound();
  safeRender();
})();
