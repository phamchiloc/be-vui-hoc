/* Đoạn văn cho bài "Chép đoạn văn" (Tập viết) theo lớp.
   Mỗi bài: { title, img, text }. Xuống dòng trong text bằng \n (dùng cho thơ, ca dao).
   Dấu thanh đặt theo kiểu cũ (hòa, thủy) giống bộ gõ có sẵn; khi chấm điểm, "hoà" và "hòa" được coi là như nhau. */
const DOANVAN_DATA = {
  1: [
    { title: 'Bé và mèo', img: '🐱', text: 'Nhà bé có con mèo. Mèo có bộ lông mềm. Bé rất yêu mèo.' },
    { title: 'Đi học', img: '🎒', text: 'Sáng nay bé đi học. Mẹ đưa bé đến trường. Cô giáo cười chào bé.' },
    { title: 'Vườn hoa', img: '🌸', text: 'Vườn nhà bà có nhiều hoa. Hoa hồng nở đỏ thắm. Bé ra vườn tưới hoa.' },
    { title: 'Bữa cơm', img: '🍚', text: 'Cả nhà ngồi ăn cơm. Bố gắp cá cho bé. Bé mời ông bà ăn cơm.' },
  ],
  2: [
    { title: 'Chú gà trống', img: '🐓', text: 'Chú gà trống nhà em có bộ lông óng mượt. Mỗi sáng, chú gáy vang để gọi cả nhà thức dậy. Em rất quý chú gà trống.' },
    { title: 'Ngày chủ nhật', img: '🎡', text: 'Chủ nhật, bố mẹ đưa em đi công viên. Em được chơi cầu trượt và ăn kem. Cả nhà ai cũng vui vẻ.' },
    { title: 'Cây bàng', img: '🌳', text: 'Giữa sân trường có một cây bàng to. Mùa hè, lá bàng xanh mát che nắng cho chúng em. Giờ ra chơi, chúng em thích ngồi dưới gốc cây.' },
  ],
  3: [
    { title: 'Mùa thu', img: '🍂', text: 'Mùa thu đến, bầu trời cao và trong xanh. Những cơn gió nhẹ thổi qua làm lá vàng rơi xào xạc. Em thích nhất là đêm Trung thu được rước đèn cùng các bạn.' },
    { title: 'Con trâu', img: '🐃', text: 'Con trâu là người bạn thân thiết của nhà nông. Trâu chăm chỉ kéo cày trên những thửa ruộng. Buổi chiều, các bạn nhỏ ngồi trên lưng trâu thổi sáo.' },
    { title: 'Bà em', img: '👵', text: 'Bà em năm nay đã ngoài bảy mươi tuổi. Tóc bà bạc trắng như mây. Mỗi tối, bà thường kể chuyện cổ tích cho em nghe.' },
  ],
  4: [
    { title: 'Quê hương', img: '🏞️', text: 'Quê hương em có dòng sông hiền hòa chảy quanh làng. Hai bên bờ là những bãi ngô xanh mướt. Chiều chiều, lũ trẻ chúng em lại ra đê thả diều. Những cánh diều bay cao, mang theo bao ước mơ của tuổi thơ.' },
    { title: 'Cơn mưa rào', img: '🌧️', text: 'Trời đang nắng bỗng tối sầm lại. Gió thổi mạnh, mây đen kéo đến. Rồi mưa rào rào trút xuống mái nhà. Chỉ một lúc sau, mưa tạnh, cây cối được tắm mát nên xanh tươi hơn.' },
    { title: 'Chiếc bút mực', img: '✒️', text: 'Em có một chiếc bút mực màu xanh. Đây là món quà bố tặng em nhân dịp năm học mới. Mỗi khi viết bài, em luôn nắn nót để chữ viết thật đẹp.' },
  ],
  5: [
    { title: 'Công cha nghĩa mẹ (ca dao)', img: '👨‍👩‍👧', text: 'Công cha như núi Thái Sơn,\nNghĩa mẹ như nước trong nguồn chảy ra.\nMột lòng thờ mẹ kính cha,\nCho tròn chữ hiếu mới là đạo con.' },
    { title: 'Cánh đồng lúa', img: '🌾', text: 'Cánh đồng lúa quê em trải dài tít tắp. Mùa lúa chín, cả cánh đồng như một tấm thảm vàng khổng lồ. Gió thổi qua, những bông lúa nặng hạt cúi đầu như đang chào đón người nông dân. Mùi lúa mới thơm ngọt lan khắp xóm làng.' },
    { title: 'Biển buổi sáng', img: '🌅', text: 'Buổi sáng, mặt trời từ từ nhô lên khỏi mặt biển. Những tia nắng đầu tiên nhuộm hồng cả một vùng trời. Sóng biển vỗ nhẹ vào bờ cát trắng. Xa xa, những chiếc thuyền đánh cá đang trở về sau một đêm ra khơi.' },
  ],
};
