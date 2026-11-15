# Bé Vui Học

Chương trình học có hình minh hoạ cho học sinh lớp 1–5, gồm ba môn: Tập viết, Toán và Tiếng Anh. Chạy trong trình duyệt, không cần cài đặt, dùng được bằng chuột, ngón tay hoặc bút cảm ứng.

## Chạy chương trình

Nháy đúp file `index.html` để mở bằng trình duyệt.

Nên dùng **Microsoft Edge**: Edge có sẵn giọng đọc tiếng Việt và tiếng Anh tự nhiên. Trình duyệt khác vẫn chạy được, nhưng có thể không có giọng đọc tiếng Việt (chương trình sẽ hiện thông báo khi thiếu).

Không cần mạng. Khi có mạng, phông chữ Nunito, Dancing Script và Mali được tải từ Google Fonts. Khi không có mạng, chương trình dùng phông có sẵn của Windows (Segoe UI, Segoe Script, Segoe Print).

## Nội dung

| Lớp | Tập viết | Toán | Tiếng Anh |
|-----|----------|------|-----------|
| 1 | Chữ cái, chữ số, tiếng và từ | Đếm hình, cộng/trừ phạm vi 10, so sánh số, cộng/trừ phạm vi 100, nhận biết hình | Alphabet, Numbers, Colors, Animals, Fruits |
| 2 | Chữ hoa, từ ngữ, câu ngắn | Cộng/trừ có nhớ, bảng nhân/chia 2 và 5, xem đồng hồ, trăm – chục – đơn vị | Family, My body, Toys, Food and drinks |
| 3 | Tên riêng, câu ứng dụng | Bảng nhân/chia 2–9, nhân/chia số có một chữ số, chu vi và diện tích, đồng hồ đến từng phút, tìm số chưa biết, một phần mấy | School things, Clothes, Weather, Actions, Greetings |
| 4 | Thành ngữ – tục ngữ, câu văn tả cảnh | Số có nhiều chữ số, nhân/chia với số có hai chữ số, phân số, so sánh phân số, trung bình cộng, cộng/trừ phân số | Jobs, Places, Sports and hobbies, Days of the week, Questions |
| 5 | Ca dao, câu văn hay | Số thập phân, tỉ số phần trăm, diện tích hình, đổi đơn vị đo, toán chuyển động | Transport, Feelings, Wild animals, Months, Daily routines, Conversations |

## Cách học từng môn

**Tập viết.** Bé tô theo chữ mờ trên khung kẻ ô li rồi bấm **Chấm điểm**. Điểm dựa trên hai yếu tố: nét chữ mẫu được tô kín đến đâu và nét của bé có nằm sát chữ mẫu không. Tô kín, sát nét được 3 sao; vẽ lung tung ra ngoài được 0–1 sao.

- **Xem mẫu**: chữ hiện dần từ trái sang phải để bé xem cách viết.
- **Hiện chữ mờ**: tắt đi để bé tự viết khi đã quen.
- **Chữ viết / Chữ in**: đổi kiểu chữ mẫu.
- Chữ ngắn được lặp 2–3 lần trên một dòng. Câu dài trên màn hình hẹp tự chia thành 2–3 dòng.

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

Nội dung nằm trong hai file dữ liệu, sửa bằng trình soạn thảo bất kỳ rồi tải lại trang.

Thêm một từ vào chủ đề Animals lớp 1, trong `js/data/tienganh-data.js`:

```js
w('elephant', 'con voi', '🐘'), w('monkey', 'con khỉ', '🐒'),
w('sheep', 'con cừu', '🐑'),   // dòng mới: từ tiếng Anh, nghĩa, hình
```

Thêm một câu vào bài Thành ngữ, tục ngữ lớp 4, trong `js/data/tapviet-data.js`:

```js
S('Nước chảy đá mòn.', '🪨'),
S('Đói cho sạch, rách cho thơm.', '👕'),   // dòng mới: câu cần viết, hình
```

Trong một chủ đề Tiếng Anh, mỗi từ cần một hình khác nhau, vì trò Nghe và chọn dùng hình làm đáp án. Dạng bài Toán được sinh bằng code trong `js/toan.js`. Mỗi dạng là một object có hàm `gen()` trả về câu hỏi.

## Cấu trúc thư mục

```text
index.html               Trang chính
css/style.css            Giao diện
js/util.js               Tiện ích: lưu sao, âm thanh, giọng đọc, pháo giấy
js/quiz.js               Bộ chạy trắc nghiệm dùng chung
js/tapviet.js            Môn Tập viết: khung ô li, vẽ, chấm điểm
js/toan.js               Môn Toán: sinh câu hỏi và hình minh hoạ
js/tienganh.js           Môn Tiếng Anh: thẻ từ, trắc nghiệm, ghép chữ
js/app.js                Điều hướng giữa các màn hình
js/data/tapviet-data.js  Dữ liệu Tập viết
js/data/tienganh-data.js Dữ liệu Tiếng Anh
```

## Xử lý sự cố

- **Không nghe thấy giọng đọc tiếng Việt**: mở chương trình bằng Microsoft Edge.
- **Không có tiếng hiệu ứng (đúng/sai)**: kiểm tra nút 🔊 ở góc trên bên phải. Nút này chỉ bật/tắt tiếng hiệu ứng, không tắt giọng đọc.
- **Một vài hình hiện thành ô vuông**: máy dùng bộ emoji cũ. Cập nhật Windows hoặc dùng trình duyệt mới hơn.
