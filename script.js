(function () {
  var cfg = window.ARKUSZ || {};
  var today = new Date();
  today.setHours(0, 0, 0, 0);

  /* ---------- Animacje wejścia ---------- */

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var io = null;
  if (!reduce && 'IntersectionObserver' in window) {
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px' });
  }

  // Tytuł wyjeżdża zza maski, kolejne elementy sekcji dochodzą kaskadą.
  function reveal(el, i) {
    if (!io) return;
    el.classList.add('reveal');
    el.style.setProperty('--i', Math.min(i || 0, 3));
    io.observe(el);
  }

  if (io) {
    document.querySelectorAll('main .band').forEach(function (band) {
      var title = band.querySelector('.title');
      if (title) {
        var inner = document.createElement('span');
        while (title.firstChild) inner.appendChild(title.firstChild);
        title.appendChild(inner);
        io.observe(title);
      }
      band.querySelectorAll('.lead, .workshop, .show, .shows__empty, .bio__text, .contact__mail')
        .forEach(function (el, i) { reveal(el, i); });
    });
  }

  /* ---------- Pomocnicze ---------- */

  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }

  // Przyjmuje 2026-11-27, 27.11.2026 i 27/11/2026 (arkusz zapisuje daty zależnie od ustawień).
  function parseDate(value) {
    var s = String(value || '').trim();
    var m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
    m = s.match(/^(\d{1,2})[.\/](\d{1,2})[.\/](\d{4})/);
    if (m) return new Date(+m[3], +m[2] - 1, +m[1]);
    return null;
  }

  function iso(date) {
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate());
  }

  function shortTime(value) {
    var m = String(value || '').trim().match(/^(\d{1,2})[:.](\d{2})/);
    return m ? m[1] + ':' + m[2] : String(value || '').trim();
  }

  function isYes(value) {
    return /^(tak|t|x|1|true|prawda)$/i.test(String(value || '').trim());
  }

  // Do href trafiają tylko zwykłe adresy; wszystko inne jest pomijane.
  function safeLink(value) {
    var s = String(value || '').trim();
    if (/^(https?:\/\/|mailto:)/i.test(s)) return s;
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) return 'mailto:' + s;
    return '';
  }

  function contactEmail() {
    var a = document.querySelector('.contact__mail');
    return a ? a.getAttribute('href').replace(/^mailto:/, '') : '';
  }

  // CSV z cudzysłowami, przecinkami i znakami nowej linii w komórkach.
  function parseCSV(text) {
    var rows = [], row = [], cell = '', quoted = false;
    text = text.replace(/^﻿/, '');
    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      if (quoted) {
        if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; }
        else if (ch === '"') quoted = false;
        else cell += ch;
      } else if (ch === '"') quoted = true;
      else if (ch === ',') { row.push(cell); cell = ''; }
      else if (ch === '\n' || ch === '\r') {
        if (ch === '\r' && text[i + 1] === '\n') i++;
        row.push(cell); rows.push(row); row = []; cell = '';
      } else cell += ch;
    }
    if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
    if (!rows.length) return [];
    var head = rows[0].map(function (h) { return h.trim().toLowerCase(); });
    return rows.slice(1).map(function (r) {
      var item = {};
      head.forEach(function (h, idx) { item[h] = (r[idx] || '').trim(); });
      return item;
    }).filter(function (item) {
      return Object.keys(item).some(function (k) { return item[k] !== ''; });
    });
  }

  // Najpierw ostatnia zapamiętana wersja (bez mrugania), potem świeża z arkusza.
  function load(name, render) {
    var url = cfg[name];
    if (!url) return false;
    var key = 'arkusz:' + name;
    try {
      var cached = localStorage.getItem(key);
      if (cached) render(parseCSV(cached));
    } catch (e) { /* brak dostępu do pamięci przeglądarki */ }
    fetch(url, { cache: 'no-store' })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.text();
      })
      .then(function (text) {
        if (/^\s*</.test(text)) throw new Error('Arkusz nie jest opublikowany jako CSV');
        render(parseCSV(text));
        try { localStorage.setItem(key, text); } catch (e) { /* jw. */ }
      })
      .catch(function (err) {
        // Zostaje to, co już jest na stronie (zapamiętana wersja albo treść z index.html).
        console.warn('Nie udało się wczytać karty „' + name + '”:', err.message);
      });
    return true;
  }

  /* ---------- Spektakle ---------- */

  var showsList = document.getElementById('shows');
  var showsEmpty = document.getElementById('shows-empty');
  var dayMonth = new Intl.DateTimeFormat('pl-PL', { day: 'numeric', month: 'long' });
  var weekday = new Intl.DateTimeFormat('pl-PL', { weekday: 'long' });

  function showRow(item, date) {
    var li = el('li', 'show');
    li.dataset.date = iso(date);

    var time = el('time', 'show__date');
    var hour = shortTime(item['godzina']);
    time.setAttribute('datetime', iso(date) + (hour ? 'T' + hour : ''));
    time.appendChild(el('b', null, String(date.getDate())));
    var month = dayMonth.format(date).replace(/^\d+\s*/, '');
    time.appendChild(document.createTextNode(' ' + month + ', ' + weekday.format(date)));
    li.appendChild(time);

    var what = el('div', 'show__what');
    what.appendChild(el('h3', null, item['tytuł'] || item['tytul'] || ''));
    var meta = [hour, item['miejsce']].filter(Boolean).join(', ');
    if (meta) what.appendChild(el('p', null, meta));
    var facts = item['szczegóły'] || item['szczegoly'];
    if (facts) what.appendChild(el('p', 'show__facts', facts));
    li.appendChild(what);

    var href = safeLink(item['link']) || '#kontakt';
    var link = el('a', 'show__link', item['przycisk'] || 'Bilety');
    link.href = href;
    li.appendChild(link);
    return li;
  }

  function renderShows(items) {
    var rows = [];
    items.forEach(function (item) {
      var date = parseDate(item['data']);
      if (!date || isYes(item['ukryj']) || date < today) return;
      rows.push({ item: item, date: date });
    });
    rows.sort(function (a, b) { return a.date - b.date; });
    showsList.textContent = '';
    rows.forEach(function (r, i) {
      var li = showRow(r.item, r.date);
      showsList.appendChild(li);
      reveal(li, i);
    });
    showsList.hidden = rows.length === 0;
    showsEmpty.hidden = rows.length !== 0;
  }

  // Bez arkusza: chowamy minione wiersze wpisane w index.html.
  function pruneStaticShows() {
    var rows = showsList.querySelectorAll('.show');
    var visible = 0;
    rows.forEach(function (row) {
      var date = parseDate(row.dataset.date);
      if (date && date < today) row.hidden = true; else visible += 1;
    });
    if (rows.length && visible === 0) {
      showsList.hidden = true;
      showsEmpty.hidden = false;
    }
  }

  if (!load('spektakle', renderShows)) pruneStaticShows();

  /* ---------- Warsztaty ---------- */

  var workshopsList = document.querySelector('.workshops');

  function renderWorkshops(items) {
    workshopsList.textContent = '';
    var count = 0;
    items.forEach(function (item) {
      var title = item['tytuł'] || item['tytul'];
      if (!title || isYes(item['ukryj'])) return;
      var until = parseDate(item['pokazuj do']);
      if (until && until < today) return;

      var li = el('li', 'workshop');
      var head = el('div', 'workshop__head');
      head.appendChild(el('h3', null, title));
      if (item['termin']) head.appendChild(el('p', 'workshop__when', item['termin']));
      li.appendChild(head);

      var body = el('div', 'workshop__body');
      if (item['opis']) body.appendChild(el('p', null, item['opis']));
      var facts = item['szczegóły'] || item['szczegoly'];
      if (facts) body.appendChild(el('p', 'workshop__facts', facts));
      var href = safeLink(item['link']) ||
        'mailto:' + contactEmail() + '?subject=' + encodeURIComponent('Zapis: ' + title);
      var btn = el('a', 'btn btn--light', item['przycisk'] || 'Zapisz się');
      btn.href = href;
      body.appendChild(btn);
      li.appendChild(body);

      workshopsList.appendChild(li);
      reveal(li, count);
      count += 1;
    });
    var empty = document.getElementById('workshops-empty');
    workshopsList.hidden = count === 0;
    empty.hidden = count !== 0;
  }

  load('warsztaty', renderWorkshops);

  /* ---------- Teksty (bio, wstępy, e-mail) ---------- */

  function renderTexts(items) {
    var t = {};
    items.forEach(function (item) {
      if (item['klucz']) t[item['klucz'].toLowerCase()] = item['treść'] || item['tresc'] || '';
    });
    function set(selector, value) {
      var node = document.querySelector(selector);
      if (node && value) node.textContent = value;
    }
    set('#warsztaty .lead', t['warsztaty_wstęp'] || t['warsztaty_wstep']);
    set('#kontakt .lead', t['kontakt_wstęp'] || t['kontakt_wstep']);
    set('.bio__first', t['bio_nagłówek'] || t['bio_naglowek']);

    if (t['bio']) {
      var box = document.querySelector('.bio__text');
      box.querySelectorAll('p:not(.bio__first)').forEach(function (p) { p.remove(); });
      t['bio'].split(/\n\s*\n|\n/).forEach(function (para) {
        if (para.trim()) box.appendChild(el('p', null, para.trim()));
      });
    }

    var mail = safeLink(t['email']);
    if (mail.indexOf('mailto:') === 0) {
      var a = document.querySelector('.contact__mail');
      // Przyciski zapisów, które otwierają e-mail, mają pisać na nowy adres.
      var old = a.getAttribute('href');
      document.querySelectorAll('.workshop a[href^="' + old + '"]').forEach(function (link) {
        link.href = mail + link.getAttribute('href').slice(old.length);
      });
      a.href = mail;
      a.textContent = mail.replace(/^mailto:/, '');
    }
  }

  load('teksty', renderTexts);

  /* ---------- Drobiazgi ---------- */

  // Zdjęcie w hero pokazujemy tylko wtedy, gdy plik assets/portret.png istnieje.
  var photo = document.querySelector('.hero__photo');
  if (photo) {
    var probe = new Image();
    probe.onload = function () { photo.hidden = false; };
    probe.src = photo.getAttribute('src');
  }

  document.getElementById('year').textContent = new Date().getFullYear();
  document.getElementById('to-top').addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0 });
  });
})();
