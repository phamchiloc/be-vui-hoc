/* Môn Toán: mỗi chủ đề có hàm gen() sinh một câu hỏi ngẫu nhiên kèm hình minh hoạ. */
const Toan = (() => {
  const { rand, pick, shuffle, fmt } = U;
  const vi = (text) => ({ text, lang: 'vi' });
  const unit = (u) => (v) => `${fmt(v)} ${u}`;

  const THINGS = [
    { e: '🍎', n: 'quả táo' }, { e: '🐟', n: 'con cá' }, { e: '⭐', n: 'ngôi sao' },
    { e: '🌸', n: 'bông hoa' }, { e: '🐥', n: 'chú gà con' }, { e: '🎈', n: 'quả bóng bay' },
    { e: '🚗', n: 'chiếc ô tô' }, { e: '🍌', n: 'quả chuối' }, { e: '🐞', n: 'con bọ rùa' },
    { e: '🧁', n: 'chiếc bánh' }, { e: '🦋', n: 'con bướm' }, { e: '🍓', n: 'quả dâu' },
  ];
  const COLORS = ['#ff6b6b', '#4dabf7', '#51cf66', '#fcc419', '#b197fc', '#ff922b'];

  /* ---------- Phương án trả lời ---------- */

  /* Đáp án số: lấy đáp án + tối đa 3 phương án nhiễu từ hints, thiếu thì bù số gần đáp án.
     Mọi giá trị là số nguyên; số thập phân được tính theo đơn vị nhỏ rồi đổi ở label. */
  function choicesNum(ans, hints = [], { spread = 3, min = 0, label = fmt } = {}) {
    const set = new Set([ans]);
    shuffle(hints).forEach((h) => {
      if (set.size < 4 && Number.isInteger(h) && h >= min && h !== ans) set.add(h);
    });
    for (let guard = 0; set.size < 4 && guard < 200; guard++) {
      const v = ans + rand(1, spread) * (Math.random() < 0.5 ? -1 : 1);
      if (v >= min) set.add(v);
    }
    for (let k = 1; set.size < 4; k++) set.add(ans + spread + k);
    return shuffle([...set]).map((v) => ({ label: label(v), value: v }));
  }

  /* Đáp án chữ: đáp án + các phương án khác nhau trong cands. */
  function choicesStr(ans, cands, label = U.esc) {
    const list = [ans];
    shuffle(cands).forEach((c) => { if (list.length < 4 && !list.includes(c)) list.push(c); });
    return shuffle(list).map((v) => ({ label: label(v), value: v }));
  }

  const sameFrac = (x, y) => {
    const [a, b] = x.split('/').map(Number);
    const [c, d] = y.split('/').map(Number);
    return a * d === b * c;
  };
  const frac = (a, b) => `<span class="frac"><span>${a}</span><span>${b}</span></span>`;
  const fracLabel = (s) => { const [a, b] = s.split('/'); return frac(a, b); };
  const timeLabel = (h, m) => {
    const H = (((h - 1) % 12) + 12) % 12 + 1;
    return m ? `${H} giờ ${m} phút` : `${H} giờ`;
  };

  /* ---------- Hình minh hoạ ---------- */
  const BOX = '<span class="qbox">?</span>';
  const expr = (html) => `<div class="expr">${html}</div>`;
  const caption = (t) => `<div class="caption">${t}</div>`;

  /* n đồ vật; từ vị trí crossFrom trở đi bị gạch (dùng cho phép trừ). */
  const objs = (e, n, crossFrom = n) =>
    `<div class="objs${n > 20 ? ' small' : ''}">${Array.from({ length: n }, (_, i) =>
      `<span class="obj${i >= crossFrom ? ' gone' : ''}">${e}</span>`).join('')}</div>`;

  function column(a, op, b) {
    return `<div class="column">
      <div class="crow"><span class="cop"></span><span>${a}</span></div>
      <div class="crow"><span class="cop">${op}</span><span>${b}</span></div>
      <div class="cline"></div>
      <div class="crow"><span class="cop"></span><span class="qmark">?</span></div>
    </div>`;
  }

  function dotArray(rows, cols) {
    const pal = ['#ff6b6b', '#ffa94d', '#fcc419', '#69db7c', '#4dabf7', '#9775fa', '#f783ac', '#38d9a9', '#a9e34b', '#74c0fc'];
    let s = `<div class="darr" style="grid-template-columns:repeat(${cols},16px)">`;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) s += `<i style="background:${pal[r % pal.length]}"></i>`;
    return s + '</div>';
  }

  function blocks(h, t, o) {
    const g = (cls, n) => (n ? `<div class="b10g">${`<i class="${cls}"></i>`.repeat(n)}</div>` : '');
    return `<div class="b10">${g('hund', h)}${g('ten', t)}${g('one', o)}</div>`;
  }

  function clockSvg(h, m) {
    const P = (deg, r) => [(Math.sin((deg * Math.PI) / 180) * r).toFixed(1), (-Math.cos((deg * Math.PI) / 180) * r).toFixed(1)];
    let s = '<svg class="clock" viewBox="-100 -100 200 200"><circle r="95" fill="#fff" stroke="#3a86ff" stroke-width="7"/>';
    for (let i = 0; i < 60; i++) {
      const [x1, y1] = P(i * 6, i % 5 ? 84 : 78);
      const [x2, y2] = P(i * 6, 89);
      s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#495057" stroke-width="${i % 5 ? 1.5 : 3.5}"/>`;
    }
    for (let i = 1; i <= 12; i++) {
      const [x, y] = P(i * 30, 63);
      s += `<text x="${x}" y="${(+y + 7).toFixed(1)}" text-anchor="middle" class="cnum">${i}</text>`;
    }
    const hand = (deg, len, w, c) => {
      const [x, y] = P(deg, len);
      return `<line x1="0" y1="0" x2="${x}" y2="${y}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
    };
    s += hand(((h % 12) + m / 60) * 30, 44, 9, '#e03131') + hand(m * 6, 74, 5, '#1c7ed6');
    return s + '<circle r="7" fill="#212529"/></svg>';
  }

  function pieSvg(num, den) {
    const p = (a) => `${(50 * Math.cos(a)).toFixed(2)} ${(50 * Math.sin(a)).toFixed(2)}`;
    let s = '<svg class="pie" viewBox="-55 -55 110 110">';
    for (let i = 0; i < den; i++) {
      const a0 = (i / den) * 2 * Math.PI - Math.PI / 2;
      const a1 = ((i + 1) / den) * 2 * Math.PI - Math.PI / 2;
      s += `<path d="M0 0 L${p(a0)} A50 50 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${p(a1)} Z" fill="${i < num ? '#ffd43b' : '#fff'}" stroke="#333" stroke-width="2"/>`;
    }
    return s + '</svg>';
  }

  function barSvg(num, den, w = 300) {
    const cw = w / den;
    let s = `<svg class="bar" width="${w + 4}" height="54" viewBox="-2 -2 ${w + 4} 54">`;
    for (let i = 0; i < den; i++) {
      s += `<rect x="${(i * cw).toFixed(2)}" y="0" width="${cw.toFixed(2)}" height="50" fill="${i < num ? '#ffd43b' : '#fff'}" stroke="#333" stroke-width="2"/>`;
    }
    return s + '</svg>';
  }

  function percentGrid(p) {
    let s = '<div class="pgrid">';
    for (let i = 0; i < 100; i++) s += `<i class="${i < p ? 'on' : ''}"></i>`;
    return s + '</div>';
  }

  function rectSvg(a, b) {
    const k = Math.min(220 / a, 120 / b);
    const w = a * k, h = b * k;
    return `<svg class="geo" viewBox="0 0 ${w + 90} ${h + 56}" width="${w + 90}" height="${h + 56}">
      <rect x="62" y="12" width="${w}" height="${h}" fill="#d0ebff" stroke="#1c7ed6" stroke-width="3"/>
      <text x="${62 + w / 2}" y="${h + 44}" text-anchor="middle" class="lbl">${a} cm</text>
      <text x="54" y="${12 + h / 2 + 7}" text-anchor="end" class="lbl">${b} cm</text></svg>`;
  }

  function triangleSvg(a, h) {
    const W = 240, H = 130, ox = 20, oy = 12, ax = ox + W * 0.35, by = oy + H;
    return `<svg class="geo" viewBox="0 0 ${W + 60} ${H + 52}" width="${W + 60}" height="${H + 52}">
      <polygon points="${ox},${by} ${ox + W},${by} ${ax},${oy}" fill="#ffe8cc" stroke="#e8590c" stroke-width="3"/>
      <line x1="${ax}" y1="${oy}" x2="${ax}" y2="${by}" stroke="#495057" stroke-width="2" stroke-dasharray="6 5"/>
      <polyline points="${ax},${by - 12} ${ax + 12},${by - 12} ${ax + 12},${by}" fill="none" stroke="#495057" stroke-width="2"/>
      <text x="${ax + 10}" y="${oy + H / 2}" class="lbl">${h} cm</text>
      <text x="${ox + W / 2 + 30}" y="${by + 28}" text-anchor="middle" class="lbl">${a} cm</text></svg>`;
  }

  function trapezoidSvg(a, b, h) {
    const W = 260, T = Math.max(70, (W * b) / a), H = 120, ox = 16, oy = 34, by = oy + H;
    const tx = Math.max(4, ox + (W - T) / 2 - 20), hx = tx + T * 0.7;
    return `<svg class="geo" viewBox="0 0 ${W + 70} ${H + 72}" width="${W + 70}" height="${H + 72}">
      <polygon points="${ox},${by} ${ox + W},${by} ${tx + T},${oy} ${tx},${oy}" fill="#d3f9d8" stroke="#2b8a3e" stroke-width="3"/>
      <line x1="${hx}" y1="${oy}" x2="${hx}" y2="${by}" stroke="#495057" stroke-width="2" stroke-dasharray="6 5"/>
      <text x="${tx + T / 2 - 20}" y="${oy - 10}" text-anchor="middle" class="lbl">${b} cm</text>
      <text x="${ox + W / 2}" y="${by + 28}" text-anchor="middle" class="lbl">${a} cm</text>
      <text x="${hx + 8}" y="${oy + H / 2 + 6}" class="lbl">${h} cm</text></svg>`;
  }

  function circleSvg(r) {
    return `<svg class="geo" viewBox="0 0 220 200" width="220" height="200">
      <circle cx="110" cy="100" r="85" fill="#e5dbff" stroke="#7048e8" stroke-width="3"/>
      <line x1="110" y1="100" x2="195" y2="100" stroke="#212529" stroke-width="3"/>
      <circle cx="110" cy="100" r="5" fill="#212529"/>
      <text x="150" y="90" text-anchor="middle" class="lbl sm">r = ${r} cm</text></svg>`;
  }

  function barsChart(nums) {
    const max = Math.max(...nums), W = 70 * nums.length + 10, H = 170;
    let s = `<svg class="geo" viewBox="0 0 ${W} ${H + 6}" width="${W * 1.2}" height="${(H + 6) * 1.2}">`;
    nums.forEach((v, i) => {
      const h = (v / max) * (H - 36), x = i * 70 + 20;
      s += `<rect x="${x}" y="${H - h}" width="40" height="${h}" rx="6" fill="${COLORS[i % COLORS.length]}"/>
        <text x="${x + 20}" y="${H - h - 8}" text-anchor="middle" class="lbl">${v}</text>`;
    });
    return s + `<line x1="5" y1="${H}" x2="${W - 5}" y2="${H}" stroke="#333" stroke-width="2"/></svg>`;
  }

  const SHAPES = [
    { n: 'Hình tròn', svg: (c) => `<circle cx="60" cy="60" r="48" fill="${c}"/>` },
    { n: 'Hình vuông', svg: (c) => `<rect x="16" y="16" width="88" height="88" rx="3" fill="${c}"/>`, rot: true },
    { n: 'Hình tam giác', svg: (c) => `<polygon points="60,10 112,104 8,104" fill="${c}"/>`, rot: true },
    { n: 'Hình chữ nhật', svg: (c) => `<rect x="4" y="32" width="112" height="56" rx="3" fill="${c}"/>`, rot: true },
  ];

  /* ===================== LỚP 1 ===================== */
  const G1 = [
    {
      id: 'dem', name: 'Đếm hình', icon: '🍎', desc: 'Đếm đồ vật từ 1 đến 10',
      gen() {
        const t = pick(THINGS), n = rand(1, 10), p = `Có bao nhiêu ${t.n}?`;
        return { prompt: p, speak: vi(p), visual: objs(t.e, n), choices: choicesNum(n, [], { spread: 2, min: 1 }), answer: n, key: t.e + n };
      },
    },
    {
      id: 'cong10', name: 'Cộng trong phạm vi 10', icon: '➕', desc: 'Gộp hai nhóm đồ vật',
      gen() {
        const t = pick(THINGS), a = rand(1, 9), b = rand(1, 10 - a);
        const p = `Có ${a} ${t.n}, thêm ${b} ${t.n}. Có tất cả mấy ${t.n}?`;
        return {
          prompt: p, speak: vi(p),
          visual: `<div class="groups">${objs(t.e, a)}<span class="op">+</span>${objs(t.e, b)}</div>${expr(`${a} + ${b} = ${BOX}`)}`,
          choices: choicesNum(a + b, [a, b], { spread: 2 }), answer: a + b, key: `${a}+${b}`,
        };
      },
    },
    {
      id: 'tru10', name: 'Trừ trong phạm vi 10', icon: '➖', desc: 'Bớt đi rồi đếm phần còn lại',
      gen() {
        const t = pick(THINGS), a = rand(2, 10), b = rand(1, a);
        const p = `Có ${a} ${t.n}, bớt đi ${b} ${t.n}. Còn lại mấy ${t.n}?`;
        return {
          prompt: p, speak: vi(p), visual: objs(t.e, a, a - b) + expr(`${a} − ${b} = ${BOX}`),
          choices: choicesNum(a - b, [a + b, b], { spread: 2 }), answer: a - b, key: `${a}-${b}`,
        };
      },
    },
    {
      id: 'sosanh', name: 'So sánh số', icon: '⚖️', desc: 'Chọn dấu >, < hoặc =',
      gen() {
        const a = rand(1, 10), b = Math.random() < 0.25 ? a : rand(1, 10);
        const t1 = pick(THINGS), t2 = pick(THINGS);
        return {
          prompt: 'Chọn dấu thích hợp', speak: vi(`So sánh ${a} và ${b}`),
          visual: `<div class="compare"><div class="cbox">${objs(t1.e, a)}<b>${a}</b></div><span class="expr">${BOX}</span><div class="cbox">${objs(t2.e, b)}<b>${b}</b></div></div>`,
          choices: ['>', '<', '='], answer: a > b ? '>' : a < b ? '<' : '=', choiceClass: 'signs', key: `${a}?${b}`,
        };
      },
    },
    {
      id: 'pv100', name: 'Cộng, trừ trong phạm vi 100', icon: '💯', desc: 'Đặt tính rồi tính (không nhớ)',
      gen() {
        const plus = Math.random() < 0.5;
        let a, b;
        do {
          if (plus) {
            const a1 = rand(1, 8), b1 = rand(0, 9 - a1), a0 = rand(0, 9), b0 = rand(0, 9 - a0);
            a = a1 * 10 + a0; b = b1 * 10 + b0;
          } else {
            const a1 = rand(1, 9), b1 = rand(0, a1), a0 = rand(0, 9), b0 = rand(0, a0);
            a = a1 * 10 + a0; b = b1 * 10 + b0;
          }
        } while (b < 2);
        const r = plus ? a + b : a - b, op = plus ? '+' : '−';
        return {
          prompt: `Tính: ${a} ${op} ${b} = ?`, speak: vi(`${a} ${plus ? 'cộng' : 'trừ'} ${b} bằng bao nhiêu?`),
          visual: column(a, op, b), choices: choicesNum(r, [r + 10, r - 10, r + 1, r - 1]), answer: r, key: `${a}${op}${b}`,
        };
      },
    },
    {
      id: 'hinh', name: 'Nhận biết hình', icon: '🔺', desc: 'Hình tròn, vuông, tam giác, chữ nhật',
      gen() {
        const s = pick(SHAPES), c = pick(COLORS), rot = s.rot ? rand(-12, 12) : 0;
        return {
          prompt: 'Đây là hình gì?', speak: vi('Đây là hình gì?'),
          visual: `<svg class="shape" viewBox="0 0 120 120"><g transform="rotate(${rot} 60 60)" stroke="#343a40" stroke-width="3">${s.svg(c)}</g></svg>`,
          choices: shuffle(SHAPES.map((x) => x.n)), answer: s.n, key: s.n + c,
        };
      },
    },
  ];

  /* ===================== LỚP 2 ===================== */
  const G2 = [
    {
      id: 'congnho', name: 'Cộng có nhớ (phạm vi 100)', icon: '➕', desc: 'Đặt tính rồi tính',
      gen() {
        const a0 = rand(1, 9), b0 = rand(10 - a0, 9), a1 = rand(1, 7), b1 = rand(1, 8 - a1);
        const a = a1 * 10 + a0, b = b1 * 10 + b0, r = a + b;
        return {
          prompt: `Tính: ${a} + ${b} = ?`, speak: vi(`${a} cộng ${b} bằng bao nhiêu?`), visual: column(a, '+', b),
          choices: choicesNum(r, [r - 10, r + 10, r + 1, r - 1]), answer: r, key: `${a}+${b}`,
        };
      },
    },
    {
      id: 'trunho', name: 'Trừ có nhớ (phạm vi 100)', icon: '➖', desc: 'Đặt tính rồi tính',
      gen() {
        const a0 = rand(0, 8), b0 = rand(a0 + 1, 9), a1 = rand(2, 9), b1 = rand(0, a1 - 1);
        const a = a1 * 10 + a0, b = b1 * 10 + b0, r = a - b;
        return {
          prompt: `Tính: ${a} − ${b} = ?`, speak: vi(`${a} trừ ${b} bằng bao nhiêu?`), visual: column(a, '−', b),
          choices: choicesNum(r, [r + 10, r - 10, r + 2]), answer: r, key: `${a}-${b}`,
        };
      },
    },
    {
      id: 'nhan25', name: 'Bảng nhân 2, 5', icon: '✖️', desc: 'Phép nhân bằng các nhóm đồ vật',
      gen() {
        const f = pick([2, 5]), n = rand(1, 10), t = pick(THINGS);
        const groups = `<div class="mgroups">${Array.from({ length: n }, () => `<div class="mgroup">${t.e.repeat(f)}</div>`).join('')}</div>`;
        return {
          prompt: `Tính: ${f} × ${n} = ?`, speak: vi(`${f} nhân ${n} bằng bao nhiêu?`),
          visual: caption(`${f} ${t.n} được lấy ${n} lần`) + groups,
          choices: choicesNum(f * n, [f * (n + 1), f * (n - 1), f + n], { min: 1 }), answer: f * n, key: `${f}x${n}`,
        };
      },
    },
    {
      id: 'chia25', name: 'Bảng chia 2, 5', icon: '➗', desc: 'Chia đều kẹo cho các bạn',
      gen() {
        const d = pick([2, 5]), q = rand(1, 10), n = d * q;
        const p = `Có ${n} cái kẹo chia đều cho ${d} bạn. Mỗi bạn được mấy cái?`;
        return {
          prompt: p, speak: vi(p),
          visual: objs('🍬', n) + `<div class="objs">${'🧒'.repeat(d)}</div>` + expr(`${n} : ${d} = ${BOX}`),
          choices: choicesNum(q, [q + 1, q - 1, n - d], { spread: 2, min: 1 }), answer: q, key: `${n}:${d}`,
        };
      },
    },
    {
      id: 'dongho', name: 'Xem đồng hồ', icon: '🕒', desc: 'Giờ đúng, 15 phút, 30 phút',
      gen() {
        const h = rand(1, 12), m = pick([0, 15, 30]), ans = timeLabel(h, m);
        const cand = [[h, (m + 15) % 45], [h, (m + 30) % 45], [h + 1, m], [h - 1, m]];
        return {
          prompt: 'Đồng hồ chỉ mấy giờ?', speak: vi('Đồng hồ chỉ mấy giờ?'), visual: clockSvg(h, m),
          choices: choicesStr(ans, cand.map(([H, M]) => timeLabel(H, M))), answer: ans, key: ans,
        };
      },
    },
    {
      id: 'tramchuc', name: 'Trăm, chục, đơn vị', icon: '🧱', desc: 'Số có ba chữ số',
      gen() {
        const h = rand(1, 9), t = rand(0, 9), o = rand(0, 9), n = h * 100 + t * 10 + o;
        const byPic = Math.random() < 0.5;
        const p = byPic ? 'Hình dưới đây biểu diễn số nào?' : `Số gồm ${h} trăm, ${t} chục và ${o} đơn vị là:`;
        const hints = [h * 100 + o * 10 + t, t * 100 + h * 10 + o, o * 100 + t * 10 + h, n + 10, n - 10, n + 100];
        return {
          prompt: p, speak: vi(p),
          visual: byPic ? blocks(h, t, o) + caption('🟨 1 trăm &nbsp; 🟦 1 chục &nbsp; 🟥 1 đơn vị') : '',
          choices: choicesNum(n, hints, { spread: 5, min: 100 }), answer: n, key: `${n}${byPic}`,
        };
      },
    },
  ];

  /* ===================== LỚP 3 ===================== */
  const G3 = [
    {
      id: 'bangnhan', name: 'Bảng nhân 2 – 9', icon: '✖️', desc: 'Ôn bảng nhân',
      gen() {
        const a = rand(2, 9), b = rand(1, 10), r = a * b;
        return {
          prompt: `Tính: ${a} × ${b} = ?`, speak: vi(`${a} nhân ${b} bằng bao nhiêu?`),
          visual: caption(`${a} được lấy ${b} lần`) + dotArray(b, a),
          choices: choicesNum(r, [a * (b + 1), a * (b - 1), (a + 1) * b, a + b], { min: 1 }), answer: r, key: `${a}x${b}`,
        };
      },
    },
    {
      id: 'bangchia', name: 'Bảng chia 2 – 9', icon: '➗', desc: 'Ôn bảng chia',
      gen() {
        const d = rand(2, 9), q = rand(1, 10), n = d * q;
        return {
          prompt: `Tính: ${n} : ${d} = ?`, speak: vi(`${n} chia ${d} bằng bao nhiêu?`),
          visual: caption(`Chia ${n} chấm thành ${d} hàng đều nhau`) + dotArray(d, q),
          choices: choicesNum(q, [q + 1, q - 1, q + 2, d], { spread: 2, min: 1 }), answer: q, key: `${n}:${d}`,
        };
      },
    },
    {
      id: 'nhanchia1', name: 'Nhân, chia với số có một chữ số', icon: '🧮', desc: 'Số có nhiều chữ số',
      gen() {
        const b = rand(2, 9), top = Math.min(9999, Math.floor(99999 / b));
        if (Math.random() < 0.5) {
          const a = rand(100, top), r = a * b;
          return {
            prompt: `Tính: ${fmt(a)} × ${b} = ?`, speak: vi(`${a} nhân ${b} bằng bao nhiêu?`), visual: column(a, '×', b),
            choices: choicesNum(r, [r + 10, r - 10, r + 100, r - b, r + b * 10]), answer: r, key: `${a}x${b}`,
          };
        }
        const q = rand(100, top), n = q * b;
        return {
          prompt: 'Tính:', speak: vi(`${n} chia ${b} bằng bao nhiêu?`), visual: expr(`${fmt(n)} : ${b} = ${BOX}`),
          choices: choicesNum(q, [q + 1, q - 1, q + 10, q - 10]), answer: q, key: `${n}:${b}`,
        };
      },
    },
    {
      id: 'chuvi', name: 'Chu vi và diện tích', icon: '📐', desc: 'Hình chữ nhật, hình vuông',
      gen() {
        const sq = Math.random() < 0.35;
        const a = sq ? rand(2, 12) : rand(4, 15), b = sq ? a : rand(2, a - 1);
        const area = Math.random() < 0.5, name = sq ? 'hình vuông' : 'hình chữ nhật';
        const dims = sq ? `cạnh ${a} cm` : `chiều dài ${a} cm, chiều rộng ${b} cm`;
        const r = area ? a * b : (a + b) * 2;
        const p = `Một ${name} có ${dims}. ${area ? 'Diện tích' : 'Chu vi'} ${name} là:`;
        const hints = area ? [(a + b) * 2, a + b, a * b + a] : [a + b, a * b, (a + b) * 2 + 2, a * 4];
        return {
          prompt: p, speak: vi(p.replace(/cm/g, 'xăng-ti-mét')), visual: rectSvg(a, b),
          choices: choicesNum(r, hints, { spread: 4, min: 1, label: unit(area ? 'cm²' : 'cm') }), answer: r, key: p,
        };
      },
    },
    {
      id: 'dongho3', name: 'Xem đồng hồ (đến từng phút)', icon: '⏰', desc: 'Đọc giờ chính xác',
      gen() {
        const h = rand(1, 12), m = Math.random() < 0.6 ? rand(1, 11) * 5 : rand(1, 59), ans = timeLabel(h, m);
        const step = m % 5 ? 1 : 5;
        const cand = [[h, (m + step) % 60], [h, (m + 60 - step) % 60], [h + 1, m], [h - 1, m]];
        if (m % 5 === 0) cand.push([m / 5, (h % 12) * 5]);
        return {
          prompt: 'Đồng hồ chỉ mấy giờ?', speak: vi('Đồng hồ chỉ mấy giờ?'), visual: clockSvg(h, m),
          choices: choicesStr(ans, cand.map(([H, M]) => timeLabel(H, M))), answer: ans, key: ans,
        };
      },
    },
    {
      id: 'timso', name: 'Tìm số chưa biết', icon: '🔍', desc: 'Điền số vào ô trống',
      gen() {
        const k = rand(0, 4);
        let e, ans, hints;
        if (k === 0) { const x = rand(10, 90), a = rand(5, 90); e = `${BOX} + ${a} = ${x + a}`; ans = x; hints = [x + 2 * a]; }
        else if (k === 1) { const x = rand(20, 99), a = rand(5, x - 5); e = `${BOX} − ${a} = ${x - a}`; ans = x; hints = [x - 2 * a]; }
        else if (k === 2) { const a = rand(30, 99), x = rand(5, a - 5); e = `${a} − ${BOX} = ${a - x}`; ans = x; hints = [2 * a - x]; }
        else if (k === 3) { const a = rand(2, 9), x = rand(2, 10); e = `${BOX} × ${a} = ${a * x}`; ans = x; hints = [a * x - a, x + 1]; }
        else { const a = rand(2, 9), q = rand(2, 10); e = `${BOX} : ${a} = ${q}`; ans = a * q; hints = [a + q, a * q + a, a * q - a]; }
        return {
          prompt: 'Số thích hợp điền vào ô trống là:', speak: vi('Tìm số thích hợp điền vào ô trống'), visual: expr(e),
          choices: choicesNum(ans, hints, { min: 1 }), answer: ans, key: e,
        };
      },
    },
    {
      id: 'motphan', name: 'Một phần mấy', icon: '🍕', desc: 'Làm quen với 1/2, 1/3, 1/4…',
      gen() {
        const n = rand(2, 9), pie = Math.random() < 0.5, p = 'Đã tô màu vào một phần mấy của hình?';
        return {
          prompt: p, speak: vi(p), visual: pie ? pieSvg(1, n) : barSvg(1, n),
          choices: choicesNum(n, [n + 1, n - 1, n + 2], { spread: 2, min: 2, label: (v) => frac(1, v) }),
          answer: n, choiceClass: 'fracs', key: `${n}${pie}`,
        };
      },
    },
  ];

  /* ===================== LỚP 4 ===================== */
  const G4 = [
    {
      id: 'solon', name: 'Số có nhiều chữ số', icon: '🔢', desc: 'So sánh số, giá trị của chữ số',
      gen() {
        if (Math.random() < 0.5) {
          const base = rand(100000, 999999), s = String(base), set = new Set([base]);
          while (set.size < 4) {
            const d = s.split('');
            d[rand(1, 5)] = String(rand(0, 9));
            set.add(+d.join(''));
          }
          const nums = [...set], big = Math.random() < 0.5, p = `Số nào ${big ? 'lớn nhất' : 'bé nhất'}?`;
          return {
            prompt: p, speak: vi(p), choices: shuffle(nums).map((v) => ({ label: fmt(v), value: v })),
            answer: big ? Math.max(...nums) : Math.min(...nums), key: nums.join(),
          };
        }
        let n, pos, s;
        do { n = rand(100000, 9999999); s = String(n); pos = rand(0, s.length - 1); } while (s[pos] === '0' || s.split(s[pos]).length !== 2);
        const d = +s[pos], place = s.length - 1 - pos, val = d * 10 ** place;
        let di = 0;
        const shown = [...fmt(n)].map((ch) => (/\d/.test(ch) ? (di++ === pos ? `<b class="hl">${ch}</b>` : ch) : ch)).join('');
        const hints = [d * 10 ** (place + 1), d * 10 ** (place + 2), place > 0 ? d * 10 ** (place - 1) : d * 1000, place > 1 ? d * 10 ** (place - 2) : d * 10000];
        return {
          prompt: `Giá trị của chữ số ${d} trong số dưới đây là:`, speak: vi(`Giá trị của chữ số ${d} trong số ${n} là bao nhiêu?`),
          visual: expr(shown), choices: choicesNum(val, hints, { min: 1 }), answer: val, key: `${n}/${pos}`,
        };
      },
    },
    {
      id: 'nhan2', name: 'Nhân với số có hai chữ số', icon: '✖️', desc: 'Đặt tính rồi tính',
      gen() {
        const a = rand(100, 999), b = rand(11, 99), r = a * b;
        const forgotShift = a * (b % 10) + a * Math.floor(b / 10);
        return {
          prompt: `Tính: ${a} × ${b} = ?`, speak: vi(`${a} nhân ${b} bằng bao nhiêu?`), visual: column(a, '×', b),
          choices: choicesNum(r, [forgotShift, r + 10, r - 10, r + a, r - a]), answer: r, key: `${a}x${b}`,
        };
      },
    },
    {
      id: 'chia2', name: 'Chia cho số có hai chữ số', icon: '➗', desc: 'Phép chia hết',
      gen() {
        const d = rand(11, 99), q = rand(12, Math.min(999, Math.floor(99999 / d))), n = q * d;
        return {
          prompt: 'Tính:', speak: vi(`${n} chia ${d} bằng bao nhiêu?`), visual: expr(`${fmt(n)} : ${d} = ${BOX}`),
          choices: choicesNum(q, [q + 1, q - 1, q + 10, q - 10], { min: 1 }), answer: q, key: `${n}:${d}`,
        };
      },
    },
    {
      id: 'phanso', name: 'Phân số', icon: '🥧', desc: 'Đọc phân số từ hình vẽ',
      gen() {
        const den = rand(2, 8), num = rand(1, den), pie = Math.random() < 0.5, ans = `${num}/${den}`;
        const cands = [`${den - num}/${den}`, `${den}/${num}`, `${num}/${den + 1}`, `${num + 1}/${den}`, `${num}/${den - num || 1}`, `${num + 2}/${den + 1}`]
          .filter((c) => !c.startsWith('0/') && c !== ans && !sameFrac(c, ans));
        const p = 'Phân số chỉ phần đã tô màu là:';
        return {
          prompt: p, speak: vi(p), visual: pie ? pieSvg(num, den) : barSvg(num, den),
          choices: choicesStr(ans, cands, fracLabel), answer: ans, choiceClass: 'fracs', key: ans + pie,
        };
      },
    },
    {
      id: 'sosanhps', name: 'So sánh phân số', icon: '⚖️', desc: 'Chọn dấu >, < hoặc =',
      gen() {
        const k = rand(0, 2);
        let a, b, c, d;
        if (k === 0) { b = d = rand(3, 10); a = rand(1, b - 1); c = rand(1, b - 1); }
        else if (k === 1) { a = c = rand(1, 5); b = rand(a + 1, 10); d = rand(a + 1, 10); }
        else { b = rand(2, 5); const m = rand(2, 3); d = b * m; a = rand(1, b - 1); c = Math.random() < 0.4 ? a * m : rand(1, d - 1); }
        const L = a * d, R = c * b;
        const col = (x, y) => `<div class="fcol">${frac(x, y)}${barSvg(x, y, 200)}</div>`;
        return {
          prompt: 'Chọn dấu thích hợp', speak: vi(`So sánh ${a} phần ${b} và ${c} phần ${d}`),
          visual: `<div class="cmp-fracs">${col(a, b)}<span class="expr">${BOX}</span>${col(c, d)}</div>`,
          choices: ['>', '<', '='], answer: L > R ? '>' : L < R ? '<' : '=', choiceClass: 'signs', key: `${a}/${b}?${c}/${d}`,
        };
      },
    },
    {
      id: 'tbc', name: 'Trung bình cộng', icon: '📊', desc: 'Tìm số trung bình cộng',
      gen() {
        let n, avg, nums;
        do {
          n = rand(2, 4); avg = rand(10, 60); nums = [];
          let rest = avg * n;
          for (let i = 0; i < n - 1; i++) { const v = avg + rand(-9, 9); nums.push(v); rest -= v; }
          nums.push(rest);
        } while (nums.some((v) => v <= 0) || new Set(nums).size < n);
        const p = `Trung bình cộng của các số ${nums.join('; ')} là:`;
        return {
          prompt: p, speak: vi(`Trung bình cộng của các số ${nums.join(', ')} là bao nhiêu?`), visual: barsChart(nums),
          choices: choicesNum(avg, [avg * n, avg + 2, avg - 2], { min: 1 }), answer: avg, key: p,
        };
      },
    },
    {
      id: 'congps', name: 'Cộng, trừ phân số', icon: '🧩', desc: 'Phân số cùng mẫu số',
      gen() {
        const b = rand(3, 12), plus = Math.random() < 0.5;
        let a, c;
        if (plus) { a = rand(1, b - 1); c = rand(1, b - 1); } else { a = rand(2, b); c = rand(1, a - 1); }
        const r = plus ? a + c : a - c, ans = `${r}/${b}`;
        const cands = [`${r}/${b * 2}`, `${r + 1}/${b}`, `${r - 1}/${b}`, `${plus ? Math.abs(a - c) : a + c}/${b}`, `${r + 2}/${b}`]
          .filter((x) => !x.startsWith('0/') && !sameFrac(x, ans));
        return {
          prompt: 'Tính:', speak: vi(`${a} phần ${b} ${plus ? 'cộng' : 'trừ'} ${c} phần ${b} bằng bao nhiêu?`),
          visual: expr(`${frac(a, b)} ${plus ? '+' : '−'} ${frac(c, b)} = ${BOX}`),
          choices: choicesStr(ans, cands, fracLabel), answer: ans, choiceClass: 'fracs', key: `${a}${plus}${c}/${b}`,
        };
      },
    },
  ];

  /* ===================== LỚP 5 ===================== */
  const CONVERSIONS = [
    () => { const m = rand(1, 9), cm = rand(1, 99); return { img: '📏', q: `${m} m ${cm} cm = ? cm`, ans: m * 100 + cm, hints: [m * 10 + cm, m * 1000 + cm, m + cm] }; },
    () => { const x = rand(11, 99); return { img: '⚖️', q: `${fmt(x / 10)} kg = ? g`, ans: x * 100, hints: [x * 10, x * 1000, x] }; },
    () => { const h = rand(1, 4), m = rand(1, 59); return { img: '⏰', q: `${h} giờ ${m} phút = ? phút`, ans: h * 60 + m, hints: [h * 100 + m, h * 10 + m, h + m] }; },
    () => { const t = rand(2, 9), kg = rand(1, 9) * 100; return { img: '🚛', q: `${t} tấn ${kg} kg = ? kg`, ans: t * 1000 + kg, hints: [t * 100 + kg, t * 10000 + kg, t + kg] }; },
    () => { const x = rand(11, 99); return { img: '🛣️', q: `${x * 100} m = ? km`, ans: x, label: (v) => fmt(v / 10), hints: [x * 10, x * 100, x + 1] }; },
    () => { const x = rand(2, 9), y = rand(1, 9); return { img: '🥛', q: `${x} l ${y * 100} ml = ? ml`, ans: x * 1000 + y * 100, hints: [x * 100 + y * 100, x * 10000 + y * 100, x + y * 100] }; },
  ];
  const VEHICLES = [
    { e: '🚗', n: 'Một ô tô', v: () => rand(8, 14) * 5 },
    { e: '🏍️', n: 'Một xe máy', v: () => rand(6, 10) * 5 },
    { e: '🚌', n: 'Một xe buýt', v: () => rand(6, 10) * 5 },
    { e: '🚲', n: 'Một người đi xe đạp', v: () => rand(10, 16) },
  ];
  const sayUnits = (s) => s.replace(/km\/giờ/g, 'ki-lô-mét trên giờ').replace(/cm²/g, 'xăng-ti-mét vuông').replace(/km/g, 'ki-lô-mét').replace(/cm/g, 'xăng-ti-mét');

  const G5 = [
    {
      id: 'tpcongtru', name: 'Cộng, trừ số thập phân', icon: '🔟', desc: 'Một hoặc hai chữ số sau dấu phẩy',
      gen() {
        const mk = () => (Math.random() < 0.5 ? rand(10, 999) * 10 : rand(100, 9999)); // tính theo phần trăm
        let A = mk(), B = mk();
        const plus = Math.random() < 0.5;
        if (!plus && A < B) [A, B] = [B, A];
        if (!plus && A === B) A += 110;
        const r = plus ? A + B : A - B, h = (v) => fmt(v / 100), op = plus ? '+' : '−';
        return {
          prompt: 'Tính:', speak: vi(`${h(A)} ${plus ? 'cộng' : 'trừ'} ${h(B)} bằng bao nhiêu?`),
          visual: expr(`${h(A)} ${op} ${h(B)} = ${BOX}`),
          choices: choicesNum(r, [r + 10, r - 10, r + 100, r - 100, r + 1], { label: h }), answer: r, key: `${A}${op}${B}`,
        };
      },
    },
    {
      id: 'tpnhanchia', name: 'Nhân, chia số thập phân', icon: '✖️', desc: 'Nhân, chia có dấu phẩy',
      gen() {
        const h = (v) => fmt(v / 100), k = rand(0, 3); // đáp án tính theo phần trăm
        let e, r, hints, said;
        if (k === 0) {
          const A = rand(11, 99), B = rand(2, 9);
          e = `${fmt(A / 10)} × ${B}`; said = `${fmt(A / 10)} nhân ${B}`; r = A * B * 10; hints = [A * B, A * B * 100];
        } else if (k === 1) {
          const A = rand(11, 49), B = rand(11, 29);
          e = `${fmt(A / 10)} × ${fmt(B / 10)}`; said = `${fmt(A / 10)} nhân ${fmt(B / 10)}`; r = A * B; hints = [A * B * 10, A * B / 10];
        } else if (k === 2) {
          const Q = rand(11, 99), D = rand(2, 9);
          e = `${fmt((Q * D) / 10)} : ${D}`; said = `${fmt((Q * D) / 10)} chia ${D}`; r = Q * 10; hints = [Q * 100, Q, (Q + 1) * 10];
        } else {
          const Q = rand(2, 12);
          let D;
          do { D = rand(11, 49); } while (D % 10 === 0);
          e = `${fmt((Q * D) / 10)} : ${fmt(D / 10)}`; said = `${fmt((Q * D) / 10)} chia ${fmt(D / 10)}`; r = Q * 100; hints = [Q * 10, Q * 1000, (Q + 1) * 100];
        }
        return {
          prompt: 'Tính:', speak: vi(`${said} bằng bao nhiêu?`), visual: expr(`${e} = ${BOX}`),
          choices: choicesNum(r, hints, { min: 1, spread: 5, label: h }), answer: r, key: e,
        };
      },
    },
    {
      id: 'phantram', name: 'Tỉ số phần trăm', icon: '💯', desc: 'Tìm phần trăm của một số',
      gen() {
        if (Math.random() < 0.6) {
          const p = pick([10, 20, 25, 30, 40, 50, 60, 75, 80]);
          let N;
          do { N = rand(2, 40) * 10; } while ((N * p) % 100);
          const r = (N * p) / 100, q = `${p}% của ${N} là:`;
          return {
            prompt: q, speak: vi(`${p} phần trăm của ${N} là bao nhiêu?`),
            visual: percentGrid(p) + caption(`Đã tô ${p} ô trên tổng số 100 ô`),
            choices: choicesNum(r, [N - r, r * 10, r + 10, N / p], { min: 1 }), answer: r, key: q,
          };
        }
        let a, b, p;
        do { b = pick([20, 25, 40, 50, 80, 200]); p = pick([10, 20, 25, 40, 50, 60, 75, 80]); a = (b * p) / 100; } while (!Number.isInteger(a));
        const q = `Tỉ số phần trăm của ${a} và ${b} là:`;
        return {
          prompt: q, speak: vi(q), visual: expr(`${a} : ${b} = ${BOX} %`),
          choices: choicesNum(p, [100 - p, a, p + 5, p - 5], { min: 1, label: (v) => `${v}%` }), answer: p, key: q,
        };
      },
    },
    {
      id: 'dientich', name: 'Diện tích hình', icon: '📐', desc: 'Tam giác, hình thang, hình tròn',
      gen() {
        const k = rand(0, 2);
        if (k === 0) {
          const a = rand(3, 14), h = rand(2, 12), r = a * h * 5; // phần mười cm²
          const q = `Hình tam giác có độ dài đáy ${a} cm, chiều cao ${h} cm. Diện tích hình tam giác là:`;
          return {
            prompt: q, speak: vi(sayUnits(q)), visual: triangleSvg(a, h),
            choices: choicesNum(r, [a * h * 10, (a + h) * 10, (a + h) * 20], { min: 1, spread: 10, label: (v) => `${fmt(v / 10)} cm²` }), answer: r, key: q,
          };
        }
        if (k === 1) {
          const a = rand(6, 14), b = rand(2, a - 2), h = rand(2, 10), r = (a + b) * h * 5;
          const q = `Hình thang có hai đáy ${a} cm và ${b} cm, chiều cao ${h} cm. Diện tích hình thang là:`;
          return {
            prompt: q, speak: vi(sayUnits(q)), visual: trapezoidSvg(a, b, h),
            choices: choicesNum(r, [(a + b) * h * 10, a * b * h * 5, (a + b + h) * 10], { min: 1, spread: 10, label: (v) => `${fmt(v / 10)} cm²` }), answer: r, key: q,
          };
        }
        const rr = rand(1, 10), r = rr * rr * 314; // phần trăm cm²
        const q = `Hình tròn có bán kính ${rr} cm. Diện tích hình tròn là:`;
        return {
          prompt: q, speak: vi(sayUnits(q)), visual: circleSvg(rr),
          choices: choicesNum(r, [rr * 2 * 314, rr * 314, rr * rr * 4 * 314], { min: 1, spread: 50, label: (v) => `${fmt(v / 100)} cm²` }), answer: r, key: q,
        };
      },
    },
    {
      id: 'doidonvi', name: 'Đổi đơn vị đo', icon: '📏', desc: 'Độ dài, khối lượng, thời gian, dung tích',
      gen() {
        const c = pick(CONVERSIONS)();
        return {
          prompt: 'Số thích hợp điền vào chỗ trống là:', speak: vi('Tìm số thích hợp điền vào chỗ trống'),
          visual: `<div class="big-emoji">${c.img}</div>` + expr(c.q.replace('?', BOX)),
          choices: choicesNum(c.ans, c.hints, { min: 1, label: c.label || fmt }), answer: c.ans, key: c.q,
        };
      },
    },
    {
      id: 'chuyendong', name: 'Toán chuyển động', icon: '🚗', desc: 'Quãng đường, vận tốc, thời gian',
      gen() {
        const veh = pick(VEHICLES), v = veh.v(), t = rand(2, 5), s = v * t, k = rand(0, 2);
        let q, ans, label, hints;
        if (k === 0) { q = `${veh.n} đi với vận tốc ${v} km/giờ trong ${t} giờ. Quãng đường đi được là:`; ans = s; label = unit('km'); hints = [v + t, s + v, s - v]; }
        else if (k === 1) { q = `${veh.n} đi quãng đường ${s} km với vận tốc ${v} km/giờ. Thời gian đi là:`; ans = t; label = unit('giờ'); hints = [t + 1, t - 1, t + 2]; }
        else { q = `${veh.n} đi quãng đường ${s} km hết ${t} giờ. Vận tốc là:`; ans = v; label = unit('km/giờ'); hints = [v + 5, v - 5, s - t]; }
        return {
          prompt: q, speak: vi(sayUnits(q)),
          visual: `<div class="road"><span>${veh.e}</span><div class="track"></div><span>🏁</span></div>`,
          choices: choicesNum(ans, hints, { min: 1, label }), answer: ans, key: q,
        };
      },
    },
  ];

  return { topics: { 1: G1, 2: G2, 3: G3, 4: G4, 5: G5 } };
})();
