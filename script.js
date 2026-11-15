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

  document.getElementById('year').textContent = new Date().getFullYear();
  document.getElementById('to-top').addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0 });
  });
})();
