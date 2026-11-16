# improwebsite

Strona improwizatorki i trenerki impro. Czysty HTML, CSS i odrobina JS, bez budowania. Publikowana przez GitHub Pages z gałęzi `main`.

## Edycja przez arkusz Google

Warsztaty, spektakle i teksty (bio, wstępy, e-mail) można prowadzić w arkuszu Google. Strona wczytuje go przy każdym wejściu, więc do zmiany terminu nie trzeba dotykać kodu.

Uruchomienie, jednorazowo:

1. Wgraj `arkusz-strona-impro.xlsx` na Dysk Google i otwórz jako Arkusz Google (Plik → Zapisz jako Arkusze Google). Ma karty `spektakle`, `warsztaty`, `teksty` i `instrukcja`.
2. Plik → Udostępnij → Opublikuj w internecie. Wybierz kartę `spektakle`, format „Wartości rozdzielane przecinkami (.csv)”, kliknij Opublikuj i skopiuj adres. Powtórz dla `warsztaty` i `teksty`.
3. Wklej trzy adresy do `config.js` i wypchnij zmianę na `main` oraz `gh-pages`.

Potem wystarczy edytować arkusz. Zmiany pojawiają się na stronie zwykle w ciągu kilku minut (Google odświeża opublikowaną wersję z opóźnieniem).

Zasady:

- Nie zmieniaj nazw kolumn ani kluczy w karcie `teksty`.
- Kolumna `szczegóły` w karcie `spektakle` to miejsce na cenę biletów i inne dopiski; pojawia się pod godziną i miejscem.
- Spektakle układają się same według daty i znikają po swoim dniu. Warsztaty idą w kolejności wierszy; kolumna `pokazuj do` chowa warsztat po podanej dacie.
- `tak` w kolumnie `ukryj` chowa wiersz bez usuwania.
- Gdy arkusz jest niedostępny, strona pokazuje ostatnią wczytaną wersję, a przy pierwszej wizycie treść z `index.html`.
- Opublikowany arkusz jest publiczny dla każdego, kto zna adres. Nie trzymaj w nim niczego prywatnego.

Imię i nazwisko w nagłówku, zdjęcie i pasek „Wersja robocza” zmienia się nadal w `index.html`.

## Co podmienić przed pokazaniem światu

Treści są przykładowe. Bez arkusza zmienia się je w `index.html`:

- **Imię i nazwisko** (teraz przykładowe „Kasia Kowalska”): nagłówek w sekcji otwierającej, `<title>`, stopka.
- **Warsztaty** (`<ul class="workshops">`): nazwy, terminy, ceny, liczba miejsc.
- **Spektakle** (`<ol id="shows">`): każdy wiersz ma `data-date="RRRR-MM-DD"`. Po tej dacie wiersz sam znika, a gdy nie zostanie żaden, pojawia się komunikat o nowych terminach. Linki „Bilety” podmień na adresy sprzedaży.
- **Bio**: cały tekst.
- **Kontakt**: adres `kontakt@example.com` (występuje też w przyciskach zapisów) . Linki do Instagrama i Facebooka dodaj pod adresem e-mail jako zwykłe `<a href="…">`; puste linki usunąłem, żeby nie prowadziły donikąd.
- Na koniec usuń pasek `<p class="draft">` u góry strony.

## Zdjęcie

Wrzuć wycięty portret (PNG z przezroczystym tłem, wysokość ok. 1200 px) jako `assets/portret.png`. Pojawi się w prawym dolnym rogu sekcji otwierającej. Bez pliku strona działa normalnie.

## Podgląd lokalnie

```
python3 -m http.server
```
