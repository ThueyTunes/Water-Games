/* App shell: a canvas-style gallery of every screen, and a focus mode where the
   tab bar and the primary actions actually navigate. */

(function (S) {
  'use strict';

  // Journey order, exactly as laid out in the mockup's turn 1.
  var ORDER = [
    'signup', 'verify', 'signin', 'join', 'payment',
    'home', 'menu', 'hits', 'chat', 'leaderboard', 'participants',
    'camera', 'tag', 'review', 'status', 'confirm',
    'teams', 'newteam', 'standings', 'team', 'profile'
  ];

  var root, bar;

  function screensInOrder() {
    return ORDER.map(function (id) { return S.screens[id]; }).filter(Boolean);
  }

  /* ---- views ------------------------------------------------------------ */

  function galleryView() {
    return '<div class="gallery">' + screensInOrder().map(function (sc) {
      return '<div class="gallery__item" id="' + sc.id + '">' +
        '<div class="gallery__label">' +
          '<a class="gallery__id" href="#/' + sc.id + '">' + sc.code + '</a>' + sc.label +
        '</div>' +
        '<div data-open="' + sc.id + '">' + S.device(sc.render(), { dark: sc.dark }) + '</div>' +
      '</div>';
    }).join('') + '</div>';
  }

  function focusView(id) {
    var sc = S.screens[id];
    if (!sc) return galleryView();
    return '<div class="focus-stage">' + S.device(sc.render(), { dark: sc.dark }) + '</div>';
  }

  function shellBar(mode, sc) {
    return '<div class="shell-bar">' +
      '<div>' +
        '<div class="shell-bar__brand">SOAKED</div>' +
        '<div class="shell-bar__sub">' +
          (mode === 'focus' ? sc.code + ' · ' + sc.label.toUpperCase() : '21 SCREENS · 402×874') +
        '</div>' +
      '</div>' +
      '<div class="shell-bar__spacer"></div>' +
      (mode === 'focus'
        ? '<button class="shell-btn" data-nav="prev">‹ PREV</button>' +
          '<button class="shell-btn" data-nav="next">NEXT ›</button>' +
          '<button class="shell-btn" data-nav="gallery">ALL SCREENS</button>'
        : '<button class="shell-btn" data-nav="first">OPEN FLOW ›</button>') +
    '</div>';
  }

  /* ---- routing ---------------------------------------------------------- */
  // State is the source of truth and the hash merely reflects it, so the app
  // still works where the fragment is unavailable (data: URLs, some embeds).

  var current = null;

  function idFromHash() {
    var m = /^#\/(.+)$/.exec(window.location.hash);
    return m && S.screens[m[1]] ? m[1] : null;
  }

  function currentId() { return current; }

  // `keepFocus` re-focuses the named field after a repaint so typing in a
  // search box that filters a list doesn't drop the caret.
  function render(keepFocus, caret) {
    if (current) {
      bar.innerHTML = shellBar('focus', S.screens[current]);
      root.innerHTML = focusView(current);
    } else {
      bar.innerHTML = shellBar('gallery');
      root.innerHTML = galleryView();
    }
    S.forms.refresh(root);

    if (keepFocus) {
      var el = root.querySelector('[data-bind="' + keepFocus + '"]');
      if (el) {
        el.focus();
        var at = caret == null ? el.value.length : caret;
        try { el.setSelectionRange(at, at); } catch (e) { /* type has no caret */ }
      }
    }
  }

  function go(id) {
    if (id && !S.screens[id]) return;
    current = id || null;
    try {
      var want = current ? '#/' + current : '';
      if (window.location.hash !== want) window.location.hash = want;
    } catch (e) {
      /* fragment unavailable — state still drives the view */
    }
    render();
    window.scrollTo(0, 0); // only on navigation, never on an in-place repaint
  }

  function step(delta) {
    var i = ORDER.indexOf(current);
    if (i < 0) return;
    go(ORDER[(i + delta + ORDER.length) % ORDER.length]);
  }

  S.go = go; // deep-linking + testing entry point

  /* ---- actions ----------------------------------------------------------- */
  // Every interactive control routes through here. Anything the design brief
  // lists as still undrawn says so plainly rather than doing nothing.

  var TODO = {
    'scan-qr': 'Camera QR scanning isn\'t built yet — type the six-character code instead.',
    'notifications': 'Notifications aren\'t built yet — the brief lists them as undrawn.',
    'report': 'Reporting and moderation aren\'t built yet.',
    'message-admin': 'Admin messaging isn\'t built yet — the review queue is still undrawn.',
    'receipts': 'Payments & receipts history isn\'t built yet.',
    'rules': 'The phase-3 rules screen lives in the other design file, not this one.',
    'invite': 'Roster invites aren\'t built yet.',
    'share': 'Sharing outside the app isn\'t built yet.',
    'trim': 'Video trimming isn\'t built yet — the clip is a placeholder.',
    'forgot': 'Password reset isn\'t built yet.',
    'sso': 'Apple / Google sign-in needs an identity provider that isn\'t wired up.',
    'add-payment': 'Adding a new payment method needs a payment processor that isn\'t wired up.'
  };

  function runAction(name, el) {
    var fs = S.formState;

    if (TODO[name]) { S.toast(TODO[name], 'todo'); return; }

    switch (name) {
      case 'request-code':
      case 'resend-code':
        S.otp.request(fs.signup.phone).then(function (r) {
          if (r.ok) { fs.verify.code = ''; go('verify'); } else render();
        });
        return;

      case 'verify-code':
        S.otp.verify(fs.verify.code).then(function (r) {
          if (r.ok) go('join'); else render();
        });
        return;

      // No invented code here — put the cursor in the boxes and let them type
      // the one the organiser actually gave them.
      case 'focus-game-code': {
        var codeInput = root.querySelector('.codes__in');
        if (codeInput) codeInput.focus();
        S.toast('Enter the six-character code the organiser gave you.');
        return;
      }

      case 'send-message': {
        var text = fs.chat.draft.trim();
        if (!text) { S.toast('Type something first.'); return; }
        fs.chat.sent.push(text);
        fs.chat.draft = '';
        render();
        var body = root.querySelector('[data-chat-scroll]');
        if (body) body.scrollTop = body.scrollHeight;
        return;
      }

      case 'flip-lens':
        fs.camera.lens = fs.camera.lens === 'REAR' ? 'FRONT' : 'REAR';
        render();
        S.toast(fs.camera.lens === 'REAR' ? 'Rear lens' : 'Front lens');
        return;

      case 'withdraw':
        S.toast('Submission #S-2841 withdrawn.');
        setTimeout(function () { go('home'); }, 900);
        return;

      case 'logout':
        S.otp.reset();
        fs.signup = { phone: '', first: '', last: '', password: '', grade: '', agree: false, showPw: false };
        fs.signin = { phone: '', password: '', showPw: false };
        fs.verify = { code: '' };
        go('signin');
        return;

      case 'signin':
        go('home');
        return;
    }
  }

  /* ---- events ----------------------------------------------------------- */

  function onClick(e) {
    var act = e.target.closest('[data-action]');
    if (act) { runAction(act.getAttribute('data-action'), act); return; }

    var nav = e.target.closest('[data-nav]');
    if (nav) {
      var what = nav.getAttribute('data-nav');
      if (what === 'gallery') go(null);
      else if (what === 'first') go(ORDER[0]);
      else if (what === 'prev') step(-1);
      else if (what === 'next') step(1);
      return;
    }

    // In the gallery, clicking a device opens it; in focus mode, in-screen
    // controls route between screens.
    var open = e.target.closest('[data-open]');
    if (open && !currentId()) { go(open.getAttribute('data-open')); return; }

    var link = e.target.closest('[data-go]');
    if (link && currentId()) { go(link.getAttribute('data-go')); }
  }

  function onKey(e) {
    // Enter inside a field that declares an action fires it (chat send).
    if (e.key === 'Enter' && e.target.getAttribute && e.target.getAttribute('data-enter')) {
      e.preventDefault();
      runAction(e.target.getAttribute('data-enter'), e.target);
      return;
    }
    // Don't hijack arrow keys while someone is typing.
    if (e.target.tagName === 'INPUT') return;
    if (!current) return;
    if (e.key === 'ArrowRight') step(1);
    else if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'Escape') go(null);
  }

  /* ---- boot ------------------------------------------------------------- */

  function boot() {
    bar = document.getElementById('shell-bar');
    root = document.getElementById('root');
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    S.forms.bind(root, function (what, bindPath, caret) {
      if (what === 'repaint') render(bindPath, caret);
    });
    // Back/forward and hand-typed deep links sync state back from the hash.
    window.addEventListener('hashchange', function () {
      var id = idFromHash();
      if (id !== current) go(id);
    });
    current = idFromHash();
    render();

    // Ticks the resend cooldown / expiry line without re-rendering the screen.
    setInterval(function () {
      var el = root.querySelector('[data-otp-countdown]');
      if (!el || !S.otp.state.sentAt) return;
      var cd = S.otp.cooldownLeft();
      if (cd > 0) {
        el.textContent = 'RESEND IN 0:' + String(cd).padStart(2, '0');
      } else if (S.otp.isExpired()) {
        el.textContent = 'CODE EXPIRED';
      } else {
        var left = S.otp.secondsLeft();
        el.textContent = 'EXPIRES IN ' + Math.floor(left / 60) + ':' + String(left % 60).padStart(2, '0');
      }
    }, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})(window.S);
