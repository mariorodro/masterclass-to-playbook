(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.M2PWaitlist = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var TRADES = ['stocks', 'options', 'futures', 'forex', 'crypto', 'other'];
  var PAY = ['yes', 'maybe', 'no'];
  var TALLY_ORIGIN = 'https://tally.so';
  var TALLY_WIDGET = TALLY_ORIGIN + '/widgets/embed.js';

  function isValidEmail(value) {
    var v = String(value == null ? '' : value).trim();
    if (v.length < 6 || v.length > 254) return false;
    var m = /^([^\s@]+)@([^\s@]+)$/.exec(v);
    if (!m) return false;
    var local = m[1], domain = m[2];
    if (local.length > 64 || /^\.|\.$|\.\./.test(local)) return false;
    var labels = domain.split('.');
    if (labels.length < 2) return false;
    return labels.every(function (l) { return /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(l); }) &&
      /^[a-z]{2,}$/i.test(labels[labels.length - 1]);
  }

  function validate(fields) {
    fields = fields || {};
    var errors = {};
    var email = String(fields.email == null ? '' : fields.email).trim();
    if (!email) errors.email = 'Enter your email address.';
    else if (!isValidEmail(email)) errors.email = 'That email address doesn\u2019t look right. Check for typos.';
    var trades = (fields.trades || []).filter(function (t) { return TRADES.indexOf(t) !== -1; });
    var pay = PAY.indexOf(fields.pay) !== -1 ? fields.pay : '';
    if (!fields.consent) errors.consent = 'Tick the box so we can email you about the Playbook test and when the app is ready.';
    return {
      ok: Object.keys(errors).length === 0,
      errors: errors,
      clean: { email: email.toLowerCase(), trades: trades, pay: pay, consent: !!fields.consent }
    };
  }

  function validFormId(id) { return typeof id === 'string' && /^[A-Za-z0-9]{3,20}$/.test(id); }
  function mode(config) { return config && validFormId(config.tallyFormId) ? 'tally' : 'stub'; }
  function tallyEmbedUrl(id) {
    if (!validFormId(id)) return null;
    return TALLY_ORIGIN + '/embed/' + id + '?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1';
  }
  function tallyShareUrl(id) { return validFormId(id) ? TALLY_ORIGIN + '/r/' + id : null; }
  function isTallySubmit(ev) {
    return !!ev && ev.origin === TALLY_ORIGIN && typeof ev.data === 'string' && ev.data.indexOf('Tally.FormSubmitted') !== -1;
  }

  function mountTally(doc, slot, id) {
    var existing = slot.querySelector('iframe[data-tally-src]');
    if (existing) return existing;
    var iframe = doc.createElement('iframe');
    iframe.setAttribute('data-tally-src', tallyEmbedUrl(id));
    iframe.setAttribute('width', '100%');
    iframe.setAttribute('height', '320');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('marginheight', '0');
    iframe.setAttribute('marginwidth', '0');
    iframe.setAttribute('title', 'Waitlist form (Tally)');
    slot.appendChild(iframe);
    var win = doc.defaultView;
    var load = function () {
      if (win.Tally && typeof win.Tally.loadEmbeds === 'function') win.Tally.loadEmbeds();
      else if (!iframe.getAttribute('src')) iframe.setAttribute('src', iframe.getAttribute('data-tally-src'));
    };
    if (win.Tally) load();
    else if (!doc.querySelector('script[src="' + TALLY_WIDGET + '"]')) {
      var tag = doc.createElement('script');
      tag.src = TALLY_WIDGET; tag.async = true; tag.onload = load; tag.onerror = load;
      doc.body.appendChild(tag);
    }
    return iframe;
  }

  function initTally(doc, opts) {
    var id = opts.config.tallyFormId;
    Array.prototype.forEach.call(doc.querySelectorAll('[data-stub-only]'), function (el) { el.parentNode.removeChild(el); });
    var box = doc.getElementById(opts.tallyContainerId || 'waitlist-tally');
    var btn = doc.getElementById('wl-open');
    var slot = doc.getElementById('wl-embed');
    var fb = doc.getElementById('wl-fallback');
    if (fb) fb.setAttribute('href', tallyShareUrl(id));
    box.hidden = false;
    var opened = false;
    function open() {
      if (opened) return;
      opened = true;
      mountTally(doc, slot, id);
      if (btn) btn.hidden = true;
      if (opts.onOpen) opts.onOpen();
    }
    if (btn) btn.addEventListener('click', open);
    doc.addEventListener('click', function (e) {
      var a = e.target && e.target.closest && e.target.closest('a[href="#waitlist"]');
      if (a) open();
    });
    var win = doc.defaultView;
    if (win.location && win.location.hash === '#waitlist') open();
    win.addEventListener('hashchange', function () { if (win.location.hash === '#waitlist') open(); });
    win.addEventListener('message', function (ev) { if (isTallySubmit(ev) && opts.onSubmitted) opts.onSubmitted(); });
    return { open: open };
  }

  function init(form, opts) {
    opts = opts || {};
    var doc = (form && form.ownerDocument) || opts.document;
    if (mode(opts.config) === 'tally') { initTally(doc, opts); return 'tally'; }
    var emailEl = form.querySelector('[name=email]');
    var consentEl = form.querySelector('[name=consent]');
    var status = doc.getElementById(opts.statusId || 'waitlist-status');
    function setErr(el, id, msg) {
      var e = doc.getElementById(id);
      e.textContent = msg || '';
      if (msg) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid');
    }
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var trades = Array.prototype.map.call(form.querySelectorAll('[name=trades]:checked'), function (x) { return x.value; });
      var payEl = form.querySelector('[name=pay]:checked');
      var r = validate({ email: emailEl.value, trades: trades, pay: payEl ? payEl.value : '', consent: consentEl.checked });
      setErr(emailEl, 'email-err', r.errors.email);
      setErr(consentEl, 'consent-err', r.errors.consent);
      if (!r.ok) {
        status.hidden = true;
        (r.errors.email ? emailEl : consentEl).focus();
        return;
      }
      if (opts.onValid) opts.onValid(r.clean);
      status.hidden = false;
      status.focus();
    });
    return 'stub';
  }

  return { TRADES: TRADES, PAY: PAY, isValidEmail: isValidEmail, validate: validate, init: init,
    validFormId: validFormId, mode: mode, tallyEmbedUrl: tallyEmbedUrl, tallyShareUrl: tallyShareUrl, isTallySubmit: isTallySubmit };
});
