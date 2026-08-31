/* Working form controls: text fields, segmented code entry, selection pills and
   validity-gated CTAs. Values live in S.formState so they survive navigation.

   Nothing here transmits anything — this is a prototype and every field is
   local to the page. */

(function (S) {
  'use strict';

  /* ---- state ------------------------------------------------------------ */
  // Every text field starts empty so people enter their own details. Greyed
  // placeholder text carries the hint the mockup's dummy values used to.

  S.formState = {
    signup:  { phone: '', first: '', last: '', password: '',
               grade: '', agree: false, showPw: false },
    verify:  { code: '' },
    signin:  { phone: '', password: '', showPw: false },
    join:    { code: '', teamCode: '' },
    payment: { method: 'apple' },
    newteam: { name: '', color: '#F0A500' },
    filters: { participants: 'Everyone', hits: 'All approved', leaderboard: 'Players', standings: 'Teams' },
    search:  { participants: '', tag: '', teams: '' },
    chat:    { draft: '', sent: [] },
    camera:  { lens: 'REAR' }
  };

  function get(path) {
    var p = path.split('.');
    return S.formState[p[0]] ? S.formState[p[0]][p[1]] : '';
  }
  function set(path, v) {
    var p = path.split('.');
    if (S.formState[p[0]]) S.formState[p[0]][p[1]] = v;
  }

  var digits = function (v) { return String(v || '').replace(/\D/g, ''); };

  // (415) 555-0182 — formats progressively as you type.
  function formatPhone(raw) {
    var d = digits(raw).slice(0, 10);
    if (d.length <= 3) return d;
    if (d.length <= 6) return '(' + d.slice(0, 3) + ') ' + d.slice(3);
    return '(' + d.slice(0, 3) + ') ' + d.slice(3, 6) + '-' + d.slice(6);
  }
  S.formatPhone = formatPhone;

  /* ---- validity --------------------------------------------------------- */

  var VALID = {
    signup: function (s) {
      return digits(s.signup.phone).length === 10 &&
        s.signup.first.trim() !== '' && s.signup.last.trim() !== '' &&
        s.signup.password.length >= 8 && !!s.signup.grade && s.signup.agree;
    },
    verify: function (s) { return s.verify.code.length === 6; },
    signin: function (s) { return digits(s.signin.phone).length === 10 && s.signin.password.length > 0; },
    join:   function (s) { return s.join.code.length === 6; },
    newteam:function (s) { return s.newteam.name.trim() !== '' && !!s.newteam.color; }
  };
  S.isValid = function (id) { return VALID[id] ? VALID[id](S.formState) : true; };

  /* ---- renderers -------------------------------------------------------- */

  S.forms = {};

  // A text input that fills its .field wrapper.
  S.forms.input = function (o) {
    var v = o.value !== undefined ? o.value : get(o.bind);
    if (o.format === 'phone') v = formatPhone(v);
    return '<input class="inp' + (o.cls ? ' ' + o.cls : '') + '"' +
      ' type="' + (o.type || 'text') + '"' +
      ' data-bind="' + o.bind + '"' +
      (o.format ? ' data-format="' + o.format + '"' : '') +
      ' value="' + S.esc(v) + '"' +
      (o.live ? ' data-live="1"' : '') +
      (o.enter ? ' data-enter="' + o.enter + '"' : '') +
      (o.placeholder ? ' placeholder="' + S.esc(o.placeholder) + '"' : '') +
      (o.maxlength ? ' maxlength="' + o.maxlength + '"' : '') +
      (o.inputmode ? ' inputmode="' + o.inputmode + '"' : '') +
      ' autocomplete="off" spellcheck="false">';
  };

  // Segmented code entry. One transparent input sits over the boxes, so typing,
  // backspace, paste and mobile keyboards all behave normally.
  S.forms.codeRow = function (o) {
    var val = get(o.bind) || '';
    var boxes = '';
    for (var i = 0; i < o.len; i++) {
      boxes += '<div class="code-box"></div>';
    }
    return '<div class="codes codes--' + o.theme + '" data-code="' + o.bind +
        '" data-len="' + o.len + '" data-kind="' + (o.kind || 'digit') + '">' +
      '<input class="codes__in" value="' + S.esc(val) + '" maxlength="' + o.len + '"' +
        ' inputmode="' + (o.kind === 'alnum' ? 'text' : 'numeric') + '"' +
        ' autocomplete="one-time-code" spellcheck="false" aria-label="' + (o.label || 'Code') + '">' +
      boxes +
    '</div>';
  };

  // Single-select group. Each option carries its own markup; JS toggles `on`.
  S.forms.pick = function (bind, value, html, cls) {
    return '<div class="pick ' + (cls || '') + '" data-pick="' + bind + '" data-value="' +
      S.esc(value) + '">' + html + '</div>';
  };

  S.forms.checkbox = function (bind) {
    return '<div class="cbx" data-toggle="' + bind + '"><span class="cbx__tick">✓</span></div>';
  };

  /* ---- wiring ----------------------------------------------------------- */

  // Repaints the parts whose appearance depends on state, without touching the
  // DOM the user is typing into (so focus and caret survive).
  function refresh(root) {
    root.querySelectorAll('.codes').forEach(function (row) {
      var val = row.querySelector('.codes__in').value;
      var boxes = row.querySelectorAll('.code-box');
      boxes.forEach(function (b, i) {
        b.textContent = val[i] || '';
        b.classList.toggle('code-box--on', i < val.length);
        b.classList.toggle('code-box--next', i === val.length);
      });
    });

    root.querySelectorAll('[data-pick]').forEach(function (el) {
      el.classList.toggle('is-on', String(get(el.getAttribute('data-pick'))) === el.getAttribute('data-value'));
    });

    root.querySelectorAll('[data-toggle]').forEach(function (el) {
      el.classList.toggle('is-on', !!get(el.getAttribute('data-toggle')));
    });

    root.querySelectorAll('[data-cta]').forEach(function (el) {
      var ok = S.isValid(el.getAttribute('data-cta'));
      var muted = el.getAttribute('data-muted') === 'ink' ? 'cta--muted-ink' : 'cta--muted';
      el.classList.toggle(muted, !ok);
      el.disabled = !ok;
    });
  }
  S.forms.refresh = refresh;

  S.forms.bind = function (root, onNavigate) {
    // Text fields
    root.addEventListener('input', function (e) {
      var el = e.target;
      if (el.classList.contains('inp')) {
        if (el.getAttribute('data-format') === 'phone') {
          var d = digits(el.value).slice(0, 10);
          set(el.getAttribute('data-bind'), d);
          el.value = formatPhone(d);
        } else {
          set(el.getAttribute('data-bind'), el.value);
        }
        // A "live" field changes what the screen lists, so it needs a real
        // re-render; the router restores focus and caret afterwards.
        if (el.getAttribute('data-live') && onNavigate) {
          onNavigate('repaint', el.getAttribute('data-bind'), el.selectionStart);
          return;
        }
        refresh(root);
        return;
      }
      if (el.classList.contains('codes__in')) {
        var row = el.closest('.codes');
        var kind = row.getAttribute('data-kind');
        var len = +row.getAttribute('data-len');
        var clean = kind === 'alnum'
          ? el.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
          : el.value.replace(/\D/g, '');
        el.value = clean.slice(0, len);
        set(row.getAttribute('data-code'), el.value);
        refresh(root);
      }
    });

    // Selection controls
    root.addEventListener('click', function (e) {
      var pick = e.target.closest('[data-pick]');
      if (pick) {
        set(pick.getAttribute('data-pick'), pick.getAttribute('data-value'));
        if (onNavigate) onNavigate('repaint');
        else refresh(root);
        return;
      }
      var tog = e.target.closest('[data-toggle]');
      if (tog) {
        var path = tog.getAttribute('data-toggle');
        set(path, !get(path));
        refresh(root);
        return;
      }
      var reveal = e.target.closest('[data-reveal]');
      if (reveal) {
        var rp = reveal.getAttribute('data-reveal');
        set(rp, !get(rp));
        var field = reveal.closest('.field');
        var input = field && field.querySelector('.inp');
        if (input) input.type = get(rp) ? 'text' : 'password';
        reveal.textContent = get(rp) ? 'HIDE' : 'SHOW';
      }
    });

    // Tapping anywhere on a code row focuses its input.
    root.addEventListener('mousedown', function (e) {
      var box = e.target.closest('.code-box');
      if (box) {
        e.preventDefault();
        box.closest('.codes').querySelector('.codes__in').focus();
      }
    });

    refresh(root);
  };
})(window.S);
