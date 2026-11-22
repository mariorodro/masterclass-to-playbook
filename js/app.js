/* Library + playbook detail (hash routes), reused from the prototype. Vanilla JS, no network. */
(function () {
  'use strict';
  var DATA = (window.PLAYBOOK_DATA && window.PLAYBOOK_DATA.playbooks) || [];
  var M2P = window.M2P, R = window.M2PRender, h = R.h;
  var store = M2P.createStore(window.localStorage);
  var app = document.getElementById('app');
  var printSheet = document.getElementById('print-sheet');

  function byId(id) { for (var i = 0; i < DATA.length; i++) if (DATA[i].id === id) return DATA[i]; return null; }

  function favButton(pb, onChange) {
    var btn = h('button', { type: 'button', class: 'fav-btn' }, h('span', { 'aria-hidden': 'true' }));
    function paint(on) {
      btn.classList.toggle('is-on', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      btn.setAttribute('aria-label', (on ? 'Remove from favorites: ' : 'Add to favorites: ') + pb.title);
      btn.title = on ? 'Remove from favorites' : 'Add to favorites';
      btn.firstChild.textContent = on ? '\u2605' : '\u2606';
    }
    paint(store.isFavorite(pb.id));
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var now = store.toggleFavorite(pb.id);
      paint(now); R.announce(now ? 'Added to favorites' : 'Removed from favorites');
      if (onChange) onChange(now);
    });
    return btn;
  }

  function tagList(tags) { return h('ul', { class: 'tags', 'aria-label': 'Tags' }, tags.map(function (t) { return h('li', { class: 'tag', text: t }); })); }

  function comingCard() {
    return h('article', { class: 'card card-coming' },
      h('div', { class: 'card-top' }, h('span', { class: 'badge badge-video', text: 'Video' })),
      h('h2', { class: 'card-title', text: 'Your course here' }),
      h('p', { class: 'card-meta', text: 'In development: a desktop app. Paste a course link, use your own AI key, get a playbook with timestamps.' }),
      h('p', null, h('a', { class: 'btn btn-sm btn-primary', href: 'index.html#waitlist', text: 'Join the waitlist' })));
  }

  function renderLibrary() {
    var filters = store.getFilters();
    var resultsEl = h('div', { class: 'card-grid', id: 'results' });
    var countEl = h('p', { class: 'result-count', 'aria-live': 'polite' });
    var tagWrap = h('div', { class: 'tag-filters', role: 'group', 'aria-label': 'Filter by tag' });
    function save() { store.setFilters(filters); }
    function drawTags() {
      tagWrap.textContent = '';
      M2P.allTags(DATA, store.context()).forEach(function (t) {
        var on = filters.tags.indexOf(t) !== -1;
        tagWrap.appendChild(h('button', { type: 'button', class: 'chip-filter' + (on ? ' is-on' : ''), 'aria-pressed': on ? 'true' : 'false',
          onclick: function () {
            var i = filters.tags.indexOf(t);
            if (i === -1) filters.tags.push(t); else filters.tags.splice(i, 1);
            save(); drawTags(); drawResults();
          } }, t));
      });
    }
    function drawResults() {
      var list = M2P.filterPlaybooks(DATA, filters, store.context());
      resultsEl.textContent = '';
      countEl.textContent = list.length + ' of ' + DATA.length + ' playbook' + (DATA.length === 1 ? '' : 's');
      list.forEach(function (pb) {
        resultsEl.appendChild(h('article', { class: 'card' },
          h('div', { class: 'card-top' }, h('span', { class: 'badge badge-book', text: 'Book \u00B7 1910' }),
            favButton(pb, function () { if (filters.favoritesOnly) drawResults(); })),
          h('h2', { class: 'card-title' }, h('a', { href: '#/playbook/' + pb.id, text: pb.title })),
          h('p', { class: 'card-meta', text: pb.author }),
          h('p', { class: 'card-meta mono', text: pb.length }),
          tagList(M2P.tagsFor(pb, store.context())),
          h('p', { class: 'card-label', text: 'Format sample \u00B7 public domain' })));
      });
      if (!list.length) {
        resultsEl.appendChild(h('div', { class: 'empty' }, h('p', { text: 'No playbooks match these filters.' }),
          h('button', { type: 'button', class: 'btn', onclick: clearAll }, 'Clear filters')));
      }
      if (filters.type !== 'book' && !filters.favoritesOnly && !filters.query && !filters.tags.length) resultsEl.appendChild(comingCard());
    }
    function clearAll() {
      filters = { query: '', tags: [], favoritesOnly: false, type: 'all' };
      save(); search.value = ''; favBox.checked = false;
      typeRadios.forEach(function (r) { r.checked = r.value === 'all'; });
      drawTags(); drawResults(); R.announce('Filters cleared');
    }
    var timer;
    var search = h('input', { type: 'search', id: 'search', class: 'input', placeholder: 'Search setups, rules, quotes, your notes\u2026', autocomplete: 'off' });
    search.value = filters.query;
    search.addEventListener('input', function () { clearTimeout(timer); timer = setTimeout(function () { filters.query = search.value; save(); drawResults(); }, 120); });
    var favBox = h('input', { type: 'checkbox', id: 'fav-only' });
    favBox.checked = filters.favoritesOnly;
    favBox.addEventListener('change', function () { filters.favoritesOnly = favBox.checked; save(); drawResults(); });
    var typeRadios = [];
    var typeGroup = h('fieldset', { class: 'segmented' }, h('legend', { class: 'sr-only', text: 'Source type' }),
      [['all', 'All'], ['book', 'Books'], ['video', 'Videos']].map(function (o) {
        var r = h('input', { type: 'radio', name: 'type', value: o[0], id: 'type-' + o[0] });
        r.checked = filters.type === o[0];
        r.addEventListener('change', function () { filters.type = o[0]; save(); drawResults(); });
        typeRadios.push(r);
        return h('span', null, r, h('label', { for: 'type-' + o[0], text: o[1] }));
      }));
    app.appendChild(h('section', { class: 'library', 'aria-labelledby': 'lib-h' },
      h('div', { class: 'page-head' },
        h('h1', { id: 'lib-h', tabindex: '-1', text: 'Library' }),
        h('p', { class: 'lede', text: 'Trading courses turned into setups, rules and a one-page checklist. For now: one free format sample.' })),
      h('div', { class: 'controls' },
        h('label', { for: 'search', class: 'sr-only', text: 'Search playbooks' }), search,
        h('div', { class: 'controls-row' }, typeGroup,
          h('span', { class: 'check' }, favBox, h('label', { for: 'fav-only', text: '\u2605 Favorites only' })),
          h('button', { type: 'button', class: 'btn btn-ghost', onclick: clearAll }, 'Clear filters')),
        tagWrap),
      countEl, resultsEl));
    drawTags(); drawResults();
  }

  function renderDetail(pb) {
    app.appendChild(h('article', { class: 'detail' },
      h('p', { class: 'crumb no-print' }, h('a', { href: '#/', text: '\u2190 Library' })),
      h('header', { class: 'detail-head' },
        h('div', { class: 'detail-title-row' }, h('h1', { tabindex: '-1', text: pb.title }), favButton(pb)),
        h('p', { class: 'card-meta' }, h('span', { class: 'badge badge-book', text: 'Book \u00B7 1910' }), ' ', pb.author, ' \u00B7 ', h('span', { class: 'mono', text: pb.length })),
        tagList(pb.tags)),
      R.renderPlaybook(pb, { level: 2, idPrefix: 'pb', store: store, notes: true })));
    printSheet.appendChild(R.renderPrintSheet(pb));
  }

  function route() {
    var parts = (location.hash.replace(/^#/, '') || '/').split('/').filter(Boolean);
    var view = parts[0] || 'library';
    app.textContent = ''; printSheet.textContent = '';
    document.body.setAttribute('data-view', view);
    document.querySelectorAll('[data-nav]').forEach(function (a) {
      if (view === 'library') a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    var title = 'Library';
    var pb = view === 'playbook' ? byId(parts[1]) : null;
    if (view === 'library') renderLibrary();
    else if (pb) { renderDetail(pb); title = pb.title; }
    else {
      title = 'Not found';
      app.appendChild(h('section', null, h('h1', { tabindex: '-1', text: 'Not found' }),
        h('p', null, 'That page is not here. ', h('a', { href: '#/', text: 'Back to the library' }))));
    }
    document.title = title + ' - Masterclass to Playbook';
    window.scrollTo(0, 0);
    var hd = app.querySelector('h1');
    if (hd && routed) hd.focus({ preventScroll: true });
    routed = true;
  }
  var routed = false;
  document.querySelector('[data-skip]').addEventListener('click', function (e) { e.preventDefault(); app.focus(); });
  window.addEventListener('hashchange', function () { if (/^#\/|^$/.test(location.hash) || !location.hash) route(); });
  route();
})();
