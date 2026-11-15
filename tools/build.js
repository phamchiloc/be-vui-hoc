/* Gộp CSS và JS vào một file index.html duy nhất để đưa lên GitHub Pages.
   GitHub Pages cho trình duyệt lưu đệm từng file 10 phút, nên nếu để nhiều file riêng,
   sau mỗi lần cập nhật trình duyệt có thể trộn file cũ với file mới và trang bị lỗi.
   Cách chạy: node tools/build.js   → tạo _site/index.html */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const out = path.join(root, '_site');
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

let html = read('index.html');
let count = 0;

html = html.replace(/<link rel="stylesheet" href="(css\/[^"]+)">/g, (_, file) => {
  count++;
  return `<style>\n${read(file)}\n</style>`;
});
html = html.replace(/<script src="(js\/[^"]+)"><\/script>/g, (_, file) => {
  count++;
  return `<script>\n${read(file).replace(/<\/script/gi, '<\\/script')}\n</script>`;
});
if (/(src|href)="(js|css)\//.test(html)) throw new Error('Còn file CSS/JS chưa được gộp vào index.html');

fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'index.html'), html);
console.log(`Đã gộp ${count} file vào _site/index.html (${Math.round(html.length / 1024)} KB)`);
