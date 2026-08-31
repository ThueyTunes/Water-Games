/* Soaked one-time codes: send and verify.
 *
 * POST /api/sms            { phone }         -> texts a code
 * POST /api/sms?do=verify  { phone, code }   -> { ok: true|false }
 *
 * The code is generated here, stored in Redis, and never returned to the
 * browser. Credentials come from environment variables — never from code.
 */

import twilio from 'twilio';
import { Redis } from '@upstash/redis';
import crypto from 'node:crypto';

const redis = Redis.fromEnv();
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

const TTL_SECONDS = 600;      // code good for 10 minutes
const COOLDOWN_SECONDS = 30;  // min gap between sends to one number
const MAX_ATTEMPTS = 5;       // wrong guesses before the code is burned
const MAX_SENDS_PER_IP_HOUR = 10;

const key = (phone) => `otp:${phone}`;
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

export default async function handler(req, res) {
  const origin = process.env.ALLOWED_ORIGIN || '';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'method' });

  const { phone, code } = req.body || {};
  if (!/^\+1\d{10}$/.test(phone || '')) {
    return res.status(400).json({ ok: false, error: 'bad_number' });
  }

  /* ---- verify ---------------------------------------------------------- */
  if (req.query.do === 'verify' || code !== undefined) {
    if (!/^\d{6}$/.test(code || '')) return res.json({ ok: false });

    const rec = await redis.get(key(phone));
    if (!rec) return res.json({ ok: false, error: 'expired' });
    if (rec.attempts >= MAX_ATTEMPTS) return res.json({ ok: false, error: 'locked' });

    if (!same(rec.code, code)) {
      rec.attempts++;
      const ttl = await redis.ttl(key(phone));
      await redis.set(key(phone), rec, { ex: Math.max(ttl, 1) });
      return res.json({ ok: false, remaining: MAX_ATTEMPTS - rec.attempts });
    }

    await redis.del(key(phone));   // burn on success
    return res.json({ ok: true });
  }

  /* ---- send ------------------------------------------------------------ */
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  const sends = await redis.incr(ipKey(ip));
  if (sends === 1) await redis.expire(ipKey(ip), 3600);
  if (sends > MAX_SENDS_PER_IP_HOUR) {
    return res.status(429).json({ ok: false, error: 'rate_limited' });
  }

  const existing = await redis.get(key(phone));
  if (existing && Date.now() - existing.sentAt < COOLDOWN_SECONDS * 1000) {
    return res.status(429).json({ ok: false, error: 'cooldown' });
  }

  const fresh = sixDigits();
  await redis.set(
    key(phone),
    { code: fresh, sentAt: Date.now(), attempts: 0 },
    { ex: TTL_SECONDS }
  );

  try {
    await client.messages.create({
      to: phone,
      from: process.env.TWILIO_FROM,
      body: `${fresh} is your Soaked code. Expires in 10 minutes.`
    });
  } catch (err) {
    await redis.del(key(phone));
    console.error('twilio send failed', err.code, err.message);
    return res.status(502).json({ ok: false, error: 'send_failed' });
  }

  // Deliberately no code in the response.
  return res.json({ ok: true });
}
