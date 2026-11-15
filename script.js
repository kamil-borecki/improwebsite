// Chowa spektakle, które już się odbyły. Gdy nie zostanie żaden, pokazuje komunikat.
(function () {
  var today = new Date();
  today.setHours(0, 0, 0, 0);

  var shows = document.querySelectorAll('#shows .show');
  var visible = 0;
  shows.forEach(function (row) {
    var date = new Date(row.dataset.date + 'T00:00:00');
    if (date < today) {
      row.hidden = true;
    } else {
      visible += 1;
    }
  });
  if (shows.length && visible === 0) {
    document.getElementById('shows').hidden = true;
    document.getElementById('shows-empty').hidden = false;
  }

  // Zdjęcie w hero pokazujemy tylko wtedy, gdy plik assets/portret.png istnieje.
  var photo = document.querySelector('.hero__photo');
  if (photo) {
    var probe = new Image();
    probe.onload = function () { photo.hidden = false; };
    probe.src = photo.getAttribute('src');
  }

  // Sekcje wchodzą przy przewijaniu: tytuł zza maski, potem kolejne elementy kaskadą.
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px' });

    document.querySelectorAll('main .band').forEach(function (band) {
      var title = band.querySelector('.title');
      if (title) {
        var inner = document.createElement('span');
        while (title.firstChild) inner.appendChild(title.firstChild);
        title.appendChild(inner);
        io.observe(title);
      }
      // Wiersze list wchodzą osobno, każdy gdy sam pojawi się w oknie.
      var items = band.querySelectorAll('.lead, .workshop, .show, .shows__empty, .bio__text, .contact__mail');
      var i = 0;
      items.forEach(function (el) {
        el.classList.add('reveal');
        el.style.setProperty('--i', Math.min(i, 3));
        i += 1;
        io.observe(el);
      });
    });
  }

  document.getElementById('year').textContent = new Date().getFullYear();
  document.getElementById('to-top').addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0 });
  });
})();
