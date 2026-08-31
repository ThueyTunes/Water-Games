/* The video-first Record Hit flow:
   camera → tag → review → status, plus the tagged player's confirm-or-deny. */

(function (S) {
  'use strict';

  /* ---- 1d · Camera ------------------------------------------------------ */
  // Bar is off this screen — it's a full-bleed capture surface.

  S.screens.camera = {
    id: 'camera', code: '1d', label: 'Camera', dark: true,
    render: function () {
      return '<div style="height:100%;position:relative;background:#0C1220;font-family:var(--sans);color:var(--cream)">' +
        '<div style="position:absolute;inset:0;background:repeating-linear-gradient(135deg,#22306E 0 8px,#1A2657 8px 16px)"></div>' +
        '<div style="position:absolute;top:50%;left:0;right:0;transform:translateY(-50%);text-align:center;font:400 11px/1.6 var(--mono);color:var(--c-40)">CAMERA PREVIEW<br/>live capture, ' + S.formState.camera.lens.toLowerCase() + ' lens</div>' +

        '<div style="position:absolute;top:56px;left:20px;right:20px;display:flex;align-items:center;justify-content:space-between">' +
          '<div style="display:flex;align-items:center;gap:9px;padding:8px 13px;border-radius:99px;background:rgba(12,18,32,.72);backdrop-filter:blur(8px)">' +
            '<div style="font:400 10px/1 var(--mono);letter-spacing:.1em;color:var(--c-80)">STEP 1 OF 3 · RECORD</div>' +
          '</div>' +
          '<div style="padding:7px 11px;border-radius:99px;background:rgba(232,51,42,.9);font:500 10px/1 var(--mono);letter-spacing:.1em">REC 0:06</div>' +
        '</div>' +

        '<div style="position:absolute;left:20px;right:20px;bottom:210px;padding:13px 15px;border-radius:12px;background:rgba(12,18,32,.72);backdrop-filter:blur(8px)">' +
          '<div style="font:400 9.5px/1 var(--mono);letter-spacing:.12em;color:var(--gold)">EVIDENCE RULES · PHASE 3</div>' +
          '<div style="font:400 12.5px/1.5 var(--sans);color:var(--c-80);margin-top:8px">Get the hit on camera first, then tag who you got. 5–30 seconds, hit visible. Trim or edit before you send it — filmed on your phone works too.</div>' +
          '<div style="display:flex;gap:9px;margin-top:11px;padding-top:11px;border-top:1px solid var(--c-14)">' +
            '<div style="width:9px;height:9px;border-radius:2px;background:var(--red);flex:none;margin-top:3px"></div>' +
            '<div style="font:500 12px/1.45 var(--sans);color:var(--red-soft)">Inappropriate videos get you banned from the game.</div>' +
          '</div>' +
        '</div>' +

        '<div style="position:absolute;left:0;right:0;bottom:0;padding:0 20px 40px;display:flex;align-items:center;justify-content:space-between">' +
          '<div style="width:52px;height:52px;border-radius:11px;background:var(--c-12);display:flex;align-items:center;justify-content:center;font:400 9px/1.3 var(--mono);text-align:center;color:var(--c-70)" data-go="tag">FROM<br/>ROLL</div>' +
          '<div style="width:86px;height:86px;border-radius:50%;border:4px solid rgba(252,247,234,.85);display:flex;align-items:center;justify-content:center" data-go="tag">' +
            '<div style="width:62px;height:62px;border-radius:16px;background:var(--red)"></div>' +
          '</div>' +
          '<div style="width:52px;height:52px;border-radius:11px;background:var(--c-12);display:flex;align-items:center;justify-content:center;font:400 9px/1.3 var(--mono);text-align:center;color:var(--c-70)" data-action="flip-lens">FLIP</div>' +
        '</div>' +
      '</div>';
    }
  };

  /* ---- 1c · Tag --------------------------------------------------------- */

  S.screens.tag = {
    id: 'tag', code: '1c', label: 'Tag',
    render: function () {
      // Team filters come from the teams actually in the game.
      var filters = ['All teams'].concat(S.data.teams.map(function (t) { return t.name; }))
        .map(function (f, i) {
          return i === 0
            ? '<div style="padding:7px 12px;border-radius:99px;background:var(--navy);color:var(--cream);font:500 11px/1 var(--sans)">' + S.esc(f) + '</div>'
            : '<div style="padding:7px 12px;border-radius:99px;border:1px solid var(--n-18);font:500 11px/1 var(--sans)">' + S.esc(f) + '</div>';
        }).join('');

      var q = S.formState.search.tag.trim().toLowerCase();
      var targets = S.data.targets.filter(function (t) {
        return !q || (t.name + ' ' + (t.meta || '')).toLowerCase().indexOf(q) >= 0;
      });

      var list = targets.map(function (t) {
        if (t.blocked) {
          return '<div style="display:flex;align-items:center;gap:12px;background:var(--n-04);border:1px dashed var(--n-20);border-radius:12px;padding:12px 14px">' +
            '<div class="hatch-av" style="width:44px;height:44px;border-radius:8px;opacity:.5"></div>' +
            '<div style="flex:1;opacity:.75"><div style="font:600 14.5px/1.2 var(--sans)">' + t.name + '</div>' +
              '<div style="font:400 11px/1.3 var(--sans);color:var(--n-55);margin-top:5px">' + t.blocked + '</div></div>' +
          '</div>';
        }
        return '<div style="display:flex;align-items:center;gap:12px;background:#fff;border:' +
            (t.picked ? '2px solid var(--gold)' : '1px solid var(--n-10)') + ';border-radius:12px;padding:12px 14px">' +
          '<div class="hatch-av" style="width:44px;height:44px;border-radius:8px"></div>' +
          '<div style="flex:1"><div style="font:600 14.5px/1.2 var(--sans)">' + t.name + '</div>' +
            '<div style="display:flex;align-items:center;gap:6px;margin-top:5px">' +
              '<div style="width:8px;height:8px;border-radius:2px;background:' + t.color + '"></div>' +
              '<div style="font:400 11px/1 var(--mono);color:var(--n-50)">' + t.meta + '</div>' +
            '</div></div>' +
          (t.picked ? '<div style="width:22px;height:22px;border-radius:50%;background:var(--gold);display:flex;align-items:center;justify-content:center;font:700 12px/1 var(--sans);color:var(--navy)">✓</div>' : '') +
        '</div>';
      }).join('');

      return '<div class="screen">' +
        '<div style="padding:56px 20px 14px;background:#fff;border-bottom:1px solid var(--n-10)">' +
          '<div style="display:flex;align-items:center;justify-content:space-between">' +
            '<div style="font:500 13px/1 var(--sans);color:var(--n-55)" data-go="home">Cancel</div>' +
            '<div style="font:400 10px/1 var(--mono);letter-spacing:.12em;color:var(--n-45)">STEP 2 OF 3 · TAG</div>' +
            '<div style="width:38px"></div>' +
          '</div>' +
          '<div style="display:flex;align-items:center;gap:12px;margin:14px 0 12px">' +
            '<div class="hatch-av" style="width:52px;height:52px;border-radius:9px;position:relative;flex:none">' +
              '<div style="position:absolute;left:5px;bottom:4px;font:400 8px/1 var(--mono);color:var(--n-60)">0:11</div>' +
            '</div>' +
            '<div><div style="font:700 24px/1.1 var(--serif)">Who did you get?</div>' +
              '<div style="font:400 10.5px/1 var(--mono);color:var(--green);margin-top:6px">VIDEO UPLOADING · 62%</div></div>' +
          '</div>' +
          '<div class="field-line" style="background:#F1EEE4;border-color:var(--n-12)">' +
            S.forms.input({ bind: 'search.tag', placeholder: 'Search players in this game', live: true }) +
          '</div>' +
          '<div style="display:flex;gap:7px;margin-top:12px">' + filters + '</div>' +
        '</div>' +

        '<div style="flex:1;overflow:hidden;padding:14px 20px 0;display:flex;flex-direction:column;gap:8px">' +
          (list || '<div class="empty">' + (S.data.targets.length ? 'No players match “' + S.esc(S.formState.search.tag) + '”.' : 'Nobody to tag yet — no other players have joined this game.') + '</div>') +
        '</div>' +

        '<div style="padding:12px 20px 34px;background:#fff;border-top:1px solid var(--n-10)">' +
          '<button class="cta" style="height:54px" data-go="review">NEXT · REVIEW</button>' +
        '</div>' +
      '</div>';
    }
  };

  /* ---- 1e · Review ------------------------------------------------------ */

  S.screens.review = {
    id: 'review', code: '1e', label: 'Review',
    render: function () {
      function line(k, v) {
        return '<div style="display:flex;justify-content:space-between;font:400 12.5px/1 var(--sans)">' +
          '<span style="color:var(--n-55)">' + k + '</span><span style="font-weight:600">' + v + '</span></div>';
      }

      // Whoever was picked in step 2. Nothing invented if nobody was.
      var tag = S.session.tagged;
      if (tag) tag.first = tag.name.split(' ')[0];

      return '<div class="screen">' +
        '<div style="padding:56px 20px 12px;display:flex;align-items:center;justify-content:space-between">' +
          '<div style="font:500 13px/1 var(--sans);color:var(--n-55)" data-go="tag">Back</div>' +
          '<div style="font:400 10px/1 var(--mono);letter-spacing:.12em;color:var(--n-45)">STEP 3 OF 3</div>' +
          '<div style="width:30px"></div>' +
        '</div>' +

        '<div style="flex:1;overflow:hidden;padding:0 20px;display:flex;flex-direction:column;gap:14px">' +
          '<div style="font:700 27px/1.15 var(--serif)">Check it, then send it in</div>' +
          '<div style="font:400 12.5px/1.45 var(--sans);color:var(--n-60);margin-top:-4px">' +
            (tag ? S.esc(tag.first) + ' says whether they got hit. If they deny it, an admin watches the video and decides.'
                 : 'Whoever you tagged says whether they got hit. If they deny it, an admin watches the video and decides.') +
          '</div>' +

          '<div style="border-radius:14px;overflow:hidden;border:1px solid var(--n-12);background:#fff">' +
            '<div class="hatch-vid-lg" style="height:212px;position:relative">' +
              '<div style="position:absolute;left:12px;bottom:12px;padding:5px 9px;border-radius:6px;background:rgba(22,37,107,.8);color:var(--cream);font:400 10px/1 var(--mono)">0:11 · 8.4 MB</div>' +
              '<div class="play-dot" style="width:54px;height:54px"></div>' +
            '</div>' +
            '<div style="display:flex;gap:10px;padding:12px">' +
              '<div style="flex:1;height:38px;border-radius:9px;border:1px solid var(--n-20);display:flex;align-items:center;justify-content:center;font:500 12px/1 var(--sans)" data-go="camera">Retake</div>' +
              '<div style="flex:1;height:38px;border-radius:9px;border:1px solid var(--n-20);display:flex;align-items:center;justify-content:center;font:500 12px/1 var(--sans)" data-action="trim">Trim</div>' +
            '</div>' +
          '</div>' +

          '<div style="background:#fff;border:1px solid var(--n-10);border-radius:12px;padding:14px 15px;display:flex;flex-direction:column;gap:11px">' +
            line('Who you hit', tag ? S.esc(tag.name) + (tag.team ? ' · ' + S.esc(tag.team) : '') : 'Not tagged yet') +
            line('Time of hit', 'Now') +
            line('Goes to', tag ? S.esc(tag.first) + ', then admin if denied' : 'Them, then admin if denied') +
            line('Visible to', 'Game participants') +
          '</div>' +

          '<div style="display:flex;gap:10px;padding:12px 14px;border-radius:12px;background:rgba(255,181,36,.14);border:1px solid rgba(255,181,36,.45)">' +
            '<div style="width:16px;height:16px;border-radius:4px;background:var(--gold);flex:none;margin-top:1px"></div>' +
            '<div style="font:400 12px/1.45 var(--sans);color:var(--gold-ink-soft)">Trim or re-edit as much as you like before sending. If they confirm the hit they’re out straight away. If they deny it, an admin makes the call.</div>' +
          '</div>' +
        '</div>' +

        '<div style="padding:12px 20px 34px">' +
          '<button class="cta cta--navy" data-go="status">SUBMIT ELIMINATION</button>' +
        '</div>' +
      '</div>';
    }
  };

  /* ---- 1f · Status ------------------------------------------------------ */

  S.screens.status = {
    id: 'status', code: '1f', label: 'Status',
    render: function () {
      function step(o) {
        return '<div style="display:flex;gap:13px">' +
          '<div style="display:flex;flex-direction:column;align-items:center">' +
            '<div style="width:11px;height:11px;border-radius:50%;background:' + o.dot + '"></div>' +
            (o.last ? '' : '<div style="width:2px;flex:1;background:rgba(22,37,107,.15)"></div>') +
          '</div>' +
          '<div' + (o.last ? '' : ' style="padding-bottom:16px"') + '>' +
            '<div style="font:600 13px/1.2 var(--sans)' + (o.pending ? ';color:var(--n-40)' : '') + '">' + o.title + '</div>' +
            '<div style="font:400 11px/' + (o.mono ? '1 var(--mono)' : '1.45 var(--sans)') + ';color:' +
              (o.pending ? 'rgba(22,37,107,.35)' : 'var(--n-55)') + ';margin-top:5px">' + o.note + '</div>' +
          '</div>' +
        '</div>';
      }

      var p = S.session.pending;

      // Nothing submitted yet — no invented player, no fake timeline.
      if (!p) {
        return '<div class="screen">' +
          '<div style="padding:56px 20px 18px;background:linear-gradient(120deg,var(--navy),var(--navy-bright));color:var(--cream)">' +
            '<div style="font:500 13px/1 var(--sans);color:var(--c-60)" data-go="hits">‹ Activity</div>' +
            '<div style="font:700 28px/1.15 var(--serif);margin-top:18px">My hits</div>' +
            '<div style="font:400 11px/1 var(--mono);color:var(--c-55);margin-top:8px">NOTHING SUBMITTED</div>' +
          '</div>' +
          '<div style="flex:1;overflow:hidden;padding:16px 20px 0;display:flex;flex-direction:column;gap:14px">' +
            '<div class="card"><div class="empty">You haven’t submitted a hit yet. Record one and its review status shows up here.</div></div>' +
          '</div>' +
          '<div style="padding:12px 20px 12px">' +
            '<button class="cta" style="height:52px" data-go="camera">RECORD A HIT</button>' +
          '</div>' +
          S.tabBar('home') +
        '</div>';
      }

      var first = p.target.split(' ')[0];
      return '<div class="screen">' +
        '<div style="padding:56px 20px 18px;background:linear-gradient(120deg,var(--navy),var(--navy-bright));color:var(--cream)">' +
          '<div style="font:500 13px/1 var(--sans);color:var(--c-60)" data-go="hits">‹ Activity</div>' +
          '<div style="display:inline-flex;align-items:center;gap:8px;margin-top:18px;padding:6px 11px;border-radius:99px;background:rgba(255,181,36,.18);border:1px solid rgba(255,181,36,.55)">' +
            '<div style="width:6px;height:6px;border-radius:50%;background:var(--gold)"></div>' +
            '<div style="font:500 10px/1 var(--mono);letter-spacing:.12em;color:var(--gold-light)">UNDER REVIEW</div>' +
          '</div>' +
          '<div style="font:700 28px/1.15 var(--serif);margin-top:14px">You → ' + S.esc(p.target) + '</div>' +
          '<div style="font:400 11px/1 var(--mono);color:var(--c-55);margin-top:8px">SUBMITTED ' + S.esc(p.at) + '</div>' +
        '</div>' +

        '<div style="flex:1;overflow:hidden;padding:16px 20px 0;display:flex;flex-direction:column;gap:14px">' +
          '<div class="hatch-vid-lg" style="height:170px;border-radius:14px;position:relative;border:1px solid var(--n-12)">' +
            '<div class="play-dot" style="width:50px;height:50px"></div>' +
            '<div style="position:absolute;right:12px;top:12px;padding:5px 9px;border-radius:6px;background:rgba(22,37,107,.8);color:var(--cream);font:400 9.5px/1 var(--mono)">NOT PUBLIC YET</div>' +
          '</div>' +
          '<div class="mono-label">TIMELINE</div>' +
          '<div style="display:flex;flex-direction:column;gap:0">' +
            step({ dot: 'var(--green)', title: 'Submitted', note: 'VIDEO VERIFIED ON SERVER', mono: true }) +
            step({ dot: 'var(--green)', title: 'Eligibility checks passed', note: 'Different teams · target alive · phase active' }) +
            step({ dot: 'var(--gold)', title: 'Sent to ' + S.esc(p.target) + ' to confirm', note: 'If they deny it, an admin reviews' }) +
            step({ dot: 'rgba(22,37,107,.18)', title: S.esc(first) + ' eliminated', note: 'PENDING', mono: true, pending: true, last: true }) +
          '</div>' +
        '</div>' +

        '<div style="padding:12px 20px 12px;display:flex;gap:10px">' +
          '<div style="flex:1;height:52px;border-radius:12px;border:1px solid rgba(232,51,42,.5);color:var(--red);display:flex;align-items:center;justify-content:center;font:600 13px/1 var(--sans)" data-action="withdraw">Withdraw</div>' +
          '<div style="flex:1.4;height:52px;border-radius:12px;background:var(--navy);color:var(--cream);display:flex;align-items:center;justify-content:center;font:600 13px/1 var(--sans)" data-action="message-admin">Message admin</div>' +
        '</div>' +
        S.tabBar('home') +
      '</div>';
    }
  };

  /* ---- 1s · Confirm hit ------------------------------------------------- */
  // The tagged player's side: confirm or deny.

  S.screens.confirm = {
    id: 'confirm', code: '1s', label: 'Confirm hit',
    render: function () {
      function line(k, v) {
        return '<div style="display:flex;justify-content:space-between;font:400 12.5px/1 var(--sans)">' +
          '<span style="color:var(--n-55)">' + k + '</span><span style="font-weight:600">' + v + '</span></div>';
      }

      var claim = S.session.incoming;

      // Nobody has claimed a hit on you — nothing to confirm or deny.
      if (!claim) {
        return '<div class="screen">' +
          '<div style="padding:56px 20px 20px;background:linear-gradient(120deg,var(--navy),var(--navy-bright));color:var(--cream)">' +
            '<div style="font:400 10px/1 var(--mono);letter-spacing:.14em;color:var(--c-80)">CLAIMS AGAINST YOU</div>' +
            '<div style="font:700 30px/1.1 var(--serif);margin-top:14px">Nobody’s got you</div>' +
            '<div style="font:400 11px/1 var(--mono);color:var(--c-75);margin-top:10px">NOTHING TO ANSWER</div>' +
          '</div>' +
          '<div style="flex:1;overflow:hidden;padding:16px 20px 0;display:flex;flex-direction:column;gap:13px">' +
            '<div class="card"><div class="empty">When someone claims they soaked you, their clip lands here and you confirm or deny it.</div></div>' +
          '</div>' +
          S.tabBar('home') +
        '</div>';
      }

      var by = claim.by.split(' ')[0];
      return '<div class="screen">' +
        '<div style="padding:56px 20px 20px;background:linear-gradient(120deg,var(--red),var(--orange));color:var(--cream)">' +
          '<div style="font:400 10px/1 var(--mono);letter-spacing:.14em;color:var(--c-80)">SOMEONE SAYS THEY GOT YOU</div>' +
          '<div style="font:700 30px/1.1 var(--serif);margin-top:14px">Did ' + S.esc(by) + ' soak you?</div>' +
          '<div style="font:400 11px/1 var(--mono);color:var(--c-75);margin-top:10px">YOU HAVE 22H TO ANSWER</div>' +
        '</div>' +

        '<div style="flex:1;overflow:hidden;padding:16px 20px 0;display:flex;flex-direction:column;gap:13px">' +
          '<div class="hatch-vid-lg" style="height:214px;border-radius:14px;position:relative;border:1px solid var(--n-12)">' +
            '<div class="play-dot" style="width:54px;height:54px"></div>' +
            '<div style="position:absolute;left:12px;bottom:12px;padding:5px 9px;border-radius:6px;background:rgba(22,37,107,.8);color:var(--cream);font:400 10px/1 var(--mono)">0:11 · WATCH IT TWICE</div>' +
          '</div>' +

          '<div style="background:#fff;border:1px solid var(--n-10);border-radius:12px;padding:13px 15px;display:flex;flex-direction:column;gap:10px">' +
            line('Claimed by', S.esc(claim.by) + (claim.team ? ' · ' + S.esc(claim.team) : '')) +
            line('When', S.esc(claim.at)) +
            line('Counts toward', claim.team ? S.esc(claim.team) : 'Their team') +
          '</div>' +

          '<div style="display:flex;gap:10px;padding:12px 14px;border-radius:12px;background:var(--n-05)">' +
            '<div style="width:15px;height:15px;border-radius:4px;background:var(--navy);flex:none;margin-top:1px"></div>' +
            '<div style="font:400 11.5px/1.5 var(--sans);color:var(--n-70)">Say yes and you\'re out of the game — it\'s final. Say no and an admin watches the video and decides for both of you.</div>' +
          '</div>' +
        '</div>' +

        '<div style="padding:12px 20px 12px;display:flex;flex-direction:column;gap:9px">' +
          '<button class="cta cta--red" data-go="leaderboard">YEAH, THEY GOT ME</button>' +
          '<div style="height:52px;border-radius:12px;background:#fff;border:1px solid var(--n-25);display:flex;align-items:center;justify-content:center;font:600 13px/1 var(--sans)" data-go="home">No — send it to an admin</div>' +
        '</div>' +
        S.tabBar('home') +
      '</div>';
    }
  };
})(window.S);
