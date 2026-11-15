/* Môn Tập viết: tô chữ theo mẫu trên khung ô li, chấm điểm theo độ phủ và độ chính xác của nét. */
const TapViet = (() => {
  const FONTS = {
    cursive: { name: 'Chữ viết', css: "'Dancing Script', 'Segoe Script', cursive", weight: 500 },
    print: { name: 'Chữ in', css: "'Mali', 'Segoe Print', 'Comic Sans MS', sans-serif", weight: 500 },
  };
  const INKS = ['#2b59c3', '#e03131', '#2f9e44', '#7048e8', '#f76707'];
  const MSG = [
    'Bé tô theo nét chữ mờ nhé! ✏️',
    'Khá rồi! Tô lại cho kín nét nhé! 🙂',
    'Tốt lắm! Cố viết sát nét mờ hơn nhé! 👍',
    'Đẹp quá! Bé viết rất giỏi! 🎉',
  ];

  const itemId = (g, lesson, i) => `tv/${g}/${lesson.id}/${i}`;
  const lessonStars = (g, lesson) => lesson.items.reduce((s, _, i) => s + U.getStars(itemId(g, lesson, i)), 0);
  /* Chữ ngắn được viết lặp lại vài lần trên một dòng để bé luyện tay. */
  const copiesOf = (t) => { const n = [...t].length; return n <= 1 ? 3 : n <= 4 ? 2 : 1; };

  /* Tô đỏ chữ cái đầu tiên trong từ khớp với chữ đang học (so theo dạng tách dấu: "ấ" khớp "â" và "a"). */
  function highlight(word, letter) {
    const target = letter.normalize('NFD');
    const chars = [...word];
    const i = chars.findIndex((ch) => ch.normalize('NFD').startsWith(target));
    return chars.map((ch, j) => (j === i ? `<b class="hl">${U.esc(ch)}</b>` : U.esc(ch))).join('');
  }

  function picHtml(it) {
    if (it.count !== undefined) {
      return it.count ? `<div class="objs small">${`<span>${it.e}</span>`.repeat(it.count)}</div>` : '<span>⭕</span>';
    }
    return `<span>${it.img}</span>`;
  }

  function wordHtml(it, fontCss) {
    if (it.w) {
      return `<div class="tv-letter" style="font-family:${fontCss}">${U.esc(it.t)}</div><div class="tv-w">${highlight(it.w, it.t)}</div>`;
    }
    return `<div class="tv-sentence">${U.esc(it.t)}</div>`;
  }

  function list(root, g) {
    root.innerHTML = `<div class="grid">${TV_DATA[g].map((l) => `
      <a class="card" href="#/lop/${g}/tapviet/${l.id}/0" style="--c:#ff7aa2">
        <div class="big">${l.icon}</div>
        <div class="title">${l.name}</div>
        <div class="sub">${l.desc}</div>
        <div class="sub">${l.items.length} mục · ⭐ ${lessonStars(g, l)}/${l.items.length * 3}</div>
      </a>`).join('')}</div>`;
  }

  function practice(root, g, lesson, index) {
    const it = lesson.items[index];
    const fontKey = FONTS[U.get('tvFont')] ? U.get('tvFont') : 'cursive';
    const F = FONTS[fontKey];
    const copies = copiesOf(it.t);
    const last = lesson.items.length - 1;
    let showGuide = U.get('tvGuide', true);
    let ink = U.get('tvInk', INKS[0]);
    const go = (i) => { location.hash = `#/lop/${g}/tapviet/${lesson.id}/${i}`; };
    const shortName = (t, i) => ([...t].length <= 10 ? U.esc(t) : `Câu ${i + 1}`);

    root.innerHTML = `
      <section class="tv">
        <div class="tv-head">
          <div class="tv-pic">${picHtml(it)}</div>
          <div class="tv-word">${wordHtml(it, F.css)}</div>
          <button class="icon-btn big speak" title="Nghe đọc">🔊</button>
        </div>
        <div class="tv-stage"><canvas class="guide"></canvas><canvas class="ink"></canvas></div>
        <div class="tv-tools">
          <div class="inks">${INKS.map((c) => `<button class="ink-dot${c === ink ? ' on' : ''}" data-c="${c}" style="background:${c}" title="Đổi màu bút"></button>`).join('')}</div>
          <button class="btn orange demo">👀 Xem mẫu</button>
          <button class="btn gray clear">🧽 Xoá</button>
          <button class="btn green check">✅ Chấm điểm</button>
        </div>
        <div class="tv-result"></div>
        <div class="tv-opts">
          <label class="switch"><input type="checkbox" class="opt-guide" ${showGuide ? 'checked' : ''}> Hiện chữ mờ</label>
          <div class="seg">${Object.entries(FONTS).map(([k, f]) => `<button data-f="${k}" class="${k === fontKey ? 'on' : ''}">${f.name}</button>`).join('')}</div>
        </div>
        <div class="tv-nav">
          <button class="btn prev" ${index === 0 ? 'disabled' : ''}>⬅️ Trước</button>
          <span class="tv-pos">${index + 1} / ${lesson.items.length}</span>
          <button class="btn next" ${index === last ? 'disabled' : ''}>Tiếp ➡️</button>
        </div>
        <div class="tv-strip">${lesson.items.map((x, i) => `
          <button class="chip${i === index ? ' on' : ''}" data-i="${i}">${shortName(x.t, i)}<small>${'⭐'.repeat(U.getStars(itemId(g, lesson, i)))}</small></button>`).join('')}
        </div>
      </section>`;

    const $ = (s) => root.querySelector(s);
    const stage = $('.tv-stage'), gC = $('canvas.guide'), iC = $('canvas.ink'), result = $('.tv-result');
    const gx = gC.getContext('2d'), ix = iC.getContext('2d');
    let W = 0, H = 0, dpr = 1, L = null, hasInk = false, raf = 0, demoTimer = 0, resizeTimer = 0, alive = true, lastW = 0;

    /* Chia câu thành n dòng có độ dài gần bằng nhau, ngắt ở khoảng trắng. */
    function splitLines(t, n) {
      const target = t.length / n, lines = [];
      let cur = '';
      for (const w of t.split(' ')) {
        if (cur && (cur + ' ' + w).length > target && lines.length < n - 1) { lines.push(cur); cur = w; }
        else cur = cur ? `${cur} ${w}` : w;
      }
      lines.push(cur);
      return lines;
    }

    /* Tính cỡ chữ: chữ thường cao 2 ô li, mỗi dòng kẻ cao 10 ô li.
       Chữ quá dài thì thu nhỏ; nếu vẫn quá nhỏ thì chia thành 2–3 dòng. */
    function layout() {
      const probe = 100;
      gx.font = `${F.weight} ${probe}px ${F.css}`;
      const xr = (gx.measureText('x').actualBoundingBoxAscent || probe * 0.45) / probe;
      const widthOf = (s) => gx.measureText(s).width / probe;
      const olMax = Math.max(200, Math.min(320, W * 0.38)) / 10;
      const fit = (ls, slot) => Math.min(olMax, ((slot / Math.max(...ls.map(widthOf))) * xr) / 2);
      let lines = [it.t], ol;
      if (copies > 1) ol = fit(lines, (W / copies) * 0.8);
      else {
        ol = fit(lines, W * 0.92);
        for (let n = 2; n <= 3 && ol < 11 && it.t.includes(' '); n++) {
          const ls = splitLines(it.t, n), o = fit(ls, W * 0.92);
          if (o > ol) { lines = ls; ol = o; }
        }
      }
      const fs = (2 * ol) / xr, span = lines.length * 10 * ol - ol;
      H = Math.max(150, Math.round(span + 2 * ol));
      const top = (H - span) / 2;
      const pieces = copies > 1
        ? Array.from({ length: copies }, (_, i) => ({ t: it.t, x: (W * (i + 0.5)) / copies, base: top + 6 * ol }))
        : lines.map((t, r) => ({ t, x: W / 2, base: top + 6 * ol + r * 10 * ol }));
      const font = `${F.weight} ${fs}px ${F.css}`;
      gx.font = font;
      pieces.forEach((p) => { p.w = gx.measureText(p.t).width; });
      return { fs, ol, pieces, bases: [...new Set(pieces.map((p) => p.base))], font, brush: Math.max(5, Math.min(30, fs * 0.11)) };
    }

    function resize() {
      W = stage.clientWidth;
      if (!W) return;
      lastW = W;
      L = layout();
      stage.style.height = `${H + stage.offsetHeight - stage.clientHeight}px`; // cộng thêm viền khung
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      for (const c of [gC, iC]) {
        c.width = Math.round(W * dpr);
        c.height = Math.round(H * dpr);
        c.style.width = `${W}px`;
        c.style.height = `${H}px`;
      }
      gx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ix.setTransform(dpr, 0, 0, dpr, 0, 0);
      paintGuide();
      clearInk();
    }

    function text(c, mode) {
      c.save();
      c.font = L.font;
      c.textAlign = 'center';
      c.textBaseline = 'alphabetic';
      c.lineJoin = 'round';
      c.lineCap = 'round';
      for (const { t, x, base } of L.pieces) {
        if (mode === 'template') {
          c.fillStyle = 'rgba(110, 130, 220, 0.2)';
          c.fillText(t, x, base);
          const d = Math.max(3, L.fs * 0.03);
          c.setLineDash([d, d]);
          c.strokeStyle = 'rgba(70, 90, 200, 0.6)';
          c.lineWidth = Math.max(1.2, L.fs * 0.012);
          c.strokeText(t, x, base);
          c.setLineDash([]);
        } else if (mode === 'solid') {
          c.fillStyle = '#ff7b00';
          c.fillText(t, x, base);
        } else if (mode === 'core') {
          c.fillStyle = '#000';
          c.fillText(t, x, base);
        } else if (mode === 'zone') {
          c.fillStyle = '#000';
          c.strokeStyle = '#000';
          c.lineWidth = L.brush * 1.8;
          c.fillText(t, x, base);
          c.strokeText(t, x, base);
        }
      }
      c.restore();
    }

    /* Vẽ khung ô li; reveal (số px chữ đã hiện) dùng khi chạy hoạt hình "Xem mẫu". */
    function paintGuide(reveal) {
      const c = gx, { ol } = L;
      c.clearRect(0, 0, W, H);
      c.fillStyle = '#fffdf6';
      c.fillRect(0, 0, W, H);
      c.lineWidth = 1;
      c.strokeStyle = '#eef2fb';
      for (let x = ol; x < W; x += ol) {
        c.beginPath(); c.moveTo(Math.round(x) + 0.5, 0); c.lineTo(Math.round(x) + 0.5, H); c.stroke();
      }
      for (const base of L.bases) {
        for (let i = -6; i <= 3; i++) {
          const y = Math.round(base + i * ol) + 0.5;
          c.beginPath(); c.moveTo(0, y); c.lineTo(W, y);
          c.strokeStyle = i === 0 ? '#e5789a' : i === -2 ? '#f3a8bf' : '#d6e0f5';
          c.lineWidth = i === 0 ? 2 : i === -2 ? 1.5 : 1;
          c.stroke();
        }
      }
      if (showGuide) text(c, 'template');
      if (reveal != null) {
        c.save();
        c.beginPath();
        let left = reveal;
        for (const p of L.pieces) {
          const shown = Math.max(0, Math.min(p.w, left));
          left -= p.w;
          if (shown > 0) c.rect(p.x - p.w / 2 - 6, p.base - 7 * ol, shown + 6, 10 * ol);
        }
        c.clip();
        text(c, 'solid');
        c.restore();
      }
    }

    function clearInk() {
      ix.clearRect(0, 0, W, H);
      hasInk = false;
      result.innerHTML = '';
      $('.next').classList.remove('pulse');
    }

    /* ---------- Vẽ bằng chuột, ngón tay hoặc bút ---------- */
    let drawing = false, prev = null;
    const pos = (e) => { const r = iC.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
    function dot(p) {
      ix.fillStyle = ink;
      ix.beginPath(); ix.arc(p.x, p.y, L.brush / 2, 0, Math.PI * 2); ix.fill();
      hasInk = true;
    }
    function seg(a, b) {
      ix.strokeStyle = ink; ix.lineWidth = L.brush; ix.lineCap = 'round'; ix.lineJoin = 'round';
      ix.beginPath(); ix.moveTo(a.x, a.y); ix.lineTo(b.x, b.y); ix.stroke();
      hasInk = true;
    }
    iC.addEventListener('pointerdown', (e) => {
      if (!L) return;
      e.preventDefault();
      if (raf || demoTimer) { stopDemo(); paintGuide(); }
      try { iC.setPointerCapture(e.pointerId); } catch (err) { /* một số trình duyệt không cho bắt con trỏ */ }
      drawing = true;
      prev = pos(e);
      dot(prev);
    });
    iC.addEventListener('pointermove', (e) => {
      if (!drawing) return;
      let evs = e.getCoalescedEvents ? e.getCoalescedEvents() : null;
      if (!evs || !evs.length) evs = [e];
      for (const ev of evs) { const p = pos(ev); seg(prev, p); prev = p; }
    });
    const end = () => { drawing = false; prev = null; };
    iC.addEventListener('pointerup', end);
    iC.addEventListener('pointercancel', end);

    /* ---------- Chấm điểm ----------
       coverage: phần nét chữ mẫu đã được tô; precision: phần nét bé vẽ nằm gần chữ mẫu. */
    function check() {
      if (!hasInk) { U.toast('Bé hãy tô theo chữ mờ trước nhé! ✏️'); return; }
      const w = iC.width, h = iC.height;
      const m = document.createElement('canvas');
      m.width = w; m.height = h;
      const mc = m.getContext('2d', { willReadFrequently: true });
      mc.setTransform(dpr, 0, 0, dpr, 0, 0);
      text(mc, 'core');
      const core = mc.getImageData(0, 0, w, h).data;
      mc.clearRect(0, 0, W, H);
      text(mc, 'zone');
      const zone = mc.getImageData(0, 0, w, h).data;
      const user = ix.getImageData(0, 0, w, h).data;
      let cN = 0, cHit = 0, uN = 0, uIn = 0;
      const step = Math.max(1, Math.round(dpr * 2));
      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          const a = (y * w + x) * 4 + 3;
          const u = user[a] > 60;
          if (core[a] > 128) { cN++; if (u) cHit++; }
          if (u) { uN++; if (zone[a] > 20) uIn++; }
        }
      }
      const coverage = cN ? cHit / cN : 0, precision = uN ? uIn / uN : 0;
      const s = coverage * Math.pow(precision, 1.5);
      const stars = s >= 0.55 ? 3 : s >= 0.4 ? 2 : s >= 0.15 ? 1 : 0;
      U.setStars(itemId(g, lesson, index), stars);
      const chip = root.querySelector(`.chip[data-i="${index}"] small`);
      if (chip) chip.textContent = '⭐'.repeat(U.getStars(itemId(g, lesson, index)));
      result.innerHTML = `<div class="rs">${U.starsHtml(stars)}</div><div>${MSG[stars]}</div>`;
      if (stars === 3) { U.sound('win'); U.confetti(); } else U.sound(stars ? 'ok' : 'bad');
      if (stars >= 2 && index < last) $('.next').classList.add('pulse');
    }

    /* ---------- Hoạt hình "Xem mẫu": chữ hiện dần từ trái sang phải, có bút chì chạy theo ---------- */
    function stopDemo() { cancelAnimationFrame(raf); clearTimeout(demoTimer); raf = 0; demoTimer = 0; }
    function demo() {
      if (!L) return;
      stopDemo();
      const total = L.pieces.reduce((s, p) => s + p.w, 0);
      const dur = Math.min(7000, 900 + [...it.t].length * copies * 260);
      const t0 = performance.now();
      const frame = (now) => {
        if (!alive) return;
        const p = Math.min(1, (now - t0) / dur), done = total * p;
        paintGuide(done);
        // bút chì đi theo đầu nét đang viết
        let left = done, cur = L.pieces[L.pieces.length - 1], x = cur.x + cur.w / 2;
        for (const pc of L.pieces) {
          if (left <= pc.w) { cur = pc; x = pc.x - pc.w / 2 + left; break; }
          left -= pc.w;
        }
        const ps = Math.max(22, L.ol * 3);
        gx.save();
        gx.font = `${ps}px 'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', sans-serif`;
        gx.textAlign = 'left';
        gx.textBaseline = 'bottom';
        gx.fillText('✏️', x - ps * 0.12, cur.base - L.ol + ps * 0.12);
        gx.restore();
        if (p < 1) raf = requestAnimationFrame(frame);
        else { raf = 0; demoTimer = setTimeout(() => { demoTimer = 0; paintGuide(); }, 800); }
      };
      raf = requestAnimationFrame(frame);
    }

    /* ---------- Nút bấm ---------- */
    const say = () => U.speak(it.w ? `${it.t}, ${it.w}` : it.t, 'vi');
    $('.speak').onclick = say;
    $('.demo').onclick = demo;
    $('.clear').onclick = clearInk;
    $('.check').onclick = check;
    $('.prev').onclick = () => index > 0 && go(index - 1);
    $('.next').onclick = () => index < last && go(index + 1);
    root.querySelectorAll('.chip').forEach((b) => { b.onclick = () => go(+b.dataset.i); });
    root.querySelectorAll('.ink-dot').forEach((b) => {
      b.onclick = () => {
        ink = b.dataset.c;
        U.set('tvInk', ink);
        root.querySelectorAll('.ink-dot').forEach((x) => x.classList.toggle('on', x === b));
      };
    });
    $('.opt-guide').onchange = (e) => { showGuide = e.target.checked; U.set('tvGuide', showGuide); if (L) paintGuide(); };
    root.querySelectorAll('.seg button').forEach((b) => {
      b.onclick = () => {
        if (b.dataset.f === fontKey) return;
        U.set('tvFont', b.dataset.f);
        window.dispatchEvent(new HashChangeEvent('hashchange'));
      };
    });

    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { if (stage.clientWidth !== lastW) resize(); }, 200);
    };
    window.addEventListener('resize', onResize);

    /* Chờ phông chữ tải xong (tối đa 2 giây) rồi mới vẽ, để chữ mẫu đúng kiểu. */
    const fontReady = document.fonts && document.fonts.load
      ? Promise.race([document.fonts.load(`${F.weight} 60px ${F.css}`, it.t), new Promise((r) => setTimeout(r, 2000))])
      : Promise.resolve();
    fontReady.catch(() => {}).then(() => { if (alive) resize(); });

    return () => {
      alive = false;
      stopDemo();
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
    };
  }

  return { list, practice, lessonStars };
})();
