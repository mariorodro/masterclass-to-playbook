(function () {
  'use strict';
  var M2P = window.M2P;
  var track = function (n, d) { if (window.M2PAnalytics) window.M2PAnalytics.track(n, d); };
  var PDF_HREF = 'downloads/wyckoff-tape-reading-checklist.pdf';

  function h(tag, attrs) {
    var el = document.createElement(tag);
    var kids = Array.prototype.slice.call(arguments, 2);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v == null || v === false) return;
        if (k === 'class') el.className = v;
        else if (k === 'text') el.textContent = v;
        else if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), v);
        else if (v === true) el.setAttribute(k, '');
        else el.setAttribute(k, v);
      });
    }
    kids.forEach(function add(c) {
      if (c == null || c === false) return;
      if (Array.isArray(c)) return c.forEach(add);
      el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return el;
  }

  var live, toastEl, toastTimer;
  function announce(msg) {
    live = live || document.getElementById('live');
    if (!live) return;
    live.textContent = '';
    setTimeout(function () { live.textContent = msg; }, 30);
  }
  function toast(msg) {
    toastEl = toastEl || document.getElementById('toast');
    if (!toastEl) return;
    toastEl.textContent = msg; toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.hidden = true; }, 3200);
  }

  var METHOD = 'How it was made: drafted with AI assistance, checked against the scan, and reviewed by the site\u2019s creator. ';
  var SHORT_DISCLAIMER = 'Educational notes only. Not investment advice. No promise of results; trading carries risk of loss. Sample summarizes Wyckoff\u2019s Studies in Tape Reading (1910), public domain in the US. No affiliation or endorsement implied. Drafted with AI assistance, checked against the scan, and reviewed by the site\u2019s creator.' +
    ' The planned app uses your own AI key, and your provider bills you directly. AI-made notes can contain mistakes, so check them against the source.';

  function sourceNote(pb, cls) {
    var link = function () { return h('a', { href: pb.source.url, rel: 'noopener', target: '_blank', onclick: function () { track('source-open'); } }, pb.source.label, ' \u2197'); };
    return h('div', { class: 'source-note ' + (cls || ''), role: 'note', 'data-disclaimer': 'long' },
      h('p', null, h('strong', { text: 'Format sample, built from a public-domain 1910 classic. ' }), 'A book, not a video.'),
      h('p', { class: 'small' }, h('strong', { text: 'Educational notes only. Not investment advice' }), ' and not a recommendation to buy or sell anything. Trading carries real risk of loss. Nothing here promises or implies any result.'),
      h('p', { class: 'small' }, 'This is our summary of Richard D. Wyckoff\u2019s ', h('em', { text: 'Studies in Tape Reading' }), ' (1910), which is in the public domain in the United States (status may differ elsewhere). Page numbers refer to that edition. The rules and numbers are his, from the 1909\u201310 market, and are untested on today\u2019s.'),
      h('p', { class: 'small' }, 'We have no affiliation with the author\u2019s estate, any Wyckoff-branded organization, or any creator named, and no endorsement is implied.'),
      h('p', { class: 'small' }, METHOD, 'Read the original: ', link(), '.'));
  }

  function makeSourceBar(pb) {
    var whereEl = h('span', { class: 'mono src-where', text: 'Pick a page reference' });
    var msgEl = h('span', { class: 'src-msg', text: 'Every rule links to the chapter and page it comes from.' });
    var el = h('div', { class: 'player-stub src-bar no-print', role: 'region', 'aria-label': 'Source reference' },
      h('span', { class: 'player-icon', 'aria-hidden': 'true', text: '\u00A7' }),
      h('div', null, h('strong', null, 'Source '), whereEl, h('br'), msgEl));
    return {
      el: el,
      show: function (ref, key) {
        var c = M2P.chapterForPage(pb.chapters, ref.p, pb.lastPage);
        whereEl.textContent = M2P.formatRef(ref);
        msgEl.textContent = '';
        msgEl.appendChild(document.createTextNode('Chapter ' + ref.ch + (c ? ', \u201C' + c.title + '\u201D' : '') + '. '));
        msgEl.appendChild(h('a', { href: pb.source.url, rel: 'noopener', target: '_blank', onclick: function () { track('source-open', { ref: M2P.formatRef(ref) }); } }, 'Read it in the 1910 scan \u2197'));
        var root = el.parentNode || document;
        root.querySelectorAll('.ref-chip').forEach(function (b) {
          var on = b.getAttribute('data-ref') === key;
          b.classList.toggle('is-active', on);
          b.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash');
        announce('Source: ' + M2P.formatRef(ref));
      }
    };
  }

  function refChips(refs, bar) {
    return (refs || []).map(function (r) {
      var label = M2P.formatRef(r);
      var key = label;
      return h('button', { type: 'button', class: 'ts-chip ref-chip', 'data-ref': key, 'aria-pressed': 'false',
        'aria-label': 'Source: ' + label.replace('\u00B7', ','), onclick: function () { bar.show(r, key); } }, label);
    });
  }

  function renderPlaybook(pb, opts) {
    opts = opts || {};
    var L = opts.level || 2;
    var P = opts.idPrefix || 'pb';
    var hs = 'h' + L, hsub = 'h' + Math.min(L + 1, 6), hmini = 'h' + Math.min(L + 2, 6);
    var bar = makeSourceBar(pb);

    function section(id, title, body, cls) {
      return h('section', { id: P + '-' + id, class: 'detail-section ' + (cls || ''), 'aria-labelledby': P + '-h-' + id },
        h(hs, { id: P + '-h-' + id, tabindex: '-1', text: title }), body);
    }

    var sections = [['tldr', 'TL;DR'], ['setups', 'Setups'], ['risk', 'Risk rules'], ['close', 'When to close'], ['checklist', 'Checklist'], ['quotes', 'Quotes']];
    if (opts.notes) sections.push(['notes', 'My notes']);
    var jump = h('nav', { class: 'jump no-print', 'aria-label': 'Playbook sections' },
      h('ul', null, sections.map(function (s) { return h('li', null, h('a', { href: '#' + P + '-' + s[0], 'data-jump': '' }, s[1])); })));

    var tldr = h('ul', { class: 'tldr' }, pb.tldr.map(function (t) {
      return h('li', null, h('span', { text: t.text + ' ' }), h('span', { class: 'ts-row inline' }, refChips(t.refs, bar)));
    }));

    var setups = h('div', { class: 'setups' }, pb.setups.map(function (s, i) {
      return h('article', { class: 'setup' },
        h(hsub, { class: 'setup-title' }, h('span', { class: 'setup-num', text: (i + 1) + '' }), s.name),
        h(hmini, { class: 'mini', text: 'Conditions' }),
        h('ul', null, s.conditions.map(function (c) { return h('li', { text: c }); })),
        h('dl', { class: 'rules' },
          h('div', { class: 'rule rule-entry' }, h('dt', { text: 'Entry' }), h('dd', { text: s.entry })),
          h('div', { class: 'rule rule-stop' }, h('dt', { text: 'Stop' }), h('dd', { text: s.stop })),
          h('div', { class: 'rule rule-exit' }, h('dt', { text: 'Exit / target' }), h('dd', { text: s.exit }))),
        h('div', { class: 'ts-row' }, h('span', { class: 'muted small', text: 'Taught in ' }), refChips(s.refs, bar)));
    }));

    function ruleList(list) {
      return h('ul', { class: 'risk-list' }, list.map(function (r) {
        return h('li', null, h('span', { text: r.text }), refChips(r.refs, bar));
      }));
    }

    var checklist = h('div', { class: 'checklist-sheet' },
      h('p', { class: 'no-print actions' },
        h('a', { class: 'btn btn-primary', href: PDF_HREF, download: 'wyckoff-tape-reading-checklist.pdf', 'data-download': 'checklist',
          onclick: function () { track('checklist-download'); announce('Downloading the one-page checklist PDF'); } }, '\u2913 Download 1-page PDF'),
        ' ',
        h('button', { type: 'button', class: 'btn', onclick: function () { track('checklist-print'); window.print(); } }, '\u2399 Print'),
        h('span', { class: 'muted small', text: ' One page: checklist, setups at a glance, risk and exit rules.' })),
      h(hsub, { class: 'sub-title', text: 'Before every trade' }),
      h('ul', { class: 'checklist' }, pb.checklist.map(function (c, i) {
        var id = P + '-chk-' + i;
        return h('li', null, h('input', { type: 'checkbox', id: id }), h('label', { for: id, text: c }));
      })));

    var quotes = h('div', { class: 'quotes' }, pb.quotes.map(function (q) {
      return h('figure', { class: 'quote' }, h('blockquote', null, h('p', { text: '\u201C' + q.text + '\u201D' })),
        h('figcaption', null, h('span', { class: 'muted small', text: (q.verbatim ? 'Verbatim, checked against the scan' : 'Paraphrase') + ' \u00B7 ' }), refChips([q.ref], bar)));
    }));

    var parts = [
      sourceNote(pb),
      h('p', { class: 'hist-note small' }, h('strong', { text: 'Historical context: ' }), pb.historicalNote + ' ', pb.historicalNoteRef ? refChips([pb.historicalNoteRef], bar) : null),
      bar.el, jump,
      section('tldr', 'TL;DR', tldr),
      section('setups', 'Setups (' + pb.setups.length + ')', h('div', null, pb.setupsNote ? h('p', { class: 'setups-note muted', text: pb.setupsNote }) : null, setups)),
      section('risk', 'Risk rules', ruleList(pb.riskRules)),
      section('close', 'When to close a trade', ruleList(pb.closeRules)),
      section('checklist', 'One-page checklist', checklist),
      section('quotes', 'Key quotes', quotes)
    ];

    if (opts.notes && opts.store) {
      var store = opts.store;
      var notesArea = h('textarea', { id: P + '-notes-text', class: 'input notes', rows: '6', placeholder: 'Your own notes. Saved in this browser only (localStorage), never sent anywhere.' });
      notesArea.value = store.getNote(pb.id);
      var saved = h('span', { class: 'muted small save-status', 'aria-live': 'polite' }, notesArea.value ? 'Saved in this browser' : '');
      var t;
      notesArea.addEventListener('input', function () {
        saved.textContent = 'Saving\u2026'; clearTimeout(t);
        t = setTimeout(function () { store.setNote(pb.id, notesArea.value); saved.textContent = 'Saved in this browser'; }, 300);
      });
      parts.push(section('notes', 'My notes', h('div', null,
        h('label', { for: P + '-notes-text', class: 'sr-only', text: 'My notes' }), notesArea,
        h('div', { class: 'notes-bar' }, saved, h('button', { type: 'button', class: 'btn btn-ghost btn-sm', onclick: function () {
          notesArea.value = ''; store.setNote(pb.id, ''); saved.textContent = 'Notes cleared'; notesArea.focus();
        } }, 'Clear notes')))));
    }

    var root = h('div', { class: 'playbook', 'data-playbook': pb.id }, parts);
    jump.addEventListener('click', function (e) {
      var a = e.target.closest('a[data-jump]');
      if (!a) return;
      e.preventDefault();
      var target = document.getElementById(a.getAttribute('href').slice(1));
      if (!target) return;
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      var hd = target.querySelector('[tabindex="-1"]'); if (hd) hd.focus({ preventScroll: true });
      if (history.replaceState && !/^#\//.test(location.hash)) history.replaceState(null, '', a.getAttribute('href'));
    });
    return root;
  }

  function renderPrintSheet(pb) {
    var ref = function (rs) { return (rs || []).map(M2P.formatRef).join('; '); };
    return h('div', { class: 'print-sheet-inner' },
      h('p', { class: 'print-brand', text: 'Masterclass \u2192 Playbook \u00B7 One-page checklist \u00B7 Format sample' }),
      h('h1', { text: pb.title + ': tape-reading checklist' }),
      h('p', { class: 'print-sub', text: pb.author + ' \u00B7 ' + pb.edition + ' \u00B7 public domain (US)' }),
      pb.setupsNote ? h('p', { class: 'print-sub', text: pb.setupsNote }) : null,
      h('h2', { text: 'Before every trade' }),
      h('ul', { class: 'p-checklist' }, pb.checklist.map(function (c) { return h('li', null, h('span', { class: 'box', 'aria-hidden': 'true' }), c); })),
      h('h2', { text: 'Setups at a glance' }),
      h('table', { class: 'glance' },
        h('thead', null, h('tr', null, ['Setup', 'Entry', 'Stop', 'Exit'].map(function (t) { return h('th', { scope: 'col', text: t }); }))),
        h('tbody', null, pb.setups.map(function (s) {
          return h('tr', null, h('th', { scope: 'row' }, s.name, h('span', { class: 'p-ref', text: ref(s.refs) })), h('td', { text: s.entry }), h('td', { text: s.stop }), h('td', { text: s.exit }));
        }))),
      h('div', { class: 'p-cols' },
        h('div', null, h('h2', { text: 'Risk rules' }), h('ul', { class: 'compact' }, pb.riskRules.map(function (r) { return h('li', null, r.text, h('span', { class: 'p-ref', text: ' ' + ref(r.refs) })); }))),
        h('div', null, h('h2', { text: 'Close the trade when' }), h('ul', { class: 'compact' }, pb.closeRules.map(function (r) { return h('li', null, r.text, h('span', { class: 'p-ref', text: ' ' + ref(r.refs) })); })))),
      h('p', { class: 'print-foot', text: SHORT_DISCLAIMER + ' Page refs are to the 1910 edition (' + pb.edition + '). Read the original: ' + pb.source.url }));
  }

  window.M2PRender = { h: h, announce: announce, toast: toast, renderPlaybook: renderPlaybook, renderPrintSheet: renderPrintSheet, SHORT_DISCLAIMER: SHORT_DISCLAIMER, sourceNote: sourceNote, PDF_HREF: PDF_HREF };
})();
