/* Soaked one-time codes over email.
 *
 * POST /api/code  { email }          -> emails a code
 * POST /api/code  { email, code }    -> { ok: true|false }
 *
 * Sends through Gmail SMTP using an App Password, so mail genuinely arrives
 * from the Gmail account you configure (e.g. soaked@gmail.com).
 *
 * The code is generated here, stored in Redis, and never returned to the
 * browser. Credentials come from environment variables — never from code.
 */

import nodemailer from 'nodemailer';
import { Redis } from '@upstash/redis';
import crypto from 'node:crypto';

const redis = Redis.fromEnv();

// Gmail SMTP. App Password required — 2-Step Verification must be on for the
// account, and the plain account password will not work here.
const mailer = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: (process.env.GMAIL_APP_PASSWORD || '').replace(/\s/g, '')
  }
});

const TTL_SECONDS = 600;      // code good for 10 minutes
const COOLDOWN_SECONDS = 30;  // min gap between sends to one address
const MAX_ATTEMPTS = 5;       // wrong guesses before the code is burned
const MAX_SENDS_PER_IP_HOUR = 10;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const key = (email) => `otp:${email}`;
const ipKey = (ip) => `ip:${ip}:${new Date().getUTCHours()}`;

function sixDigits() {
  // Rejection-sampled so every code is equally likely.
  let n;
  do { n = crypto.randomBytes(4).readUInt32BE(0); } while (n >= 4294000000);
  return String(n % 1000000).padStart(6, '0');
}

// Constant-time compare so response timing can't leak the code.
function same(a, b) {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

function body(code) {
  return {
    subject: `${code} is your Soaked code`,
    text:
`${code}

That's your Soaked verification code. It expires in 10 minutes.

If you didn't ask for this, you can ignore this email — nobody can use the
code without it.`,
    html:
`<div style="font-family:system-ui,-apple-system,sans-serif;max-width:420px;margin:0 auto;padding:28px 24px;color:#16256B">
  <div style="font:700 20px/1 Georgia,serif;letter-spacing:.04em;color:#16256B">SOAKED</div>
  <p style="font-size:14px;line-height:1.5;color:#4a5578;margin:22px 0 8px">
    Your verification code:
  </p>
  <div style="font:700 38px/1 Georgia,serif;letter-spacing:.2em;background:#F1ECDD;border-radius:12px;padding:18px 20px;text-align:center;color:#16256B">
    ${code}
  </div>
  <p style="font-size:13px;line-height:1.5;color:#6b7699;margin:18px 0 0">
    Expires in 10 minutes. If you didn't ask for this, ignore this email.
  </p>
  <p style="font-size:11px;line-height:1.5;color:#9aa3bd;margin:22px 0 0">
    Soaked is a player-run game and is not affiliated with any school.
  </p>
</div>`
  };
}

export default async function handler(req, res) {
  const origin = process.env.ALLOWED_ORIGIN || '';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'method' });

  const { email, code } = req.body || {};
  const addr = String(email || '').trim().toLowerCase();
  if (!EMAIL_RE.test(addr)) {
    return res.status(400).json({ ok: false, error: 'bad_email' });
  }

  /* ---- verify ---------------------------------------------------------- */
  if (code !== undefined) {
    if (!/^\d{6}$/.test(code)) return res.json({ ok: false });

    const rec = await redis.get(key(addr));
    if (!rec) return res.json({ ok: false, error: 'expired' });
    if (rec.attempts >= MAX_ATTEMPTS) return res.json({ ok: false, error: 'locked' });

    if (!same(rec.code, code)) {
      rec.attempts++;
      const ttl = await redis.ttl(key(addr));
      await redis.set(key(addr), rec, { ex: Math.max(ttl, 1) });
      return res.json({ ok: false, remaining: MAX_ATTEMPTS - rec.attempts });
    }

    await redis.del(key(addr));   // burn on success
    return res.json({ ok: true });
  }

  /* ---- send ------------------------------------------------------------ */
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  const sends = await redis.incr(ipKey(ip));
  if (sends === 1) await redis.expire(ipKey(ip), 3600);
  if (sends > MAX_SENDS_PER_IP_HOUR) {
    return res.status(429).json({ ok: false, error: 'rate_limited' });
  }

  const existing = await redis.get(key(addr));
  if (existing && Date.now() - existing.sentAt < COOLDOWN_SECONDS * 1000) {
    return res.status(429).json({ ok: false, error: 'cooldown' });
  }

  const fresh = sixDigits();
  await redis.set(
    key(addr),
    { code: fresh, sentAt: Date.now(), attempts: 0 },
    { ex: TTL_SECONDS }
  );

  const mail = body(fresh);
  try {
    await mailer.sendMail({
      from: `"${process.env.MAIL_FROM_NAME || 'Soaked'}" <${process.env.GMAIL_USER}>`,
      to: addr,
      subject: mail.subject,
      text: mail.text,
      html: mail.html
    });
  } catch (err) {
    await redis.del(key(addr));
    console.error('gmail send failed', err.message);
    return res.status(502).json({ ok: false, error: 'send_failed' });
  }

  // Deliberately no code in the response.
  return res.json({ ok: true });
}
