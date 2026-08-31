/* Sign up → verify → sign in → join game → payment.
   The tab bar is off the auth and payment screens except where the mockup
   explicitly draws it (Join game keeps it, inert). */

(function (S) {
  'use strict';

  var GRADES = ['8th', '9th', '10th', '11th', '12th'];

  // Sign-in greeting couplets, from the mockup's <script data-dc-script>.
  var GREETINGS = [
    ['Phase 3', 'is live.'],
    ['Somebody', 'is looking for you.'],
    ['41 left.', 'Still one of them?'],
    ['Dry so far.', 'Keep it that way.'],
    ['Day 12.', 'Eyes up.'],
    ['Your team', 'is waiting.'],
    ['Six days', 'to the cut.'],
    ['Stay dry,', 'stay in.']
  ];

  /* ---- 1q · Sign up ----------------------------------------------------- */

  S.screens.signup = {
    id: 'signup', code: '1q', label: 'Sign up', dark: true,
    render: function () {
      var grades = GRADES.map(function (g) {
        return S.forms.pick('signup.grade', g, g, 'pick--grade');
      }).join('');

      return '<div class="screen screen--navy">' +
        '<div class="jersey"></div>' +
        '<div style="position:relative;flex:1;overflow:hidden;padding:66px 26px 0;display:flex;flex-direction:column">' +
          '<div style="display:flex;align-items:baseline;justify-content:space-between">' +
            '<div style="font:700 22px/1 var(--serif);letter-spacing:.03em">SOAKED</div>' +
            '<div style="font:500 12.5px/1 var(--sans);color:var(--c-60)" data-go="signin">Sign in</div>' +
          '</div>' +
          '<div style="font:700 34px/1.08 var(--serif);margin-top:32px">Make an account</div>' +
          '<div style="font:400 12.5px/1.5 var(--sans);color:var(--c-60);margin-top:10px">Open to 8th grade through seniors. You\'ll need a game code to actually play.</div>' +

          '<div style="display:flex;flex-direction:column;gap:11px;margin-top:24px">' +
            '<div>' +
              '<div class="field-label">PHONE NUMBER</div>' +
              '<div class="field field--split">' +
                S.forms.input({ bind: 'signup.phone', format: 'phone', inputmode: 'tel', placeholder: '(555) 555-0100' }) +
                '<div style="font:400 10px/1 var(--mono);color:var(--c-50);flex:none">US +1</div>' +
              '</div>' +
            '</div>' +
            '<div style="display:flex;gap:10px">' +
              '<div style="flex:1"><div class="field-label">FIRST NAME</div><div class="field">' +
                S.forms.input({ bind: 'signup.first', placeholder: 'First' }) + '</div></div>' +
              '<div style="flex:1"><div class="field-label">LAST NAME</div><div class="field">' +
                S.forms.input({ bind: 'signup.last', placeholder: 'Last' }) + '</div></div>' +
            '</div>' +
            '<div style="font:400 11px/1.45 var(--sans);color:var(--c-50);margin-top:-2px">Real names only — no nicknames or handles. Everyone in the game sees this.</div>' +
            '<div>' +
              '<div class="field-label">SET A PASSWORD</div>' +
              '<div class="field field--split">' +
                S.forms.input({ bind: 'signup.password', type: 'password', placeholder: 'At least 8 characters' }) +
                '<div class="reveal" data-reveal="signup.showPw">SHOW</div>' +
              '</div>' +
            '</div>' +
          '</div>' +

          '<div style="margin-top:18px">' +
            '<div class="field-label" style="margin-bottom:8px">GRADE</div>' +
            '<div style="display:flex;gap:7px">' + grades + '</div>' +
          '</div>' +

          '<div style="display:flex;gap:10px;padding:13px 14px;border-radius:11px;background:var(--c-06);margin-top:14px">' +
            S.forms.checkbox('signup.agree') +
            '<div style="font:400 11.5px/1.5 var(--sans);color:var(--c-70)">I\'m in 8th grade through senior year and I agree to play by the game\'s safety rules. Soaked is not affiliated with any school.</div>' +
          '</div>' +
        '</div>' +
        '<div style="position:relative;padding:14px 26px 34px">' +
          '<button class="cta" data-cta="signup" data-action="request-code">TEXT ME A CODE</button>' +
          (S.otp.state.error
            ? '<div class="form-error">' + S.esc(S.otp.state.error) + '</div>'
            : '<div style="text-align:center;font:400 10.5px/1.5 var(--mono);color:var(--c-35);margin-top:12px">ONE-TIME CODE TO CONFIRM YOUR NUMBER</div>') +
        '</div>' +
      '</div>';
    }
  };

  /* ---- 1r · Verify phone ------------------------------------------------ */

  S.screens.verify = {
    id: 'verify', code: '1r', label: 'Verify phone', dark: true,
    render: function () {
      var boxes = S.forms.codeRow({
        bind: 'verify.code', len: 6, kind: 'digit', theme: 'navy', label: 'One-time code'
      });

      var st = S.otp.state;
      var sentTo = st.phone ? S.formatPhone(st.phone) : S.formatPhone(S.formState.signup.phone);

      return '<div class="screen screen--navy">' +
        '<div class="jersey"></div>' +
        '<div style="position:relative;flex:1;overflow:hidden;padding:66px 26px 0;display:flex;flex-direction:column">' +
          '<div style="font:500 13px/1 var(--sans);color:var(--c-60)" data-go="signup">&lsaquo; Back</div>' +
          '<div style="font:700 34px/1.08 var(--serif);margin-top:38px">Check your texts</div>' +
          '<div style="font:400 13px/1.55 var(--sans);color:var(--c-65);margin-top:12px">One-time code sent to ' +
            S.esc(sentTo) + ' to confirm your number. You won’t need a code again — just your password.</div>' +

          // Local mode has no carrier to hand the code to, so it surfaces here.
          (S.otp.isLocal() && st.code
            ? '<div class="dev-code">' +
                '<div class="dev-code__tag">PROTOTYPE · NO SMS PROVIDER CONFIGURED</div>' +
                '<div class="dev-code__val">' + st.code + '</div>' +
                '<div class="dev-code__note">A real code was generated and is shown here instead of being texted.</div>' +
              '</div>'
            : '') +

          '<div style="margin-top:' + (S.otp.isLocal() && st.code ? '18px' : '30px') + '">' + boxes + '</div>' +
          (st.error ? '<div class="form-error form-error--left">' + S.esc(st.error) + '</div>' : '') +

          '<div style="display:flex;align-items:center;justify-content:space-between;margin-top:18px">' +
            '<div style="font:400 11px/1 var(--mono);color:var(--c-45)" data-otp-countdown>' +
              (st.sentAt ? 'RESEND IN 0:' + String(S.otp.cooldownLeft()).padStart(2, '0') : 'NO CODE SENT YET') +
            '</div>' +
            '<div style="font:500 12.5px/1 var(--sans);color:var(--gold-light)" data-action="resend-code">Resend code</div>' +
          '</div>' +
        '</div>' +
        '<div style="position:relative;padding:14px 26px 34px">' +
          '<button class="cta" data-cta="verify" data-action="verify-code">CONTINUE</button>' +
        '</div>' +
      '</div>';
    }
  };

  /* ---- 1m · Sign in ----------------------------------------------------- */

  S.screens.signin = {
    id: 'signin', code: '1m', label: 'Sign in', dark: true,
    render: function () {
      var g = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];

      return '<div class="screen screen--navy">' +
        '<div class="jersey"></div>' +
        '<div style="position:relative;flex:1;overflow:hidden;padding:92px 26px 0;display:flex;flex-direction:column">' +
          '<div style="font:700 30px/1 var(--serif);letter-spacing:.03em">SOAKED</div>' +
          '<div style="font:400 10px/1 var(--mono);letter-spacing:.14em;color:var(--c-50);margin-top:9px">PLAYER-RUN WATER GAMES</div>' +
          '<div style="font:700 38px/1.08 var(--serif);margin-top:44px">' + S.esc(g[0]) + '<br/>' + S.esc(g[1]) + '</div>' +

          '<div style="display:flex;flex-direction:column;gap:10px;margin-top:28px">' +
            '<div><div class="field-label">PHONE NUMBER</div><div class="field">' +
              S.forms.input({ bind: 'signin.phone', format: 'phone', inputmode: 'tel', placeholder: '(555) 555-0100' }) +
            '</div></div>' +
            '<div>' +
              '<div class="field-label">PASSWORD</div>' +
              '<div class="field field--split">' +
                S.forms.input({ bind: 'signin.password', type: 'password', placeholder: 'Your password' }) +
                '<div class="reveal" data-reveal="signin.showPw">SHOW</div>' +
              '</div>' +
            '</div>' +
            '<div style="text-align:right;font:500 12px/1 var(--sans);color:var(--gold-light);margin-top:2px" data-action="forgot">Forgot password?</div>' +
          '</div>' +

          '<button class="cta" style="margin-top:20px" data-cta="signin" data-action="signin">SIGN IN</button>' +

          '<div style="display:flex;align-items:center;gap:11px;margin:24px 0 16px">' +
            '<div style="flex:1;height:1px;background:rgba(252,247,234,.16)"></div>' +
            '<div style="font:400 10px/1 var(--mono);letter-spacing:.1em;color:var(--c-40)">OR</div>' +
            '<div style="flex:1;height:1px;background:rgba(252,247,234,.16)"></div>' +
          '</div>' +
          '<div style="display:flex;gap:10px">' +
            '<div style="flex:1;height:50px;border-radius:11px;border:1px solid var(--c-22);display:flex;align-items:center;justify-content:center;gap:9px" data-action="sso">' +
              '<div style="width:16px;height:16px;border-radius:3px;background:var(--c-75)"></div>' +
              '<div style="font:600 12.5px/1 var(--sans)">Apple</div>' +
            '</div>' +
            '<div style="flex:1;height:50px;border-radius:11px;border:1px solid var(--c-22);display:flex;align-items:center;justify-content:center;gap:9px" data-action="sso">' +
              '<div style="width:16px;height:16px;border-radius:50%;background:var(--c-75)"></div>' +
              '<div style="font:600 12.5px/1 var(--sans)">Google</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div style="position:relative;padding:14px 26px 34px;text-align:center">' +
          '<div style="font:400 13px/1.5 var(--sans);color:var(--c-60)" data-go="signup">New here? <strong style="font-weight:600;color:var(--cream)">Create an account</strong></div>' +
          '<div style="font:400 10.5px/1.5 var(--mono);color:var(--c-35);margin-top:12px">NOT AFFILIATED WITH ANY SCHOOL OR DISTRICT</div>' +
        '</div>' +
      '</div>';
    }
  };

  /* ---- 1k · Join game --------------------------------------------------- */

  S.screens.join = {
    id: 'join', code: '1k', label: 'Join game',
    render: function () {
      var boxes = S.forms.codeRow({
        bind: 'join.code', len: 6, kind: 'alnum', theme: 'light', label: 'Game code'
      });

      return '<div class="screen">' +
        '<div style="flex:1;overflow:hidden;padding:78px 24px 0;display:flex;flex-direction:column">' +
          '<div style="font:700 22px/1 var(--serif);letter-spacing:.02em">SOAKED</div>' +
          '<div style="font:700 38px/1.08 var(--serif);margin-top:34px">Got a game<br/>code?</div>' +
          '<div style="font:400 13.5px/1.55 var(--sans);color:var(--n-60);margin-top:12px">Whoever runs your game hands these out. Six characters, not case sensitive.</div>' +
          '<div style="margin-top:26px">' + boxes + '</div>' +

          '<div style="display:flex;align-items:center;gap:12px;margin-top:24px;padding:14px 15px;border-radius:12px;background:#fff;border:1px solid var(--n-10)" data-action="scan-qr">' +
            '<div class="hatch-qr" style="width:46px;height:46px;border-radius:8px"></div>' +
            '<div style="flex:1"><div style="font:600 13.5px/1.2 var(--sans)">Scan a QR instead</div>' +
              '<div style="font:400 11px/1.35 var(--sans);color:var(--n-55);margin-top:4px">Whoever set the game up has one</div></div>' +
            '<div style="font:400 17px/1;color:var(--n-30)">›</div>' +
          '</div>' +

          '<div style="display:flex;align-items:center;gap:11px;margin:22px 0">' +
            '<div style="flex:1;height:1px;background:var(--n-14)"></div>' +
            '<div style="font:400 10px/1 var(--mono);letter-spacing:.1em;color:var(--n-40)">OR BROWSE</div>' +
            '<div style="flex:1;height:1px;background:var(--n-14)"></div>' +
          '</div>' +

          '<div style="display:flex;align-items:center;gap:12px;padding:13px 15px;border-radius:12px;background:#fff;border:1px solid var(--n-10)" data-action="focus-game-code">' +
            '<div class="team-bar" style="background:var(--navy)"></div>' +
            '<div style="flex:1"><div style="font:600 13.5px/1.2 var(--sans)">Westside Soak \'26</div>' +
              '<div style="font:400 10.5px/1 var(--mono);color:var(--n-50);margin-top:5px">REGISTRATION OPEN · 41 JOINED · $25</div></div>' +
            '<div style="padding:6px 11px;border-radius:99px;background:rgba(255,181,36,.2);font:600 10px/1 var(--mono);color:var(--gold-ink)">JOIN</div>' +
          '</div>' +
        '</div>' +

        '<div style="padding:12px 24px 12px">' +
          '<div style="display:flex;align-items:center;gap:11px;padding:12px 14px;border-radius:11px;background:rgba(255,181,36,.14);border:1px solid rgba(255,181,36,.4);margin-bottom:12px">' +
            '<div style="font:700 19px/1 var(--serif);color:var(--gold-ink)">$25</div>' +
            '<div style="font:400 11.5px/1.4 var(--sans);color:var(--gold-ink-soft)">Entry fee, due before your first phase starts. Next step.</div>' +
          '</div>' +
          '<button class="cta" data-cta="join" data-muted="ink" data-go="payment">CONTINUE TO PAYMENT</button>' +
          '<div style="text-align:center;font:400 11.5px/1.4 var(--sans);color:var(--n-45);margin-top:14px">The organizer may need to approve you</div>' +
        '</div>' +
        S.tabBar('home') +
      '</div>';
    }
  };

  /* ---- 1l · Payment ----------------------------------------------------- */

  S.screens.payment = {
    id: 'payment', code: '1l', label: 'Payment',
    render: function () {
      function method(o) {
        return S.forms.pick('payment.method', o.key,
          '<div class="hatch-card" style="width:36px;height:25px;border-radius:5px;flex:none"></div>' +
          '<div style="flex:1"><div style="font:600 13px/1.2 var(--sans)">' + o.name + '</div>' +
            '<div style="font:400 10px/1 var(--mono);color:var(--n-50);margin-top:4px">' + o.note + '</div></div>' +
          '<div class="pick__tick">✓</div>',
          'pick--pay');
      }

      return '<div class="screen">' +
        '<div style="padding:56px 24px 12px;display:flex;align-items:center;justify-content:space-between">' +
          '<div style="font:500 13px/1 var(--sans);color:var(--n-55)" data-go="join">‹ Back</div>' +
          '<div style="font:400 10px/1 var(--mono);letter-spacing:.12em;color:var(--n-45)">JOIN · STEP 2 OF 2</div>' +
          '<div style="width:34px"></div>' +
        '</div>' +

        '<div style="flex:1;overflow:hidden;padding:0 24px;display:flex;flex-direction:column;gap:16px">' +
          '<div style="font:700 32px/1.1 var(--serif);margin-top:10px">Pay in to play</div>' +
          '<div style="font:400 13.5px/1.55 var(--sans);color:var(--n-60)">Westside Soak \'26 · one-time entry, non-refundable once the phase opens.</div>' +

          '<div style="flex:none;background:#fff;border:1px solid var(--n-12);border-radius:14px;overflow:hidden">' +
            '<div style="display:flex;align-items:flex-end;justify-content:space-between;padding:18px 18px 16px">' +
              '<div>' +
                '<div style="font:400 10px/1 var(--mono);letter-spacing:.12em;color:var(--n-50)">ENTRY FEE</div>' +
                '<div style="font:700 44px/1 var(--serif);margin-top:10px">$25.00</div>' +
              '</div>' +
              '<div style="text-align:right;font:400 11px/1.5 var(--mono);color:var(--n-45)">41 PAID<br/>$820 IN POT</div>' +
            '</div>' +
            '<div style="padding:14px 18px;border-top:1px solid var(--n-07);display:flex;flex-direction:column;gap:11px">' +
              '<div style="display:flex;justify-content:space-between;align-items:center">' +
                '<div style="display:flex;align-items:center;gap:9px"><div style="width:9px;height:9px;border-radius:2px;background:var(--green)"></div>' +
                '<div style="font:400 12.5px/1 var(--sans)">To the Westside prize pot</div></div>' +
                '<div style="font:600 12.5px/1 var(--sans)">$20.00</div>' +
              '</div>' +
              '<div style="display:flex;justify-content:space-between;align-items:center">' +
                '<div style="display:flex;align-items:center;gap:9px"><div style="width:9px;height:9px;border-radius:2px;background:var(--gold)"></div>' +
                '<div style="font:400 12.5px/1 var(--sans)">Soaked platform fee</div></div>' +
                '<div style="font:600 12.5px/1 var(--sans)">$5.00</div>' +
              '</div>' +
              '<div style="display:flex;height:8px;border-radius:4px;overflow:hidden;margin-top:4px">' +
                '<div style="flex:4;background:var(--green)"></div><div style="flex:1;background:var(--gold)"></div>' +
              '</div>' +
            '</div>' +
          '</div>' +

          '<div class="mono-label">PAY WITH</div>' +
          '<div style="display:flex;flex-direction:column;gap:7px">' +
            method({ key: 'apple', name: 'Apple Pay', note: 'FASTEST · FACE ID' }) +
            method({ key: 'card', name: 'Card · Visa ···· 4417', note: 'SAVED' }) +
            method({ key: 'venmo', name: 'Venmo', note: '@MAYA-OKONKWO' }) +
            '<div style="display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:12px;background:#fff;border:1px dashed rgba(22,37,107,.22)" data-action="add-payment">' +
              '<div style="width:36px;height:25px;border-radius:5px;border:1px solid var(--n-20);display:flex;align-items:center;justify-content:center;font:600 15px/1 var(--sans);color:var(--n-45)">+</div>' +
              '<div style="flex:1"><div style="font:600 13px/1.2 var(--sans);color:var(--n-70)">Google Pay, PayPal, Cash App, new card</div></div>' +
              '<div style="font:400 16px/1;color:var(--n-30)">›</div>' +
            '</div>' +
          '</div>' +

          '<div style="font:400 11.5px/1.5 var(--sans);color:var(--n-50)">Soaked keeps $5 of every entry; the rest goes to the pot the organizer pays out. Not affiliated with any school.</div>' +
        '</div>' +

        '<div style="padding:12px 24px 34px">' +
          '<button class="cta" data-action="pay-entry">PAY $25 &amp; JOIN</button>' +
        '</div>' +
      '</div>';
    }
  };
})(window.S);
