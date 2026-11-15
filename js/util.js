/* Tiện ích dùng chung: số ngẫu nhiên, định dạng số, lưu tiến độ, âm thanh, giọng đọc, hiệu ứng. */
const U = (() => {
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const el = (html) => {
    const t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  };

  /* Viết số theo kiểu sách giáo khoa: nhóm nghìn cách nhau (từ 5 chữ số), phần thập phân sau dấu phẩy. */
  function fmt(n, maxDec = 3) {
    const neg = n < 0;
    const s = String(+Math.abs(n).toFixed(maxDec));
    let [i, f] = s.split('.');
    if (i.length > 4) i = i.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return (neg ? '-' : '') + i + (f ? ',' + f : '');
  }

  /* ---------- Lưu tiến độ trong trình duyệt ---------- */
  const KEY = 'bevuihoc.v1';
  let store = {};
  try { store = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { store = {}; }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) { /* bỏ qua */ } };
  const get = (k, d) => (k in store ? store[k] : d);
  const set = (k, v) => { store[k] = v; save(); };

  /* Sao: lưu số sao cao nhất của từng bài, khoá dạng "toan/2/congnho". */
  const getStars = (id) => (store.stars || {})[id] || 0;
  function setStars(id, n) {
    store.stars = store.stars || {};
    if (n > (store.stars[id] || 0)) { store.stars[id] = n; save(); }
    updateStarTotal();
  }
  /* Xoá sao của những bài không còn trong chương trình. */
  function dropStars(test) {
    const s = store.stars || {};
    const keys = Object.keys(s).filter(test);
    keys.forEach((k) => delete s[k]);
    if (keys.length) save();
  }
  const totalStars = (prefix = '') =>
    Object.entries(store.stars || {}).filter(([k]) => k.startsWith(prefix)).reduce((s, [, v]) => s + v, 0);
  function updateStarTotal() {
    const e = document.getElementById('starTotal');
    if (e) e.textContent = totalStars();
  }
  const starsHtml = (n, max = 3) => '⭐'.repeat(n) + '<span class="star-off">⭐</span>'.repeat(Math.max(0, max - n));

  /* ---------- Âm thanh hiệu ứng (tạo bằng Web Audio, không cần file) ---------- */
  let actx = null;
  const TUNES = {
    ok: [[660, 0, 0.12], [880, 0.1, 0.2]],
    bad: [[240, 0, 0.18, 'triangle'], [180, 0.15, 0.25, 'triangle']],
    win: [[523, 0, 0.15], [659, 0.13, 0.15], [784, 0.26, 0.15], [1047, 0.39, 0.4]],
    tap: [[520, 0, 0.05]],
  };
  function sound(name) {
    if (!get('sound', true)) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === 'suspended') actx.resume();
      const now = actx.currentTime;
      (TUNES[name] || []).forEach(([f, t, d, type]) => {
        const o = actx.createOscillator();
        const g = actx.createGain();
        o.type = type || 'sine';
        o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, now + t);
        g.gain.exponentialRampToValueAtTime(name === 'tap' ? 0.08 : 0.22, now + t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, now + t + d);
        o.connect(g).connect(actx.destination);
        o.start(now + t);
        o.stop(now + t + d + 0.05);
      });
    } catch (e) { /* trình duyệt không hỗ trợ */ }
  }

  /* ---------- Giọng đọc (Web Speech API) ---------- */
  let voices = [];
  const hasTTS = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const loadVoices = () => { voices = hasTTS ? speechSynthesis.getVoices() : []; };
  if (hasTTS) { loadVoices(); speechSynthesis.onvoiceschanged = loadVoices; }

  function findVoice(lang) {
    const list = voices.filter((v) => v.lang.toLowerCase().replace('_', '-').startsWith(lang));
    if (!list.length) return null;
    const score = (v) =>
      (/natural|online/i.test(v.name) ? 4 : 0) + (/en-us/i.test(v.lang.replace('_', '-')) ? 2 : 0) + (/google/i.test(v.name) ? 1 : 0);
    return list.sort((a, b) => score(b) - score(a))[0];
  }

  let warnedVi = false;
  function speak(text, lang = 'en', rate) {
    if (!hasTTS) { toast('Trình duyệt này không đọc được thành tiếng.'); return; }
    if (!voices.length) loadVoices();
    const v = findVoice(lang);
    if (!v && lang === 'vi') {
      if (!warnedVi) {
        warnedVi = true;
        toast('Máy chưa có giọng đọc tiếng Việt. Hãy mở chương trình bằng Microsoft Edge.', 4500);
      }
      return;
    }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    if (v) { u.voice = v; u.lang = v.lang; } else { u.lang = 'en-US'; }
    u.rate = rate || (lang === 'en' ? 0.85 : 1);
    speechSynthesis.speak(u);
  }
  const stopSpeak = () => { if (hasTTS) speechSynthesis.cancel(); };

  /* ---------- Thông báo nhỏ và pháo giấy ---------- */
  let toastTimer = 0;
  function toast(msg, ms = 2400) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), ms);
  }

  let confettiRaf = 0;
  function confetti() {
    const c = document.getElementById('confetti');
    if (!c) return;
    const ctx = c.getContext('2d');
    c.width = innerWidth;
    c.height = innerHeight;
    c.style.display = 'block';
    const colors = ['#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#6a4c93', '#ff924c'];
    const parts = Array.from({ length: 170 }, () => ({
      x: Math.random() * c.width,
      y: -20 - Math.random() * c.height * 0.6,
      vx: (Math.random() - 0.5) * 4,
      vy: 2 + Math.random() * 4,
      s: 7 + Math.random() * 8,
      r: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      col: pick(colors),
    }));
    const t0 = performance.now();
    cancelAnimationFrame(confettiRaf);
    const frame = (t) => {
      ctx.clearRect(0, 0, c.width, c.height);
      parts.forEach((p) => {
        p.x += p.vx; p.y += p.vy; p.vy += 0.05; p.r += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r);
        ctx.fillStyle = p.col;
        ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
        ctx.restore();
      });
      if (t - t0 < 3200) confettiRaf = requestAnimationFrame(frame);
      else { ctx.clearRect(0, 0, c.width, c.height); c.style.display = 'none'; }
    };
    confettiRaf = requestAnimationFrame(frame);
  }

  return {
    rand, pick, shuffle, esc, el, fmt,
    get, set, getStars, setStars, dropStars, totalStars, updateStarTotal, starsHtml,
    sound, speak, stopSpeak, toast, confetti,
  };
})();
