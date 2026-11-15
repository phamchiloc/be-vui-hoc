/* Bài học cô Lan: tổng hợp báo cáo học tập hằng tuần của cô Phương Lan (các file W2, W3, W5, W6).
   Bean và Bon học Nhóm 1 (7–8 tuổi), King học Nhóm 2 (10 tuổi). Mỗi bé lưu sao riêng.
   Mỗi tuần gồm:
     report  – nội dung báo cáo của cô, ghi lại gần nguyên văn
     topics  – các bài luyện (cùng dạng chủ đề với TA_DATA trong tienganh-data.js, xem chú thích đầu file đó)
     drill   – trò luyện mẫu câu của tuần, câu hỏi sinh trong js/colan.js
   Thêm tuần mới: chép một tuần có sẵn trong cùng nhóm rồi sửa nội dung.
   Trò drill chỉ dùng được cho tuần đã có hàm cùng tên trong DRILLS (js/colan.js); tuần mới chưa có thì bỏ dòng drill. */

/* Hình vẽ cho những từ không có emoji phù hợp. Cao 1em, nên to nhỏ theo cỡ chữ của chỗ đặt hình. */
const COLAN_ART = (() => {
  const svg = (w, body, y = 0, h = 100) =>
    `<svg viewBox="0 ${y} ${w} ${h}" style="width:${(w / h).toFixed(3)}em;height:1em" aria-hidden="true">${body}</svg>`;
  const ON = { fill: '#ff6b6b', line: '#c92a2a' }, OFF = { fill: '#e9ecef', line: '#adb5bd' };

  /* Khuôn mặt: tóc dài/ngắn, mắt to/nhỏ, mũi to/nhỏ. */
  function face({ hair = 'short', eyes = 'big', nose = 'small' } = {}) {
    const H = '#7a4a26';
    const eye = (x) => (eyes === 'big'
      ? `<circle cx="${x}" cy="54" r="8.5" fill="#fff" stroke="#343a40" stroke-width="1.8"/><circle cx="${x}" cy="55" r="4.6" fill="#343a40"/>`
      : `<circle cx="${x}" cy="55" r="2.8" fill="#343a40"/>`);
    return svg(100, `
      ${hair === 'long' ? `<path d="M50 12C22 12 14 32 14 56L12 97Q28 100 34 86L66 86Q72 100 88 97L86 56C86 32 78 12 50 12Z" fill="${H}"/>` : ''}
      <circle cx="50" cy="56" r="30" fill="#ffd9b8" stroke="#e3a878" stroke-width="2"/>
      <path d="M20 56C18 24 38 17 50 17C62 17 82 24 80 56C74 42 64 35 50 35C36 35 26 42 20 56Z" fill="${H}"/>
      ${eye(36)}${eye(64)}
      <circle cx="29" cy="70" r="4.5" fill="#ff8fab" opacity=".45"/><circle cx="71" cy="70" r="4.5" fill="#ff8fab" opacity=".45"/>
      ${nose === 'big' ? '<ellipse cx="50" cy="67" rx="9" ry="7.5" fill="#f4a582"/>' : '<ellipse cx="50" cy="68" rx="3" ry="2.4" fill="#e8956f"/>'}
      <path d="M41 77Q50 84 59 77" stroke="#c0392b" stroke-width="2.6" fill="none" stroke-linecap="round"/>`);
  }

  /* To – nhỏ: hai quả bóng, quả đúng nghĩa được tô màu. */
  function size(big) {
    const ball = (cx, cy, r, c) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${c.fill}" stroke="${c.line}" stroke-width="3"/>
      <circle cx="${cx - r * 0.35}" cy="${cy - r * 0.35}" r="${r * 0.2}" fill="#fff" opacity=".7"/>`;
    return svg(150, ball(52, 54, 40, big ? ON : OFF) + ball(126, 80, 14, big ? OFF : ON));
  }

  /* Dài – ngắn: hai cây bút chì, cây đúng nghĩa được tô màu. */
  function len(long) {
    const pencil = (y, L, on) => {
      const body = on ? '#fcc419' : '#e9ecef', tip = on ? '#ffe8cc' : '#f8f9fa', line = on ? '#e67700' : '#adb5bd';
      return `<rect x="8" y="${y - 9}" width="${L - 18}" height="18" rx="3" fill="${body}" stroke="${line}" stroke-width="2.5"/>
        <path d="M${L - 10} ${y - 9}L${L + 8} ${y}L${L - 10} ${y + 9}Z" fill="${tip}" stroke="${line}" stroke-width="2.5" stroke-linejoin="round"/>`;
    };
    return svg(150, pencil(32, 134, long) + pencil(72, 52, !long));
  }

  const table = () => svg(100, `
    <rect x="8" y="34" width="84" height="11" rx="3" fill="#c0703a"/>
    <rect x="14" y="45" width="72" height="7" fill="#8b4513"/>
    <rect x="16" y="45" width="8" height="46" rx="2" fill="#8b4513"/><rect x="76" y="45" width="8" height="46" rx="2" fill="#8b4513"/>`);

  const mop = () => svg(100, `
    <rect x="46" y="4" width="8" height="64" rx="4" fill="#c08a4b"/>
    <rect x="32" y="64" width="36" height="9" rx="3" fill="#495057"/>
    <path d="M36 74Q30 88 27 96M44 74Q42 88 40 97M50 74V98M56 74Q58 88 60 97M64 74Q70 88 73 96" stroke="#74c0fc" stroke-width="7" stroke-linecap="round" fill="none"/>`);

  /* Vị trí quả bóng so với cái bàn và cái hộp: on-table, under-table, by-table, in-box, by-box. */
  const BALL = { 'on-table': [62, 34], 'under-table': [62, 84], 'by-table': [16, 84], 'in-box': [114, 64], 'by-box': [140, 84] };
  function place(where) {
    const [x, y] = BALL[where];
    const ball = `<circle cx="${x}" cy="${y}" r="8" fill="#ff6b6b" stroke="#c92a2a" stroke-width="2.5"/>`;
    return svg(150, `
      <line x1="2" y1="93" x2="148" y2="93" stroke="#ced4da" stroke-width="3" stroke-linecap="round"/>
      <rect x="34" y="42" width="56" height="8" rx="2" fill="#c0703a"/>
      <rect x="38" y="50" width="6" height="42" fill="#8b4513"/><rect x="80" y="50" width="6" height="42" fill="#8b4513"/>
      ${where === 'in-box' ? ball : ''}
      <path d="M100 64L92 55L99 52L106 62Z M128 64L136 55L129 52L122 62Z" fill="#d48a35"/>
      <rect x="99" y="64" width="30" height="28" fill="#e8a24a" stroke="#a0622a" stroke-width="2.5"/>
      ${where === 'in-box' ? '' : ball}`, 22, 76);
  }

  /* Emoji đặt trong hình SVG. */
  const emo = (x, y, size, e, extra = '') =>
    `<text x="${x}" y="${y}" font-size="${size}" text-anchor="middle" dominant-baseline="central"${extra}>${e}</text>`;

  /* Trẻ – già: hai hình, hình đúng nghĩa rõ nét, hình kia mờ. */
  const pair = (on, off) => svg(150, emo(48, 54, 78, on) + emo(120, 68, 48, off, ' opacity=".28"'));

  /* Cao – thấp: hai người đứng cạnh nhau, người đúng nghĩa được tô màu. */
  function height(tall) {
    const person = (x, h, on) => {
      const top = 96 - h;
      return `<rect x="${x - 12}" y="${top + 20}" width="24" height="${h - 20}" rx="10" fill="${on ? '#4dabf7' : '#e9ecef'}" stroke="${on ? '#1c7ed6' : '#adb5bd'}" stroke-width="2.5"/>
        <circle cx="${x}" cy="${top + 9}" r="9" fill="${on ? '#ffd9b8' : '#f1f3f5'}" stroke="${on ? '#e3a878' : '#adb5bd'}" stroke-width="2.5"/>`;
    };
    return svg(150, `<line x1="10" y1="97" x2="140" y2="97" stroke="#ced4da" stroke-width="3" stroke-linecap="round"/>
      ${person(52, 90, tall)}${person(104, 50, !tall)}`);
  }

  /* Người làm nghề kèm một biểu tượng nhỏ, ví dụ giáo viên + ➗ = giáo viên Toán. */
  const duo = (main, badge) => svg(100, `${emo(44, 52, 76, main)}
    <circle cx="80" cy="78" r="19" fill="#fff" stroke="#ced4da" stroke-width="2.5"/>${emo(80, 79, 22, badge)}`);

  return { face, size, len, table, mop, place, pair, height, duo };
})();

const COLAN_DATA = (() => {
  const A = COLAN_ART;
  const w = (en, vi, img, extra) => Object.assign({ en, vi, img }, extra);
  const s = (en, vi, svg) => ({ en, vi, svg });
  const b = (en, vi, badge) => ({ en, vi, badge });
  const months = () => ({
    id: 'thang', name: 'Months', vi: '12 tháng trong năm', icon: '🗓️',
    items: [
      b('January', 'Tháng Một', '1'), b('February', 'Tháng Hai', '2'), b('March', 'Tháng Ba', '3'), b('April', 'Tháng Tư', '4'),
      b('May', 'Tháng Năm', '5'), b('June', 'Tháng Sáu', '6'), b('July', 'Tháng Bảy', '7'), b('August', 'Tháng Tám', '8'),
      b('September', 'Tháng Chín', '9'), b('October', 'Tháng Mười', '10'), b('November', 'Tháng Mười Một', '11'), b('December', 'Tháng Mười Hai', '12'),
    ],
  });

  return {
    teacher: 'Phương Lan',
    students: [
      { id: 'bean', name: 'Bean', icon: '🐻', color: '#ff922b', group: 'nhom1' },
      { id: 'bon', name: 'Bon', icon: '🐰', color: '#f06595', group: 'nhom1' },
      { id: 'king', name: 'King', icon: '🦁', color: '#4263eb', group: 'nhom2' },
    ],
    groups: {
      nhom1: {
        name: 'Nhóm 1', age: '7–8 tuổi', level: 2,
        weeks: [
          {
            id: 'tuan2', n: 2, date: '13–17/10/2026', icon: '🪑', title: 'Is it the chair?',
            report: {
              topic: "Is it the chair? Yes, it is / No, it isn't",
              vocab: ['book', 'crayon', 'chair', 'table', 'door', 'window', 'kitten', 'mouse'],
              patterns: ["Is it the chair? – Yes, it is / No, it isn't", 'Open / close the door / window / book', 'How are you today?', "I'm good / great / wonderful. Thank you"],
              activities: 'Sticky balls, feed the kitten / cheetah',
              homework: 'Ôn lại cấu trúc câu Open / close the door / window / book',
              level: 'Tốt',
            },
            topics: [
              {
                id: 'tuvung', name: 'New words', vi: 'Từ vựng tuần 2', icon: '📚',
                items: [
                  w('book', 'quyển sách', '📖'), w('crayon', 'bút sáp màu', '🖍️'), w('chair', 'cái ghế', '🪑'), s('table', 'cái bàn', A.table()),
                  w('door', 'cửa ra vào', '🚪'), w('window', 'cửa sổ', '🪟'), w('kitten', 'mèo con', '🐱'), w('mouse', 'con chuột', '🐭'),
                ],
              },
              {
                id: 'maucau', name: 'Sentences', vi: 'Mẫu câu tuần 2', icon: '💬', phrases: true,
                items: [
                  w('Is it the chair? – Yes, it is.', 'Đó có phải cái ghế không? – Đúng rồi.', '🪑'),
                  w("Is it the book? – No, it isn't.", 'Đó có phải quyển sách không? – Không phải.', '🖍️'),
                  w('Open the door.', 'Mở cửa ra vào.', '🚪'),
                  w('Close the window.', 'Đóng cửa sổ lại.', '🪟'),
                  w('Open the book.', 'Mở sách ra.', '📖'),
                  w('Close the book.', 'Gấp sách lại.', '📕'),
                  w('How are you today?', 'Hôm nay bạn thế nào?', '🙋'),
                  w("I'm good. Thank you.", 'Mình khỏe. Cảm ơn bạn.', '🙂'),
                  w("I'm great. Thank you.", 'Mình rất khỏe. Cảm ơn bạn.', '😄'),
                  w("I'm wonderful. Thank you.", 'Mình thấy tuyệt vời. Cảm ơn bạn.', '🤩'),
                ],
              },
            ],
            drill: { id: 'isit', name: 'Is it the …?', desc: 'Trả lời Yes / No, nghe lệnh Open / Close' },
          },
          {
            id: 'tuan3', n: 3, date: '27–31/10/2026', icon: '👃', title: 'Parts of face',
            report: {
              topic: 'Parts of face',
              vocab: ['face', 'hair', 'eyes', 'nose', 'big', 'small', 'long', 'short', 'hat', 'mop'],
              patterns: ["What is this? – It's...", 'Kết hợp danh từ và tính từ'],
              activities: 'Rocket race',
              homework: 'Ôn lại từ vựng các bộ phận trên gương mặt',
              level: 'Tốt',
            },
            topics: [
              {
                id: 'tuvung', name: 'Parts of face', vi: 'Từ vựng tuần 3', icon: '👃',
                items: [
                  s('face', 'khuôn mặt', A.face()), w('hair', 'mái tóc', '💇'), w('eyes', 'đôi mắt', '👀'), w('nose', 'cái mũi', '👃'),
                  s('big', 'to, lớn', A.size(true)), s('small', 'nhỏ, bé', A.size(false)), s('long', 'dài', A.len(true)), s('short', 'ngắn', A.len(false)),
                  w('hat', 'cái mũ', '👒'), s('mop', 'cây lau nhà', A.mop()),
                ],
              },
              {
                id: 'maucau', name: 'Sentences', vi: 'Mẫu câu tuần 3', icon: '💬', phrases: true,
                items: [
                  w('What is this?', 'Đây là cái gì?', '🤔'),
                  w("It's a nose.", 'Đó là cái mũi.', '👃'),
                  w("It's a hat.", 'Đó là cái mũ.', '👒'),
                  s("It's a mop.", 'Đó là cây lau nhà.', A.mop()),
                  s('big eyes', 'đôi mắt to', A.face({ eyes: 'big' })),
                  s('small eyes', 'đôi mắt nhỏ', A.face({ eyes: 'small' })),
                  s('a big nose', 'cái mũi to', A.face({ nose: 'big' })),
                  s('long hair', 'mái tóc dài', A.face({ hair: 'long' })),
                  s('short hair', 'mái tóc ngắn', A.face({ hair: 'short', eyes: 'small' })),
                  w('a small hat', 'cái mũ nhỏ', '👒'),
                ],
              },
            ],
            drill: { id: 'face', name: "What is this? – It's…", desc: 'Gọi tên đồ vật, ghép danh từ với tính từ' },
          },
          {
            id: 'tuan5', n: 5, date: '3–7/11/2026', icon: '💪', title: 'Parts of body and feelings',
            report: {
              topic: 'Parts of body and feelings',
              vocab: ['happy', 'sad', 'angry', 'arms', 'hands', 'legs', 'feet', 'gorilla', 'jump', 'run', 'dance', 'crawl', 'kick'],
              patterns: ['He / she is....', 'This is my.... / These are my....'],
              activities: 'Touch your.....',
              homework: 'Ôn lại từ vựng các bộ phận trên cơ thể',
              level: 'Tốt',
            },
            topics: [
              {
                id: 'tuvung', name: 'Body and feelings', vi: 'Cơ thể và cảm xúc', icon: '😀',
                items: [
                  w('happy', 'vui vẻ', '😀'), w('sad', 'buồn', '😢'), w('angry', 'tức giận', '😠'),
                  w('arms', 'cánh tay', '💪'), w('hands', 'bàn tay', '👐'), w('legs', 'cái chân', '🦵'), w('feet', 'bàn chân', '🦶'),
                ],
              },
              {
                id: 'hanhdong', name: 'Actions', vi: 'Hành động', icon: '🏃',
                items: [
                  w('gorilla', 'con khỉ đột', '🦍'), w('jump', 'nhảy lên', '🦘'), w('run', 'chạy', '🏃'),
                  w('dance', 'nhảy múa', '💃'), w('crawl', 'bò', '🐛'), w('kick', 'đá', '⚽'),
                ],
              },
              {
                id: 'maucau', name: 'Sentences', vi: 'Mẫu câu tuần 5', icon: '💬', phrases: true,
                items: [
                  w('He is happy.', 'Cậu ấy đang vui.', '😀'),
                  w('She is sad.', 'Cô ấy đang buồn.', '😢'),
                  w('He is angry.', 'Cậu ấy đang tức giận.', '😠'),
                  w('This is my hand.', 'Đây là bàn tay của tớ.', '✋'),
                  w('These are my hands.', 'Đây là hai bàn tay của tớ.', '👐'),
                  w('These are my arms.', 'Đây là hai cánh tay của tớ.', '💪'),
                  w('These are my feet.', 'Đây là hai bàn chân của tớ.', '🦶'),
                  w('Touch your nose!', 'Chạm vào mũi của bạn!', '👃'),
                  w('Touch your legs!', 'Chạm vào chân của bạn!', '🦵'),
                ],
              },
            ],
            drill: { id: 'body', name: 'This is my… / He is…', desc: 'Nhìn hình, chọn câu đúng' },
          },
          {
            id: 'tuan6', n: 6, date: '10–14/11/2026', icon: '👪', title: 'Family, animals and appearance',
            report: {
              topic: 'Family, animals and appearance',
              vocab: ['father', 'mother', 'sister', 'brother', 'grandfather', 'grandmother', 'baby', 'duck', 'lamb', 'night', 'young', 'short', 'old', 'tall'],
              patterns: ['Who is this?', 'This is....'],
              activities: 'Describe your family',
              homework: 'Ôn lại từ vựng về gia đình',
              level: 'Tốt',
            },
            topics: [
              {
                id: 'giadinh', name: 'Family', vi: 'Gia đình', icon: '👪',
                items: [
                  w('father', 'bố', '👨'), w('mother', 'mẹ', '👩'), w('sister', 'chị gái, em gái', '👧'), w('brother', 'anh trai, em trai', '👦'),
                  w('grandfather', 'ông', '👴'), w('grandmother', 'bà', '👵'), w('baby', 'em bé', '👶'),
                ],
              },
              {
                id: 'tuvung', name: 'Animals and appearance', vi: 'Con vật và ngoại hình', icon: '🐑',
                items: [
                  w('duck', 'con vịt', '🦆'), w('lamb', 'cừu con', '🐑'), w('night', 'ban đêm', '🌙'),
                  s('young', 'trẻ, nhỏ tuổi', A.pair('🧒', '🧓')), s('old', 'già', A.pair('🧓', '🧒')),
                  s('tall', 'cao', A.height(true)), s('short', 'thấp', A.height(false)),
                ],
              },
              {
                id: 'maucau', name: 'Sentences', vi: 'Mẫu câu tuần 6', icon: '💬', phrases: true,
                items: [
                  w('Who is this?', 'Đây là ai?', '🤔'),
                  w('This is my father.', 'Đây là bố của tớ.', '👨'),
                  w('This is my mother.', 'Đây là mẹ của tớ.', '👩'),
                  w('This is my grandmother.', 'Đây là bà của tớ.', '👵'),
                  w('This is my baby brother.', 'Đây là em trai nhỏ của tớ.', '👶'),
                  w('My grandfather is old.', 'Ông của tớ đã già.', '👴'),
                  w('My sister is young.', 'Em gái của tớ còn nhỏ.', '👧'),
                  s('My father is tall.', 'Bố của tớ cao.', A.height(true)),
                  s('My mother is short.', 'Mẹ của tớ thấp.', A.height(false)),
                ],
              },
            ],
            drill: { id: 'family', name: 'Who is this?', desc: 'Nhìn hình, chọn câu giới thiệu đúng' },
          },
        ],
      },

      nhom2: {
        name: 'Nhóm 2', age: '10 tuổi', level: 4,
        weeks: [
          {
            id: 'tuan2', n: 2, date: '13–17/10/2026', icon: '🎂', title: 'Ôn Unit 3, học Unit 4',
            report: {
              topic: 'Ôn tập Unit 3, học từ vựng và cấu trúc Unit 4, học bài thuyết trình giới thiệu bản thân',
              vocab: ['12 months of the year', 'food and drink topics', 'small', 'tall', 'friends', 'funny'],
              patterns: ['Ôn lại tất cả mẫu câu của Unit 3', "When is your birthday? – It's in...", 'What do you want to eat / drink? – I want some....', 'There is / There are...'],
              activities: 'Ôn từ vựng cũ, luyện phản xạ với mẫu câu và luyện tập bài thuyết trình về bản thân "All about me"',
              homework: 'Ôn lại từ vựng của 12 tháng trong năm',
              level: 'Tốt',
            },
            topics: [
              months(),
              {
                id: 'tuvung', name: 'New words', vi: 'Từ vựng mới', icon: '👫',
                items: [w('small', 'nhỏ bé', '🐭'), w('tall', 'cao', '🦒'), w('friends', 'những người bạn', '👫'), w('funny', 'vui tính, hài hước', '🤪')],
              },
              {
                id: 'doan', name: 'Food and drinks', vi: 'Đồ ăn, thức uống', icon: '🍽️',
                items: [
                  w('rice', 'cơm', '🍚'), w('bread', 'bánh mì', '🍞'), w('noodles', 'mì, phở', '🍜'), w('chicken', 'thịt gà', '🍗'),
                  w('fish', 'cá', '🐟'), w('eggs', 'trứng', '🥚'),
                  w('milk', 'sữa', '🥛', { drink: true }), w('water', 'nước lọc', '💧', { drink: true }),
                  w('juice', 'nước ép', '🧃', { drink: true }), w('lemonade', 'nước chanh', '🍋', { drink: true }),
                ],
              },
              {
                id: 'maucau', name: 'Sentences', vi: 'Mẫu câu tuần 2', icon: '💬', phrases: true,
                items: [
                  w('When is your birthday?', 'Sinh nhật của bạn vào tháng mấy?', '🎂'),
                  w("It's in May.", 'Vào tháng Năm.', '🗓️'),
                  w('What do you want to eat?', 'Bạn muốn ăn gì?', '🍽️'),
                  w('I want some noodles.', 'Mình muốn ăn một ít mì.', '🍜'),
                  w('What do you want to drink?', 'Bạn muốn uống gì?', '🥤'),
                  w('I want some milk.', 'Mình muốn uống một ít sữa.', '🥛'),
                  w('There is one apple.', 'Có một quả táo.', '🍎'),
                  w('There are three eggs.', 'Có ba quả trứng.', '🥚'),
                  w('My name is King.', 'Tên mình là King.', '🙋'),
                  w("I'm ten years old.", 'Mình mười tuổi.', '🔟'),
                ],
              },
            ],
            drill: { id: 'birthday', name: 'Birthday · Food · There is/are', desc: 'Nhìn hình, chọn câu trả lời đúng' },
          },
          {
            id: 'tuan3', n: 3, date: '27–31/10/2026', icon: '🎸', title: 'Unit 5: Things we can do',
            report: {
              topic: 'Unit 5: Things we can do',
              vocab: ['ôn từ vựng 12 months of the year', 'can', 'cook', 'swim', 'play the guitar', 'play the piano', 'ride a bike', 'ride a horse', 'roller skate', 'but', 'draw'],
              patterns: ['Can you ...? – Yes, I can.', "I / she / he can't .... but I / she / he can...."],
              activities: 'Ôn từ vựng cũ và mẫu câu của Unit 4, luyện phản xạ với mẫu câu và luyện tập bài thuyết trình về bản thân',
              homework: 'Ôn lại từ vựng của Unit 5 và 12 tháng trong năm',
              level: 'Tốt',
            },
            topics: [
              {
                id: 'hoatdong', name: 'Things we can do', vi: 'Những việc em làm được', icon: '🎸',
                items: [
                  w('cook', 'nấu ăn', '🍳'), w('swim', 'bơi', '🏊'), w('play the guitar', 'chơi đàn ghi-ta', '🎸'), w('play the piano', 'chơi đàn pi-a-nô', '🎹'),
                  w('ride a bike', 'đi xe đạp', '🚴'), w('ride a horse', 'cưỡi ngựa', '🏇'), w('roller skate', 'trượt pa-tanh', '🛼'), w('draw', 'vẽ', '🎨'),
                ],
              },
              months(),
              {
                id: 'maucau', name: 'Sentences', vi: 'Mẫu câu tuần 3', icon: '💬', phrases: true,
                items: [
                  w('Can you swim? – Yes, I can.', 'Bạn có biết bơi không? – Có, mình biết.', '🏊'),
                  w("Can you cook? – No, I can't.", 'Bạn có biết nấu ăn không? – Không, mình không biết.', '🍳'),
                  w('I can play the piano.', 'Mình biết chơi đàn pi-a-nô.', '🎹'),
                  w('He can play the guitar.', 'Cậu ấy biết chơi đàn ghi-ta.', '🎸'),
                  w("I can't swim, but I can ride a bike.", 'Mình không biết bơi, nhưng mình biết đi xe đạp.', '🚴'),
                  w("She can't cook, but she can draw.", 'Cô ấy không biết nấu ăn, nhưng cô ấy biết vẽ.', '🎨'),
                  w("He can't ride a horse, but he can roller skate.", 'Cậu ấy không biết cưỡi ngựa, nhưng cậu ấy biết trượt pa-tanh.', '🛼'),
                ],
              },
            ],
            drill: { id: 'can', name: "Can / can't … but …", desc: 'Nhìn hình, chọn câu đúng' },
          },
          {
            id: 'tuan5', n: 5, date: '3–7/11/2026', icon: '🏫', title: 'Unit 6: Our school facilities',
            report: {
              topic: 'Review Lesson 1–5, Unit 6: Our school facilities',
              vocab: ['city', 'town', 'village', 'playground', 'garden', 'mountain', 'building', 'computer room', 'các giới từ chỉ vị trí: on, in, under, by'],
              patterns: [
                "Where's your school? – It's in the ... / My school is in ...",
                'How many ... are there at your school?',
                'There is + one + danh từ số ít / There are + số lượng nhiều + danh từ số nhiều',
                "Where is ...? – It's on / in / under / by the ...",
              ],
              activities: 'Game Baamboozle, thuyết trình về bản thân, sinh nhật của gia đình và về trường học',
              homework: 'Ôn lại từ vựng của Unit 6 và cấu trúc ngữ pháp đã học',
              level: 'Tốt',
            },
            topics: [
              {
                id: 'truonghoc', name: 'Our school', vi: 'Trường học và nơi chốn', icon: '🏫',
                items: [
                  w('city', 'thành phố', '🏙️'), w('town', 'thị trấn', '🏘️'), w('village', 'ngôi làng', '🛖'), w('playground', 'sân chơi', '🛝'),
                  w('garden', 'khu vườn', '🌷'), w('mountain', 'ngọn núi', '⛰️'), w('building', 'tòa nhà', '🏢'), w('computer room', 'phòng máy tính', '💻'),
                ],
              },
              {
                id: 'gioitu', name: 'Prepositions', vi: 'Giới từ chỉ vị trí', icon: '📍',
                items: [
                  s('on', 'ở trên', A.place('on-table')), s('in', 'ở trong', A.place('in-box')),
                  s('under', 'ở dưới', A.place('under-table')), s('by', 'ở bên cạnh', A.place('by-box')),
                ],
              },
              {
                id: 'maucau', name: 'Sentences', vi: 'Mẫu câu tuần 5', icon: '💬', phrases: true,
                items: [
                  w("Where's your school?", 'Trường của bạn ở đâu?', '🏫'),
                  w("It's in the city.", 'Trường ở trong thành phố.', '🏙️'),
                  w('My school is in the village.', 'Trường của mình ở trong làng.', '🛖'),
                  w('How many computer rooms are there at your school?', 'Trường bạn có bao nhiêu phòng máy tính?', '💻'),
                  w('There is one playground.', 'Có một sân chơi.', '🛝'),
                  w('There are two gardens.', 'Có hai khu vườn.', '🌷'),
                  w('Where is the ball?', 'Quả bóng ở đâu?', '⚽'),
                  s("It's under the table.", 'Nó ở dưới gầm bàn.', A.place('under-table')),
                  s("It's in the box.", 'Nó ở trong cái hộp.', A.place('in-box')),
                ],
              },
            ],
            drill: { id: 'school', name: 'Where is…? How many…?', desc: 'Vị trí đồ vật, số lượng, trường ở đâu' },
          },
          {
            id: 'tuan6', n: 6, date: '10–14/11/2026', icon: '📚', title: 'Ôn Unit 6, học Unit 7',
            report: {
              topic: 'Review Unit 6, học Unit 7',
              vocab: [
                'subject', 'Art', 'History', 'Geography', 'Maths', 'Music', 'Science', 'English', 'Vietnamese', 'days of the week',
                'IT', 'PE', 'English teacher', 'Maths teacher', 'painter', 'singer', 'favourite', 'why', 'because',
              ],
              patterns: ['What subjects do you have today? – I have + (name of subject).', 'When do you have ...? – I have it on ...'],
              activities: 'Game Baamboozle, thuyết trình về trường học và các hoạt động ở trường',
              homework: 'Ôn lại từ vựng của Unit 7 và cấu trúc ngữ pháp đã học',
              level: 'Tốt',
            },
            topics: [
              {
                id: 'monhoc', name: 'School subjects', vi: 'Các môn học', icon: '📚',
                items: [
                  w('Art', 'Mĩ thuật', '🖼️'), w('History', 'Lịch sử', '🏛️'), w('Geography', 'Địa lí', '🌏'), w('Maths', 'Toán', '➗'),
                  w('Music', 'Âm nhạc', '🎵'), w('Science', 'Khoa học', '🔬'), w('English', 'Tiếng Anh', '🔤'), w('Vietnamese', 'Tiếng Việt', '✍️'),
                  w('IT', 'Tin học', '⌨️', { say: 'I.T.' }), w('PE', 'Thể dục', '🤸', { say: 'P.E.' }),
                ],
              },
              {
                id: 'thu', name: 'Days of the week', vi: 'Các ngày trong tuần', icon: '📅',
                items: [
                  b('Monday', 'Thứ Hai', 'T2'), b('Tuesday', 'Thứ Ba', 'T3'), b('Wednesday', 'Thứ Tư', 'T4'), b('Thursday', 'Thứ Năm', 'T5'),
                  b('Friday', 'Thứ Sáu', 'T6'), b('Saturday', 'Thứ Bảy', 'T7'), b('Sunday', 'Chủ Nhật', 'CN'),
                ],
              },
              {
                id: 'tuvung', name: 'Jobs and more', vi: 'Nghề nghiệp và từ khác', icon: '🧑‍🏫',
                items: [
                  w('subject', 'môn học', '📚'), s('English teacher', 'giáo viên tiếng Anh', A.duo('🧑‍🏫', '🔤')),
                  s('Maths teacher', 'giáo viên Toán', A.duo('🧑‍🏫', '➗')), w('painter', 'họa sĩ', '👩‍🎨'), w('singer', 'ca sĩ', '👨‍🎤'),
                  w('favourite', 'yêu thích', '❤️'), w('why', 'tại sao', '❓'), w('because', 'bởi vì', '💡'),
                ],
              },
              {
                id: 'maucau', name: 'Sentences', vi: 'Mẫu câu tuần 6', icon: '💬', phrases: true,
                items: [
                  w('What subjects do you have today?', 'Hôm nay bạn có những môn học nào?', '📚'),
                  w('I have Maths and English.', 'Mình có môn Toán và môn Tiếng Anh.', '➗'),
                  w('When do you have Music?', 'Bạn có môn Âm nhạc vào thứ mấy?', '🎵'),
                  w('I have it on Monday.', 'Mình có môn đó vào thứ Hai.', '📅'),
                  w("What's your favourite subject?", 'Môn học yêu thích của bạn là gì?', '❤️'),
                  w('My favourite subject is Art.', 'Môn học yêu thích của mình là Mĩ thuật.', '🎨'),
                  w('Why do you like Art?', 'Vì sao bạn thích môn Mĩ thuật?', '❓'),
                  w('Because I want to be a painter.', 'Vì mình muốn trở thành họa sĩ.', '👩‍🎨'),
                ],
              },
            ],
            drill: { id: 'subjects', name: 'Subjects · When · Why', desc: 'Môn học hôm nay, học vào thứ mấy, vì sao thích' },
          },
        ],
      },
    },
  };
})();
