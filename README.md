# Bé Vui Học

Chương trình học có hình minh hoạ cho học sinh lớp 1–5, gồm ba môn: Tập viết, Toán và Tiếng Anh. Chạy trong trình duyệt, không cần cài đặt. Tập viết cần bàn phím; Toán và Tiếng Anh dùng được bằng chuột hoặc chạm màn hình.

## Chạy chương trình

Nháy đúp file `index.html` để mở bằng trình duyệt.

Nên dùng **Microsoft Edge**: Edge có sẵn giọng đọc tiếng Việt và tiếng Anh tự nhiên. Trình duyệt khác vẫn chạy được, nhưng có thể không có giọng đọc tiếng Việt (chương trình sẽ hiện thông báo khi thiếu).

Không cần mạng. Khi có mạng, phông chữ Nunito được tải từ Google Fonts. Khi không có mạng, chương trình dùng phông Segoe UI có sẵn của Windows.

Bản trên mạng: https://phamchiloc.github.io/be-vui-hoc/ (tự cập nhật mỗi lần push lên nhánh `main`).

## Nội dung

| Lớp | Tập viết | Toán | Tiếng Anh |
|-----|----------|------|-----------|
| 1 | 4 đoạn văn ngắn (2–3 câu) | Đếm hình, cộng/trừ phạm vi 10, so sánh số, cộng/trừ phạm vi 100, nhận biết hình | Alphabet, Numbers, Colors, Animals, Fruits |
| 2 | 3 đoạn văn (3 câu) | Cộng/trừ có nhớ, bảng nhân/chia 2 và 5, xem đồng hồ, trăm – chục – đơn vị | Family, My body, Toys, Food and drinks |
| 3 | 3 đoạn văn (3 câu) | Bảng nhân/chia 2–9, nhân/chia số có một chữ số, chu vi và diện tích, đồng hồ đến từng phút, tìm số chưa biết, một phần mấy | School things, Clothes, Weather, Actions, Greetings |
| 4 | 3 đoạn văn (3–4 câu) | Số có nhiều chữ số, nhân/chia với số có hai chữ số, phân số, so sánh phân số, trung bình cộng, cộng/trừ phân số | Jobs, Places, Sports and hobbies, Days of the week, Questions |
| 5 | 1 bài ca dao, 2 đoạn văn (4 câu) | Số thập phân, tỉ số phần trăm, diện tích hình, đổi đơn vị đo, toán chuyển động | Transport, Feelings, Wild animals, Months, Daily routines, Conversations |

## Cách học từng môn

**Tập viết.** Bé đọc đoạn văn rồi gõ lại bằng bàn phím vào ô bên dưới. Bấm môn Tập viết là vào thẳng bài đầu tiên, các bài sau chọn ở cuối trang.

- Chương trình có sẵn bộ gõ Telex, máy không cần cài Unikey hay EVKey. Máy đã bật Unikey/EVKey thì tắt mục **Bộ gõ Telex có sẵn**.
- Ô **Từ cần gõ** chỉ từng phím phải bấm cho từ đang gõ, kể cả dấu. Ví dụ **tiếng** = `t i e e n g s`, **Người** = `Shift+N g u w o w i f`.
- Bảng **Hướng dẫn gõ dấu** liệt kê cách gõ ă â ê ô ơ ư đ và 5 dấu thanh, mỗi dấu có hình ví dụ.
- Trên đoạn văn: từ gõ đúng hiện màu xanh, từ sai hiện màu đỏ, từ đang gõ có khung vàng (chuyển đỏ khi gõ lệch).
- Gõ xong từ cuối thì tự chấm điểm, hoặc bấm **Nộp bài**. Đúng từ 95% số từ được 3 sao, từ 80% được 2 sao, từ 60% được 1 sao. Vị trí đặt dấu không ảnh hưởng điểm (`hoà` và `hòa` đều đúng). Chữ hoa và dấu câu phải gõ đúng.
- Ô gõ không cho dán chữ, để bé tự gõ.

**Toán.** Mỗi lượt có 10 câu trắc nghiệm, câu hỏi sinh ngẫu nhiên nên mỗi lần làm là một đề mới. Đúng 9–10 câu được 3 sao, 7–8 câu được 2 sao, 5–6 câu được 1 sao. Nút 🔊 đọc đề bằng tiếng Việt.

**Tiếng Anh.** Mỗi chủ đề có 4 trò:

- **Học từ**: thẻ có hình, từ, nghĩa và giọng đọc. Phím ← → để chuyển thẻ, phím cách để nghe lại. Xem hết các thẻ được 3 sao.
- **Nghe và chọn**: nghe từ rồi chọn hình đúng.
- **Nhìn và chọn**: nhìn hình rồi chọn từ đúng.
- **Ghép chữ**: bấm (hoặc gõ phím) các chữ cái theo đúng thứ tự. Từ lớp 3 có thêm 2 chữ cái gây nhiễu. Sai 2 lần thì chương trình tự gợi ý.

Với chủ đề mẫu câu (Greetings, Questions, Conversations), trò chọn đáp án hỏi nghĩa tiếng Việt và không có Ghép chữ.

## Tiến độ

Số sao được lưu trong trình duyệt (`localStorage`). Mỗi trình duyệt, mỗi máy lưu riêng. Xoá dữ liệu duyệt web sẽ mất số sao.

## Thêm nội dung

Nội dung nằm trong các file dữ liệu, sửa bằng trình soạn thảo bất kỳ rồi tải lại trang.

Thêm một từ vào chủ đề Animals lớp 1, trong `js/data/tienganh-data.js`:

```js
w('elephant', 'con voi', '🐘'), w('monkey', 'con khỉ', '🐒'),
w('sheep', 'con cừu', '🐑'),   // dòng mới: từ tiếng Anh, nghĩa, hình
```

Thêm một đoạn văn cho lớp 2, trong `js/data/doanvan-data.js`:

```js
{ title: 'Con mèo', img: '🐱', text: 'Nhà em có con mèo mướp. Mèo rất thích nằm sưởi nắng.' },
```

Viết dấu thanh theo kiểu cũ (`hòa`, `thủy`) cho giống bộ gõ có sẵn. Ca dao, thơ thì xuống dòng bằng `\n`.

Trong một chủ đề Tiếng Anh, mỗi từ cần một hình khác nhau, vì trò Nghe và chọn dùng hình làm đáp án. Dạng bài Toán được sinh bằng code trong `js/toan.js`. Mỗi dạng là một object có hàm `gen()` trả về câu hỏi.

## Cấu trúc thư mục

```text
index.html               Trang chính
css/style.css            Giao diện
js/util.js               Tiện ích: lưu sao, âm thanh, giọng đọc, pháo giấy
js/quiz.js               Bộ chạy trắc nghiệm dùng chung
js/chepvan.js            Môn Tập viết: bộ gõ Telex, gợi ý phím, chấm điểm
js/toan.js               Môn Toán: sinh câu hỏi và hình minh hoạ
js/tienganh.js           Môn Tiếng Anh: thẻ từ, trắc nghiệm, ghép chữ
js/app.js                Điều hướng giữa các màn hình
js/data/doanvan-data.js  Đoạn văn cho Tập viết
js/data/tienganh-data.js Dữ liệu Tiếng Anh
```

## Xử lý sự cố

- **Không nghe thấy giọng đọc tiếng Việt**: mở chương trình bằng Microsoft Edge.
- **Không có tiếng hiệu ứng (đúng/sai)**: kiểm tra nút 🔊 ở góc trên bên phải. Nút này chỉ bật/tắt tiếng hiệu ứng, không tắt giọng đọc.
- **Một vài hình hiện thành ô vuông**: máy dùng bộ emoji cũ. Cập nhật Windows hoặc dùng trình duyệt mới hơn.
