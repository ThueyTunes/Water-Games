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

  /* ---- events ----------------------------------------------------------- */

  function onClick(e) {
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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})(window.S);
