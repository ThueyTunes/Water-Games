/* Team join/create, standings, team detail and profile. */

(function (S) {
  'use strict';

  /* ---- 1o · Teams ------------------------------------------------------- */

  S.screens.teams = {
    id: 'teams', code: '1o', label: 'Teams',
    render: function () {
      var list = S.data.openTeams.map(function (t) {
        return '<div style="display:flex;align-items:center;gap:12px;background:#fff;border:' +
            (t.pick ? '2px solid var(--gold)' : '1px solid var(--n-10)') + ';border-radius:12px;padding:12px 14px">' +
          '<div class="team-bar" style="background:' + t.color + '"></div>' +
          '<div style="flex:1"><div style="font:600 14px/1.2 var(--sans)">' + t.name + '</div>' +
            '<div style="font:400 10.5px/1 var(--mono);color:var(--n-50);margin-top:5px">' + t.meta + '</div></div>' +
          '<div style="padding:6px 11px;border-radius:99px;background:rgba(255,181,36,.2);font:600 10px/1 var(--mono);color:var(--gold-ink)">ASK</div>' +
        '</div>';
      }).join('');

      return '<div class="screen">' +
        '<div style="padding:56px 20px 18px;background:linear-gradient(120deg,var(--navy),var(--navy-bright));color:var(--cream)">' +
          '<div style="font:700 28px/1.1 var(--serif)">Pick your team</div>' +
          '<div style="font:400 12.5px/1.5 var(--sans);color:var(--c-65);margin-top:10px">You\'re paid in but teamless. Join a team with an open slot, or start your own.</div>' +
        '</div>' +

        '<div style="flex:1;overflow:hidden;padding:16px 20px 0;display:flex;flex-direction:column;gap:10px">' +
          '<div class="field-line" style="height:44px">' +
            S.forms.input({ bind: 'join.teamCode', placeholder: 'Enter a team code', maxlength: 8 }) +
          '</div>' +
          '<div style="display:flex;align-items:baseline;justify-content:space-between;margin-top:4px">' +
            '<div class="mono-label">OPEN SLOTS</div>' +
            '<div style="font:400 10px/1 var(--mono);color:var(--n-40)">4 OF 9 TEAMS</div>' +
          '</div>' +
          list +

          '<div style="display:flex;align-items:center;gap:11px;margin:10px 0 4px">' +
            '<div style="flex:1;height:1px;background:var(--n-14)"></div>' +
            '<div style="font:400 10px/1 var(--mono);letter-spacing:.1em;color:var(--n-40)">OR RUN YOUR OWN</div>' +
            '<div style="flex:1;height:1px;background:var(--n-14)"></div>' +
          '</div>' +

          '<div style="background:#fff;border:1px solid rgba(255,181,36,.6);border-radius:12px;padding:15px" data-go="newteam">' +
            '<div style="display:flex;align-items:baseline;justify-content:space-between">' +
              '<div style="font:600 15px/1.2 var(--sans)">Create a team</div>' +
              '<div style="font:700 19px/1 var(--serif);color:var(--gold-ink)">$5</div>' +
            '</div>' +
            '<div style="font:400 12px/1.5 var(--sans);color:var(--n-60);margin-top:8px">One-time fee to start a team. You become captain, name it, pick a color, and invite up to 4 players. $3 goes to the pot.</div>' +
          '</div>' +
        '</div>' +

        '<div style="padding:12px 20px 12px;display:flex;gap:10px">' +
          '<button class="cta" style="flex:1.3;height:54px;font-size:14px;letter-spacing:.08em" data-go="team">ASK TO JOIN TIDE</button>' +
          '<div style="flex:1;height:54px;border-radius:12px;border:1px solid var(--n-25);display:flex;align-items:center;justify-content:center;font:600 12.5px/1 var(--sans)" data-go="newteam">Create · $5</div>' +
        '</div>' +
        S.tabBar('chat') +
      '</div>';
    }
  };

  /* ---- 1p · New team ---------------------------------------------------- */

  S.screens.newteam = {
    id: 'newteam', code: '1p', label: 'New team',
    render: function () {
      // Faded swatches are colors already claimed in this game.
      var swatches = [
        { c: '#12A66B', taken: true },
        { c: '#E8332A', taken: true },
        { c: '#7C3AED', taken: true },
        { c: '#1F79F5', taken: true },
        { c: '#F0A500' },
        { c: '#16256B' }
      ].map(function (s) {
        // Taken colors render faded and aren't selectable.
        if (s.taken) {
          return '<div class="pick--swatch is-taken" style="background:' + s.c + '"></div>';
        }
        return S.forms.pick('newteam.color', s.c, '', 'pick--swatch') .replace(
          'class="pick pick--swatch"', 'class="pick pick--swatch" style="background:' + s.c + '"');
      }).join('');

      var slots = [0, 1, 2, 3].map(function () {
        return '<div style="width:34px;height:34px;border-radius:50%;border:1px dashed var(--n-30);display:flex;align-items:center;justify-content:center;font:400 14px/1 var(--sans);color:var(--n-35)" data-action="invite">+</div>';
      }).join('');

      return '<div class="screen">' +
        '<div style="padding:56px 22px 12px;display:flex;align-items:center;justify-content:space-between">' +
          '<div style="font:500 13px/1 var(--sans);color:var(--n-55)" data-go="teams">‹ Back</div>' +
          '<div style="font:400 10px/1 var(--mono);letter-spacing:.12em;color:var(--n-45)">NEW TEAM</div>' +
          '<div style="width:34px"></div>' +
        '</div>' +

        '<div style="flex:1;overflow:hidden;padding:0 22px;display:flex;flex-direction:column;gap:14px">' +
          '<div style="font:700 30px/1.1 var(--serif);margin-top:6px">Start a team</div>' +

          '<div>' +
            '<div class="field-label" style="color:var(--n-50)">TEAM NAME</div>' +
            '<div class="field" style="height:50px;background:#fff;border-color:var(--n-14);justify-content:space-between">' +
              S.forms.input({ bind: 'newteam.name', cls: 'inp--teamname', placeholder: 'Team name', maxlength: 18 }) +
              '<div style="font:400 10px/1 var(--mono);color:var(--green);flex:none">AVAILABLE</div>' +
            '</div>' +
          '</div>' +

          '<div>' +
            '<div class="field-label" style="color:var(--n-50);margin-bottom:8px">TEAM COLOR</div>' +
            '<div style="display:flex;gap:9px">' + swatches + '</div>' +
            '<div style="font:400 11px/1.4 var(--sans);color:var(--n-50);margin-top:8px">Faded colors are already taken in this game.</div>' +
          '</div>' +

          '<div style="background:#fff;border:1px solid var(--n-10);border-radius:12px;padding:13px 15px">' +
            '<div style="display:flex;align-items:baseline;justify-content:space-between">' +
              '<div class="field-label" style="color:var(--n-50);margin:0">ROSTER · 5 MAX</div>' +
              '<div style="font:400 11px/1 var(--sans);color:var(--n-55)">You\'re captain · invite 4</div>' +
            '</div>' +
            '<div style="display:flex;align-items:center;gap:9px;margin-top:12px">' + S.avatar(34) + slots + '</div>' +
          '</div>' +

          '<div style="flex:none;background:#fff;border:1px solid var(--n-12);border-radius:12px;overflow:hidden">' +
            '<div style="display:flex;align-items:flex-end;justify-content:space-between;padding:15px 15px 13px">' +
              '<div>' +
                '<div class="field-label" style="color:var(--n-50);margin:0">TEAM CREATION FEE</div>' +
                '<div style="font:700 34px/1 var(--serif);margin-top:9px">$5.00</div>' +
              '</div>' +
              '<div style="text-align:right;font:400 10.5px/1.5 var(--mono);color:var(--n-45)">CHARGED ONCE<br/>APPLE PAY ···· 4417</div>' +
            '</div>' +
            '<div style="padding:12px 15px;border-top:1px solid var(--n-07);display:flex;flex-direction:column;gap:9px">' +
              '<div style="display:flex;justify-content:space-between;align-items:center">' +
                '<div style="display:flex;align-items:center;gap:9px"><div style="width:9px;height:9px;border-radius:2px;background:var(--green)"></div>' +
                '<div style="font:400 12px/1 var(--sans)">To the Westside prize pot</div></div>' +
                '<div style="font:600 12px/1 var(--sans)">$3.00</div>' +
              '</div>' +
              '<div style="display:flex;justify-content:space-between;align-items:center">' +
                '<div style="display:flex;align-items:center;gap:9px"><div style="width:9px;height:9px;border-radius:2px;background:var(--gold)"></div>' +
                '<div style="font:400 12px/1 var(--sans)">Soaked platform fee</div></div>' +
                '<div style="font:600 12px/1 var(--sans)">$2.00</div>' +
              '</div>' +
              '<div style="display:flex;height:8px;border-radius:4px;overflow:hidden;margin-top:3px">' +
                '<div style="flex:3;background:var(--green)"></div><div style="flex:2;background:var(--gold)"></div>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<div style="padding:12px 22px 12px">' +
          '<button class="cta" data-cta="newteam" data-muted="ink" data-go="team">PAY $5 &amp; CREATE TEAM</button>' +
        '</div>' +
        S.tabBar('chat') +
      '</div>';
    }
  };

  /* ---- 1h · Standings --------------------------------------------------- */

  S.screens.standings = {
    id: 'standings', code: '1h', label: 'Standings',
    render: function () {
      var mode = S.formState.filters.standings;
      var chips = ['Teams', 'Players', 'Survival'].map(function (c) {
        return S.forms.pick('filters.standings', c, c,
          'pick--chip').replace('class="pick pick--chip"', 'class="pick pick--chip" style="padding:8px 13px"');
      }).join('');

      // One card shape, three rankings poured into it.
      function card(o) {
        return '<div style="display:flex;align-items:center;gap:13px;background:#fff;border:' +
            (o.mine ? '2px solid var(--green)' : '1px solid var(--n-10)') + ';border-radius:12px;padding:14px 15px"' +
            (o.go ? ' data-go="' + o.go + '"' : '') + '>' +
          '<div style="font:700 22px/1 var(--serif);width:26px">' + o.rank + '</div>' +
          (o.avatar ? '<div class="hatch-av" style="width:40px;height:40px;border-radius:8px;flex:none"></div>'
                    : '<div class="team-bar" style="background:' + o.color + '"></div>') +
          '<div style="flex:1">' +
            (o.mine
              ? '<div style="display:flex;align-items:center;gap:7px"><div style="font:600 15px/1.2 var(--sans)">' + o.name + '</div>' +
                '<div style="padding:3px 6px;border-radius:4px;background:rgba(18,166,107,.15);font:600 8.5px/1 var(--mono);letter-spacing:.08em;color:var(--green)">YOURS</div></div>'
              : '<div style="font:600 15px/1.2 var(--sans)' + (o.out ? ';text-decoration:line-through' : '') + '">' + o.name + '</div>') +
            '<div style="font:400 10.5px/1 var(--mono);color:var(--n-50);margin-top:5px">' + o.meta + '</div>' +
          '</div>' +
          '<div style="text-align:right"><div style="font:700 22px/1 var(--serif)">' + o.score + '</div>' +
            '<div style="font:400 9px/1 var(--mono);color:var(--n-45);margin-top:4px">' + o.unit + '</div></div>' +
        '</div>';
      }

      var rows, caption;

      if (mode === 'Players') {
        caption = 'APPROVED HITS · EVERY PHASE';
        rows = S.data.leaders.slice().sort(function (a, b) { return b.elims - a.elims; })
          .slice(0, 4).map(function (p, i) {
            return card({ rank: i + 1, name: p.name, meta: p.meta + ' · ' + p.phase3 + ' THIS PHASE',
              score: p.elims, unit: 'HITS', avatar: true, out: p.out, mine: p.mine });
          }).join('');
      } else if (mode === 'Survival') {
        caption = 'PLAYERS STILL IN · 5 PER TEAM';
        rows = S.data.teams.slice().sort(function (a, b) { return b.alive - a.alive || b.hits - a.hits; })
          .slice(0, 4).map(function (t, i) {
            return card({ rank: i + 1, name: t.name, color: t.color,
              meta: (5 - t.alive) + ' LOST · ' + t.hits + ' HITS',
              score: t.alive, unit: 'ALIVE', mine: t.mine, go: t.mine ? 'team' : null });
          }).join('');
      } else {
        caption = 'APPROVED HITS · PHASE 3 QUOTA: 3 PER TEAM';
        rows = S.data.teams.slice(0, 4).map(function (t, i) {
          return card({ rank: i + 1, name: t.name, color: t.color,
            meta: t.alive + ' ALIVE · ' + t.phase, score: t.hits, unit: 'HITS',
            mine: t.mine, go: t.mine ? 'team' : null });
        }).join('');
      }

      return '<div class="screen">' +
        '<div style="padding:56px 20px 16px;background:linear-gradient(120deg,var(--navy-bright),var(--navy));color:var(--cream)">' +
          '<div style="font:700 28px/1.1 var(--serif)">Standings</div>' +
          '<div style="display:flex;gap:7px;margin-top:16px">' + chips + '</div>' +
        '</div>' +

        '<div style="flex:1;overflow:hidden;padding:16px 20px 0;display:flex;flex-direction:column;gap:9px">' +
          '<div style="font:400 10px/1 var(--mono);letter-spacing:.1em;color:var(--n-45)">' + caption + '</div>' +
          rows +
          '<div style="margin-top:8px;padding:14px 15px;border-radius:12px;background:var(--canvas);border:1px dashed var(--n-20)">' +
            '<div style="font:400 10px/1 var(--mono);letter-spacing:.1em;color:var(--n-50)">YOUR LINE</div>' +
            '<div style="display:flex;align-items:center;gap:13px;margin-top:11px">' +
              '<div style="font:700 20px/1 var(--serif);width:26px">7</div>' +
              '<div class="hatch-av" style="width:40px;height:40px;border-radius:8px"></div>' +
              '<div style="flex:1"><div style="font:600 14px/1.2 var(--sans)">You</div>' +
                '<div style="font:400 10.5px/1 var(--mono);color:var(--n-50);margin-top:5px">3 HITS · 1 PENDING</div></div>' +
              '<div style="font:400 11px/1 var(--sans);color:var(--green)">+2 this week</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        S.tabBar('leaderboard') +
      '</div>';
    }
  };

  /* ---- 1i · Team -------------------------------------------------------- */

  S.screens.team = {
    id: 'team', code: '1i', label: 'Team',
    render: function () {
      var roster = S.data.roster.map(function (m) {
        return '<div style="display:flex;align-items:center;gap:12px;background:' +
            (m.out ? 'var(--n-04);border:1px solid var(--n-08)' : '#fff;border:1px solid var(--n-10)') +
            ';border-radius:12px;padding:11px 13px">' +
          '<div class="hatch-av" style="width:42px;height:42px;border-radius:50%' + (m.out ? ';opacity:.5' : '') + '"></div>' +
          '<div style="flex:1' + (m.out ? ';opacity:.7' : '') + '">' +
            (m.captain
              ? '<div style="display:flex;align-items:center;gap:7px"><div style="font:600 14px/1.2 var(--sans)">' + m.name + '</div>' +
                '<div style="padding:3px 6px;border-radius:4px;background:var(--gold);font:600 8.5px/1 var(--mono);letter-spacing:.06em;color:var(--navy)">CAPTAIN</div></div>'
              : '<div style="font:600 14px/1.2 var(--sans)' + (m.out ? ';text-decoration:line-through' : '') + '">' + m.name + '</div>') +
            '<div style="font:400 10.5px/1 var(--mono);color:var(--n-50);margin-top:5px">' + m.meta + '</div>' +
          '</div>' +
          (m.dot ? '<div style="width:7px;height:7px;border-radius:50%;background:var(--green)"></div>' : '') +
        '</div>';
      }).join('');

      function stat(v, l) {
        return '<div><div style="font:700 20px/1 var(--serif)">' + v + '</div>' +
          '<div style="font:400 9.5px/1 var(--mono);letter-spacing:.08em;color:var(--c-70);margin-top:5px">' + l + '</div></div>';
      }

      return '<div class="screen">' +
        '<div style="padding:56px 20px 20px;background:linear-gradient(120deg,var(--green-deep),var(--green-light));color:var(--cream);position:relative;overflow:hidden">' +
          '<div style="position:absolute;inset:0;background:repeating-linear-gradient(115deg,rgba(255,255,255,.06) 0 12px,transparent 12px 30px)"></div>' +
          '<div style="position:relative;font:500 13px/1 var(--sans);color:var(--c-75)" data-go="teams">‹ Teams</div>' +
          '<div style="position:relative;font:700 34px/1.05 var(--serif);margin-top:16px">Riptide</div>' +
          '<div style="position:relative;display:flex;gap:24px;margin-top:16px">' +
            stat('2nd', 'PLACE') + stat('12', 'HITS') + stat('3/5', 'ALIVE') +
          '</div>' +
        '</div>' +

        '<div style="flex:1;overflow:hidden;padding:16px 20px 0;display:flex;flex-direction:column;gap:9px">' +
          '<div style="display:flex;align-items:baseline;justify-content:space-between">' +
            '<div class="mono-label">ROSTER · 5 MAX</div>' +
            '<div style="font:400 10px/1 var(--mono);color:var(--n-40)">CAPTAIN: MAYA O.</div>' +
          '</div>' +
          roster +
        '</div>' +

        '<div style="padding:12px 20px 12px">' +
          '<div style="height:52px;border-radius:12px;border:1px solid var(--n-20);display:flex;align-items:center;justify-content:center;font:600 13px/1 var(--sans)" data-go="chat">Team chat · 4 new</div>' +
        '</div>' +
        S.tabBar('chat') +
      '</div>';
    }
  };

  /* ---- 1j · Profile ----------------------------------------------------- */

  S.screens.profile = {
    id: 'profile', code: '1j', label: 'Profile',
    render: function () {
      function stat(v, l) {
        return '<div style="flex:1;background:#fff;border:1px solid var(--n-10);border-radius:12px;padding:13px 14px">' +
          '<div style="font:700 24px/1 var(--serif)">' + v + '</div>' +
          '<div style="font:400 9px/1.3 var(--mono);letter-spacing:.06em;color:var(--n-50);margin-top:6px">' + l + '</div></div>';
      }
      function clip(t) {
        return '<div class="hatch-vid" style="flex:1;height:132px;border-radius:11px;position:relative">' +
          '<div style="position:absolute;left:8px;bottom:8px;font:400 9px/1 var(--mono);color:var(--n-60)">' + t + '</div></div>';
      }
      function game(name, meta, pill, alive) {
        return '<div style="display:flex;align-items:center;gap:12px;padding:12px 14px' +
            (alive ? ';border-bottom:1px solid var(--n-08)' : '') + '">' +
          '<div style="flex:1"><div style="font:600 13px/1.2 var(--sans)">' + name + '</div>' +
            '<div style="font:400 10px/1 var(--mono);color:var(--n-50);margin-top:5px">' + meta + '</div></div>' +
          '<div style="padding:4px 8px;border-radius:5px;background:' +
            (alive ? 'rgba(18,166,107,.14);font:600 9px/1 var(--mono);color:var(--green)' : 'var(--n-08);font:600 9px/1 var(--mono);color:var(--n-55)') +
            '">' + pill + '</div>' +
        '</div>';
      }

      return '<div class="screen">' +
        '<div style="padding:56px 20px 22px;background:linear-gradient(140deg,var(--navy) 40%,var(--team-purple) 100%);color:var(--cream)">' +
          '<div style="display:flex;gap:15px;align-items:center">' +
            '<div class="hatch-navy" style="width:76px;height:76px;border-radius:50%"></div>' +
            '<div style="flex:1">' +
              '<div style="font:700 26px/1.1 var(--serif)">Maya Okonkwo</div>' +
              '<div style="font:400 10.5px/1 var(--mono);color:var(--c-55);margin-top:7px">JOINED MAY \'26</div>' +
              '<div style="display:flex;align-items:center;gap:7px;margin-top:9px"><div style="width:9px;height:9px;border-radius:2px;background:var(--green)"></div>' +
                '<div style="font:400 11.5px/1 var(--sans);color:var(--c-80)">Riptide · captain</div></div>' +
            '</div>' +
          '</div>' +
          '<div style="font:400 12.5px/1.5 var(--sans);color:var(--c-70);margin-top:16px">Cross country. Undefeated in the parking lot. Will not be caught twice.</div>' +
          '<div style="display:inline-flex;align-items:center;gap:8px;margin-top:16px;padding:6px 11px;border-radius:99px;background:rgba(255,181,36,.16);border:1px solid rgba(255,181,36,.45)">' +
            '<div style="width:6px;height:6px;border-radius:50%;background:var(--gold)"></div>' +
            '<div style="font:500 10px/1 var(--mono);letter-spacing:.1em;color:var(--gold-light)">FAIR GAME · NOT ON YOUR TEAM</div>' +
          '</div>' +
        '</div>' +

        '<div style="flex:1;overflow:hidden;padding:16px 20px 0;display:flex;flex-direction:column;gap:13px">' +
          '<div style="display:flex;gap:9px">' +
            stat('5', 'HITS<br/>LANDED') + stat('1', 'TIMES<br/>SOAKED') + stat('12d', 'LONGEST<br/>SURVIVAL') +
          '</div>' +
          '<div class="mono-label">APPROVED CLIPS</div>' +
          '<div style="display:flex;gap:9px">' + clip('0:14') + clip('0:09') + clip('0:22') + '</div>' +
          '<div class="mono-label" style="margin-top:2px">GAME HISTORY</div>' +
          '<div class="card">' +
            game("Westside Soak '26", 'ACTIVE · PHASE 3 · WEEK 3', 'ALIVE', true) +
            game('Junior Spring Skirmish', 'COMPLETED · 4TH OF 60', 'OUT', false) +
          '</div>' +
        '</div>' +

        '<div style="padding:12px 20px 12px;display:flex;gap:10px">' +
          '<button class="cta" style="flex:1;height:52px;font-size:13.5px;letter-spacing:.08em" data-go="camera">RECORD A HIT</button>' +
          '<div style="width:52px;height:52px;border-radius:12px;border:1px solid var(--n-20);display:flex;align-items:center;justify-content:center;font:400 9px/1.2 var(--mono);text-align:center;color:var(--n-60)" data-action="report">RE<br/>PORT</div>' +
        '</div>' +
        S.tabBar('participants') +
      '</div>';
    }
  };
})(window.S);
