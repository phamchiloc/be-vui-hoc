/* Bài học cô Lan: chọn học sinh → chọn tuần → xem báo cáo của cô và luyện tập.
   Địa chỉ: #/colan/<bé>/<tuần>/<chủ đề>/<trò>. Sao lưu theo từng bé: colan/<bé>/...
   Từ vựng và mẫu câu dùng lại các trò của môn Tiếng Anh; mỗi tuần có thêm trò luyện mẫu câu (DRILLS). */
const CoLan = (() => {
  const D = COLAN_DATA, A = COLAN_ART, esc = U.esc;
  const pic = (it) => TiengAnh.pic(it);
  const NUM = ['zero', 'one', 'two', 'three', 'four', 'five'];

  const groupOf = (st) => D.groups[st.group];
  const topicOf = (wk, id) => wk.topics.find((t) => t.id === id);
  const itemOf = (wk, en) => wk.topics.flatMap((t) => t.items).find((it) => it.en === en);
  const wkCtx = (st, wk) => ({ href: `#/colan/${st.id}/${wk.id}`, key: `colan/${st.id}/${wk.id}`, level: groupOf(st).level });
  const stCtx = (st) => ({ href: `#/colan/${st.id}`, key: `colan/${st.id}`, level: groupOf(st).level });
  const maxOf = (topic) => TiengAnh.modesFor(topic).length * 3;
  const weekMax = (wk) => wk.topics.reduce((s, t) => s + maxOf(t), 0) + (wk.drill ? 3 : 0);

  /* Ôn tập tổng hợp: mọi từ vựng (không gồm mẫu câu) của các tuần, mỗi từ một lần. */
  const reviews = {};
  function review(st) {
    if (!reviews[st.group]) {
      const seen = new Set();
      const items = groupOf(st).weeks.flatMap((wk) => wk.topics.filter((t) => !t.phrases).flatMap((t) => t.items))
        .filter((it) => !seen.has(it.en) && seen.add(it.en));
      reviews[st.group] = { id: 'ontap', name: 'Ôn tập tổng hợp', vi: 'Từ vựng của tất cả các tuần', icon: '🏆', items };
    }
    return reviews[st.group];
  }

  /* ---------- Trò luyện mẫu câu của từng tuần ---------- */
  const sentenceChoices = (list) => U.shuffle(list).map((c) => ({ label: esc(c), value: c }));
  const listenBox = (text) => `<button class="speak speak-big" title="Nghe lại">🔊</button>${text ? `<div class="phrase">${esc(text)}</div>` : ''}`;
  const canDo = (it, yes) => `<span class="cd ${yes ? 'yes' : 'no'}">${pic(it)}<b>${yes ? '✔' : '✘'}</b></span>`;
  const flipped = (e) => `<span class="flip">${e}</span>`;

  /* There is one … / There are … : hình có n đồ vật, chọn câu đúng (có một câu sai is/are). */
  function countQ([one, many, emoji], speakText) {
    const n = U.rand(1, 4);
    const say = (k, right = true) => (k === 1 ? `There ${right ? 'is' : 'are'} one ${one}.` : `There ${right ? 'are' : 'is'} ${NUM[k]} ${many}.`);
    const answer = say(n);
    const others = U.shuffle([1, 2, 3, 4].filter((k) => k !== n)).slice(0, 2).map((k) => say(k));
    return {
      prompt: speakText ? esc(speakText) : 'Chọn câu đúng với hình',
      speak: speakText ? { text: speakText, lang: 'en' } : null, autoSpeak: !!speakText,
      visual: `<div class="cl-count">${Array(n).fill(emoji).join(' ')}</div>`,
      choices: sentenceChoices([answer, say(n, false), ...others]), answer, say: answer, choiceClass: 'words small', key: answer,
    };
  }

  const DRILLS = {
    /* Nhóm 1 – tuần 2: Is it the …? và nghe lệnh Open / Close. */
    isit(wk) {
      const items = topicOf(wk, 'tuvung').items;
      if (Math.random() < 0.7) {
        const it = U.pick(items);
        const asked = Math.random() < 0.5 ? it : U.pick(items.filter((x) => x !== it));
        const q = `Is it the ${asked.en}?`, yes = asked === it;
        return {
          prompt: 'Nhìn hình rồi trả lời', speak: { text: q, lang: 'en' }, autoSpeak: true,
          visual: `<div class="look-pic">${pic(it)}</div><div class="phrase">${esc(q)}</div>`,
          choices: [{ label: '👍 Yes, it is.', value: 'yes' }, { label: "👎 No, it isn't.", value: 'no' }],
          answer: yes ? 'yes' : 'no', say: yes ? 'Yes, it is.' : "No, it isn't.", choiceClass: 'words small', key: `${it.en}|${asked.en}`,
        };
      }
      const target = U.pick(['door', 'window', 'book']);
      const cmd = `${U.pick(['Open', 'Close'])} the ${target}.`;
      const opts = U.shuffle(['door', 'window', 'book', U.pick(['chair', 'table', 'crayon'])].map((en) => itemOf(wk, en)));
      return {
        prompt: 'Nghe cô nói, chọn đồ vật đúng', speak: { text: cmd, lang: 'en' }, autoSpeak: true, visual: listenBox(),
        choices: opts.map((o) => ({ label: pic(o), value: o.en })), answer: target, say: cmd, choiceClass: 'pictures', key: cmd,
      };
    },

    /* Nhóm 1 – tuần 3: What is this? – It's a … và ghép tính từ với danh từ (big eyes, long hair…). */
    face(wk) {
      if (Math.random() < 0.35) {
        const nouns = ['face', 'nose', 'hat', 'mop'];
        const en = U.pick(nouns);
        return {
          prompt: 'What is this?', speak: { text: 'What is this?', lang: 'en' }, autoSpeak: true,
          visual: `<div class="look-pic">${pic(itemOf(wk, en))}</div>`,
          choices: sentenceChoices(nouns.map((n) => `It's a ${n}.`)), answer: `It's a ${en}.`, say: `It's a ${en}.`,
          choiceClass: 'words small', key: `what|${en}`,
        };
      }
      const [noun, a, b] = U.pick([['eyes', 'big', 'small'], ['nose', 'big', 'small'], ['hair', 'long', 'short'], ['hat', 'big', 'small']]);
      const [adj, other] = U.shuffle([a, b]);
      const phrase = noun === 'nose' || noun === 'hat' ? `a ${adj} ${noun}` : `${adj} ${noun}`;
      const look = { hair: U.pick(['long', 'short']), eyes: U.pick(['big', 'small']), nose: 'small' };
      const draw = (v) => (noun === 'hat'
        ? `<span class="emo" style="font-size:${v === 'big' ? 1.25 : 0.5}em">👒</span>`
        : `<span class="svg-pic">${A.face({ ...look, [noun]: v })}</span>`);
      return {
        prompt: 'Nghe rồi chọn hình đúng', speak: { text: phrase, lang: 'en' }, autoSpeak: true, visual: listenBox(phrase),
        choices: U.shuffle([adj, other]).map((v) => ({ label: draw(v), value: v })), answer: adj, say: phrase,
        choiceClass: 'pictures big', key: phrase,
      };
    },

    /* Nhóm 1 – tuần 5: This is my … / These are my … và He / She is happy / sad / angry. */
    body() {
      if (Math.random() < 0.55) {
        const [p, o] = U.shuffle([['hand', 'hands', '✋'], ['foot', 'feet', '🦶'], ['leg', 'legs', '🦵'], ['arm', 'arms', '💪']]);
        const many = Math.random() < 0.5;
        const sent = (x, m) => (m ? `These are my ${x[1]}.` : `This is my ${x[0]}.`);
        const answer = sent(p, many);
        return {
          prompt: 'Chọn câu đúng với hình', visual: `<div class="look-pic">${many ? p[2] + flipped(p[2]) : p[2]}</div>`,
          choices: sentenceChoices([answer, sent(p, !many), sent(o, many), sent(o, !many)]), answer, say: answer,
          choiceClass: 'words small', key: answer,
        };
      }
      const [who, whoEmoji] = U.pick([['He', '👦'], ['She', '👧']]);
      const [f, f2, f3] = U.shuffle([['happy', '😀'], ['sad', '😢'], ['angry', '😠']]);
      const answer = `${who} is ${f[0]}.`;
      return {
        prompt: 'Chọn câu đúng với hình', visual: `<div class="scene">${whoEmoji}<span class="bubble">${f[1]}</span></div>`,
        choices: sentenceChoices([answer, `${who === 'He' ? 'She' : 'He'} is ${f[0]}.`, `${who} is ${f2[0]}.`, `${who} is ${f3[0]}.`]),
        answer, say: answer, choiceClass: 'words small', key: answer,
      };
    },

    /* Nhóm 1 – tuần 6: Who is this? – This is my … và He / She is old / young. */
    family(wk) {
      const fam = topicOf(wk, 'giadinh').items;
      if (Math.random() < 0.6) {
        const [m, ...rest] = U.shuffle(fam);
        const sent = (x) => `This is my ${x.en}.`;
        return {
          prompt: 'Who is this?', speak: { text: 'Who is this?', lang: 'en' }, autoSpeak: true,
          visual: `<div class="look-pic">${pic(m)}</div>`,
          choices: sentenceChoices([m, ...rest.slice(0, 3)].map(sent)), answer: sent(m), say: sent(m),
          choiceClass: 'words small', key: m.en,
        };
      }
      const [en, who, adj] = U.pick([['grandfather', 'He', 'old'], ['grandmother', 'She', 'old'], ['brother', 'He', 'young'], ['sister', 'She', 'young']]);
      const answer = `${who} is ${adj}.`;
      return {
        prompt: 'Chọn câu đúng với hình', visual: `<div class="look-pic">${pic(itemOf(wk, en))}</div>`,
        choices: sentenceChoices(['He is old.', 'He is young.', 'She is old.', 'She is young.']), answer,
        say: `This is my ${en}. ${answer}`, choiceClass: 'words small', key: `adj|${en}`,
      };
    },

    /* Nhóm 2 – tuần 2: When is your birthday? / What do you want to eat, drink? / There is, There are. */
    birthday(wk) {
      const r = Math.random();
      if (r < 0.4) {
        const [m, ...rest] = U.shuffle(topicOf(wk, 'thang').items);
        const answer = `It's in ${m.en}.`;
        return {
          prompt: 'When is your birthday?', speak: { text: 'When is your birthday?', lang: 'en' }, autoSpeak: true,
          visual: `<div class="look-pic">🎂${pic(m)}</div>`,
          choices: sentenceChoices([m, ...rest.slice(0, 3)].map((x) => `It's in ${x.en}.`)), answer, say: answer,
          choiceClass: 'words small', key: answer,
        };
      }
      if (r < 0.75) {
        const [f, ...rest] = U.shuffle(topicOf(wk, 'doan').items);
        const q = `What do you want to ${f.drink ? 'drink' : 'eat'}?`;
        const answer = `I want some ${f.en}.`;
        return {
          prompt: esc(q), speak: { text: q, lang: 'en' }, autoSpeak: true, visual: `<div class="look-pic">${pic(f)}</div>`,
          choices: sentenceChoices([f, ...rest.slice(0, 3)].map((x) => `I want some ${x.en}.`)), answer, say: answer,
          choiceClass: 'words small', key: answer,
        };
      }
      return countQ(U.pick([['cake', 'cakes', '🍰'], ['apple', 'apples', '🍎'], ['egg', 'eggs', '🥚'], ['friend', 'friends', '🧒']]));
    },

    /* Nhóm 2 – tuần 3: Can you …? / He can, She can't … but … */
    can(wk) {
      const acts = topicOf(wk, 'hoatdong').items;
      const r = Math.random();
      if (r < 0.3) {
        const it = U.pick(acts), yes = Math.random() < 0.5;
        const q = `Can you ${it.en}?`;
        return {
          prompt: 'Nhìn hình rồi trả lời', speak: { text: q, lang: 'en' }, autoSpeak: true,
          visual: `<div class="scene">🧒${canDo(it, yes)}</div><div class="phrase">${esc(q)}</div>`,
          choices: [{ label: '👍 Yes, I can.', value: 'yes' }, { label: "👎 No, I can't.", value: 'no' }],
          answer: yes ? 'yes' : 'no', say: yes ? 'Yes, I can.' : "No, I can't.", choiceClass: 'words small', key: `${q}|${yes}`,
        };
      }
      const [who, whoEmoji] = U.pick([['He', '👦'], ['She', '👧']]);
      const other = who === 'He' ? 'She' : 'He';
      const [a, b, c] = U.shuffle(acts);
      if (r < 0.65) {
        const yes = Math.random() < 0.5;
        const sent = (w, ok, it) => `${w} ${ok ? 'can' : "can't"} ${it.en}.`;
        const answer = sent(who, yes, a);
        return {
          prompt: 'Chọn câu đúng với hình', visual: `<div class="scene">${whoEmoji}${canDo(a, yes)}</div>`,
          choices: sentenceChoices([answer, sent(who, !yes, a), sent(other, yes, a), sent(who, yes, b)]), answer, say: answer,
          choiceClass: 'words small', key: answer,
        };
      }
      const but = (w, no, ok) => `${w} can't ${no.en}, but ${w.toLowerCase()} can ${ok.en}.`;
      const answer = but(who, a, b);
      return {
        prompt: 'Chọn câu đúng với hình', visual: `<div class="scene">${whoEmoji}${canDo(a, false)}${canDo(b, true)}</div>`,
        choices: sentenceChoices([answer, but(who, b, a), but(other, a, b), but(who, a, c)]), answer, say: answer,
        choiceClass: 'words small', key: answer,
      };
    },

    /* Nhóm 2 – tuần 5: Where is the ball? / How many … are there? / Where's your school? */
    school() {
      const r = Math.random();
      if (r < 0.4) {
        const spots = [['on', 'table'], ['under', 'table'], ['by', 'table'], ['in', 'box'], ['by', 'box']];
        const [spot, ...rest] = U.shuffle(spots);
        const sent = ([p, o]) => `It's ${p} the ${o}.`;
        const answer = sent(spot);
        return {
          prompt: 'Where is the ball?', speak: { text: 'Where is the ball?', lang: 'en' }, autoSpeak: true,
          visual: `<div class="look-pic">${pic({ svg: A.place(`${spot[0]}-${spot[1]}`) })}</div>`,
          choices: sentenceChoices([spot, ...rest.slice(0, 3)].map(sent)), answer, say: answer, choiceClass: 'words small', key: answer,
        };
      }
      if (r < 0.75) {
        const thing = U.pick([['computer room', 'computer rooms', '💻'], ['garden', 'gardens', '🌷'], ['building', 'buildings', '🏢'], ['playground', 'playgrounds', '🛝']]);
        return countQ(thing, `How many ${thing[1]} are there at your school?`);
      }
      const places = [['city', '🏙️'], ['town', '🏘️'], ['village', '🛖'], ['mountains', '⛰️']];
      const [where, emoji] = U.pick(places);
      const answer = `It's in the ${where}.`;
      return {
        prompt: "Where's your school?", speak: { text: "Where's your school?", lang: 'en' }, autoSpeak: true,
        visual: `<div class="scene">🏫<span class="bubble">${emoji}</span></div>`,
        choices: sentenceChoices(places.map(([p]) => `It's in the ${p}.`)), answer, say: answer, choiceClass: 'words small', key: answer,
      };
    },

    /* Nhóm 2 – tuần 6: What subjects do you have today? / When do you have …? / Why do you like …? */
    subjects(wk) {
      const subs = topicOf(wk, 'monhoc').items;
      const said = (x) => x.say || x.en;
      const r = Math.random();
      if (r < 0.35) {
        const [a, b, c, d] = U.shuffle(subs);
        const sent = (x, y) => `I have ${x.en} and ${y.en}.`;
        const q = 'What subjects do you have today?';
        return {
          prompt: esc(q), speak: { text: q, lang: 'en' }, autoSpeak: true, visual: `<div class="scene">${pic(a)}${pic(b)}</div>`,
          choices: sentenceChoices([sent(a, b), sent(a, c), sent(c, b), sent(c, d)]), answer: sent(a, b),
          say: `I have ${said(a)} and ${said(b)}.`, choiceClass: 'words small', key: `have|${a.en}|${b.en}`,
        };
      }
      if (r < 0.7) {
        const s = U.pick(subs);
        const [d, ...rest] = U.shuffle(topicOf(wk, 'thu').items);
        const sent = (x) => `I have it on ${x.en}.`;
        return {
          prompt: esc(`When do you have ${s.en}?`), speak: { text: `When do you have ${said(s)}?`, lang: 'en' }, autoSpeak: true,
          visual: `<div class="scene">${pic(s)}<span class="bubble">${pic(d)}</span></div>`,
          choices: sentenceChoices([d, ...rest.slice(0, 3)].map(sent)), answer: sent(d), say: sent(d),
          choiceClass: 'words small', key: `when|${s.en}|${d.en}`,
        };
      }
      const reasons = [['Art', 'a painter'], ['Music', 'a singer'], ['English', 'an English teacher'], ['Maths', 'a Maths teacher']];
      const [sub, job] = U.pick(reasons);
      const sent = (j) => `Because I want to be ${j}.`;
      const q = `Why do you like ${sub}?`;
      return {
        prompt: esc(q), speak: { text: q, lang: 'en' }, autoSpeak: true, visual: `<div class="look-pic">${pic(itemOf(wk, sub))}</div>`,
        choices: sentenceChoices(reasons.map(([, j]) => sent(j))), answer: sent(job), say: sent(job),
        choiceClass: 'words small', key: `why|${sub}`,
      };
    },
  };

  /* ---------- Các màn hình ---------- */
  function students(screen) {
    screen.innerHTML = `
      <p class="cl-intro">Bài học tiếng Anh trên lớp của cô ${esc(D.teacher)}, tổng hợp từ báo cáo hằng tuần. Bé bấm vào tên mình nhé!</p>
      <div class="grid grades">${D.students.map((st) => {
        const g = groupOf(st);
        return `<a class="card" href="#/colan/${st.id}" style="--c:${st.color}">
          <div class="big">${st.icon}</div>
          <div class="title">${esc(st.name)}</div>
          <div class="sub">${g.name} · ${g.age}</div>
          <div class="sub">⭐ ${U.totalStars(`colan/${st.id}/`, st.id)} sao</div>
        </a>`;
      }).join('')}</div>`;
  }

  function studentScreen(screen, st) {
    const g = groupOf(st), rv = review(st);
    const stars = (wk) => U.totalStars(`colan/${st.id}/${wk.id}/`);
    screen.innerHTML = `
      <p class="cl-intro">${g.name} · ${g.age} · Giáo viên: cô ${esc(D.teacher)}</p>
      <div class="grid">${g.weeks.map((wk) => `
        <a class="card" href="#/colan/${st.id}/${wk.id}" style="--c:${st.color}">
          <div class="big">${wk.icon}</div>
          <div class="title">Tuần ${wk.n}</div>
          <div class="sub">${wk.date}</div>
          <div class="cl-topic">${esc(wk.title)}</div>
          <div class="sub">⭐ ${stars(wk)}/${weekMax(wk)}</div>
        </a>`).join('')}
        <a class="card" href="#/colan/${st.id}/ontap" style="--c:#fab005">
          <div class="big">${rv.icon}</div>
          <div class="title">${rv.name}</div>
          <div class="sub">${rv.items.length} từ của tất cả các tuần</div>
          <div class="sub">⭐ ${TiengAnh.topicStars(stCtx(st), rv)}/${maxOf(rv)}</div>
        </a>
      </div>
      <h3 class="section-title">📒 Tổng hợp các tuần</h3>
      <div class="cl-sum">${g.weeks.map((wk) => `
        <a class="cl-sum-row" href="#/colan/${st.id}/${wk.id}" style="--c:${st.color}">
          <div class="cl-sum-week"><b>Tuần ${wk.n}</b><small>${wk.date}</small></div>
          <div>
            <div class="cl-sum-topic">${esc(wk.report.topic)}</div>
            <div class="cl-chips">${wk.report.vocab.map((v) => `<span class="cl-chip">${esc(v)}</span>`).join('')}</div>
            <div class="cl-sum-hw">🏠 ${esc(wk.report.homework)}</div>
          </div>
        </a>`).join('')}
      </div>`;
  }

  function weekScreen(screen, st, wk) {
    const r = wk.report, c = wkCtx(st, wk);
    const isEn = (t) => /^[\x20-\x7e]+$/.test(t);
    const row = (label, html) => `<div class="cl-row"><dt>${label}</dt><dd>${html}</dd></div>`;
    screen.innerHTML = `
      <section class="cl-report" style="--c:${st.color}">
        <div class="cl-rhead">
          <div><b>Báo cáo tuần ${wk.n}</b> · ${wk.date}</div>
          <div>Cô ${esc(D.teacher)} · Mức độ tiếp thu: <span class="cl-good">${esc(r.level)}</span></div>
        </div>
        <dl>
          ${row('📌 Chủ đề bài học', esc(r.topic))}
          ${row('🔤 Từ vựng mới', `<div class="cl-chips">${r.vocab.map((v) => (isEn(v)
            ? `<button class="cl-chip say" title="Bấm để nghe">${esc(v)}</button>`
            : `<span class="cl-chip">${esc(v)}</span>`)).join('')}</div>`)}
          ${row('💬 Mẫu câu', `<ul class="cl-lines">${r.patterns.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>`)}
          ${row('🎲 Hoạt động trên lớp', esc(r.activities))}
          ${row('🏠 Bài tập về nhà', esc(r.homework))}
        </dl>
      </section>
      <h3 class="section-title">🎮 Luyện tập</h3>
      <div class="grid">${wk.topics.map((t) => `
        <a class="card" href="${c.href}/${t.id}" style="--c:#2ec4b6">
          <div class="big">${t.icon}</div>
          <div class="title">${esc(t.name)}</div>
          <div class="sub">${esc(t.vi)} · ${t.items.length} ${t.phrases ? 'câu' : 'từ'}</div>
          <div class="sub">⭐ ${TiengAnh.topicStars(c, t)}/${maxOf(t)}</div>
        </a>`).join('')}
        ${wk.drill && DRILLS[wk.drill.id] ? `
        <a class="card" href="${c.href}/luyen" style="--c:#e64980">
          <div class="big">🎯</div>
          <div class="title">${esc(wk.drill.name)}</div>
          <div class="sub">${esc(wk.drill.desc)}</div>
          <div class="stars">${U.starsHtml(U.getStars(`${c.key}/luyen`))}</div>
        </a>` : ''}
      </div>`;
    screen.querySelectorAll('.cl-chip.say').forEach((btn) => {
      const it = itemOf(wk, btn.textContent);
      btn.onclick = () => U.speak(it ? it.say || it.en : btn.textContent, 'en');
    });
  }

  /* Bài luyện trong một chủ đề (của tuần, hoặc phần ôn tập): màn chọn trò, hoặc chạy trò. */
  function topicRoute(frame, go, crumbs, c, topic, modeId, backParts) {
    const topicCrumb = [`${topic.icon} ${esc(topic.name)}`, `${c.href}/${topic.id}`];
    const mode = TiengAnh.MODES.find((m) => m.id === modeId);
    if (!mode) {
      TiengAnh.topicScreen(frame([...crumbs, topicCrumb], `${topic.icon} ${esc(topic.name)} – ${esc(topic.vi)}`), c, topic);
      return null;
    }
    const [modeName] = TiengAnh.modeText(topic, mode);
    return TiengAnh.run(frame([...crumbs, topicCrumb, [modeName]]), c, topic, mode.id, () => go(backParts));
  }

  /* p: phần địa chỉ sau #/colan. Trả về hàm dọn dẹp (nếu có). */
  function render(p, { frame, go }) {
    const home = [['🏠 Trang chủ', '#/'], ['👩‍🏫 Bài học cô Lan', '#/colan']];
    const st = D.students.find((s) => s.id === p[0]);
    if (!st) return students(frame(home, '👩‍🏫 Bài học cô Lan – Bé là ai?'));

    const stCrumbs = [...home, [`${st.icon} ${esc(st.name)}`, `#/colan/${st.id}`]];
    if (p[1] === 'ontap') {
      return topicRoute(frame, go, stCrumbs, stCtx(st), review(st), p[2], ['colan', st.id, 'ontap']);
    }
    const wk = groupOf(st).weeks.find((w) => w.id === p[1]);
    if (!wk) return studentScreen(frame(stCrumbs, `${st.icon} ${esc(st.name)} – Bài học cô Lan`), st);

    const wkCrumbs = [...stCrumbs, [`Tuần ${wk.n}`, `#/colan/${st.id}/${wk.id}`]];
    if (p[2] === 'luyen' && wk.drill && DRILLS[wk.drill.id]) {
      const c = wkCtx(st, wk);
      return Quiz.run({
        container: frame([...wkCrumbs, [`🎯 ${esc(wk.drill.name)}`]]),
        title: `🎯 ${esc(wk.drill.name)}`,
        lessonId: `${c.key}/luyen`,
        total: 10,
        makeQuestion: () => DRILLS[wk.drill.id](wk),
        onAnswer: (q) => { if (q.say) setTimeout(() => U.speak(q.say, 'en'), 250); },
        onExit: () => go(['colan', st.id, wk.id]),
      });
    }
    const topic = topicOf(wk, p[2]);
    if (!topic) return weekScreen(frame(wkCrumbs, `${wk.icon} Tuần ${wk.n} – ${esc(wk.title)}`), st, wk);
    return topicRoute(frame, go, wkCrumbs, wkCtx(st, wk), topic, p[3], ['colan', st.id, wk.id, topic.id]);
  }

  return { render, DRILLS };
})();
