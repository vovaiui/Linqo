const express = require('express');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

const app = express();
app.use(express.json());

const APP_ID = process.env.AGORA_APP_ID || '481fbc46f3f54a60b9dfd70b6e3f652a';
const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE || '87cb47fca8a34bc8be2e6470888af721';
const TOKEN_EXPIRY_SEC = 3600; // 1 час

app.get('/health', (req, res) => res.json({ ok: true }));

// GET /token?channel=xxx&uid=0
app.get('/token', (req, res) => {
  const { channel, uid } = req.query;

  if (!channel) {
    return res.status(400).json({ error: 'channel is required' });
  }
  if (!APP_ID || !APP_CERTIFICATE) {
    return res.status(500).json({ error: 'Agora credentials not configured' });
  }

  const uidNum = parseInt(uid || '0', 10);
  const expireTs = Math.floor(Date.now() / 1000) + TOKEN_EXPIRY_SEC;

  const token = RtcTokenBuilder.buildTokenWithUid(
    APP_ID,
    APP_CERTIFICATE,
    channel,
    uidNum,
    RtcRole.PUBLISHER,
    expireTs
  );

  return res.json({ token, expireTs });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Token server running on port ${PORT}`));
