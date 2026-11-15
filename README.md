# improwebsite

Strona improwizatorki i trenerki impro. Czysty HTML, CSS i odrobina JS, bez budowania. Publikowana przez GitHub Pages z gałęzi `main`.

## Co podmienić przed pokazaniem światu

Treści są przykładowe. W `index.html`:

- **Imię i nazwisko** (teraz przykładowe „Kasia Kowalska”): nagłówek w sekcji otwierającej, `<title>`, stopka.
- **Warsztaty** (`<ul class="workshops">`): nazwy, terminy, ceny, liczba miejsc.
- **Spektakle** (`<ol id="shows">`): każdy wiersz ma `data-date="RRRR-MM-DD"`. Po tej dacie wiersz sam znika, a gdy nie zostanie żaden, pojawia się komunikat o nowych terminach. Linki „Bilety” podmień na adresy sprzedaży.
- **Bio**: cały tekst.
- **Kontakt**: adres `kontakt@example.com` (występuje też w przyciskach zapisów) oraz linki do Instagrama i Facebooka.
- Na koniec usuń pasek `<p class="draft">` u góry strony.

## Zdjęcie

Wrzuć wycięty portret (PNG z przezroczystym tłem, wysokość ok. 1200 px) jako `assets/portret.png`. Pojawi się w prawym dolnym rogu sekcji otwierającej. Bez pliku strona działa normalnie.

## Podgląd lokalnie

```
python3 -m http.server
```
