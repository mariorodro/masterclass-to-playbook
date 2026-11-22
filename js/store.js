(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.M2P = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var PREFIX = 'm2p:';

  function normalize(str) {
    return String(str == null ? '' : str)
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function searchText(pb, ctx) {
    ctx = ctx || {};
    var parts = [pb.title, pb.channel, pb.author].concat(pb.tags || []);
    (pb.tldr || []).forEach(function (t) { parts.push(typeof t === 'string' ? t : t.text); });
    (pb.summary || []).forEach(function (t) { parts.push(t); });
    (pb.setups || []).forEach(function (s) {
      parts.push(s.name, s.entry, s.stop, s.exit);
      (s.conditions || []).forEach(function (c) { parts.push(c); });
    });
    (pb.riskRules || []).forEach(function (r) { parts.push(r.text); });
    (pb.closeRules || []).forEach(function (r) { parts.push(r.text); });
    (pb.checklist || []).forEach(function (c) { parts.push(c); });
    (pb.quotes || []).forEach(function (q) { parts.push(q.text); });
    if (ctx.notes && ctx.notes[pb.id]) parts.push(ctx.notes[pb.id]);
    if (ctx.userTags && ctx.userTags[pb.id]) parts = parts.concat(ctx.userTags[pb.id]);
    return normalize(parts.join(' \n '));
  }

  function matchesQuery(pb, query, ctx) {
    var q = normalize(query);
    if (!q) return true;
    var hay = searchText(pb, ctx);
    return q.split(' ').every(function (w) { return hay.indexOf(w) !== -1; });
  }

  function tagsFor(pb, ctx) {
    var extra = (ctx && ctx.userTags && ctx.userTags[pb.id]) || [];
    var out = [];
    (pb.tags || []).concat(extra).forEach(function (t) {
      var n = normalize(t);
      if (n && out.indexOf(n) === -1) out.push(n);
    });
    return out;
  }

  function allTags(list, ctx) {
    var seen = [];
    list.forEach(function (pb) {
      tagsFor(pb, ctx).forEach(function (t) { if (seen.indexOf(t) === -1) seen.push(t); });
    });
    return seen.sort();
  }

  function filterPlaybooks(list, filters, ctx) {
    filters = filters || {};
    ctx = ctx || {};
    var favs = ctx.favorites || [];
    var want = (filters.tags || []).map(normalize);
    var type = filters.type || 'all';
    return list.filter(function (pb) {
      if (type !== 'all' && pb.type !== type) return false;
      if (filters.favoritesOnly && favs.indexOf(pb.id) === -1) return false;
      if (want.length) {
        var have = tagsFor(pb, ctx);
        if (!want.every(function (t) { return have.indexOf(t) !== -1; })) return false;
      }
      return matchesQuery(pb, filters.query, ctx);
    });
  }

  function formatRef(ref) {
    if (!ref || !ref.ch || !ref.p) return '';
    var pages = ref.pEnd && ref.pEnd !== ref.p ? 'pp. ' + ref.p + '\u2013' + ref.pEnd : 'p. ' + ref.p;
    return 'Ch. ' + ref.ch + ' \u00B7 ' + pages;
  }

  function chapterForPage(chapters, page, lastPage) {
    if (!chapters || !chapters.length || page < chapters[0].p || (lastPage && page > lastPage)) return null;
    var found = null;
    chapters.forEach(function (c) { if (page >= c.p) found = c; });
    return found;
  }

  function refIsValid(pb, ref) {
    if (!ref || typeof ref.p !== 'number') return false;
    var end = ref.pEnd || ref.p;
    if (end < ref.p) return false;
    var a = chapterForPage(pb.chapters, ref.p, pb.lastPage);
    var b = chapterForPage(pb.chapters, end, pb.lastPage);
    return !!(a && b && a.ch === ref.ch && b.ch === ref.ch);
  }

  function memoryStorage() {
    var m = {};
    return {
      getItem: function (k) { return Object.prototype.hasOwnProperty.call(m, k) ? m[k] : null; },
      setItem: function (k, v) { m[k] = String(v); },
      removeItem: function (k) { delete m[k]; }
    };
  }

  function createStore(storage) {
    var s = storage;
    try {
      s.setItem(PREFIX + '__probe', '1');
      s.removeItem(PREFIX + '__probe');
    } catch (e) {
      s = memoryStorage();
    }

    function read(key, fallback) {
      try {
        var raw = s.getItem(PREFIX + key);
        return raw == null ? fallback : JSON.parse(raw);
      } catch (e) { return fallback; }
    }
    function write(key, value) {
      try { s.setItem(PREFIX + key, JSON.stringify(value)); } catch (e) { /* quota or private mode */ }
    }

    var defaults = { query: '', tags: [], favoritesOnly: false, type: 'all' };

    return {
      getFavorites: function () { return read('favorites', []); },
      isFavorite: function (id) { return this.getFavorites().indexOf(id) !== -1; },
      toggleFavorite: function (id) {
        var favs = this.getFavorites();
        var i = favs.indexOf(id);
        if (i === -1) favs.push(id); else favs.splice(i, 1);
        write('favorites', favs);
        return i === -1;
      },
      getNotes: function () { return read('notes', {}); },
      getNote: function (id) { return this.getNotes()[id] || ''; },
      setNote: function (id, text) {
        var notes = this.getNotes();
        if (text) notes[id] = text; else delete notes[id];
        write('notes', notes);
      },
      getUserTags: function () { return read('userTags', {}); },
      addUserTag: function (id, tag) {
        var t = normalize(tag);
        if (!t) return false;
        var all = this.getUserTags();
        var list = all[id] || [];
        if (list.indexOf(t) !== -1) return false;
        list.push(t);
        all[id] = list;
        write('userTags', all);
        return true;
      },
      removeUserTag: function (id, tag) {
        var all = this.getUserTags();
        var t = normalize(tag);
        all[id] = (all[id] || []).filter(function (x) { return x !== t; });
        if (!all[id].length) delete all[id];
        write('userTags', all);
      },
      getFilters: function () {
        var f = read('filters', {});
        return {
          query: typeof f.query === 'string' ? f.query : defaults.query,
          tags: Array.isArray(f.tags) ? f.tags : [],
          favoritesOnly: !!f.favoritesOnly,
          type: ['all', 'book', 'video'].indexOf(f.type) !== -1 ? f.type : 'all'
        };
      },
      setFilters: function (f) { write('filters', f); },
      context: function () {
        return { favorites: this.getFavorites(), notes: this.getNotes(), userTags: this.getUserTags() };
      }
    };
  }

  return {
    normalize: normalize,
    searchText: searchText,
    matchesQuery: matchesQuery,
    tagsFor: tagsFor,
    allTags: allTags,
    filterPlaybooks: filterPlaybooks,
    formatRef: formatRef,
    chapterForPage: chapterForPage,
    refIsValid: refIsValid,
    createStore: createStore,
    memoryStorage: memoryStorage
  };
});
