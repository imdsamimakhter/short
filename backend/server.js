const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const shortid = require('shortid');
const cors = require('cors');
const path = require('path');
const request = require('request');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
  host: 'sql.freedb.tech',
  user: 'freedb_servuser',
  password: 'r5gzxFf#VS6c6TA',
  database: 'freedb_servdb'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1);
  }
  console.log('MySQL connected...');
});

// Proxy endpoint to fetch and stream file from source URL
app.get('/download', (req, res) => {
  const { token } = req.query;
  const sql = 'SELECT source_url FROM links WHERE short_url = ?';
  db.query(sql, [token], (err, result) => {
    if (err) {
      console.error('Error fetching from MySQL:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: 'URL not found' });
    }

    const sourceUrl = result[0].source_url;
    const fileName = path.basename(new URL(sourceUrl).pathname); // Extract filename from URL

    // Send request to source URL and stream response back to client
    request.get(sourceUrl)
      .on('response', function(response) {
        // Set content disposition header to force download with original filename
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
      })
      .pipe(res)
      .on('error', function(err) {
        console.error('Error fetching the file:', err);
        res.status(500).send('Error fetching the file.');
      });
  });
});

// URL shortening endpoint
app.post('/api/shorten', (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  const token = shortid.generate();
  const sql = 'INSERT INTO links (source_url, short_url) VALUES (?, ?)';
  db.query(sql, [url, token], (err, result) => {
    if (err) {
      console.error('Error inserting into MySQL:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    const fullShortUrl = `http://localhost:5000/download?token=${token}`;
    res.json({ shortUrl: fullShortUrl });
  });
});

// Other endpoints...

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
