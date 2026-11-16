/* Bé đang học và quà của bé. Mỗi bé (danh sách học sinh trong js/data/colan-data.js) có sao và quà riêng.
   - Hộp hình dán: tự có ở các mốc sao trong STEPS. Mở hộp được một hình dán mới cho bộ sưu tập.
   - Quà thật: bố mẹ đặt ở #/qua/phuhuynh (số sao cần đạt + phần quà). Đủ sao thì bé mở hộp quà vàng để xem quà,
     bố mẹ trao quà rồi đánh dấu "Đã trao".
   Địa chỉ: #/qua (quà của bé đang học), #/qua/phuhuynh/<bé> (bố mẹ đặt quà).
   Dữ liệu quà của mỗi bé lưu ở khoá "qua.<bé>": { opened, stickers, medals, gifts: [{ id, stars, text, opened, given }] }. */
const Qua = (() => {
  const esc = U.esc;
  const KIDS = COLAN_DATA.students;
  const kid = (id) => KIDS.find((k) => k.id === id);
  const current = () => kid(U.who());

  /* Hình dán: [emoji, tiếng Anh, tiếng Việt]. Bấm vào hình đã có để nghe đọc tiếng Anh. */
  const STICKERS = [
    ['🐶', 'dog', 'con chó'], ['🐱', 'cat', 'con mèo'], ['🐼', 'panda', 'gấu trúc'], ['🐨', 'koala', 'gấu túi'],
    ['🐯', 'tiger', 'con hổ'], ['🦊', 'fox', 'con cáo'], ['🐸', 'frog', 'con ếch'], ['🐵', 'monkey', 'con khỉ'],
    ['🐧', 'penguin', 'chim cánh cụt'], ['🦄', 'unicorn', 'kỳ lân'], ['🐙', 'octopus', 'bạch tuộc'], ['🦋', 'butterfly', 'con bướm'],
    ['🐢', 'turtle', 'con rùa'], ['🐬', 'dolphin', 'cá heo'], ['🦒', 'giraffe', 'hươu cao cổ'], ['🐘', 'elephant', 'con voi'],
    ['🐝', 'bee', 'con ong'], ['🐳', 'whale', 'cá voi'], ['🦖', 'dinosaur', 'khủng long'], ['🦉', 'owl', 'cú mèo'],
    ['🍓', 'strawberry', 'dâu tây'], ['🍉', 'watermelon', 'dưa hấu'], ['🍌', 'banana', 'quả chuối'], ['🍦', 'ice cream', 'kem'],
    ['🍩', 'doughnut', 'bánh vòng'], ['🧁', 'cupcake', 'bánh cupcake'], ['🍭', 'lollipop', 'kẹo mút'], ['🍕', 'pizza', 'bánh pizza'],
    ['🌈', 'rainbow', 'cầu vồng'], ['🌙', 'moon', 'mặt trăng'], ['🌞', 'sun', 'mặt trời'], ['🌻', 'sunflower', 'hoa hướng dương'],
    ['⛄', 'snowman', 'người tuyết'], ['🚀', 'rocket', 'tên lửa'], ['🪐', 'planet', 'hành tinh'], ['🚗', 'car', 'ô tô'],
    ['🚒', 'fire engine', 'xe cứu hỏa'], ['🚁', 'helicopter', 'trực thăng'], ['⛵', 'sailboat', 'thuyền buồm'], ['🚂', 'train', 'tàu hỏa'],
    ['🎈', 'balloon', 'bóng bay'], ['🎸', 'guitar', 'đàn ghi-ta'], ['⚽', 'ball', 'quả bóng'], ['👑', 'crown', 'vương miện'],
    ['💎', 'diamond', 'kim cương'], ['🧸', 'teddy bear', 'gấu bông'],
  ];
  const IDEAS = ['🍦 Đi ăn kem', '📚 Một cuốn truyện', '🎡 Đi công viên', '🧸 Một món đồ chơi', '🎬 Xem phim cùng bố mẹ'];

  /* Mốc sao của hộp hình dán: 5, 15, 30… 200, sau đó cứ thêm 50 sao lại có một hộp. */
  const STEPS = [5, 15, 30, 50, 75, 100, 130, 160, 200];
  const boxAt = (i) => (i < STEPS.length ? STEPS[i] : STEPS[STEPS.length - 1] + 50 * (i - STEPS.length + 1));
  const earned = (total) => { let i = 0; while (boxAt(i) <= total) i++; return i; };

  const load = (id) => ({ opened: 0, stickers: [], medals: 0, gifts: [], ...U.get(`qua.${id}`, {}) });
  const save = (id, s) => U.set(`qua.${id}`, s);

  function status(id = U.who()) {
    const total = U.totalStars('', id), s = load(id), n = earned(total);
    const boxes = Math.max(0, n - s.opened);
    const ready = s.gifts.filter((g) => !g.opened && total >= g.stars);
    const goal = s.gifts.filter((g) => total < g.stars).sort((a, b) => a.stars - b.stars)[0];
    const prev = n ? boxAt(n - 1) : 0, next = boxAt(n);
    const pct = Math.round(((total - prev) / (next - prev)) * 100);
    return { total, s, boxes, ready, waiting: boxes + ready.length, next, pct, goal };
  }

  /* ---------- Thanh trên cùng: bé đang học, nút 🎁 có số quà chờ mở ---------- */
  let lastWaiting = -1;
  function paint() {
    const k = current();
    const btn = document.getElementById('btnKid');
    btn.querySelector('.kid-ic').textContent = k ? k.icon : '👤';
    btn.querySelector('.kid-name').textContent = k ? k.name : 'Chọn bé';
    btn.style.setProperty('--c', k ? k.color : '#adb5bd');
    const w = k ? status().waiting : 0;
    const gift = document.getElementById('btnGift');
    const badge = gift.querySelector('.badge');
    badge.textContent = w;
    badge.hidden = !w;
    gift.classList.toggle('has', w > 0);
    U.updateStarTotal();
    const grew = lastWaiting >= 0 && w > lastWaiting;
    lastWaiting = w;
    return grew;
  }

  /* Thông báo "Bé có quà mới!" hiện dưới thanh trên cùng khi bé vừa đạt một mốc. */
  let pop = null, popTimer = 0;
  const hidePop = () => { if (pop) pop.classList.remove('show'); };
  function showPop() {
    if (!pop) {
      pop = U.el(`<a class="gift-pop" href="#/qua"><span class="gp-ic">🎁</span><span><b>Bé có quà mới!</b><small>Bấm vào đây để mở quà</small></span></a>`);
      document.body.appendChild(pop);
      window.addEventListener('hashchange', hidePop);
    }
    pop.classList.add('show');
    clearTimeout(popTimer);
    popTimer = setTimeout(hidePop, 9000);
  }

  /* Hộp thoại. closable: bấm ra ngoài hoặc Esc để đóng. sticky: không tự đóng khi đổi trang (bảng chọn bé lần đầu). */
  function modal(html, { closable = true, sticky = false, onClose } = {}) {
    const m = U.el(`<div class="modal"><div class="modal-card">${html}</div></div>`);
    let canClose = closable;
    const onKey = (e) => { if (e.key === 'Escape' && canClose) close(); };
    function close() {
      if (!m.isConnected) return;
      m.remove();
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('hashchange', close);
      if (onClose) onClose();
    }
    m.addEventListener('click', (e) => { if (e.target === m && canClose) close(); });
    document.addEventListener('keydown', onKey);
    if (!sticky) window.addEventListener('hashchange', close);
    document.body.appendChild(m);
    return { card: m.firstElementChild, close, allowClose: () => { canClose = true; } };
  }

  /* ---------- Chọn bé ---------- */
  let onKid = () => {};
  let picker = null;

  /* announce: báo bằng một dòng nhỏ (dùng khi tự đổi bé, ví dụ mở bài cô Lan của bé khác). */
  function setKid(id, announce) {
    if (!kid(id) || id === U.who()) return;
    const moved = U.setWho(id);
    lastWaiting = -1;
    paint();
    const k = kid(id);
    if (moved) U.toast(`${moved} ⭐ bé đạt trước đây được tính cho ${k.name}.`, 4500);
    else if (announce) U.toast(`Đang học: ${k.icon} ${k.name}`);
  }

  /* force: bắt buộc chọn (lần đầu mở trang), không có nút đóng. */
  function pickKid(force = false) {
    if (picker) return;
    picker = modal(`
      <h2 class="kp-title">👋 Ai đang học?</h2>
      <p class="kp-sub">Mỗi bé có sao và quà riêng. Bé bấm vào tên mình nhé!</p>
      <div class="kid-opts">${KIDS.map((k) => {
        const st = status(k.id);
        return `<button class="kid-opt${k.id === U.who() ? ' on' : ''}" data-id="${k.id}" style="--c:${k.color}">
          <span class="ko-ic">${k.icon}</span><b>${esc(k.name)}</b>
          <small>⭐ ${st.total}</small>${st.waiting ? `<small class="ko-gift">🎁 ${st.waiting} quà</small>` : ''}
        </button>`;
      }).join('')}</div>
      ${force ? '' : '<button class="btn gray kp-close">Đóng</button>'}`, { closable: !force, sticky: force, onClose: () => { picker = null; } });
    picker.card.classList.add('kid-picker');
    picker.card.querySelectorAll('.kid-opt').forEach((b) => {
      b.onclick = () => {
        const id = b.dataset.id, changed = id !== U.who();
        picker.close();
        setKid(id, true);
        if (changed) onKid(id);
      };
    });
    const c = picker.card.querySelector('.kp-close');
    if (c) c.onclick = picker.close;
  }

  /* ---------- Dải thông tin ở trang chủ ---------- */
  function mountBanner(slot) {
    const k = current();
    if (!k || !slot) return;
    const st = status();
    slot.innerHTML = `
      <section class="kid-banner" style="--c:${k.color}">
        <button class="kb-kid" title="Đổi bé"><span>${k.icon}</span><small>Đổi bé</small></button>
        <div class="kb-main">
          <div class="kb-line"><b>${esc(k.name)}</b> · ⭐ ${st.total} sao</div>
          <div class="progress"><div class="bar" style="width:${st.waiting ? 100 : st.pct}%"></div></div>
          <div class="kb-next">${st.waiting
            ? `🎁 Bé có <b>${st.waiting}</b> hộp quà chờ mở!`
            : `Còn <b>${st.next - st.total} ⭐</b> nữa là được mở hộp quà!`}</div>
          ${st.goal ? `<div class="kb-next">🎯 Quà của bố mẹ: <b>${esc(st.goal.text)}</b> – còn ${st.goal.stars - st.total} ⭐</div>` : ''}
        </div>
        <a class="btn orange kb-go${st.waiting ? ' pulse' : ''}" href="#/qua">🎁 Xem quà</a>
      </section>`;
    slot.querySelector('.kb-kid').onclick = () => pickKid();
  }

  /* ---------- Trang quà của bé ---------- */
  function giftRow(g, total) {
    const state = g.given ? 'given' : g.opened ? 'opened' : total >= g.stars ? 'ready' : 'locked';
    const tag = { locked: `Còn ${g.stars - total} ⭐`, ready: 'Mở quà ngay!', opened: 'Chờ bố mẹ trao quà', given: 'Đã nhận ✓' }[state];
    const icon = { locked: '🔒', ready: '🎁', opened: '🎉', given: '✅' }[state];
    return `<div class="qa-gift ${state}"${state === 'ready' ? ` data-gift="${g.id}" role="button" tabindex="0"` : ''}>
      <div class="qa-gift-ic">${icon}</div>
      <div class="qa-gift-main"><b>${esc(g.text)}</b><small>Cần ${g.stars} ⭐</small>
        ${state === 'locked' ? `<div class="progress"><div class="bar" style="width:${Math.round((total / g.stars) * 100)}%"></div></div>` : ''}
      </div>
      <span class="qa-tag">${tag}</span>
    </div>`;
  }

  function giftScreen(screen, k) {
    const st = status(k.id), s = st.s;
    const boxes = [
      ...st.ready.map((g) => `<button class="qa-box gold" data-gift="${g.id}"><span>🎁</span><small>Quà của bố mẹ</small></button>`),
      ...Array.from({ length: st.boxes }, () => '<button class="qa-box" data-box="1"><span>🎁</span><small>Hộp hình dán</small></button>'),
    ];
    const gifts = s.gifts.slice().sort((a, b) => a.stars - b.stars);
    screen.innerHTML = `
      <section class="qa-head" style="--c:${k.color}">
        <div class="qa-kid">${k.icon}</div>
        <div class="qa-info">
          <div class="qa-total">⭐ ${st.total} sao</div>
          <div class="progress"><div class="bar" style="width:${st.boxes ? 100 : st.pct}%"></div></div>
          <div class="qa-next">${st.boxes
            ? 'Bé đã đủ sao để mở hộp quà. Bấm vào hộp quà bên dưới nhé!'
            : `Còn <b>${st.next - st.total} ⭐</b> nữa là được mở hộp hình dán tiếp theo (mốc ${st.next} ⭐).`}</div>
        </div>
        <button class="btn gray qa-change">🔄 Đổi bé</button>
      </section>

      <h3 class="section-title">🎁 Hộp quà chờ mở</h3>
      ${boxes.length ? `<div class="qa-boxes">${boxes.join('')}</div>`
        : '<p class="qa-empty">Chưa có hộp quà nào. Bé làm bài để nhận thêm sao nhé!</p>'}

      <h3 class="section-title">🏆 Quà của bố mẹ</h3>
      ${gifts.length ? `<div class="qa-gifts">${gifts.map((g) => giftRow(g, st.total)).join('')}</div>`
        : '<p class="qa-empty">Bố mẹ chưa đặt quà. Bố mẹ bấm nút "Bố mẹ đặt quà" ở cuối trang nhé.</p>'}

      <h3 class="section-title">📒 Bộ sưu tập hình dán · ${s.stickers.length}/${STICKERS.length}${s.medals ? ` · 🏅 ${s.medals}` : ''}</h3>
      <div class="qa-stickers">${STICKERS.map(([e, en]) => (s.stickers.includes(e)
        ? `<button class="qa-st" data-en="${esc(en)}" title="Bấm để nghe"><span>${e}</span><small>${esc(en)}</small></button>`
        : `<div class="qa-st off"><span>${e}</span><small>?</small></div>`)).join('')}</div>

      <div class="row-btns"><a class="btn gray" href="#/qua/phuhuynh/${k.id}">👪 Bố mẹ đặt quà</a></div>`;

    const reopen = () => giftScreen(screen, k);
    screen.querySelector('.qa-change').onclick = () => pickKid();
    screen.querySelectorAll('[data-box]').forEach((b) => { b.onclick = () => openBox(k, null, reopen); });
    screen.querySelectorAll('[data-gift]').forEach((b) => {
      b.onclick = () => openBox(k, b.dataset.gift, reopen);
      b.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); b.click(); } };
    });
    screen.querySelectorAll('.qa-st[data-en]').forEach((b) => { b.onclick = () => U.speak(b.dataset.en, 'en'); });
  }

  /* Mở một hộp: ghi nhận phần quà ngay, rồi cho bé bấm vào hộp để xem quà. */
  function openBox(k, giftId, done) {
    const s = load(k.id);
    let prize;
    if (giftId) {
      const g = s.gifts.find((x) => x.id === giftId);
      if (!g || g.opened || U.totalStars('', k.id) < g.stars) return;
      g.opened = true;
      prize = { big: '🎉', name: esc(g.text), sub: 'Quà của bố mẹ dành cho bé!', note: 'Bé khoe với bố mẹ để nhận quà nhé!' };
    } else {
      if (!status(k.id).boxes) return;
      s.opened++;
      const left = STICKERS.filter(([e]) => !s.stickers.includes(e));
      if (left.length) {
        const [e, en, vi] = U.pick(left);
        s.stickers.push(e);
        prize = { big: e, name: esc(en), sub: esc(vi), note: `Hình dán mới! Bé đã có ${s.stickers.length}/${STICKERS.length} hình.`, say: en };
      } else {
        s.medals++;
        prize = { big: '🏅', name: 'Huy chương', sub: 'Bé đã sưu tập đủ hình dán!', note: `Bé có ${s.medals} huy chương.` };
      }
    }
    save(k.id, s);
    paint();

    const m = modal(`
      <div class="qa-reveal">
        <button class="qa-bigbox${giftId ? ' gold' : ''}" title="Bấm để mở">🎁</button>
        <p class="qa-tap">Bấm vào hộp quà để mở nhé!</p>
      </div>`, { closable: false, onClose: done });
    const box = m.card.querySelector('.qa-bigbox');
    box.onclick = () => {
      if (box.classList.contains('open')) return;
      box.classList.add('open');
      U.sound('tap');
      setTimeout(() => {
        m.card.innerHTML = `
          <div class="qa-reveal">
            <div class="qa-prize">${prize.big}</div>
            <div class="qa-prize-name">${prize.name}</div>
            <div class="qa-prize-sub">${prize.sub}</div>
            <p class="qa-prize-note">${prize.note}</p>
            <button class="btn green qa-ok">Tuyệt quá! 🎉</button>
          </div>`;
        m.allowClose();
        U.sound('win');
        U.confetti();
        if (prize.say) setTimeout(() => U.speak(prize.say, 'en'), 500);
        m.card.querySelector('.qa-ok').onclick = m.close;
      }, 850);
    };
  }

  /* ---------- Bố mẹ đặt quà ---------- */
  let unlocked = false;

  /* Câu hỏi nhỏ để bé không vô tình sửa quà. Không phải mật khẩu. */
  function gate(screen, ok) {
    const a = U.rand(6, 9), b = U.rand(6, 9), c = U.rand(11, 29);
    screen.innerHTML = `
      <section class="qa-gate">
        <div class="big">👪</div>
        <p>Phần này dành cho bố mẹ. Bố mẹ tính giúp phép tính dưới đây để vào nhé:</p>
        <form class="qa-q"><span>${a} × ${b} + ${c} =</span>
          <input type="number" inputmode="numeric" aria-label="Kết quả" required>
          <button class="btn">Vào</button></form>
        <div class="feedback"></div>
      </section>`;
    const form = screen.querySelector('form'), input = form.querySelector('input');
    form.onsubmit = (e) => {
      e.preventDefault();
      if (+input.value === a * b + c) { unlocked = true; ok(); return; }
      screen.querySelector('.feedback').innerHTML = '<span class="oops">Chưa đúng, bố mẹ thử lại nhé.</span>';
      input.select();
    };
    input.focus();
  }

  function rowState(g, total) {
    if (total < g.stars) return `Còn ${g.stars - total} ⭐`;
    if (g.given) return 'Đã trao quà';
    return g.opened ? 'Bé đã mở quà' : 'Bé đủ sao, chưa mở';
  }

  function parentScreen(screen, k) {
    if (!unlocked) { gate(screen, () => parentScreen(screen, k)); return; }
    const total = U.totalStars('', k.id), s = load(k.id);
    const gifts = s.gifts.slice().sort((a, b) => a.stars - b.stars);
    const suggest = Math.max(10, Math.ceil((total + 20) / 10) * 10);
    screen.innerHTML = `
      <p class="cl-intro">Bố mẹ đặt quà cho từng bé: ghi số sao cần đạt và phần quà. Đủ sao thì bé được mở hộp quà vàng trong trang Quà; bố mẹ trao quà rồi đánh dấu "Đã trao".</p>
      <div class="qa-tabs">${KIDS.map((x) => `
        <a class="chip${x.id === k.id ? ' on' : ''}" href="#/qua/phuhuynh/${x.id}">${x.icon} ${esc(x.name)}<small>⭐ ${U.totalStars('', x.id)}</small></a>`).join('')}
      </div>
      <section class="qa-panel" style="--c:${k.color}">
        <h3>${k.icon} Quà của ${esc(k.name)} · bé đang có ⭐ ${total} sao</h3>
        <div class="qa-rows">${gifts.map((g) => `
          <div class="qa-row" data-id="${g.id}">
            <label class="qa-stars" title="Số sao cần đạt">⭐<input type="number" min="1" max="9999" inputmode="numeric" value="${g.stars}" data-f="stars" aria-label="Số sao cần đạt"></label>
            <input class="qa-text" type="text" maxlength="60" value="${esc(g.text)}" data-f="text" aria-label="Phần quà">
            <span class="qa-state">${rowState(g, total)}</span>
            <label class="qa-given"${total < g.stars ? ' hidden' : ''}><input type="checkbox" data-f="given"${g.given ? ' checked' : ''}> Đã trao</label>
            <button class="icon-btn del" title="Xoá quà này">🗑️</button>
          </div>`).join('') || '<p class="qa-empty">Chưa có quà nào. Thêm quà đầu tiên ở dưới nhé.</p>'}
        </div>
        <form class="qa-add">
          <label>⭐ Số sao cần đạt<input type="number" name="stars" min="1" max="9999" inputmode="numeric" placeholder="${suggest}" required></label>
          <label>🎁 Phần quà<input type="text" name="text" maxlength="60" placeholder="Ví dụ: Đi ăn kem" required></label>
          <button class="btn green">➕ Thêm quà</button>
        </form>
        <div class="qa-ideas">Gợi ý: ${IDEAS.map((i) => `<button type="button" class="chip idea">${i}</button>`).join('')}</div>
      </section>
      <p class="qa-note">Ngoài quà của bố mẹ, bé tự được mở một hộp hình dán ở các mốc ${STEPS.slice(0, 6).join(', ')}… sao.
        Mỗi bài chỉ tính số sao cao nhất bé đạt, nên làm lại bài cũ không được thêm sao.
        Sao và quà lưu trong trình duyệt của máy này.</p>`;

    const write = (fn) => { const cur = load(k.id); fn(cur); save(k.id, cur); paint(); };
    screen.querySelectorAll('.qa-row').forEach((row) => {
      const id = row.dataset.id;
      row.querySelectorAll('[data-f]').forEach((inp) => {
        inp.onchange = () => write((cur) => {
          const g = cur.gifts.find((x) => x.id === id);
          if (!g) return;
          if (inp.dataset.f === 'stars') {
            const v = Math.round(+inp.value);
            if (v >= 1 && v <= 9999) g.stars = v; else inp.value = g.stars;
          } else if (inp.dataset.f === 'text') {
            const v = inp.value.trim();
            if (v) g.text = v; else inp.value = g.text;
          } else {
            g.given = inp.checked;
          }
          row.querySelector('.qa-state').textContent = rowState(g, total);
          row.querySelector('.qa-given').hidden = total < g.stars;
        });
      });
      row.querySelector('.del').onclick = () => {
        const g = load(k.id).gifts.find((x) => x.id === id);
        if (!g || !confirm(`Xoá quà "${g.text}"?`)) return;
        write((cur) => { cur.gifts = cur.gifts.filter((x) => x.id !== id); });
        parentScreen(screen, k);
      };
    });

    const form = screen.querySelector('.qa-add');
    form.onsubmit = (e) => {
      e.preventDefault();
      const f = form.elements, stars = Math.round(+f.stars.value), text = f.text.value.trim();
      if (!(stars >= 1 && stars <= 9999) || !text) return;
      write((cur) => { cur.gifts.push({ id: Date.now().toString(36), stars, text, opened: false, given: false }); });
      parentScreen(screen, k);
      U.toast(`Đã thêm quà cho ${k.name}: ${text} (${stars} ⭐)`);
    };
    screen.querySelectorAll('.idea').forEach((b) => {
      b.onclick = () => { const f = form.elements; f.text.value = b.textContent; (f.stars.value ? f.text : f.stars).focus(); };
    });
  }

  /* p: phần địa chỉ sau #/qua. */
  function render(p, { frame }) {
    const k = current();
    const home = ['🏠 Trang chủ', '#/'];
    if (p[0] === 'phuhuynh') {
      const who = kid(p[1]) || k || KIDS[0];
      parentScreen(frame([home, ['🎁 Quà của bé', '#/qua'], ['👪 Bố mẹ đặt quà']], '👪 Bố mẹ đặt quà'), who);
      return;
    }
    if (!k) { frame([home, ['🎁 Quà của bé']], '🎁 Quà của bé'); return; }
    giftScreen(frame([home, ['🎁 Quà của bé']], `🎁 Quà của ${k.icon} ${esc(k.name)}`), k);
  }

  function init(opts = {}) {
    if (opts.onKid) onKid = opts.onKid;
    document.getElementById('btnKid').onclick = () => pickKid();
    U.onStars(() => { if (paint()) showPop(); });
  }

  return { KIDS, STICKERS, STEPS, kid, current, status, setKid, pickKid, paint, mountBanner, render, init, boxAt };
})();
