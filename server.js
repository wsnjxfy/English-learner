const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// 静态资源
app.use(express.static(path.join(__dirname, 'public')));

// 公开 chapters 文件夹
app.use('/chapters', express.static(path.join(__dirname, 'chapters')));

// API：获取章节列表
app.get('/api/chapters', (req, res) => {
  const chapterDir = path.join(__dirname, 'chapters');

  fs.readdir(chapterDir, (err, files) => {
    if (err) return res.status(500).json({ error: '无法读取章节文件' });

    const chapters = files
      .filter(f => f.endsWith('.json'))
      .map(f => ({
        name: f.replace('.json', ''),
        file: '/chapters/' + encodeURIComponent(f)
      }));

    res.json(chapters);
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
