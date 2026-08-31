/* One-time-code lifecycle: generate, deliver, expire, verify, rate-limit.

   DELIVERY IS PLUGGABLE. Out of the box this runs in 'local' mode: a real
   random code is generated and shown on screen, because a static site has no
   server and therefore no safe way to hold an SMS credential.

   To send real texts, stand up the serverless function in docs/sms-backend.md
   and set S.otp.endpoint to its URL. The provider credential lives in that
   function's environment — never in this file, and never in the repo. */

(function (S) {
  'use strict';

  var otp = S.otp = {};

  // null = local mode. A string = POST {phone} to this URL to send a real SMS.
  otp.endpoint = null;

  otp.TTL_SECONDS = 600;      // code is good for 10 minutes
  otp.COOLDOWN_SECONDS = 30;  // minimum gap between sends
  otp.MAX_ATTEMPTS = 5;       // wrong guesses before the code is burned

  otp.state = {
    code: null,      // held client-side only in local mode
    phone: '',
    sentAt: 0,
    attempts: 0,
    error: '',
    notice: '',
    sending: false,
    verified: false
  };

  function now() { return Math.floor(Date.now() / 1000); }

  // Cryptographically random, not Math.random — this is a credential.
  function generate() {
    var a = new Uint32Array(1);
    (window.crypto || window.msCrypto).getRandomValues(a);
    return String(a[0] % 1000000).padStart(6, '0');
  }

  otp.secondsLeft = function () {
    if (!otp.state.sentAt) return 0;
    return Math.max(0, otp.TTL_SECONDS - (now() - otp.state.sentAt));
  };

  otp.cooldownLeft = function () {
    if (!otp.state.sentAt) return 0;
    return Math.max(0, otp.COOLDOWN_SECONDS - (now() - otp.state.sentAt));
  };

  otp.isExpired = function () {
    return !!otp.state.sentAt && otp.secondsLeft() === 0;
  };

  /* ---- request ---------------------------------------------------------- */

  otp.request = function (phone) {
    var digits = String(phone || '').replace(/\D/g, '');
    if (digits.length !== 10) {
      otp.state.error = 'Enter a 10-digit US mobile number first.';
      return Promise.resolve({ ok: false });
    }
    if (otp.cooldownLeft() > 0) {
      otp.state.error = 'Hold on — you can resend in ' + otp.cooldownLeft() + 's.';
      return Promise.resolve({ ok: false });
    }

    otp.state.sending = true;
    otp.state.error = '';
    otp.state.phone = digits;
    otp.state.attempts = 0;

    // Real delivery: the server owns the code, so we never see it here.
    if (otp.endpoint) {
      return fetch(otp.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: '+1' + digits })
      }).then(function (r) {
        if (!r.ok) throw new Error('send failed (' + r.status + ')');
        otp.state.code = null;
        otp.state.sentAt = now();
        otp.state.notice = 'Code sent to ' + S.formatPhone(digits) + '.';
        return { ok: true };
      }).catch(function (e) {
        otp.state.error = "Couldn't send the code: " + e.message;
        return { ok: false };
      }).then(function (res) {
        otp.state.sending = false;
        return res;
      });
    }

    // Local mode: generate here and surface it in the UI.
    otp.state.code = generate();
    otp.state.sentAt = now();
    otp.state.sending = false;
    otp.state.notice = '';
    return Promise.resolve({ ok: true });
  };

  /* ---- verify ----------------------------------------------------------- */

  otp.verify = function (entered) {
    var v = String(entered || '');
    if (v.length !== 6) {
      otp.state.error = 'Enter all six digits.';
      return Promise.resolve({ ok: false });
    }
    if (!otp.state.sentAt) {
      otp.state.error = 'Request a code first.';
      return Promise.resolve({ ok: false });
    }
    if (otp.isExpired()) {
      otp.state.error = 'That code expired. Send a new one.';
      return Promise.resolve({ ok: false });
    }
    if (otp.state.attempts >= otp.MAX_ATTEMPTS) {
      otp.state.error = 'Too many tries. Send a new code.';
      return Promise.resolve({ ok: false });
    }

    // Real delivery: only the server can say whether the code is right.
    if (otp.endpoint) {
      return fetch(otp.endpoint + '/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: '+1' + otp.state.phone, code: v })
      }).then(function (r) { return r.json(); })
        .then(function (j) {
          if (!j.ok) {
            otp.state.attempts++;
            otp.state.error = 'That code is not right. ' +
              (otp.MAX_ATTEMPTS - otp.state.attempts) + ' tries left.';
            return { ok: false };
          }
          otp.state.verified = true;
          otp.state.error = '';
          return { ok: true };
        })
        .catch(function (e) {
          otp.state.error = "Couldn't check that code: " + e.message;
          return { ok: false };
        });
    }

    if (v !== otp.state.code) {
      otp.state.attempts++;
      var left = otp.MAX_ATTEMPTS - otp.state.attempts;
      otp.state.error = left > 0
        ? 'That code is not right. ' + left + (left === 1 ? ' try left.' : ' tries left.')
        : 'Too many tries. Send a new code.';
      return Promise.resolve({ ok: false });
    }

    otp.state.verified = true;
    otp.state.error = '';
    return Promise.resolve({ ok: true });
  };

  otp.reset = function () {
    otp.state.code = null;
    otp.state.sentAt = 0;
    otp.state.attempts = 0;
    otp.state.error = '';
    otp.state.notice = '';
    otp.state.verified = false;
  };

  // True when no real SMS provider is configured.
  otp.isLocal = function () { return !otp.endpoint; };
})(window.S);
