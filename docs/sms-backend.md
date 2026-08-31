# Sending real texts

The app generates, expires, rate-limits and verifies one-time codes already.
The only missing piece is the carrier hop, and that **cannot** live in this
repo.

## Why there's no SMS today

GitHub Pages serves static files. There is no server, so there is nowhere to
keep an SMS provider's credential. Putting a Twilio auth token in `index.html`
would publish it in a public repo, and anyone could then send texts billed to
you — SMS credentials get scraped from public repos within minutes.

So the send has to happen on a server you control, with the credential in that
server's environment.

## What it costs

| Item | Cost |
|---|---|
| Twilio phone number | ~$1.15/month |
| Outbound SMS (US) | ~$0.0079 each |
| A2P 10DLC brand registration | ~$4 one-time |
| A2P 10DLC campaign | ~$15 one-time + ~$1.50/month |
| Hosting (Vercel/Netlify/Cloudflare free tier) | $0 at this volume |

**A2P 10DLC registration is not optional.** US carriers block unregistered
application-to-person traffic. Approval takes a few days. Skipping it means
your codes silently never arrive.

## The function

Deploy to Vercel as `api/sms.js`. Set `TWILIO_SID`, `TWILIO_TOKEN` and
`TWILIO_FROM` as environment variables in the Vercel dashboard — never in code.

```js
import twilio from 'twilio';

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

// Codes live server-side only. Swap this Map for Redis/KV before real use —
// serverless instances don't share memory, so a Map breaks across cold starts.
const codes = new Map();

const TTL_MS = 10 * 60 * 1000;
const COOLDOWN_MS = 30 * 1000;
const MAX_ATTEMPTS = 5;

export default async function handler(req, res) {
  // Lock this to your own origin. A wildcard lets anyone bill texts to you.
  res.setHeader('Access-Control-Allow-Origin', 'https://thueytunes.github.io');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false });

  const { phone, code } = req.body || {};
  if (!/^\+1\d{10}$/.test(phone || '')) {
    return res.status(400).json({ ok: false, error: 'bad number' });
  }

  // --- verify
  if (code !== undefined) {
    const rec = codes.get(phone);
    if (!rec || Date.now() > rec.expires) return res.json({ ok: false });
    if (rec.attempts >= MAX_ATTEMPTS) return res.json({ ok: false });
    rec.attempts++;
    if (rec.code !== code) return res.json({ ok: false });
    codes.delete(phone);          // burn on success
    return res.json({ ok: true });
  }

  // --- send
  const prev = codes.get(phone);
  if (prev && Date.now() - prev.sentAt < COOLDOWN_MS) {
    return res.status(429).json({ ok: false, error: 'slow down' });
  }

  const fresh = String(Math.floor(Math.random() * 1e6)).padStart(6, '0');
  codes.set(phone, { code: fresh, expires: Date.now() + TTL_MS, sentAt: Date.now(), attempts: 0 });

  await client.messages.create({
    to: phone,
    from: process.env.TWILIO_FROM,
    body: `${fresh} is your Soaked code. Expires in 10 minutes.`
  });

  return res.json({ ok: true });   // never return the code to the client
}
```

## Wiring it up

One line in `app/src/otp.js`:

```js
otp.endpoint = 'https://your-project.vercel.app/api/sms';
```

The client already branches on this. With an endpoint set it stops generating
codes locally, stops showing the prototype banner, and asks the server to
verify instead — because only the server knows the code.

## Before this touches a real person

- **Swap the `Map` for durable storage** (Vercel KV, Upstash, Redis). Serverless
  functions don't share memory; codes will vanish between requests otherwise.
- **Rate-limit by IP as well as by number**, or someone will pay your bill for
  you by looping the endpoint.
- **Keep the CORS origin locked** to your site.
- **The app is for 8th graders through seniors.** Sending SMS to minors puts you
  under COPPA/parental-consent territory depending on age and what you store.
  Worth a lawyer's opinion before launch, not after.
