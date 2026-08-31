/* Shared primitives: the iOS device frame (ported from `ios-frame.jsx`) and the
   handful of fragments the mockups repeat on nearly every screen. */

window.S = window.S || {};

(function (S) {
  'use strict';

  /* -- escaping ---------------------------------------------------------- */

  S.esc = function (v) {
    return String(v).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  };

  /* -- iOS status bar ---------------------------------------------------- */
  // Icon geometry copied from ios-frame.jsx so the frame reads as the real thing.

  function statusBar(dark) {
    var c = dark ? '#fff' : '#000';
    return '' +
      '<div class="ios-statusbar">' +
        '<div class="ios-statusbar__time">9:41</div>' +
        '<div class="ios-statusbar__icons">' +
          '<svg width="19" height="12" viewBox="0 0 19 12">' +
            '<rect x="0" y="7.5" width="3.2" height="4.5" rx="0.7" fill="' + c + '"/>' +
            '<rect x="4.8" y="5" width="3.2" height="7" rx="0.7" fill="' + c + '"/>' +
            '<rect x="9.6" y="2.5" width="3.2" height="9.5" rx="0.7" fill="' + c + '"/>' +
            '<rect x="14.4" y="0" width="3.2" height="12" rx="0.7" fill="' + c + '"/>' +
          '</svg>' +
          '<svg width="17" height="12" viewBox="0 0 17 12">' +
            '<path d="M8.5 3.2C10.8 3.2 12.9 4.1 14.4 5.6L15.5 4.5C13.7 2.7 11.2 1.5 8.5 1.5C5.8 1.5 3.3 2.7 1.5 4.5L2.6 5.6C4.1 4.1 6.2 3.2 8.5 3.2Z" fill="' + c + '"/>' +
            '<path d="M8.5 6.8C9.9 6.8 11.1 7.3 12 8.2L13.1 7.1C11.8 5.9 10.2 5.1 8.5 5.1C6.8 5.1 5.2 5.9 3.9 7.1L5 8.2C5.9 7.3 7.1 6.8 8.5 6.8Z" fill="' + c + '"/>' +
            '<circle cx="8.5" cy="10.5" r="1.5" fill="' + c + '"/>' +
          '</svg>' +
          '<svg width="27" height="13" viewBox="0 0 27 13">' +
            '<rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke="' + c + '" stroke-opacity="0.35" fill="none"/>' +
            '<rect x="2" y="2" width="20" height="9" rx="2" fill="' + c + '"/>' +
            '<path d="M25 4.5V8.5C25.8 8.2 26.5 7.2 26.5 6.5C26.5 5.8 25.8 4.8 25 4.5Z" fill="' + c + '" fill-opacity="0.4"/>' +
          '</svg>' +
        '</div>' +
      '</div>';
  }

  /* -- device frame ------------------------------------------------------ */
  // The mockups never pass `title`, so the iOS nav bar is intentionally absent:
  // each screen paints its own header edge to edge.

  S.device = function (inner, opts) {
    opts = opts || {};
    return '' +
      '<div class="ios-device' + (opts.dark ? ' ios-device--dark' : '') + '">' +
        '<div class="ios-island"></div>' +
        statusBar(opts.dark) +
        '<div class="ios-viewport">' + inner + '</div>' +
        '<div class="ios-home"><div class="ios-home__bar"></div></div>' +
      '</div>';
  };

  /* -- tab bar ----------------------------------------------------------- */
  // Five tabs run the app. `active` is the screen id the tab points at, or null
  // on screens (auth, payment, camera) where the bar is present but inert.

  var TABS = [
    { id: 'participants', label: 'PLAYERS' },
    { id: 'leaderboard', label: 'LEADERS' },
    { id: 'home', label: 'HOME' },
    { id: 'hits', label: 'HITS' },
    { id: 'chat', label: 'CHAT' }
  ];

  S.tabBar = function (active) {
    return '<div class="tabbar">' + TABS.map(function (t) {
      var on = t.id === active;
      return '<button class="tab' + (on ? ' tab--on' : '') + '" data-go="' + t.id + '">' +
        '<div class="tab__dot"></div>' +
        '<div class="tab__label">' + t.label + '</div>' +
      '</button>';
    }).join('') + '</div>';
  };

  /* -- small repeated fragments ------------------------------------------ */

  S.avatar = function (size, extra) {
    return '<div class="avatar hatch-av' + (extra ? ' ' + extra : '') +
      '" style="width:' + size + 'px;height:' + size + 'px"></div>';
  };

  S.teamDot = function (color) {
    return '<div class="team-dot" style="background:' + color + '"></div>';
  };

  S.monoNote = function (text) {
    return '<div style="font:400 10px/1 var(--mono);color:var(--n-55);margin-top:5px">' + text + '</div>';
  };

  // Video/photo placeholder with the centered play dot and a duration stamp.
  S.videoTile = function (o) {
    return '<div class="' + (o.hatch || 'hatch-vid') + '" style="height:' + o.height + 'px;' + (o.style || '') + '">' +
      (o.dot ? '<div class="play-dot" style="width:' + o.dot + 'px;height:' + o.dot + 'px"></div>' : '') +
      (o.time ? '<div style="position:absolute;left:' + (o.pad || 8) + 'px;bottom:' + (o.pad || 8) +
        'px;font:400 ' + (o.timeSize || 9) + 'px/1 var(--mono);color:var(--n-70)">' + o.time + '</div>' : '') +
      (o.extra || '') +
    '</div>';
  };
})(window.S);
