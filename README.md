# Soaked — app screens

Implementation of `Soaked App Mockups.dc.html` from the Claude Design handoff
bundle. All 21 iPhone screens (402×874), in journey order, inside a port of the
`ios-frame.jsx` device frame.

## Run it

Double-click **`index.html`** — a single self-contained file, no server needed.

Or open `app/index.html` for the same app in its unbundled, editable form.

> Fonts (Geist, Geist Mono, Source Serif 4) load from Google Fonts, so the first
> open needs a network connection. Everything else is local.

## Publish it (GitHub Pages)

The root `index.html` is fully self-contained, so it works at any URL — no base
path to configure.

1. Create an empty repo at <https://github.com/new>. Don't add a README,
   `.gitignore` or licence — this folder already has commits.
2. Point this folder at it and push:

```bash
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

3. In the repo: **Settings → Pages**. Under *Build and deployment*, set Source to
   **Deploy from a branch**, branch **main**, folder **/ (root)**. Save.
4. Wait ~1 minute. The site lands at
   `https://YOUR-USERNAME.github.io/YOUR-REPO/`.

To update it later: `cd app && ./build.sh`, then commit and push.

**Live at <https://thueytunes.github.io/Water-Games/>.**

On a free GitHub plan Pages only serves from a **public** repo — private repos
need Pro or Team — so this repo has to stay public for the site to work. Because
of that, `water-games/` (the original design bundle) is gitignored and never
published: it stays on your machine only. Nothing in the app depends on it.

`.nojekyll` is present so GitHub serves the files as-is rather than running them
through Jekyll.

## Layout

```
soaked.html            single-file build — the thing you open
app/
  index.html           unbundled entry point
  build.sh             regenerates soaked.html (Git Bash: ./build.sh)
  src/
    tokens.css         design tokens lifted from the mockup
    app.css            frame, gallery and shared component styles
    data.js            fixture data (players, teams, rosters, targets)
    ui.js              iOS device frame + the fragments every screen repeats
    app.js             gallery/focus router
    screens/
      auth.js          sign up · verify · sign in · join game · payment
      main.js          home · menu · hits · team chat · leaderboard · participants
      capture.js       camera · tag · review · status · confirm hit
      teams.js         teams · new team · standings · team · profile
water-games/           the original design handoff bundle — local only, gitignored
```

## How it works

The app opens as a **gallery** of all 21 screens, mirroring the design canvas.
Click any device to focus it. In focus mode the five-tab bar and the primary
actions actually navigate — `←`/`→` step through the journey, `Esc` returns to
the gallery.

Screens are plain functions returning markup (`S.screens.home.render()`), so
porting to React later is mechanical: each becomes a component, and `S.data`
becomes props.

## Decisions worth knowing

**Stack.** You didn't specify one, and this machine has neither Node nor Python
— so a Vite/React build would have been something you couldn't run. This is
zero-build vanilla HTML/CSS/JS with classic (non-module) scripts, which is what
makes `file://` work without a server. The structure is deliberately
React-shaped for a later port.

**Fidelity over structure.** Per the handoff README, this recreates the visual
output rather than copying the prototype's internals. Inline styles that were
one-offs stayed inline; the patterns the mockups repeat on nearly every screen
(tab bar, hatch placeholders, gold CTA, mono labels, status pills) became CSS
classes and helpers. Every color, size and string is carried over from the
source.

**Placeholders are intentional.** Photos and video render as the diagonal hatch
the mockups use, so nothing reads as real content. Names, teams and rosters are
the fictional placeholders from the design brief — Soaked is not affiliated with
any school.

**The tab bar is off** the auth, payment, camera, tag and review screens, matching
the mockups. Join game keeps it, inert.

**Sign in** picks one of the eight greeting couplets at random on each render,
reproducing the mockup's `renderVals()` logic.

## Not built

- `Soaked Rules Screens.dc.html` — a second design in the bundle, outside the
  file you asked for.
- The admin review queue, moderation and notifications — the brief lists these as
  still undrawn.
- No backend. Navigation moves between screens; nothing persists, and no hit is
  ever really submitted.

## Open questions from the design brief

Still unanswered, and each one changes real behaviour:

- What if the tagged player never answers before the 22h auto-confirm?
- Does a denied-then-approved hit still count toward the phase quota?
- Do eliminated players still post to the feed?
- What happens when several teams miss the phase quota at once?
- Does an elimination count in the phase it landed or the phase it was approved?
- Real logo, team names and player photos — do you have them?
