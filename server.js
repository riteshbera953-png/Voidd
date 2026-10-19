const express = require('express');
const app = express();

// Allow any origin (fixes CORS)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(express.json());

// Main forward endpoint
app.post('/api/forward', (req, res) => {
  const { firebaseUrl, key, time } = req.body;
  console.log('[FORWARD] URL:', firebaseUrl, 'KEY:', key?.slice(0, 15) + '...');

  // (Optional) Save to a file here if you want
  res.json({ ok: true, message: 'Forwarded' });
});

// Wake‑up health check
app.get('/', (req, res) => res.send('Online'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running on port', PORT));
