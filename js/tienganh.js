/* Môn Tiếng Anh: thẻ từ có hình và giọng đọc, nghe – chọn hình, nhìn – chọn từ, ghép chữ. */
const TiengAnh = (() => {
  const esc = U.esc;
  const MODES = [
    { id: 'learn', name: 'Học từ', icon: '📇', desc: 'Xem hình, nghe đọc', color: '#4dabf7' },
    { id: 'listen', name: 'Nghe và chọn', icon: '👂', desc: 'Nghe rồi chọn hình đúng', color: '#ff922b',
      pName: 'Nghe và chọn nghĩa', pDesc: 'Nghe câu rồi chọn nghĩa đúng' },
    { id: 'look', name: 'Nhìn và chọn', icon: '👀', desc: 'Nhìn hình chọn từ đúng', color: '#51cf66',
      pName: 'Đọc và chọn nghĩa', pDesc: 'Đọc câu rồi chọn nghĩa đúng' },
    { id: 'spell', name: 'Ghép chữ', icon: '🧩', desc: 'Xếp chữ cái thành từ', color: '#cc5de8' },
  ];
  let keyHandler = null;

  /* g là số lớp, hoặc { href, key, level } khi dùng cho bài học riêng (xem js/colan.js):
     href là địa chỉ chứa các chủ đề, key là tiền tố lưu sao, level quyết định độ khó của Ghép chữ. */
  const ctx = (g) => (typeof g === 'object' ? g : { href: `#/lop/${g}/tienganh`, key: `ta/${g}`, level: g });

  const pic = (it) => {
    if (it.svg) return `<span class="svg-pic">${it.svg}</span>`;
    if (it.color) return `<span class="color-dot" style="background:${it.color}"></span>`;
    if (it.badge) return `<span class="badge-img">${esc(it.badge)}</span>`;
    return `<span class="emo">${it.img}</span>`;
  };
  const letterCount = (s) => s.replace(/[^a-z]/gi, '').length;
  const spellItems = (topic) => (topic.phrases ? [] : topic.items.filter((it) => letterCount(it.en) <= 10));
  const modesFor = (topic) => MODES.filter((m) => m.id !== 'spell' || spellItems(topic).length >= 4);
  const modeText = (topic, m) => (topic.phrases && m.pName ? [m.pName, m.pDesc] : [m.name, m.desc]);
  const sid = (g, topic, mode) => `${ctx(g).key}/${topic.id}/${mode}`;
  const topicStars = (g, topic) => modesFor(topic).reduce((s, m) => s + U.getStars(sid(g, topic, m.id)), 0);
  const sayItem = (it, slow) => U.speak(it.letter ? `${it.letter}. ${it.en}` : it.say || it.en, 'en', slow ? 0.5 : 0.85);

  function setKeys(fn) {
    if (keyHandler) document.removeEventListener('keydown', keyHandler);
    keyHandler = fn;
    if (fn) document.addEventListener('keydown', fn);
  }

  /* ---------- Danh sách chủ đề và màn hình chủ đề ---------- */
  function list(root, g) {
    root.innerHTML = `<div class="grid">${TA_DATA[g].map((t) => `
      <a class="card" href="${ctx(g).href}/${t.id}" style="--c:#2ec4b6">
        <div class="big">${t.icon}</div>
        <div class="title">${esc(t.name)}</div>
        <div class="sub">${esc(t.vi)} · ${t.items.length} ${t.phrases ? 'câu' : 'từ'}</div>
        <div class="sub">⭐ ${topicStars(g, t)}/${modesFor(t).length * 3}</div>
      </a>`).join('')}</div>`;
  }

  function topicScreen(root, g, topic) {
    root.innerHTML = `
      <div class="grid modes">${modesFor(topic).map((m) => {
        const [name, desc] = modeText(topic, m);
        return `<a class="card" href="${ctx(g).href}/${topic.id}/${m.id}" style="--c:${m.color}">
          <div class="big">${m.icon}</div><div class="title">${name}</div><div class="sub">${desc}</div>
          <div class="stars">${U.starsHtml(U.getStars(sid(g, topic, m.id)))}</div></a>`;
      }).join('')}</div>
      <h3 class="section-title">📋 ${topic.phrases ? 'Các câu' : 'Các từ'} trong bài (bấm để nghe)</h3>
      <div class="word-grid">${topic.items.map((it, i) => `
        <button class="word-tile" data-i="${i}"><div class="wt-pic">${pic(it)}</div><b>${esc(it.en)}</b><small>${esc(it.vi)}</small></button>`).join('')}
      </div>`;
    root.querySelectorAll('.word-tile').forEach((b) => { b.onclick = () => sayItem(topic.items[+b.dataset.i]); });
  }

  /* ---------- Học từ: thẻ có hình, chữ, nghĩa và giọng đọc ---------- */
  function learn(root, g, topic) {
    const items = topic.items, seen = new Set();
    let i = 0;
    root.innerHTML = `
      <section class="flash-wrap">
        <div class="flash" title="Bấm vào thẻ để nghe lại"></div>
        <div class="flash-ctrl">
          <button class="btn prev">⬅️ Trước</button>
          <button class="btn orange say">🔊 Nghe</button>
          <button class="btn gray slow">🐢 Đọc chậm</button>
          <button class="btn next">Tiếp ➡️</button>
        </div>
        <div class="pdots">${items.map(() => '<i></i>').join('')}</div>
      </section>`;
    const card = root.querySelector('.flash'), dots = [...root.querySelectorAll('.pdots i')];
    const prevBtn = root.querySelector('.prev'), nextBtn = root.querySelector('.next');

    function show() {
      const it = items[i];
      seen.add(i);
      card.classList.remove('pop');
      void card.offsetWidth;
      card.classList.add('pop');
      card.innerHTML = `
        ${it.letter ? `<div class="flash-letter">${it.letter} ${it.letter.toLowerCase()}</div>` : ''}
        <div class="flash-pic">${pic(it)}</div>
        <div class="flash-word${topic.phrases ? ' phrase' : ''}">${esc(it.en)}</div>
        <div class="flash-vi">${esc(it.vi)}</div>`;
      dots.forEach((d, j) => { d.className = j === i ? 'on' : seen.has(j) ? 'seen' : ''; });
      prevBtn.disabled = i === 0;
      nextBtn.disabled = i === items.length - 1;
      sayItem(it);
      const id = sid(g, topic, 'learn');
      if (seen.size === items.length && U.getStars(id) < 3) {
        U.setStars(id, 3);
        U.sound('win');
        U.toast('Bé đã học hết các từ trong bài! Được 3 sao ⭐⭐⭐');
      }
    }
    const move = (d) => { const j = i + d; if (j >= 0 && j < items.length) { i = j; show(); } };
    prevBtn.onclick = () => move(-1);
    nextBtn.onclick = () => move(1);
    root.querySelector('.say').onclick = () => sayItem(items[i]);
    root.querySelector('.slow').onclick = () => sayItem(items[i], true);

    let sx = null, swiped = false;
    card.addEventListener('pointerdown', (e) => { sx = e.clientX; swiped = false; });
    card.addEventListener('pointerup', (e) => {
      if (sx !== null && Math.abs(e.clientX - sx) > 50) { swiped = true; move(e.clientX < sx ? 1 : -1); }
      sx = null;
    });
    card.addEventListener('click', () => { if (!swiped) sayItem(items[i]); });

    setKeys((e) => {
      if (e.key === 'ArrowRight') move(1);
      else if (e.key === 'ArrowLeft') move(-1);
      else if (e.key === ' ') { e.preventDefault(); sayItem(items[i]); }
    });
    show();
    return () => setKeys(null);
  }

  /* ---------- Nghe và chọn / Nhìn và chọn ---------- */
  function quiz(root, g, topic, mode, onExit) {
    const items = topic.items;
    const sayOf = (en) => { const x = items.find((i) => i.en === en); return x ? x.say || x.en : en; };
    const [name] = modeText(topic, MODES.find((m) => m.id === mode));
    return Quiz.run({
      container: root,
      title: `${topic.icon} ${esc(topic.name)} – ${name}`,
      lessonId: sid(g, topic, mode),
      total: Math.min(10, items.length),
      onExit,
      onAnswer: (q) => setTimeout(() => U.speak(sayOf(q.answer), 'en'), 250),
      makeQuestion() {
        const it = U.pick(items);
        const opts = U.shuffle([it, ...U.shuffle(items.filter((x) => x !== it)).slice(0, 3)]);
        const speak = { text: it.say || it.en, lang: 'en' };
        if (mode === 'listen') {
          const visual = '<button class="speak speak-big" title="Nghe lại">🔊</button>';
          if (topic.phrases) {
            return {
              prompt: 'Nghe và chọn nghĩa đúng', speak, autoSpeak: true, visual,
              choices: opts.map((o) => ({ label: `${pic(o)}<span>${esc(o.vi)}</span>`, value: o.en })),
              answer: it.en, choiceClass: 'textpics', key: it.en,
            };
          }
          return {
            prompt: 'Nghe và chọn hình đúng', speak, autoSpeak: true, visual,
            choices: opts.map((o) => ({ label: pic(o), value: o.en })), answer: it.en, choiceClass: 'pictures', key: it.en,
          };
        }
        if (topic.phrases) {
          return {
            prompt: 'Câu này có nghĩa là gì?', speak, visual: `<div class="phrase">${esc(it.en)}</div>`,
            choices: opts.map((o) => ({ label: esc(o.vi), value: o.en })), answer: it.en, choiceClass: 'words small', key: it.en,
          };
        }
        return {
          prompt: 'Đây là gì?', visual: `<div class="look-pic">${pic(it)}</div>`,
          choices: opts.map((o) => ({ label: esc(o.en), value: o.en })), answer: it.en, choiceClass: 'words', key: it.en,
        };
      },
    });
  }

  /* ---------- Ghép chữ: bấm các ô chữ cái theo đúng thứ tự ---------- */
  function spell(root, g, topic, onExit) {
    const pool = U.shuffle(spellItems(topic)).slice(0, 8);
    const id = sid(g, topic, 'spell');
    let i = 0, score = 0, timer = 0;

    function render() {
      clearTimeout(timer);
      if (i >= pool.length) {
        setKeys(null);
        root.innerHTML = '<section class="spell"></section>';
        Quiz.result(root.querySelector('.spell'), { score, total: pool.length, lessonId: id, again: () => spell(root, g, topic, onExit), exit: onExit });
        return;
      }
      const it = pool[i];
      const chars = [...it.en];
      const slotIdx = chars.map((c, j) => (/[a-z]/i.test(c) ? j : -1)).filter((j) => j >= 0);
      const target = slotIdx.map((j) => chars[j].toLowerCase());
      let tiles;
      do { tiles = U.shuffle(target); } while (new Set(target).size > 1 && tiles.join('') === target.join(''));
      if (ctx(g).level >= 3) for (let x = 0; x < 2; x++) tiles.splice(U.rand(0, tiles.length), 0, U.pick([...'abcdefghijklmnopqrstuvwxyz']));
      const filled = new Array(target.length).fill(null); // chỉ số ô chữ đang nằm ở mỗi vị trí
      let wrong = 0, locked = false;

      root.innerHTML = `
        <section class="spell">
          <div class="qcount">Từ ${i + 1}/${pool.length}</div>
          <div class="spell-top">
            <div class="spell-pic">${pic(it)}</div>
            <div><div class="spell-vi">${esc(it.vi)}</div><button class="icon-btn speak" title="Nghe">🔊</button></div>
          </div>
          <div class="slots">${chars.map((c, j) => (/[a-z]/i.test(c)
            ? '<span class="slot"></span>'
            : `<span class="slot fixed">${c === ' ' ? '&nbsp;' : esc(c)}</span>`)).join('')}</div>
          <div class="tiles">${tiles.map((c, t) => `<button class="tile" data-t="${t}">${c}</button>`).join('')}</div>
          <div class="spell-ctrl">
            <button class="btn gray undo">↩️ Xoá chữ</button>
            <button class="btn orange hint">💡 Gợi ý</button>
          </div>
          <div class="feedback"></div>
        </section>`;
      const slotEls = [...root.querySelectorAll('.slot:not(.fixed)')];
      const tileEls = [...root.querySelectorAll('.tile')];
      const slotsBox = root.querySelector('.slots'), fb = root.querySelector('.feedback');
      const paint = () => slotEls.forEach((s, k) => { s.textContent = filled[k] === null ? '' : tiles[filled[k]]; });

      function place(t) {
        if (locked || tileEls[t].classList.contains('used')) return;
        const k = filled.indexOf(null);
        if (k < 0) return;
        filled[k] = t;
        tileEls[t].classList.add('used');
        U.sound('tap');
        paint();
        if (!filled.includes(null)) check();
      }
      function unplace(k) {
        if (locked || filled[k] === null) return;
        tileEls[filled[k]].classList.remove('used');
        filled[k] = null;
        paint();
      }
      function undo() {
        for (let k = filled.length - 1; k >= 0; k--) if (filled[k] !== null) { unplace(k); break; }
      }
      function check() {
        if (filled.map((t) => tiles[t]).join('') === target.join('')) {
          locked = true;
          slotsBox.classList.add('ok');
          slotEls.forEach((s, k) => { s.textContent = chars[slotIdx[k]]; });
          if (wrong === 0) score++;
          U.sound('ok');
          setTimeout(() => sayItem(it), 300);
          fb.innerHTML = `<span class="good">${wrong === 0 ? 'Giỏi quá! 🎉' : 'Đúng rồi! 👍'}</span>`;
          timer = setTimeout(() => { i++; render(); }, 1700);
          return;
        }
        wrong++;
        locked = true;
        slotsBox.classList.add('bad');
        U.sound('bad');
        fb.innerHTML = '<span class="oops">Chưa đúng, bé thử lại nhé!</span>';
        timer = setTimeout(() => {
          slotsBox.classList.remove('bad');
          filled.fill(null);
          tileEls.forEach((t) => t.classList.remove('used'));
          paint();
          locked = false;
          if (wrong >= 2) hint();
        }, 900);
      }
      /* Giữ các chữ đúng ở đầu, đặt thêm một chữ đúng tiếp theo. */
      function hint() {
        if (locked) return;
        wrong = Math.max(wrong, 1);
        let k = 0;
        while (k < target.length && filled[k] !== null && tiles[filled[k]] === target[k]) k++;
        if (k >= target.length) return;
        for (let j = k; j < filled.length; j++) {
          if (filled[j] !== null) { tileEls[filled[j]].classList.remove('used'); filled[j] = null; }
        }
        const t = tiles.findIndex((c, ti) => c === target[k] && !filled.includes(ti));
        filled[k] = t;
        tileEls[t].classList.add('used');
        paint();
        fb.innerHTML = `<span class="hint-msg">💡 Chữ tiếp theo là “${target[k]}”</span>`;
        if (!filled.includes(null)) check();
      }

      tileEls.forEach((b) => { b.onclick = () => place(+b.dataset.t); });
      slotEls.forEach((s, k) => { s.onclick = () => unplace(k); });
      root.querySelector('.undo').onclick = undo;
      root.querySelector('.hint').onclick = hint;
      root.querySelector('.speak').onclick = () => sayItem(it);
      setKeys((e) => {
        if (/^[a-z]$/i.test(e.key)) {
          const t = tiles.findIndex((c, ti) => c === e.key.toLowerCase() && !tileEls[ti].classList.contains('used'));
          if (t >= 0) place(t);
        } else if (e.key === 'Backspace') { e.preventDefault(); undo(); }
      });
      timer = setTimeout(() => sayItem(it), 300);
    }

    render();
    return () => { clearTimeout(timer); setKeys(null); };
  }

  function run(root, g, topic, mode, onExit) {
    if (mode === 'learn') return learn(root, g, topic);
    if (mode === 'spell' && spellItems(topic).length >= 4) return spell(root, g, topic, onExit);
    if (mode === 'listen' || mode === 'look') return quiz(root, g, topic, mode, onExit);
    onExit();
    return null;
  }

  return { list, topicScreen, run, topicStars, modesFor, pic, MODES, modeText };
})();
