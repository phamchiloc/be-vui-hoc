/* Dữ liệu Tiếng Anh theo lớp.
   Mỗi chủ đề: { id, name, vi, icon, items, phrases? }.
   Mỗi mục: en, vi, img (emoji) — hoặc color (mã màu) / badge (chữ trên tờ lịch) thay cho img.
   phrases: true khi mục là câu, khi đó bỏ trò Ghép chữ và trắc nghiệm hỏi nghĩa tiếng Việt. */
const TA_DATA = (() => {
  const w = (en, vi, img, extra) => Object.assign({ en, vi, img }, extra);
  const c = (en, vi, color) => ({ en, vi, color });
  const b = (en, vi, badge) => ({ en, vi, badge });

  return {
    1: [
      {
        id: 'alphabet', name: 'Alphabet', vi: 'Bảng chữ cái', icon: '🔤',
        items: [
          w('apple', 'quả táo', '🍎', { letter: 'A' }), w('ball', 'quả bóng', '⚽', { letter: 'B' }),
          w('cat', 'con mèo', '🐱', { letter: 'C' }), w('dog', 'con chó', '🐶', { letter: 'D' }),
          w('egg', 'quả trứng', '🥚', { letter: 'E' }), w('fish', 'con cá', '🐟', { letter: 'F' }),
          w('grapes', 'chùm nho', '🍇', { letter: 'G' }), w('hat', 'cái mũ', '🎩', { letter: 'H' }),
          w('ice cream', 'kem', '🍦', { letter: 'I' }), w('juice', 'nước ép', '🧃', { letter: 'J' }),
          w('kite', 'con diều', '🪁', { letter: 'K' }), w('lion', 'sư tử', '🦁', { letter: 'L' }),
          w('monkey', 'con khỉ', '🐒', { letter: 'M' }), w('nose', 'cái mũi', '👃', { letter: 'N' }),
          w('orange', 'quả cam', '🍊', { letter: 'O' }), w('pig', 'con lợn', '🐷', { letter: 'P' }),
          w('queen', 'nữ hoàng', '👸', { letter: 'Q' }), w('rabbit', 'con thỏ', '🐰', { letter: 'R' }),
          w('sun', 'mặt trời', '☀️', { letter: 'S' }), w('tiger', 'con hổ', '🐯', { letter: 'T' }),
          w('umbrella', 'cái ô', '☂️', { letter: 'U' }), w('violin', 'đàn vi-ô-lông', '🎻', { letter: 'V' }),
          w('watch', 'đồng hồ đeo tay', '⌚', { letter: 'W' }), w('fox', 'con cáo', '🦊', { letter: 'X' }),
          w('yo-yo', 'con quay yo-yo', '🪀', { letter: 'Y' }), w('zebra', 'ngựa vằn', '🦓', { letter: 'Z' }),
        ],
      },
      {
        id: 'numbers', name: 'Numbers', vi: 'Số đếm 1–10', icon: '🔢',
        items: [
          w('one', 'số một', '1️⃣'), w('two', 'số hai', '2️⃣'), w('three', 'số ba', '3️⃣'), w('four', 'số bốn', '4️⃣'),
          w('five', 'số năm', '5️⃣'), w('six', 'số sáu', '6️⃣'), w('seven', 'số bảy', '7️⃣'), w('eight', 'số tám', '8️⃣'),
          w('nine', 'số chín', '9️⃣'), w('ten', 'số mười', '🔟'),
        ],
      },
      {
        id: 'colors', name: 'Colors', vi: 'Màu sắc', icon: '🎨',
        items: [
          c('red', 'màu đỏ', '#e03131'), c('blue', 'màu xanh dương', '#1c7ed6'), c('green', 'màu xanh lá', '#2f9e44'),
          c('yellow', 'màu vàng', '#fcc419'), c('orange', 'màu cam', '#fd7e14'), c('purple', 'màu tím', '#7048e8'),
          c('pink', 'màu hồng', '#f783ac'), c('black', 'màu đen', '#212529'), c('white', 'màu trắng', '#ffffff'),
          c('brown', 'màu nâu', '#8b5a2b'),
        ],
      },
      {
        id: 'animals', name: 'Animals', vi: 'Con vật', icon: '🐶',
        items: [
          w('cat', 'con mèo', '🐱'), w('dog', 'con chó', '🐶'), w('bird', 'con chim', '🐦'), w('fish', 'con cá', '🐟'),
          w('duck', 'con vịt', '🦆'), w('chicken', 'con gà', '🐔'), w('cow', 'con bò', '🐄'), w('pig', 'con lợn', '🐷'),
          w('horse', 'con ngựa', '🐴'), w('rabbit', 'con thỏ', '🐰'), w('elephant', 'con voi', '🐘'), w('monkey', 'con khỉ', '🐒'),
        ],
      },
      {
        id: 'fruits', name: 'Fruits', vi: 'Hoa quả', icon: '🍓',
        items: [
          w('apple', 'quả táo', '🍎'), w('banana', 'quả chuối', '🍌'), w('orange', 'quả cam', '🍊'), w('grapes', 'chùm nho', '🍇'),
          w('mango', 'quả xoài', '🥭'), w('watermelon', 'dưa hấu', '🍉'), w('strawberry', 'dâu tây', '🍓'), w('pineapple', 'quả dứa', '🍍'),
          w('lemon', 'quả chanh', '🍋'), w('coconut', 'quả dừa', '🥥'), w('cherry', 'quả anh đào', '🍒'), w('peach', 'quả đào', '🍑'),
        ],
      },
    ],
    2: [
      {
        id: 'family', name: 'Family', vi: 'Gia đình', icon: '👨‍👩‍👧',
        items: [
          w('father', 'bố', '👨'), w('mother', 'mẹ', '👩'), w('brother', 'anh / em trai', '👦'), w('sister', 'chị / em gái', '👧'),
          w('baby', 'em bé', '👶'), w('grandfather', 'ông', '👴'), w('grandmother', 'bà', '👵'), w('family', 'gia đình', '👨‍👩‍👧‍👦'),
        ],
      },
      {
        id: 'body', name: 'My body', vi: 'Cơ thể', icon: '🙂',
        items: [
          w('eye', 'mắt', '👁️'), w('ear', 'tai', '👂'), w('nose', 'mũi', '👃'), w('mouth', 'miệng', '👄'),
          w('hand', 'bàn tay', '✋'), w('foot', 'bàn chân', '🦶'), w('leg', 'chân', '🦵'), w('arm', 'cánh tay', '💪'),
          w('tooth', 'răng', '🦷'), w('hair', 'tóc', '💇'), w('face', 'khuôn mặt', '🙂'), w('tongue', 'lưỡi', '👅'),
        ],
      },
      {
        id: 'toys', name: 'Toys', vi: 'Đồ chơi', icon: '🧸',
        items: [
          w('ball', 'quả bóng', '⚽'), w('doll', 'búp bê', '🪆'), w('kite', 'con diều', '🪁'), w('teddy bear', 'gấu bông', '🧸'),
          w('car', 'ô tô', '🚗'), w('robot', 'rô-bốt', '🤖'), w('yo-yo', 'con quay yo-yo', '🪀'), w('puzzle', 'trò xếp hình', '🧩'),
          w('balloon', 'bóng bay', '🎈'), w('train', 'tàu hoả', '🚂'), w('drum', 'cái trống', '🥁'),
        ],
      },
      {
        id: 'food', name: 'Food and drinks', vi: 'Đồ ăn, đồ uống', icon: '🍕',
        items: [
          w('rice', 'cơm', '🍚'), w('bread', 'bánh mì', '🍞'), w('milk', 'sữa', '🥛'), w('egg', 'trứng', '🥚'),
          w('cake', 'bánh ngọt', '🍰'), w('water', 'nước', '💧'), w('juice', 'nước ép', '🧃'), w('noodles', 'mì', '🍜'),
          w('chicken', 'thịt gà', '🍗'), w('ice cream', 'kem', '🍦'), w('candy', 'kẹo', '🍬'), w('pizza', 'bánh pi-za', '🍕'),
        ],
      },
    ],
    3: [
      {
        id: 'school', name: 'School things', vi: 'Đồ dùng học tập', icon: '🎒',
        items: [
          w('book', 'quyển sách', '📕'), w('pen', 'bút mực', '🖊️'), w('pencil', 'bút chì', '✏️'), w('ruler', 'thước kẻ', '📏'),
          w('school bag', 'cặp sách', '🎒'), w('crayon', 'bút sáp màu', '🖍️'), w('scissors', 'cái kéo', '✂️'), w('notebook', 'quyển vở', '📓'),
          w('computer', 'máy tính', '💻'), w('chair', 'cái ghế', '🪑'), w('clock', 'đồng hồ', '⏰'), w('teacher', 'giáo viên', '🧑‍🏫'),
        ],
      },
      {
        id: 'clothes', name: 'Clothes', vi: 'Quần áo', icon: '👕',
        items: [
          w('T-shirt', 'áo phông', '👕'), w('dress', 'váy liền', '👗'), w('hat', 'mũ rộng vành', '👒'), w('cap', 'mũ lưỡi trai', '🧢'),
          w('shoes', 'giày', '👟'), w('socks', 'tất', '🧦'), w('jacket', 'áo khoác', '🧥'), w('jeans', 'quần bò', '👖'),
          w('scarf', 'khăn quàng', '🧣'), w('gloves', 'găng tay', '🧤'), w('boots', 'đôi ủng', '👢'),
        ],
      },
      {
        id: 'weather', name: 'Weather', vi: 'Thời tiết', icon: '🌦️',
        items: [
          w('sunny', 'có nắng', '☀️'), w('rainy', 'có mưa', '🌧️'), w('cloudy', 'nhiều mây', '☁️'), w('windy', 'có gió', '🌬️'),
          w('snowy', 'có tuyết', '❄️'), w('stormy', 'có bão', '⛈️'), w('hot', 'nóng', '🥵'), w('cold', 'lạnh', '🥶'),
          w('rainbow', 'cầu vồng', '🌈'),
        ],
      },
      {
        id: 'actions', name: 'Actions', vi: 'Hoạt động', icon: '🏃',
        items: [
          w('run', 'chạy', '🏃'), w('swim', 'bơi', '🏊'), w('sing', 'hát', '🎤'), w('dance', 'nhảy múa', '💃'),
          w('read', 'đọc', '📖'), w('write', 'viết', '✍️'), w('draw', 'vẽ', '🎨'), w('sleep', 'ngủ', '😴'),
          w('eat', 'ăn', '🍽️'), w('drink', 'uống', '🥤'), w('cook', 'nấu ăn', '🍳'), w('ride a bike', 'đạp xe', '🚴'),
        ],
      },
      {
        id: 'greetings', name: 'Greetings', vi: 'Chào hỏi', icon: '👋', phrases: true,
        items: [
          w('Hello!', 'Xin chào!', '🙋'), w('Good morning!', 'Chào buổi sáng!', '🌅'),
          w('Good afternoon!', 'Chào buổi chiều!', '🌇'), w('Good night!', 'Chúc ngủ ngon!', '🌙'),
          w('Thank you!', 'Cảm ơn!', '🙏'), w('Sorry!', 'Xin lỗi!', '😔'), w('Goodbye!', 'Tạm biệt!', '👋'),
          w('How are you?', 'Bạn có khoẻ không?', '🤔'), w("I'm fine, thank you.", 'Tôi khoẻ, cảm ơn bạn.', '😄'),
        ],
      },
    ],
    4: [
      {
        id: 'jobs', name: 'Jobs', vi: 'Nghề nghiệp', icon: '🧑‍⚕️',
        items: [
          w('doctor', 'bác sĩ', '🧑‍⚕️'), w('teacher', 'giáo viên', '🧑‍🏫'), w('farmer', 'nông dân', '🧑‍🌾'), w('cook', 'đầu bếp', '🧑‍🍳'),
          w('police officer', 'cảnh sát', '👮'), w('firefighter', 'lính cứu hoả', '🧑‍🚒'), w('pilot', 'phi công', '🧑‍✈️'), w('singer', 'ca sĩ', '🧑‍🎤'),
          w('artist', 'hoạ sĩ', '🧑‍🎨'), w('scientist', 'nhà khoa học', '🧑‍🔬'), w('builder', 'thợ xây', '👷'), w('astronaut', 'phi hành gia', '🧑‍🚀'),
        ],
      },
      {
        id: 'places', name: 'Places', vi: 'Địa điểm', icon: '🏫',
        items: [
          w('school', 'trường học', '🏫'), w('hospital', 'bệnh viện', '🏥'), w('park', 'công viên', '🏞️'), w('zoo', 'sở thú', '🦒'),
          w('supermarket', 'siêu thị', '🛒'), w('bank', 'ngân hàng', '🏦'), w('post office', 'bưu điện', '🏤'), w('library', 'thư viện', '📚'),
          w('cinema', 'rạp chiếu phim', '🎬'), w('museum', 'bảo tàng', '🏛️'), w('beach', 'bãi biển', '🏖️'), w('airport', 'sân bay', '🛫'),
        ],
      },
      {
        id: 'sports', name: 'Sports and hobbies', vi: 'Thể thao, sở thích', icon: '⚽',
        items: [
          w('football', 'bóng đá', '⚽'), w('basketball', 'bóng rổ', '🏀'), w('badminton', 'cầu lông', '🏸'), w('swimming', 'bơi lội', '🏊'),
          w('tennis', 'quần vợt', '🎾'), w('volleyball', 'bóng chuyền', '🏐'), w('table tennis', 'bóng bàn', '🏓'), w('chess', 'cờ vua', '♟️'),
          w('cycling', 'đạp xe', '🚴'), w('skating', 'trượt băng', '⛸️'), w('fishing', 'câu cá', '🎣'), w('running', 'chạy bộ', '🏃'),
        ],
      },
      {
        id: 'days', name: 'Days of the week', vi: 'Các ngày trong tuần', icon: '📅',
        items: [
          b('Monday', 'Thứ Hai', 'T2'), b('Tuesday', 'Thứ Ba', 'T3'), b('Wednesday', 'Thứ Tư', 'T4'), b('Thursday', 'Thứ Năm', 'T5'),
          b('Friday', 'Thứ Sáu', 'T6'), b('Saturday', 'Thứ Bảy', 'T7'), b('Sunday', 'Chủ Nhật', 'CN'),
        ],
      },
      {
        id: 'sentences4', name: 'Questions', vi: 'Mẫu câu hỏi', icon: '❓', phrases: true,
        items: [
          w("What's your name?", 'Bạn tên là gì?', '📛'), w('How old are you?', 'Bạn bao nhiêu tuổi?', '🎂'),
          w('Where are you from?', 'Bạn đến từ đâu?', '🌏'), w('What day is it today?', 'Hôm nay là thứ mấy?', '📅'),
          w('What time is it?', 'Bây giờ là mấy giờ?', '🕒'), w('Can you swim?', 'Bạn có biết bơi không?', '🏊'),
          w("What's the weather like?", 'Thời tiết thế nào?', '🌦️'), w('Where is the library?', 'Thư viện ở đâu?', '📚'),
        ],
      },
    ],
    5: [
      {
        id: 'transport', name: 'Transport', vi: 'Phương tiện giao thông', icon: '🚌',
        items: [
          w('car', 'ô tô', '🚗'), w('bus', 'xe buýt', '🚌'), w('train', 'tàu hoả', '🚆'), w('plane', 'máy bay', '✈️'),
          w('ship', 'tàu thuỷ', '🚢'), w('boat', 'thuyền buồm', '⛵'), w('bicycle', 'xe đạp', '🚲'), w('motorbike', 'xe máy', '🏍️'),
          w('taxi', 'tắc-xi', '🚕'), w('helicopter', 'trực thăng', '🚁'), w('truck', 'xe tải', '🚚'), w('rocket', 'tên lửa', '🚀'),
        ],
      },
      {
        id: 'feelings', name: 'Feelings', vi: 'Cảm xúc', icon: '😀',
        items: [
          w('happy', 'vui vẻ', '😀'), w('sad', 'buồn', '😢'), w('angry', 'tức giận', '😠'), w('tired', 'mệt', '😫'),
          w('scared', 'sợ hãi', '😨'), w('surprised', 'ngạc nhiên', '😮'), w('sleepy', 'buồn ngủ', '🥱'), w('sick', 'bị ốm', '🤒'),
          w('excited', 'háo hức', '🤩'), w('shy', 'xấu hổ', '😳'),
        ],
      },
      {
        id: 'wild', name: 'Wild animals', vi: 'Động vật hoang dã', icon: '🦒',
        items: [
          w('bear', 'con gấu', '🐻'), w('giraffe', 'hươu cao cổ', '🦒'), w('zebra', 'ngựa vằn', '🦓'), w('crocodile', 'cá sấu', '🐊'),
          w('kangaroo', 'chuột túi', '🦘'), w('panda', 'gấu trúc', '🐼'), w('penguin', 'chim cánh cụt', '🐧'), w('dolphin', 'cá heo', '🐬'),
          w('whale', 'cá voi', '🐳'), w('snake', 'con rắn', '🐍'), w('owl', 'cú mèo', '🦉'), w('camel', 'lạc đà', '🐫'),
        ],
      },
      {
        id: 'months', name: 'Months', vi: 'Các tháng trong năm', icon: '🗓️',
        items: [
          b('January', 'Tháng Một', '1'), b('February', 'Tháng Hai', '2'), b('March', 'Tháng Ba', '3'), b('April', 'Tháng Tư', '4'),
          b('May', 'Tháng Năm', '5'), b('June', 'Tháng Sáu', '6'), b('July', 'Tháng Bảy', '7'), b('August', 'Tháng Tám', '8'),
          b('September', 'Tháng Chín', '9'), b('October', 'Tháng Mười', '10'), b('November', 'Tháng Mười Một', '11'), b('December', 'Tháng Mười Hai', '12'),
        ],
      },
      {
        id: 'routines', name: 'Daily routines', vi: 'Hoạt động hằng ngày', icon: '⏰',
        items: [
          w('get up', 'thức dậy', '⏰'), w('brush teeth', 'đánh răng', '🪥'), w('have breakfast', 'ăn sáng', '🥣'), w('go to school', 'đi học', '🏫'),
          w('do homework', 'làm bài tập', '📝'), w('watch TV', 'xem ti vi', '📺'), w('take a shower', 'tắm', '🚿'), w('go to bed', 'đi ngủ', '🛏️'),
          w('play games', 'chơi trò chơi', '🎮'), w('listen to music', 'nghe nhạc', '🎧'),
        ],
      },
      {
        id: 'sentences5', name: 'Conversations', vi: 'Mẫu câu giao tiếp', icon: '💬', phrases: true,
        items: [
          w("What's your hobby?", 'Sở thích của bạn là gì?', '🎨'), w('How do you go to school?', 'Bạn đến trường bằng gì?', '🚌'),
          w("What's the matter?", 'Bạn bị làm sao vậy?', '🤒'), w('What would you like to eat?', 'Bạn muốn ăn gì?', '🍽️'),
          w('Where did you go last summer?', 'Hè vừa rồi bạn đã đi đâu?', '🏖️'), w('What do you want to be?', 'Bạn muốn làm nghề gì?', '🧑‍🚀'),
          w("What's your favourite food?", 'Món ăn yêu thích của bạn là gì?', '🍕'), w("Let's play football!", 'Chúng mình cùng chơi bóng đá nhé!', '⚽'),
        ],
      },
    ],
  };
})();
