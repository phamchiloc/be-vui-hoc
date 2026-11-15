/* Dữ liệu Tập viết theo lớp.
   Mỗi bài: { id, name, icon, desc, items }.
   Mỗi mục: t = chữ cần viết, img = hình minh hoạ, w = từ gợi ý (chữ t được tô đỏ trong từ).
   Mục chữ số dùng count + e: vẽ count hình e thay cho img. */
const TV_DATA = (() => {
  const L = (t, img, w) => ({ t, img, w });
  const S = (t, img) => ({ t, img });
  const NUM_WORDS = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];

  return {
    1: [
      {
        id: 'chucai', name: 'Chữ cái', icon: '🔤', desc: 'Tô 29 chữ cái tiếng Việt',
        items: [
          L('a', '🌸', 'hoa'), L('ă', '🌙', 'trăng'), L('â', '🌳', 'cây'), L('b', '🐄', 'bò'),
          L('c', '🐟', 'cá'), L('d', '🐐', 'dê'), L('đ', '💡', 'đèn'), L('e', '🚲', 'xe'),
          L('ê', '🐸', 'ếch'), L('g', '🐔', 'gà'), L('h', '🐯', 'hổ'), L('i', '🐦', 'chim'),
          L('k', '✂️', 'kéo'), L('l', '🍃', 'lá'), L('m', '🐱', 'mèo'), L('n', '🍄', 'nấm'),
          L('o', '🐝', 'ong'), L('ô', '☂️', 'ô'), L('ơ', '🥑', 'bơ'), L('p', '🔋', 'pin'),
          L('q', '🎁', 'quà'), L('r', '🐢', 'rùa'), L('s', '⭐', 'sao'), L('t', '🍎', 'táo'),
          L('u', '🥬', 'rau'), L('ư', '🦁', 'sư tử'), L('v', '🐘', 'voi'), L('x', '🥭', 'xoài'),
          L('y', '👩‍⚕️', 'y tá'),
        ],
      },
      {
        id: 'chuso', name: 'Chữ số', icon: '🔢', desc: 'Tô các chữ số từ 0 đến 9',
        items: NUM_WORDS.map((w, i) => ({ t: String(i), w, count: i, e: '🍎' })),
      },
      {
        id: 'tieng', name: 'Tiếng và từ', icon: '🏠', desc: 'Những tiếng đầu tiên bé học',
        items: [
          S('bé', '👶'), S('bà', '👵'), S('mẹ', '👩'), S('bố', '👨'), S('cô', '👩‍🏫'), S('nhà', '🏠'),
          S('mưa', '🌧️'), S('gió', '🌬️'), S('sữa', '🥛'), S('bút', '✏️'), S('vở', '📒'), S('trường', '🏫'),
        ],
      },
    ],
    2: [
      {
        id: 'chuhoa', name: 'Chữ hoa', icon: '🅰️', desc: 'Tô 29 chữ cái viết hoa',
        items: [
          L('A', '👕', 'Áo'), L('Ă', '🍚', 'Ăn'), L('Â', '🫖', 'Ấm'), L('B', '⚽', 'Bóng'),
          L('C', '🍊', 'Cam'), L('D', '🥥', 'Dừa'), L('Đ', '🎸', 'Đàn'), L('E', '👶', 'Em bé'),
          L('Ê', '🐸', 'Ếch'), L('G', '🐻', 'Gấu'), L('H', '🌸', 'Hoa'), L('I', '🤫', 'Im lặng'),
          L('K', '🍦', 'Kem'), L('L', '🍃', 'Lá'), L('M', '🐱', 'Mèo'), L('N', '🍇', 'Nho'),
          L('O', '🐝', 'Ong'), L('Ô', '🚗', 'Ô tô'), L('Ơ', '🌶️', 'Ớt'), L('P', '🍜', 'Phở'),
          L('Q', '🎁', 'Quà'), L('R', '🐢', 'Rùa'), L('S', '📖', 'Sách'), L('T', '🍎', 'Táo'),
          L('U', '👢', 'Ủng'), L('Ư', '🌠', 'Ước mơ'), L('V', '🐘', 'Voi'), L('X', '🚲', 'Xe đạp'),
          L('Y', '❤️', 'Yêu thương'),
        ],
      },
      {
        id: 'tungu', name: 'Từ ngữ', icon: '📝', desc: 'Viết các từ quen thuộc',
        items: [
          S('bạn bè', '👫'), S('trường học', '🏫'), S('cô giáo', '👩‍🏫'), S('gia đình', '👨‍👩‍👧'),
          S('học bài', '📚'), S('vui chơi', '🎈'), S('cầu vồng', '🌈'), S('mặt trời', '☀️'),
          S('quê hương', '🏡'), S('ông bà', '👴👵'),
        ],
      },
      {
        id: 'caungan', name: 'Câu ngắn', icon: '💬', desc: 'Viết câu ngắn có chữ hoa đầu câu',
        items: [
          S('Anh em thuận hòa.', '👬'), S('Bé yêu mẹ.', '🥰'), S('Em đi học.', '🎒'), S('Mẹ đi chợ.', '🛒'),
          S('Bé chăm học.', '📚'), S('Cả nhà vui vẻ.', '😊'), S('Em tưới cây.', '🌱'), S('Gà gáy ò ó o.', '🐓'),
        ],
      },
    ],
    3: [
      {
        id: 'tenrieng', name: 'Tên riêng', icon: '🗺️', desc: 'Viết hoa tên địa danh Việt Nam',
        items: [
          S('Việt Nam', '⭐'), S('Hà Nội', '🏙️'), S('Huế', '🏯'), S('Hạ Long', '🏝️'), S('Sa Pa', '🏔️'),
          S('Đà Lạt', '🌲'), S('Hội An', '🏮'), S('Cần Thơ', '🛶'), S('Sông Hồng', '🌊'), S('Phú Quốc', '🏖️'),
        ],
      },
      {
        id: 'tucngu3', name: 'Câu ứng dụng', icon: '📜', desc: 'Ca dao, tục ngữ ngắn',
        items: [
          S('Anh em như thể tay chân.', '🤝'), S('Có công mài sắt, có ngày nên kim.', '🪡'),
          S('Đi một ngày đàng, học một sàng khôn.', '🎒'), S('Tiên học lễ, hậu học văn.', '🙇'),
          S('Lá lành đùm lá rách.', '🍃'), S('Một con ngựa đau, cả tàu bỏ cỏ.', '🐴'),
          S('Muốn biết phải hỏi, muốn giỏi phải học.', '📚'), S('Chim có tổ, người có tông.', '🐦'),
        ],
      },
    ],
    4: [
      {
        id: 'tucngu4', name: 'Thành ngữ, tục ngữ', icon: '📜', desc: 'Những câu tục ngữ hay',
        items: [
          S('Ăn quả nhớ kẻ trồng cây.', '🌳'), S('Uống nước nhớ nguồn.', '💧'),
          S('Một cây làm chẳng nên non.', '🌲'), S('Gần mực thì đen, gần đèn thì sáng.', '💡'),
          S('Học thầy không tày học bạn.', '👫'), S('Tốt gỗ hơn tốt nước sơn.', '🪵'),
          S('Thương người như thể thương thân.', '❤️'), S('Có chí thì nên.', '💪'),
          S('Kiến tha lâu cũng đầy tổ.', '🐜'), S('Nước chảy đá mòn.', '🪨'),
        ],
      },
      {
        id: 'cauvan', name: 'Câu văn tả cảnh', icon: '🌅', desc: 'Câu văn đẹp về thiên nhiên',
        items: [
          S('Mùa xuân, cây cối đâm chồi nảy lộc.', '🌱'), S('Cánh đồng lúa chín vàng óng.', '🌾'),
          S('Mặt trời đỏ rực trên biển.', '🌅'), S('Ve kêu râm ran báo hè về.', '🌞'),
          S('Hoa phượng nở đỏ sân trường.', '🌺'), S('Trăng rằm tròn như chiếc đĩa.', '🌕'),
          S('Chú mèo nằm sưởi nắng bên hiên.', '🐈'), S('Bầu trời trong xanh, mây trắng.', '☁️'),
        ],
      },
    ],
    5: [
      {
        id: 'cadao', name: 'Ca dao', icon: '🎋', desc: 'Viết từng dòng ca dao',
        items: [
          S('Công cha như núi Thái Sơn,', '👨‍👩‍👧'), S('Nghĩa mẹ như nước trong nguồn chảy ra.', '👨‍👩‍👧'),
          S('Một lòng thờ mẹ kính cha,', '👨‍👩‍👧'), S('Cho tròn chữ hiếu mới là đạo con.', '👨‍👩‍👧'),
          S('Trong đầm gì đẹp bằng sen,', '🌸'), S('Lá xanh bông trắng lại chen nhị vàng.', '🌸'),
          S('Nhị vàng bông trắng lá xanh,', '🌸'), S('Gần bùn mà chẳng hôi tanh mùi bùn.', '🌸'),
          S('Bầu ơi thương lấy bí cùng,', '🎃'), S('Tuy rằng khác giống nhưng chung một giàn.', '🎃'),
          S('Cày đồng đang buổi ban trưa,', '🌾'), S('Mồ hôi thánh thót như mưa ruộng cày.', '🌾'),
          S('Ai ơi bưng bát cơm đầy,', '🍚'), S('Dẻo thơm một hạt, đắng cay muôn phần.', '🍚'),
        ],
      },
      {
        id: 'doanvan', name: 'Câu văn hay', icon: '✒️', desc: 'Luyện viết câu dài, đều nét',
        items: [
          S('Quê hương em có dòng sông xanh mát.', '🏞️'), S('Em yêu những buổi chiều thả diều.', '🪁'),
          S('Tiếng trống trường rộn ràng ngày khai giảng.', '🥁'), S('Bà kể chuyện cổ tích bên ánh đèn.', '👵'),
          S('Hàng tre xanh rì rào trong gió.', '🎋'), S('Biển xanh, cát trắng, nắng vàng.', '🏖️'),
        ],
      },
    ],
  };
})();
