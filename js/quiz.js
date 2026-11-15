/* Bộ chạy bài trắc nghiệm dùng chung cho Toán và Tiếng Anh.
   Mỗi câu hỏi là một object:
   { prompt, visual, choices, answer, speak: {text, lang}, autoSpeak, choiceClass, key } */
const Quiz = (() => {
  const PRAISE = ['Giỏi quá! 🎉', 'Tuyệt vời! 🌟', 'Chính xác! 👏', 'Bé giỏi lắm! 💯', 'Đúng rồi! 🚀'];
  const OOPS = ['Chưa đúng rồi! 💪', 'Tiếc quá! 🙂', 'Sai mất rồi! 🤔'];
  let timer = 0;

  const starsFor = (score, total) => {
    const r = total ? score / total : 0;
    return r >= 0.9 ? 3 : r >= 0.7 ? 2 : r >= 0.5 ? 1 : 0;
  };

  /* Màn hình kết quả, dùng chung cho trắc nghiệm và ghép chữ. */
  function result(container, { score, total, lessonId, again, exit }) {
    const stars = starsFor(score, total);
    if (lessonId) U.setStars(lessonId, stars);
    U.sound('win');
    if (stars >= 2) U.confetti();
    const msg = ['Không sao, mình làm lại nhé!', 'Khá lắm! Luyện thêm sẽ giỏi hơn!', 'Rất tốt! Cố thêm chút nữa nhé!', 'Xuất sắc! Bé thật giỏi!'][stars];
    container.innerHTML = `
      <div class="result">
        <div class="result-stars">${U.starsHtml(stars)}</div>
        <div class="result-score">Bé làm đúng <b>${score}/${total}</b></div>
        <div class="result-msg">${msg}</div>
        <div class="row-btns">
          <button class="btn green again">🔁 Làm lại</button>
          <button class="btn gray back">📚 Chọn bài khác</button>
        </div>
      </div>`;
    container.querySelector('.again').onclick = again;
    container.querySelector('.back').onclick = exit;
  }

  /* opts: { container, title, lessonId, total, makeQuestion(), onAnswer(q, right), onExit() } */
  function run(opts) {
    clearTimeout(timer);
    const total = opts.total || 10;
    let idx = 0, score = 0, current = null, locked = false;
    const seen = new Set();

    opts.container.innerHTML = `
      <section class="quiz">
        <div class="quiz-head">
          <div class="quiz-title">${opts.title}</div>
          <div class="progress"><div class="bar"></div></div>
          <div class="qcount"></div>
        </div>
        <div class="quiz-card"></div>
      </section>`;
    const card = opts.container.querySelector('.quiz-card');
    const bar = opts.container.querySelector('.bar');
    const qcount = opts.container.querySelector('.qcount');

    function makeUnique() {
      let q;
      for (let tries = 0; tries < 40; tries++) {
        q = opts.makeQuestion(idx);
        const key = q.key || `${q.prompt}|${q.answer}`;
        if (!seen.has(key)) { seen.add(key); break; }
      }
      return q;
    }

    function show() {
      clearTimeout(timer);
      if (idx >= total) return finish();
      locked = false;
      current = makeUnique();
      const q = current;
      bar.style.width = `${(idx / total) * 100}%`;
      qcount.textContent = `Câu ${idx + 1}/${total}`;
      const choices = q.choices.map((c) => (typeof c === 'object' ? c : { label: U.esc(c), value: c }));
      card.innerHTML = `
        <div class="q-prompt">${q.prompt}${q.speak ? ' <button class="icon-btn speak" title="Nghe đọc đề">🔊</button>' : ''}</div>
        ${q.visual ? `<div class="q-visual">${q.visual}</div>` : ''}
        <div class="choices ${q.choiceClass || ''}">
          ${choices.map((c, i) => `<button class="choice" data-i="${i}">${c.label}</button>`).join('')}
        </div>
        <div class="feedback"></div>`;
      card.querySelectorAll('.speak').forEach((b) => { b.onclick = () => U.speak(q.speak.text, q.speak.lang); });
      if (q.speak && q.autoSpeak) timer = setTimeout(() => U.speak(q.speak.text, q.speak.lang), 300);
      card.querySelectorAll('.choice').forEach((btn) => {
        btn.onclick = () => choose(btn, choices[+btn.dataset.i], choices);
      });
    }

    function choose(btn, c, choices) {
      if (locked) return;
      locked = true;
      const right = String(c.value) === String(current.answer);
      card.querySelectorAll('.choice').forEach((b, i) => {
        if (String(choices[i].value) === String(current.answer)) b.classList.add('ok');
      });
      const fb = card.querySelector('.feedback');
      if (right) {
        score++;
        U.sound('ok');
        fb.innerHTML = `<span class="good">${U.pick(PRAISE)}</span>`;
        timer = setTimeout(nextQ, 1300);
      } else {
        btn.classList.add('bad');
        U.sound('bad');
        fb.innerHTML = `<span class="oops">${U.pick(OOPS)} Đáp án đúng được tô xanh.</span>
          <button class="btn next">Tiếp tục ➡️</button>`;
        fb.querySelector('.next').onclick = nextQ;
      }
      if (opts.onAnswer) opts.onAnswer(current, right);
    }

    function nextQ() { idx++; show(); }

    function finish() {
      bar.style.width = '100%';
      qcount.textContent = 'Hoàn thành';
      result(card, { score, total, lessonId: opts.lessonId, again: () => run(opts), exit: () => opts.onExit && opts.onExit() });
    }

    show();
    return () => clearTimeout(timer);
  }

  return { run, result, starsFor };
})();
