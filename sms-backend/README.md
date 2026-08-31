# Soaked SMS backend

Sends and verifies the one-time codes the app already generates. Deploy this,
set one line in the app, and "TEXT ME A CODE" sends a real text.

**This cannot live in the main repo.** That repo is public (GitHub Pages needs
it to be, on a free plan), and an SMS credential in a public repo gets scraped
and abused within minutes.

## What you need first

| Thing | Why | Cost |
|---|---|---|
| Twilio account + phone number | Sends the SMS | ~$1.15/month |
| A2P 10DLC registration | US carriers **block** unregistered app traffic | ~$19 once, then ~$1.50/mo |
| Upstash Redis (free tier) | Codes must survive between serverless calls | $0 |
| Vercel account (free tier) | Runs the function | $0 |

Per text: ~$0.0079.

**Do the A2P registration first.** Approval takes a few days, and without it
your texts are accepted by Twilio and then silently dropped by the carrier.

## Deploy

```bash
cd sms-backend
npx vercel
```

Then in the Vercel dashboard → Settings → Environment Variables, add the five
values from `.env.example`. Real values go **only** there — never in a file.

## Point the app at it

In `app/src/otp.js`:

```js
otp.endpoint = 'https://your-project.vercel.app/api/sms';
```

Then `cd app && ./build.sh`, commit, push. The app switches automatically: it
stops generating codes locally, hides the prototype banner, and asks the server
to verify — because from then on only the server knows the code.

## What's already handled

- Code generated server-side with `crypto.randomBytes`, never sent to the browser
- 10-minute expiry, enforced by a Redis TTL
- 30-second resend cooldown per number
- 5 wrong attempts burns the code
- 10 sends per IP per hour, so nobody can run up your Twilio bill
- Constant-time comparison, so response timing can't leak the code
- CORS locked to one origin

## Before real people use it

The app is for 8th graders through seniors. Texting minors and storing their
numbers puts you in COPPA / parental-consent territory depending on age and
what you retain. Worth a lawyer's read before launch, not after.
