/* Bộ gõ Telex nhỏ gọn chạy ngay trong trang, để máy chưa cài Unikey/EVKey vẫn gõ được tiếng Việt.
   Quy tắc: aa=â, aw=ă, ee=ê, oo=ô, ow=ơ, uw=ư, dd=đ; s f r x j = sắc huyền hỏi ngã nặng; z = xoá dấu.
   Dấu thanh đặt theo kiểu cũ (hòa, thủy). */
const Telex = (() => {
  const TONE_RE = /[̣̀́̃̉]/g;
  const TONE_KEYS = { s: '́', f: '̀', r: '̉', x: '̃', j: '̣' };
  const TONE_INFO = {
    '́': { name: 'dấu sắc', key: 's', vni: '1', sample: 'á', ex: ['cá', '🐟'] },
    '̀': { name: 'dấu huyền', key: 'f', vni: '2', sample: 'à', ex: ['gà', '🐔'] },
    '̉': { name: 'dấu hỏi', key: 'r', vni: '3', sample: 'ả', ex: ['hổ', '🐯'] },
    '̃': { name: 'dấu ngã', key: 'x', vni: '4', sample: 'ã', ex: ['sữa', '🥛'] },
    '̣': { name: 'dấu nặng', key: 'j', vni: '5', sample: 'ạ', ex: ['mẹ', '👩'] },
  };
  const MODS = { 'ă': 'aw', 'â': 'aa', 'ê': 'ee', 'ô': 'oo', 'ơ': 'ow', 'ư': 'uw', 'đ': 'dd' };
  const MOD_EX = { 'ă': ['trăng', '🌙'], 'â': ['cây', '🌳'], 'ê': ['dê', '🐐'], 'ô': ['ô', '☂️'], 'ơ': ['bơ', '🥑'], 'ư': ['sư tử', '🦁'], 'đ': ['đèn', '💡'] };
  const PUNCT = {
    '.': 'dấu chấm: phím <kbd>.</kbd>',
    ',': 'dấu phẩy: phím <kbd>,</kbd>',
    '!': 'dấu chấm than: <kbd>Shift</kbd> + <kbd>1</kbd>',
    '?': 'dấu hỏi chấm: <kbd>Shift</kbd> + <kbd>/</kbd>',
    ':': 'dấu hai chấm: <kbd>Shift</kbd> + <kbd>;</kbd>',
  };
  const VOWELS = 'aăâeêioôơuưy';
  const isVowel = (c) => VOWELS.includes(c);
  const isUpper = (c) => c !== c.toLowerCase();
  const withCase = (orig, ch) => (isUpper(orig) ? ch.toUpperCase() : ch);

  /* Tách dấu thanh khỏi từ: "tiếng" → { base: "tiêng", tone: dấu sắc }. */
  function splitTone(word) {
    const d = word.normalize('NFD');
    const m = d.match(TONE_RE);
    return { base: d.replace(TONE_RE, '').normalize('NFC'), tone: m ? m[m.length - 1] : '' };
  }
  /* Dạng chuẩn để so sánh: không phụ thuộc vị trí đặt dấu (hoà = hòa). */
  const canon = (word) => { const { base, tone } = splitTone(word.normalize('NFC')); return `${base}|${tone}`; };
  /* Bỏ hết dấu: dùng để kiểm tra bé đang gõ có đi đúng hướng không. */
  const skeleton = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');

  /* Vị trí nguyên âm mang dấu thanh. */
  function tonePos(base) {
    const low = [...base].map((c) => c.toLowerCase());
    let s = low.findIndex(isVowel);
    if (s < 0) return -1;
    let e = s;
    while (e + 1 < low.length && isVowel(low[e + 1])) e++;
    if (e > s && s > 0 && ((low[s] === 'u' && low[s - 1] === 'q') || (low[s] === 'i' && low[s - 1] === 'g'))) s++;
    const cl = low.slice(s, e + 1);
    for (const v of ['ơ', 'ê', 'ô', 'â', 'ă', 'ư']) {
      const j = cl.indexOf(v);
      if (j >= 0) return s + j;
    }
    if (cl.length === 1) return s;
    if (cl.length >= 3) return s + 1;
    return e < low.length - 1 ? s + 1 : s; // có phụ âm cuối → nguyên âm sau; vần mở → nguyên âm trước
  }

  function place(base, tone) {
    if (!tone) return base;
    const i = tonePos(base);
    if (i < 0) return base;
    const chars = [...base];
    chars[i] = (chars[i].normalize('NFD') + tone).normalize('NFC');
    return chars.join('');
  }

  /* Gõ thêm phím key vào cuối từ word. Trả về từ mới, hoặc null nếu chỉ cần chèn phím như bình thường. */
  function applyKey(word, key) {
    const k = key.toLowerCase();
    if (!/^[a-z]$/.test(k)) return null;
    const { base, tone } = splitTone(word.normalize('NFC'));
    const chars = [...base];
    const low = chars.map((c) => c.toLowerCase());
    const n = low.length;
    const hasVowel = low.some(isVowel);
    const done = () => place(chars.join(''), tone);

    if (TONE_KEYS[k] || k === 'z') {
      if (!hasVowel) return null;
      if (k === 'z') return tone ? base : null;
      if (TONE_KEYS[k] === tone) return base + key; // gõ lại phím dấu: bỏ dấu, giữ chữ
      return place(base, TONE_KEYS[k]);
    }
    if (k === 'a' || k === 'e' || k === 'o') {
      const hat = { a: 'â', e: 'ê', o: 'ô' }[k];
      if (low[n - 1] === hat) { chars[n - 1] = withCase(chars[n - 1], k); return place(chars.join(''), tone) + key; }
      const i = low.lastIndexOf(k);
      if (i >= 0 && i >= n - 3) { chars[i] = withCase(chars[i], hat); return done(); }
    }
    if (k === 'w') {
      for (let i = 0; i < n - 1; i++) {
        if ((low[i] === 'u' || low[i] === 'ư') && low[i + 1] === 'o') {
          chars[i] = withCase(chars[i], 'ư');
          chars[i + 1] = withCase(chars[i + 1], 'ơ');
          return done();
        }
      }
      const rev = { 'ư': 'u', 'ơ': 'o', 'ă': 'a' }[low[n - 1]];
      if (rev) { chars[n - 1] = withCase(chars[n - 1], rev); return place(chars.join(''), tone) + key; }
      for (let i = n - 1; i >= Math.max(0, n - 3); i--) {
        const m = { a: 'ă', o: 'ơ', u: 'ư' }[low[i]];
        if (m) { chars[i] = withCase(chars[i], m); return done(); }
      }
      if (!hasVowel) return word + withCase(key, 'ư'); // w đứng riêng → ư
      return null;
    }
    if (k === 'd') {
      if (low[0] === 'd') { chars[0] = withCase(chars[0], 'đ'); return done(); }
      if (n === 1 && low[0] === 'đ') return withCase(chars[0], 'd') + key;
    }
    if (tone) return place(base + key, tone); // thêm chữ thì đặt lại dấu cho đúng chỗ
    return null;
  }

  /* Dãy phím cần bấm (kiểu Telex) để gõ ra một từ, dấu thanh gõ sau cùng. */
  function keysFor(word) {
    const keys = [];
    let tone = '', lastLetter = -1;
    for (const ch of word.normalize('NFC')) {
      const d = ch.normalize('NFD');
      const t = d.match(TONE_RE);
      if (t) tone = t[0];
      const b = d.replace(TONE_RE, '').normalize('NFC');
      if (/\p{L}/u.test(b)) {
        const up = isUpper(b), seq = MODS[b.toLowerCase()] || b.toLowerCase();
        [...seq].forEach((c, i) => keys.push({ k: i === 0 && up ? c.toUpperCase() : c, cls: i === 0 ? (up ? 'shift' : '') : 'mod' }));
        lastLetter = keys.length - 1;
      } else {
        keys.push({ k: b, cls: 'punct' });
      }
    }
    if (tone) keys.splice(lastLetter + 1, 0, { k: TONE_INFO[tone].key, cls: 'tone' });
    return keys;
  }

  /* Giải thích ngắn cho từng điểm khó trong từ: chữ có mũ/móc, dấu thanh, chữ hoa, dấu câu. */
  function notesFor(word) {
    const notes = [];
    const add = (s) => { if (!notes.includes(s)) notes.push(s); };
    for (const ch of word.normalize('NFC')) {
      const b = ch.normalize('NFD').replace(TONE_RE, '').normalize('NFC');
      const lo = b.toLowerCase();
      if (isUpper(b)) add('chữ hoa: giữ <kbd>Shift</kbd> rồi gõ chữ');
      if (MODS[lo]) add(`<b>${lo}</b> = ${[...MODS[lo]].map((c) => `<kbd>${c}</kbd>`).join('')}`);
      if (PUNCT[b]) add(PUNCT[b]);
    }
    const { tone } = splitTone(word.normalize('NFC'));
    if (tone) { const t = TONE_INFO[tone]; add(`<b>${t.name}</b> (${t.sample}) = <kbd>${t.key}</kbd>, gõ sau cùng`); }
    return notes;
  }

  return { applyKey, keysFor, notesFor, canon, skeleton, TONE_INFO, MODS, MOD_EX };
})();

/* Tập viết – Chép đoạn văn: đọc đoạn văn rồi gõ lại bằng bàn phím. */
const ChepVan = (() => {
  const esc = U.esc;
  const sid = (g, i) => `tv/${g}/chepvan/${i}`;
  const kbd = (keys) => keys.map((k) => `<kbd class="${k.cls}">${k.cls === 'shift' ? '⇧ ' : ''}${esc(k.k)}</kbd>`).join('');

  function guideHtml(open) {
    const mods = Object.entries(Telex.MOD_EX).map(([ch, [w, e]]) => `
      <div class="gcard"><div class="gch">${ch}</div><div class="gkeys">${kbd(Telex.keysFor(ch))}</div>
      <div class="gex">${e} ${w}</div></div>`).join('');
    const tones = Object.values(Telex.TONE_INFO).map((t) => `
      <div class="gcard tone"><div class="gch">${t.sample}</div><div class="gname">${t.name}</div>
      <div class="gkeys"><kbd class="tone">${t.key}</kbd></div>
      <div class="gex">${t.ex[1]} ${t.ex[0]}</div><div class="gseq">${kbd(Telex.keysFor(t.ex[0]))}</div></div>`).join('');
    return `
      <details class="guide" ${open ? 'open' : ''}>
        <summary>📖 Hướng dẫn gõ dấu tiếng Việt (kiểu Telex)</summary>
        <div class="guide-body">
          <h4>1. Chữ có mũ, có móc, có gạch ngang</h4>
          <div class="gcards">${mods}</div>
          <h4>2. Năm dấu thanh — gõ sau cùng của mỗi chữ</h4>
          <div class="gcards">${tones}</div>
          <h4>3. Mẹo nhỏ</h4>
          <ul>
            <li>Gõ hết các chữ cái rồi mới gõ dấu thanh: <b>tiếng</b> = ${kbd(Telex.keysFor('tiếng'))}</li>
            <li>Chữ <b>ươ</b> gõ là ${kbd(Telex.keysFor('ươ'))}, ví dụ <b>người</b> = ${kbd(Telex.keysFor('người'))}</li>
            <li>Gõ nhầm dấu thì gõ <kbd>z</kbd> để xoá dấu, rồi gõ lại dấu đúng.</li>
            <li>Chữ hoa: giữ phím <kbd>Shift</kbd> rồi gõ chữ. Ví dụ <b>Mẹ</b> = ${kbd(Telex.keysFor('Mẹ'))}</li>
            <li>Hết một từ thì bấm phím cách (phím dài nhất) để sang từ mới. Nhớ gõ cả dấu chấm <kbd>.</kbd> và dấu phẩy <kbd>,</kbd></li>
          </ul>
          <p class="gnote">Máy đã bật Unikey hoặc EVKey kiểu VNI? Gõ số sau chữ: 1 sắc, 2 huyền, 3 hỏi, 4 ngã, 5 nặng, 6 mũ (â ê ô), 7 móc (ơ ư), 8 trăng (ă), 9 đ — và tắt mục "Bộ gõ Telex có sẵn".</p>
        </div>
      </details>`;
  }

  function practice(root, g, index) {
    const list = DOANVAN_DATA[g], item = list[index], last = list.length - 1;
    const words = item.text.split(/\s+/).filter(Boolean);
    const go = (i) => { location.hash = `#/lop/${g}/tapviet/${i}`; };
    let telexOn = U.get('telex', true), finished = false, t0 = 0, hintIdx = -1;

    let wi = 0;
    const textHtml = item.text.split('\n').map((line) =>
      `<div class="cv-line">${line.split(/\s+/).filter(Boolean).map((w) => `<span class="w" data-i="${wi++}">${esc(w)}</span>`).join(' ')}</div>`).join('');

    root.innerHTML = `
      <section class="cv">
        <div class="tv-head">
          <div class="tv-pic"><span>${item.img}</span></div>
          <div class="tv-word"><div class="cv-title">${esc(item.title)}</div><div class="cv-sub">Bé đọc đoạn văn rồi gõ lại vào ô bên dưới nhé!</div></div>
          <button class="icon-btn big speak" title="Nghe đọc đoạn văn">🔊</button>
        </div>
        <div class="cv-text">${textHtml}</div>
        <div class="cv-hint"></div>
        <textarea class="cv-input" rows="4" spellcheck="false" autocomplete="off" autocorrect="off" autocapitalize="off" placeholder="Gõ lại đoạn văn ở đây…"></textarea>
        <div class="cv-status"><div class="progress"><div class="bar"></div></div><span class="cv-count"></span></div>
        <div class="cv-result"></div>
        <div class="tv-opts">
          <label class="switch" title="Tắt mục này nếu máy đã bật Unikey hoặc EVKey"><input type="checkbox" class="opt-telex" ${telexOn ? 'checked' : ''}> Bộ gõ Telex có sẵn</label>
          <button class="btn gray redo">🔁 Gõ lại</button>
          <button class="btn green submit">✅ Nộp bài</button>
        </div>
        ${guideHtml(U.get('cvGuideOpen', true))}
        <div class="tv-nav">
          <button class="btn prev" ${index === 0 ? 'disabled' : ''}>⬅️ Bài trước</button>
          <span class="tv-pos">${index + 1} / ${list.length}</span>
          <button class="btn next" ${index === last ? 'disabled' : ''}>Bài sau ➡️</button>
        </div>
        <div class="tv-strip">${list.map((x, i) => `
          <button class="chip${i === index ? ' on' : ''}" data-i="${i}">${x.img} Bài ${i + 1}<small>${'⭐'.repeat(U.getStars(sid(g, i)))}</small></button>`).join('')}
        </div>
      </section>`;

    const $ = (s) => root.querySelector(s);
    const ta = $('.cv-input'), hint = $('.cv-hint'), result = $('.cv-result');
    const spans = [...root.querySelectorAll('.cv-text .w')];

    function renderHint(i) {
      if (i === hintIdx) return;
      hintIdx = i;
      if (i >= words.length) {
        hint.innerHTML = '<div class="cv-target">🎉 Bé đã gõ hết đoạn văn! Bấm <b>Nộp bài</b> để xem kết quả.</div>';
        return;
      }
      const w = words[i], notes = Telex.notesFor(w);
      hint.innerHTML = `
        <div class="cv-target"><span class="lbl">Từ cần gõ:</span> <b>${esc(w)}</b>
          <button class="icon-btn speak-word" title="Nghe từ này">🔊</button></div>
        <div class="cv-keys"><span class="lbl">Bấm phím:</span> ${kbd(Telex.keysFor(w))}</div>
        ${notes.length ? `<div class="cv-notes">${notes.join(' · ')}</div>` : ''}`;
      hint.querySelector('.speak-word').onclick = () => U.speak(w.replace(/[^\p{L}\s]/gu, ''), 'vi');
    }

    function update() {
      const parts = ta.value.replace(/^\s+/, '').split(/\s+/);
      const done = parts.slice(0, -1), curText = parts[parts.length - 1];
      const cur = done.length;
      let correct = 0;
      spans.forEach((s, i) => {
        s.className = 'w';
        s.removeAttribute('title');
        if (i < cur) {
          const ok = Telex.canon(done[i]) === Telex.canon(words[i]);
          s.classList.add(ok ? 'ok' : 'bad');
          if (ok) correct++; else s.title = `Bé gõ: ${done[i]}`;
        } else if (i === cur) {
          s.classList.add('cur');
          if (curText && Telex.canon(curText) === Telex.canon(words[i])) { s.classList.add('ok'); correct++; }
          else if (curText && !Telex.skeleton(words[i]).startsWith(Telex.skeleton(curText))) s.classList.add('typo');
        }
      });
      renderHint(Math.min(cur, words.length));
      $('.bar').style.width = `${(Math.min(cur, words.length) / words.length) * 100}%`;
      $('.cv-count').textContent = `Đúng ${correct}/${words.length} từ`;
      const lastDone = cur === words.length - 1 && curText && Telex.canon(curText) === Telex.canon(words[cur]);
      if (!finished && (cur >= words.length || lastDone)) finish();
    }

    function finish() {
      finished = true;
      const typed = ta.value.trim().split(/\s+/).filter(Boolean);
      let correct = 0;
      const wrong = [];
      words.forEach((w, i) => {
        if (typed[i] && Telex.canon(typed[i]) === Telex.canon(w)) correct++;
        else wrong.push([w, typed[i] || '']);
      });
      const acc = correct / words.length;
      const stars = acc >= 0.95 ? 3 : acc >= 0.8 ? 2 : acc >= 0.6 ? 1 : 0;
      U.setStars(sid(g, index), stars);
      const chip = root.querySelector(`.chip[data-i="${index}"] small`);
      if (chip) chip.textContent = '⭐'.repeat(U.getStars(sid(g, index)));
      const secs = t0 ? Math.round((Date.now() - t0) / 1000) : 0;
      const time = secs ? ` trong ${secs >= 60 ? `${Math.floor(secs / 60)} phút ` : ''}${secs % 60} giây` : '';
      const msg = ['Bé gõ lại cho đúng dấu nhé! 💪', 'Khá lắm! Cố gõ đúng dấu hơn nhé! 🙂', 'Tốt lắm! Chỉ sai một vài từ thôi! 👍', 'Tuyệt vời! Bé gõ đúng hết rồi! 🎉'][stars];
      result.innerHTML = `
        <div class="rs">${U.starsHtml(stars)}</div>
        <div>Bé gõ đúng <b>${correct}/${words.length}</b> từ (${Math.round(acc * 100)}%)${time}. ${msg}</div>
        ${wrong.length ? `<div class="cv-wrong"><span class="lbl">Từ cần sửa:</span> ${wrong.slice(0, 15).map(([w, t]) =>
          `<span class="wr"><b>${esc(w)}</b> ${t ? `(bé gõ: ${esc(t)})` : '(chưa gõ)'}</span>`).join('')}</div>` : ''}`;
      if (stars === 3) { U.sound('win'); U.confetti(); } else U.sound(stars ? 'ok' : 'bad');
      if (stars >= 2 && index < last) $('.next').classList.add('pulse');
      result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    /* Bộ gõ Telex: chặn phím chữ cái trước khi vào ô, tự ghép dấu cho từ đang gõ. */
    ta.addEventListener('beforeinput', (e) => {
      if (!telexOn || e.isComposing || e.inputType !== 'insertText' || !e.data || e.data.length !== 1) return;
      const pos = ta.selectionStart;
      if (pos !== ta.selectionEnd) return;
      const m = ta.value.slice(0, pos).match(/\p{L}+$/u);
      const word = m ? m[0] : '';
      const out = Telex.applyKey(word, e.data);
      if (out === null) return;
      e.preventDefault();
      ta.setRangeText(out, pos - word.length, pos, 'end');
      if (!t0) t0 = Date.now();
      update();
    });
    ta.addEventListener('input', () => { if (!t0) t0 = Date.now(); update(); });
    const noPaste = (e) => { e.preventDefault(); U.toast('Bé hãy tự gõ từng chữ nhé! ✍️'); };
    ta.addEventListener('paste', noPaste);
    ta.addEventListener('drop', noPaste);

    $('.speak').onclick = () => U.speak(item.text.replace(/\n/g, ' '), 'vi');
    $('.opt-telex').onchange = (e) => { telexOn = e.target.checked; U.set('telex', telexOn); ta.focus(); };
    $('.redo').onclick = () => {
      ta.value = ''; finished = false; t0 = 0; result.innerHTML = '';
      $('.next').classList.remove('pulse');
      update(); ta.focus();
    };
    $('.submit').onclick = () => { if (!ta.value.trim()) { U.toast('Bé hãy gõ đoạn văn trước nhé! ⌨️'); return; } finish(); };
    $('.guide').addEventListener('toggle', (e) => U.set('cvGuideOpen', e.target.open));
    $('.prev').onclick = () => index > 0 && go(index - 1);
    $('.next').onclick = () => index < last && go(index + 1);
    root.querySelectorAll('.chip').forEach((b) => { b.onclick = () => go(+b.dataset.i); });

    update();
    ta.focus();
    return null;
  }

  return { practice };
})();
