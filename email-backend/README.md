# Soaked email backend

Emails the one-time codes the app already generates, **from a Gmail address**
like `soaked@gmail.com`. Deploy this, set one line in the app, and
"EMAIL ME A CODE" sends a real email.

**This cannot live in the main repo.** That repo is public (GitHub Pages needs
it to be, on a free plan), and a mail credential in a public repo gets scraped
and abused within minutes.

## Why email and not SMS

| | Email (this) | SMS |
|---|---|---|
| Cost | **Free** | ~$1.15/mo + $0.008/text |
| Carrier registration | none | A2P 10DLC, ~$19 + days of approval |
| Blocked if unregistered | no | yes, silently |
| Daily limit | ~500 (Gmail) | unlimited |

## What you need

1. **A Gmail account** — make `soaked@gmail.com` (or whatever you want as the
   sender) if it doesn't exist.
2. **2-Step Verification ON** for that account. Required before Google will
   issue an App Password.
3. **An App Password** from <https://myaccount.google.com/apppasswords> —
   16 characters. This is *not* the account password, and it only works for
   SMTP. Revoke it any time without changing the account password.
4. **Upstash Redis** free tier — codes must survive between serverless calls.
5. **Vercel** free tier — runs the function.

All free.

## Deploy

```bash
cd email-backend
npx vercel
```

Then in Vercel → Settings → Environment Variables, add the six values from
`.env.example`. Real values go **only** there — never in a file.

## Point the app at it

In `app/src/otp.js`:

```js
otp.endpoint = 'https://your-project.vercel.app/api/code';
```

Then `cd app && ./build.sh`, commit, push. The app switches automatically: it
stops generating codes locally, hides the prototype banner, and asks the server
to verify — because from then on only the server knows the code.

## What the email looks like

Subject: **`482913 is your Soaked code`**

Body: the SOAKED wordmark, the code large on a cream panel, "Expires in 10
minutes", and a line noting the game isn't affiliated with any school. Plain
text version included for clients that block HTML.

## What's already handled

- Code generated server-side with `crypto.randomBytes`, never sent to the browser
- 10-minute expiry, enforced by a Redis TTL
- 30-second resend cooldown per address
- 5 wrong attempts burns the code
- 10 sends per IP per hour, so nobody can spam your Gmail quota
- Constant-time comparison, so response timing can't leak the code
- CORS locked to one origin

## Gotchas

- **Gmail's limit is roughly 500 messages/day.** Fine for a school-sized game;
  if you outgrow it, switch the transport to Resend or Postmark with your own
  domain — only the `mailer` block changes.
- **Codes may land in spam** at first, since gmail.com addresses sending
  automated mail have no domain reputation of their own. Sending from your own
  verified domain fixes this properly.
- **Don't reuse a personal Gmail** you care about. Use a dedicated account.

## Before real people use it

The app is for 8th graders through seniors. Collecting minors' email addresses
puts you in COPPA / parental-consent territory depending on age and what you
retain. Worth a lawyer's read before launch, not after.
