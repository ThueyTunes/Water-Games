/* The five tabs plus the slide-over menu:
   Home · Menu · Hits · Team chat · Leaderboard · Participants */

(function (S) {
  'use strict';

  /* ---- 1a · Home -------------------------------------------------------- */

  S.screens.home = {
    id: 'home', code: '1a', label: 'Home',
    render: function () {
      var quick = [
        { title: 'Record a hit', note: 'CAMERA', gold: true, go: 'camera' },
        { title: 'My hits', note: 'STATUS', go: 'status' },
        { title: 'Rules', note: 'PHASE 3' },
        { title: 'My team', note: 'RIPTIDE', go: 'team' }
      ].map(function (q) {
        return '<div style="flex:1;padding:10px 9px;border-radius:11px;background:' +
            (q.gold ? 'var(--gold)' : '#fff') + ';border:1px solid ' + (q.gold ? 'var(--gold)' : 'var(--n-14)') +
            ';display:flex;flex-direction:column;gap:5px;align-items:flex-start"' +
            (q.go ? ' data-go="' + q.go + '"' : '') + '>' +
          '<div style="font:600 11.5px/1.2 var(--sans);color:var(--navy)">' + q.title + '</div>' +
          '<div style="font:400 8.5px/1.2 var(--mono);letter-spacing:.04em;color:var(--navy);opacity:.6">' + q.note + '</div>' +
        '</div>';
      }).join('');

      var rows = S.data.teams.map(function (t, i) {
        return '<div style="display:flex;align-items:center;gap:11px;padding:9px 13px;' +
            (t.mine ? 'background:rgba(18,166,107,.1);' : '') + 'border-bottom:1px solid var(--n-07)"' +
            (t.mine ? ' data-go="team"' : '') + '>' +
          '<div style="font:700 14px/1 var(--serif);width:14px;color:var(--n-55)">' + (i + 1) + '</div>' +
          '<div style="width:3px;height:20px;border-radius:2px;background:' + t.color + '"></div>' +
          '<div style="flex:1;font:600 13px/1 var(--sans)">' + t.name + '</div>' +
          '<div style="font:400 10px/1 var(--mono);color:var(--n-55);width:58px;text-align:right">' + t.alive + ' of 5 ALIVE</div>' +
          '<div style="font:700 15px/1 var(--serif);width:26px;text-align:right">' + t.hits + '</div>' +
        '</div>';
      }).join('');

      return '<div class="screen">' +
        '<div style="background:linear-gradient(120deg,var(--navy) 0%,var(--navy-bright) 100%);color:var(--cream);padding:58px 20px 16px;display:flex;align-items:flex-end;justify-content:space-between">' +
          '<div>' +
            '<div style="font:700 24px/1 var(--serif);letter-spacing:.02em">SOAKED <span style="font-weight:400;color:var(--c-65)">— Home</span></div>' +
            '<div style="font:400 10px/1 var(--mono);letter-spacing:.12em;color:var(--c-70);margin-top:6px">WESTSIDE SOAK · PHASE 3 · 41 IN</div>' +
          '</div>' +
          '<div style="display:flex;align-items:center;gap:12px">' +
            '<div class="hatch-navy" style="width:34px;height:34px;border-radius:50%" data-go="profile"></div>' +
            '<div style="width:34px;height:34px;border-radius:9px;background:var(--c-14);display:flex;flex-direction:column;justify-content:center;align-items:center;gap:4px" data-go="menu">' +
              '<div style="width:15px;height:2px;border-radius:1px;background:var(--cream)"></div>' +
              '<div style="width:15px;height:2px;border-radius:1px;background:var(--cream)"></div>' +
              '<div style="width:15px;height:2px;border-radius:1px;background:var(--cream)"></div>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<div style="flex:1;overflow:hidden;padding:14px 20px 0;display:flex;flex-direction:column;gap:12px">' +
          '<div style="display:flex;gap:8px">' + quick + '</div>' +

          '<div style="border-radius:14px;overflow:hidden;background:#fff;border:1px solid var(--n-10)">' +
            '<div class="hatch-vid" style="height:142px;position:relative">' +
              '<div style="position:absolute;top:11px;left:11px;padding:5px 9px;border-radius:5px;background:var(--red);color:var(--cream);font:600 9px/1 var(--mono);letter-spacing:.1em">HIT OF THE DAY</div>' +
              '<div class="play-dot" style="width:54px;height:54px"></div>' +
              '<div style="position:absolute;left:11px;bottom:11px;font:400 10px/1 var(--mono);color:var(--n-70)">0:11</div>' +
            '</div>' +
            '<div style="padding:12px 14px">' +
              '<div style="font:600 14px/1.35 var(--sans)">Maya Okonkwo catches Ty Brennan in the Safeway lot</div>' +
              '<div style="font:400 10px/1 var(--mono);color:var(--n-50);margin-top:7px">128 VIEWS · APPROVED 14 MIN AGO</div>' +
            '</div>' +
          '</div>' +

          '<div style="display:flex;align-items:baseline;justify-content:space-between">' +
            '<div style="font:500 10px/1 var(--mono);letter-spacing:.12em;color:var(--n-55)">TOP TEAMS</div>' +
            '<div style="font:500 11px/1 var(--sans);color:var(--red)" data-go="standings">Full board</div>' +
          '</div>' +

          '<div class="card">' + rows +
            '<div style="display:flex;align-items:center;gap:9px;padding:9px 13px;background:rgba(255,181,36,.16);border-top:1px solid var(--n-07)" data-go="profile">' +
              S.avatar(22) +
              '<div style="font:400 9px/1 var(--mono);letter-spacing:.1em;color:var(--gold-ink)">MOST ELIMS</div>' +
              '<div style="flex:1;font:600 12px/1 var(--sans)">Maya Okonkwo</div>' +
              '<div style="font:700 15px/1 var(--serif)">5</div>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<div style="padding:12px 20px 0">' +
          '<button class="cta" style="height:54px" data-go="camera">RECORD A HIT</button>' +
        '</div>' +
        S.tabBar('home') +
      '</div>';
    }
  };

  /* ---- 1y · Menu -------------------------------------------------------- */

  S.screens.menu = {
    id: 'menu', code: '1y', label: 'Menu',
    render: function () {
      function group(label, items) {
        var rows = items.map(function (it, i) {
          return '<div style="display:flex;align-items:center;gap:12px;padding:13px 15px;' +
              (i < items.length - 1 ? 'border-bottom:1px solid var(--n-07)' : '') + '"' +
              (it.go ? ' data-go="' + it.go + '"' : '') + '>' +
            '<div style="flex:1"><div style="font:600 13.5px/1.2 var(--sans)">' + it.title + '</div>' +
              (it.note ? '<div style="font:400 10.5px/1 var(--mono);color:var(--n-50);margin-top:5px">' + it.note + '</div>' : '') +
            '</div><div style="font:400 16px/1;color:var(--n-30)">›</div>' +
          '</div>';
        }).join('');
        return '<div class="mono-label">' + label + '</div>' +
          '<div class="card" style="flex:none">' + rows + '</div>';
      }

      return '<div class="screen">' +
        '<div style="padding:56px 20px 18px;background:linear-gradient(120deg,var(--navy),var(--navy-bright));color:var(--cream);display:flex;align-items:center;gap:13px">' +
          '<div class="hatch-navy" style="width:46px;height:46px;border-radius:50%"></div>' +
          '<div style="flex:1">' +
            '<div style="font:700 20px/1.1 var(--serif)">Maya Okonkwo</div>' +
            '<div style="font:400 10px/1 var(--mono);color:var(--c-70);margin-top:7px">RIPTIDE · CAPTAIN · 5 ELIMS</div>' +
          '</div>' +
          '<div style="font:400 22px/1;color:var(--c-70)" data-go="home">×</div>' +
        '</div>' +

        '<div style="flex:1;overflow:hidden;padding:14px 20px 0;display:flex;flex-direction:column;gap:9px">' +
          group('TEAM', [
            { title: 'My team', note: 'RIPTIDE · 3 ALIVE', go: 'team' },
            { title: 'Join a team', note: '4 TEAMS HAVE OPEN SLOTS', go: 'teams' },
            { title: 'Create a team', note: '$5 · YOU BECOME CAPTAIN', go: 'newteam' }
          ]) +
          group('GAME', [
            { title: 'Rules', note: 'PHASE 3 · QUOTA 3' },
            { title: 'Join another game', note: 'ENTER A GAME CODE', go: 'join' },
            { title: 'Payments &amp; receipts', note: '$25 ENTRY · $5 TEAM', go: 'payment' }
          ]) +
          group('ACCOUNT', [
            { title: 'Profile &amp; photo', go: 'profile' },
            { title: 'Notifications', note: '4 UNREAD' },
            { title: 'Report a player or clip' }
          ]) +
          '<div style="flex:none;display:flex;align-items:center;justify-content:center;height:48px;border-radius:12px;background:#fff;border:1px solid rgba(232,51,42,.45);font:600 13px/1 var(--sans);color:var(--red);margin-top:2px" data-go="signin">Log out</div>' +
        '</div>' +
        S.tabBar('home') +
      '</div>';
    }
  };

  /* ---- 1u · Hits -------------------------------------------------------- */

  S.screens.hits = {
    id: 'hits', code: '1u', label: 'Hits',
    render: function () {
      function clip(h, caption, time) {
        return '<div style="border-radius:12px;overflow:hidden;background:#fff;border:1px solid var(--n-10)" data-go="status">' +
          '<div class="hatch-vid" style="height:' + h + 'px;position:relative">' +
            '<div class="play-dot" style="width:38px;height:38px"></div>' +
            '<div style="position:absolute;left:8px;bottom:8px;font:400 9px/1 var(--mono);color:var(--n-70)">' + time + '</div>' +
          '</div>' +
          '<div style="padding:9px 10px;font:500 11.5px/1.35 var(--sans)">' + caption + '</div>' +
        '</div>';
      }

      var chips = ['All approved', 'My team', 'Phase 3'].map(function (c, i) {
        return '<div class="chip' + (i === 0 ? ' chip--on' : '') + '">' + c + '</div>';
      }).join('');

      return '<div class="screen">' +
        '<div class="hdr">' +
          '<div class="hdr__title">Hits</div>' +
          '<div class="hdr__chips">' + chips + '</div>' +
        '</div>' +

        '<div style="flex:1;overflow:hidden;padding:14px 20px 0;display:flex;flex-direction:column;gap:10px">' +
          '<div style="display:flex;gap:10px;align-items:flex-start">' +
            '<div style="flex:1;display:flex;flex-direction:column;gap:10px">' +
              clip(150, 'Maya → Ty · parking lot ambush', '0:11') +
              clip(110, 'Eli → Priya · bike rack', '0:07') +
            '</div>' +
            '<div style="flex:1;display:flex;flex-direction:column;gap:10px">' +
              clip(110, 'Deshawn → Ana · front porch', '0:22') +
              clip(150, 'Jonah → Chris · bus stop', '0:09') +
            '</div>' +
          '</div>' +

          '<div style="display:flex;align-items:center;gap:11px;padding:11px 13px;border-radius:12px;background:#fff;border:1px solid var(--n-10)">' +
            '<div class="hatch-vid" style="width:34px;height:34px;border-radius:8px"></div>' +
            '<div style="flex:1"><div style="font:500 12px/1.35 var(--sans)">Your clip is live — 128 views</div>' +
              '<div style="font:400 10px/1 var(--mono);color:var(--n-50);margin-top:5px">TAP TO SHARE OUTSIDE THE APP</div></div>' +
            '<div style="font:400 16px/1;color:var(--n-30)">›</div>' +
          '</div>' +
        '</div>' +
        S.tabBar('hits') +
      '</div>';
    }
  };

  /* ---- 1v · Team chat --------------------------------------------------- */

  S.screens.chat = {
    id: 'chat', code: '1v', label: 'Team chat',
    render: function () {
      function theirs(who, text) {
        return '<div style="display:flex;gap:9px">' +
          '<div class="hatch-av" style="width:30px;height:30px;border-radius:50%;flex:none"></div>' +
          '<div><div style="font:400 9.5px/1 var(--mono);color:var(--n-50);margin-bottom:5px">' + who + '</div>' +
            '<div style="max-width:250px;padding:10px 13px;border-radius:14px 14px 14px 4px;background:#fff;border:1px solid var(--n-10);font:400 13px/1.45 var(--sans)">' + text + '</div></div>' +
        '</div>';
      }

      var faces = [0, 1, 2].map(function (i) {
        return '<div class="hatch-av" style="width:28px;height:28px;border-radius:50%;border:2px solid var(--green);' +
          (i ? 'margin-left:-9px' : '') + '"></div>';
      }).join('');

      return '<div class="screen">' +
        '<div style="padding:56px 20px 14px;background:linear-gradient(120deg,var(--green-deep),var(--green-light));color:var(--cream);display:flex;align-items:center;gap:12px">' +
          '<div><div style="font:700 24px/1.1 var(--serif)">Riptide</div>' +
            '<div style="font:400 10px/1 var(--mono);color:var(--c-80);margin-top:7px">3 ALIVE · 2 OF 3 THIS PHASE</div></div>' +
          '<div style="flex:1"></div>' +
          '<div style="display:flex" data-go="team">' + faces + '</div>' +
        '</div>' +

        '<div style="flex:1;overflow:hidden;padding:16px 18px 0;display:flex;flex-direction:column;gap:11px">' +
          '<div style="text-align:center;font:400 9.5px/1 var(--mono);letter-spacing:.1em;color:var(--n-40)">TODAY</div>' +
          theirs('MAYA · CAPTAIN', 'Ty walks to the Safeway at 4:45 every day. I\'ve got him. Somebody take Priya.') +
          theirs('DESHAWN', 'On it. She\'s at practice till 6.') +
          '<div style="display:flex;justify-content:flex-end">' +
            '<div style="max-width:250px;padding:10px 13px;border-radius:14px 14px 4px 14px;background:var(--navy);color:var(--cream);font:400 13px/1.45 var(--sans)">One more and we clear the phase. Don\'t get caught in a car.</div>' +
          '</div>' +
          '<div style="display:flex;align-items:center;gap:10px;padding:10px 13px;border-radius:12px;background:rgba(232,51,42,.1);border:1px solid rgba(232,51,42,.35)">' +
            '<div style="width:13px;height:13px;border-radius:3px;background:var(--red);flex:none"></div>' +
            '<div style="font:400 11.5px/1.45 var(--sans);color:var(--red-ink)">Ana was eliminated 1 hr ago — she can still read the chat but can\'t post.</div>' +
          '</div>' +
        '</div>' +

        '<div style="padding:10px 18px 0;display:flex;gap:9px;align-items:center">' +
          '<div style="flex:1;height:46px;border-radius:23px;background:#fff;border:1px solid rgba(22,37,107,.15);display:flex;align-items:center;padding:0 16px;font:400 13.5px/1 var(--sans);color:var(--n-45)">Message Riptide</div>' +
          '<div style="width:46px;height:46px;border-radius:50%;background:var(--gold)"></div>' +
        '</div>' +
        S.tabBar('chat') +
      '</div>';
    }
  };

  /* ---- 1w · Leaderboard ------------------------------------------------- */

  S.screens.leaderboard = {
    id: 'leaderboard', code: '1w', label: 'Leaderboard',
    render: function () {
      var chips = ['Players', 'Teams', 'This phase'].map(function (c, i) {
        return '<div class="chip' + (i === 0 ? ' chip--on' : '') + '"' + (i === 1 ? ' data-go="standings"' : '') + '>' + c + '</div>';
      }).join('');

      var rows = S.data.leaders.map(function (p, i) {
        var rank = i + 1;
        return '<div class="row"' + (p.mine ? ' style="background:rgba(18,166,107,.1)"' : '') + '>' +
          '<div style="font:700 15px/1 var(--serif);width:18px;color:' + (rank <= 3 ? 'var(--navy)' : 'var(--n-50)') + '">' + rank + '</div>' +
          '<div class="avatar hatch-av" style="width:32px;height:32px' + (p.out ? ';opacity:.45' : '') + '"></div>' +
          '<div style="flex:1" class="' + (p.out ? 'is-out' : '') + '">' +
            '<div class="name" style="font:600 13.5px/1.2 var(--sans)">' + p.name + '</div>' +
            '<div style="display:flex;align-items:center;gap:6px;margin-top:5px">' + S.teamDot(p.color) +
              '<div style="font:400 10px/1 var(--mono);color:var(--n-55)">' + p.meta + '</div>' +
            '</div>' +
          '</div>' +
          '<div style="font:700 19px/1 var(--serif)">' + p.elims + '</div>' +
        '</div>';
      }).join('');

      return '<div class="screen">' +
        '<div class="hdr" style="background:linear-gradient(120deg,var(--navy-bright),var(--navy))">' +
          '<div class="hdr__title">Leaderboard</div>' +
          '<div class="hdr__chips">' + chips + '</div>' +
        '</div>' +
        '<div style="flex:1;overflow:hidden;padding:13px 20px 0;display:flex;flex-direction:column;gap:9px">' +
          '<div style="display:flex;justify-content:space-between;font:400 9.5px/1 var(--mono);letter-spacing:.1em;color:var(--n-50);padding:0 4px"><span>PLAYER · TEAM</span><span>ELIMS</span></div>' +
          '<div class="card">' + rows + '</div>' +
          '<div style="font:400 11px/1.45 var(--sans);color:var(--n-50);padding:0 4px">Struck-through names are out. Eliminations stay on the board.</div>' +
        '</div>' +
        S.tabBar('leaderboard') +
      '</div>';
    }
  };

  /* ---- 1x · Participants ------------------------------------------------ */

  S.screens.participants = {
    id: 'participants', code: '1x', label: 'Participants',
    render: function () {
      var chips = ['Everyone', 'Alive', 'Out'].map(function (c) {
        return S.forms.pick('filters.participants', c, c, 'pick--chip');
      }).join('');

      // Search and the Alive/Out chips both narrow the list for real.
      var mode = S.formState.filters.participants;
      var q = S.formState.search.participants.trim().toLowerCase();
      var shown = S.data.participants.filter(function (p) {
        if (mode === 'Alive' && p.out) return false;
        if (mode === 'Out' && !p.out) return false;
        if (q && (p.name + ' ' + p.meta).toLowerCase().indexOf(q) < 0) return false;
        return true;
      });

      var rows = shown.map(function (p) {
        return '<div class="row" data-go="profile">' +
          '<div class="avatar hatch-av" style="width:34px;height:34px' + (p.out ? ';opacity:.45' : '') + '"></div>' +
          '<div style="flex:1" class="' + (p.out ? 'is-out' : '') + '">' +
            '<div class="name" style="font:600 13.5px/1.2 var(--sans)">' + p.name + '</div>' +
            '<div style="display:flex;align-items:center;gap:6px;margin-top:5px">' + S.teamDot(p.color) +
              '<div style="font:400 10px/1 var(--mono);color:var(--n-55)">' + p.meta + '</div>' +
            '</div>' +
          '</div>' +
          '<div class="status-pill status-pill--' + (p.out ? 'out">OUT' : 'alive">ALIVE') + '</div>' +
        '</div>';
      }).join('');

      return '<div class="screen">' +
        '<div class="hdr">' +
          '<div style="display:flex;align-items:baseline;justify-content:space-between">' +
            '<div class="hdr__title">Participants</div>' +
            '<div style="font:400 10px/1 var(--mono);color:var(--c-70)">41 IN · 19 OUT</div>' +
          '</div>' +
          '<div class="hdr__chips">' + chips + '</div>' +
        '</div>' +
        '<div style="flex:1;overflow:hidden;padding:13px 20px 0;display:flex;flex-direction:column;gap:9px">' +
          '<div class="field-line">' +
            S.forms.input({ bind: 'search.participants', placeholder: 'Search players', live: true }) +
          '</div>' +
          '<div class="card">' + (rows ||
            '<div class="empty">No players match “' + S.esc(S.formState.search.participants) + '”.</div>') + '</div>' +
        '</div>' +
        S.tabBar('participants') +
      '</div>';
    }
  };
})(window.S);
