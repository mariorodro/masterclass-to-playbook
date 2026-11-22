(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.M2PAnalytics = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  var EVENTS = ['sample-view', 'checklist-download', 'checklist-print', 'waitlist-open', 'waitlist-submit', 'waitlist-submit-stub', 'source-open'];
  var REMOTE_EVENTS = ['sample-view', 'checklist-download', 'waitlist-open', 'waitlist-submit'];
  var GC_SCRIPT = 'https://gc.zgo.at/count.js';
  var log = [], queue = [], state = { mode: 'off', win: null };

  function validCode(c) { return typeof c === 'string' && /^[a-z0-9](?:[a-z0-9-]{0,48}[a-z0-9])?$/.test(c); }
  function endpoint(code) { return validCode(code) ? 'https://' + code + '.goatcounter.com/count' : null; }
  function scriptTag(code) {
    if (!validCode(code)) return null;
    return '<script data-goatcounter="' + endpoint(code) + '" async src="' + GC_SCRIPT + '"></script>';
  }

  function send(name) {
    var gc = state.win && state.win.goatcounter;
    if (gc && typeof gc.count === 'function') { gc.count({ path: name, title: name, event: true }); return true; }
    return false;
  }
  function flush() { while (queue.length && send(queue[0])) queue.shift(); }

  function init(doc) {
    if (state.mode !== 'off' || !doc || !doc.querySelector) return state.mode;
    var tag = doc.querySelector('script[data-goatcounter]');
    if (!tag || tag.getAttribute('src') !== GC_SCRIPT) return state.mode;
    state.win = doc.defaultView;
    state.mode = 'goatcounter';
    tag.addEventListener('load', flush);
    flush();
    return state.mode;
  }

  function track(name, data) {
    if (EVENTS.indexOf(name) === -1) return false;
    log.push({ name: name, data: data || null, at: Date.now() });
    if (typeof window !== 'undefined') window.M2P_EVENTS = log;
    if (state.mode === 'goatcounter' && REMOTE_EVENTS.indexOf(name) !== -1 && !send(name)) queue.push(name);
    return true;
  }

  var api = { EVENTS: EVENTS, REMOTE_EVENTS: REMOTE_EVENTS, GC_SCRIPT: GC_SCRIPT, track: track, init: init,
    validCode: validCode, endpoint: endpoint, scriptTag: scriptTag,
    events: function () { return log.slice(); }, queued: function () { return queue.slice(); } };
  Object.defineProperty(api, 'mode', { get: function () { return state.mode; } });
  if (typeof document !== 'undefined') init(document);
  return api;
});
