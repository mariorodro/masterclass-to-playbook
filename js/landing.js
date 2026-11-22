/* Landing page: renders the sample and wires the waitlist (Tally, loaded on open; local stub if no form id). */
(function () {
  'use strict';
  var R = window.M2PRender;
  var pb = window.PLAYBOOK_DATA.playbooks[0];
  var store = window.M2P.createStore(window.localStorage);

  document.getElementById('sample-root').appendChild(R.renderPlaybook(pb, { level: 3, idPrefix: 'sample', store: store }));
  document.getElementById('print-sheet').appendChild(R.renderPrintSheet(pb));

  window.M2PWaitlist.init(document.getElementById('waitlist-form'), {
    config: window.M2P_CONFIG,
    onValid: function () { window.M2PAnalytics.track('waitlist-submit-stub'); },
    onOpen: function () { window.M2PAnalytics.track('waitlist-open'); },
    onSubmitted: function () { window.M2PAnalytics.track('waitlist-submit'); }
  });

  /* "sample-view" fires once, when the sample scrolls into view (in memory; also GoatCounter in the release build). */
  var sample = document.getElementById('sample');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      if (entries.some(function (e) { return e.isIntersecting; })) { window.M2PAnalytics.track('sample-view'); io.disconnect(); }
    }, { threshold: 0.15 });
    io.observe(sample);
  }

  /* In-page anchors: move focus to the target heading for keyboard and screen-reader users. */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]:not([data-jump])');
    if (!a) return;
    var id = a.getAttribute('href').slice(1);
    var t = id && document.getElementById(id);
    if (!t) return;
    setTimeout(function () {
      var hd = t.matches('[tabindex="-1"]') ? t : t.querySelector('h1[tabindex="-1"], h2[tabindex="-1"]');
      if (hd) hd.focus({ preventScroll: true });
    }, 0);
  });
})();
