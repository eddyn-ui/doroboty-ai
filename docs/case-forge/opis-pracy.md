# Case Forge: „Od kogo zacząć?” — prototyp dla pracodawcy w DoRoboty.ai

**Data:** 2026-11-22 · **Kod:** github.com/eddyn-ui/doroboty-ai (gałąź `main`) · **Ekran:** `/#/app/kandydaci/przeglad`

---

## 1. Jaki problem użytkownika rozwiązuję

**Użytkownik:** pracodawca (rekruter), który dostał kilka aplikacji na jedną rolę i musi zdecydować, kogo zaprosić na rozmowę.

**Problem (potrzeba O05):** „Sam wynik nie mówi mi, od kogo zacząć ani o co zapytać.”

**Skąd wiem (discovery → problem):**

| Typ        | Sygnał                                                                                                                                                           | Źródło                                        |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| Obserwacja | Przewaga „continue” po rozmowie dla wyższego wyniku spadła z +38 pp (XI 2025) do +18 pp (V 2026) i +3 pp (VI 2026). Wynik przestał odróżniać dobrych kandydatów. | 4 950 aplikacji z rozmową, `applications.csv` |
| Deklaracja | 3 z 4 rekruterów: wynik nie wystarcza do wyboru ani do pytań. 1 z 4 chce sortować po wyniku.                                                                     | Wywiady F1–F4                                 |
| Obserwacja | Aplikacje z przykładem pracy: 41,0% „continue”, bez przykładu: 25,3%. Przykład pracy niesie informację, której wynik nie pokazuje.                               | Test E1 na danych                             |
| Decyzja    | Supersprint 2026-11-02: O05 wybrana po PRES (remis 12 pkt z O03, O06). Pomysły I1 + I2.                                                                          | `decisions/2026-11-02-prototyp-tydzien-3.md`  |

**Rozwiązanie (problem → prototyp):** przy każdej aplikacji, pod wynikiem:

- **I1 — trzy zdania:** co kandydat potwierdza przykładem, co tylko deklaruje, czego brakuje. Odpowiada na „od kogo zacząć”.
- **I2 — dwa pytania do kandydata** z przyciskiem „Użyj pytania”. Odpowiada na „o co zapytać”.

Żeby sprawdzić, czy to pomaga, ekran ma dwie wersje: **„Sam wynik”** (jak dziś) i **„Wynik i wskazówki”** (I1 + I2).

---

## 2. Po czym poznam, że prototyp działa

### 2a. Zadanie i wynik na ekranie (czy prototyp działa technicznie)

**Zadanie rekrutera:** „Wskaż trzy osoby, które zaprosisz na rozmowę jako pierwsze, i zapisz, o co każdą zapytasz.”

| #   | Krok                                                               | Co ma się pojawić                                                                                                                       |
| --- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Uruchom `npm run dev`, otwórz http://127.0.0.1:3001                | Strona główna DoRoboty.ai                                                                                                               |
| 2   | „Wybierz osobę” → **Karolina Wiśniewska** (pracodawca, BrightLabs) | Strefa pracodawcy, menu z „Kandydaci”                                                                                                   |
| 3   | Kandydaci → **„Od kogo zacząć? (test)”**                           | Ekran z ogłoszeniem Lead AI (senior) i 8 kartami A–H, aktywna wersja „Sam wynik”                                                        |
| 4   | Wpisz „Rekruter nr” 1                                              | Podpowiedź: „Rekruter 1 zaczyna od wersji »Sam wynik«”                                                                                  |
| 5   | Zaznacz 3 osoby, wpisz przy każdej pytanie                         | Pod każdą zaznaczoną kartą pole „Twoje pytanie”, licznik „Wybrano 3 z 3: …”                                                             |
| 6   | Spróbuj zaznaczyć czwartą osobę                                    | Komunikat: „Możesz wskazać tylko 3 osoby…”, nic się nie zaznacza                                                                        |
| 7   | „Zapisz odpowiedź”                                                 | „Zapisano próbę…”, w „Zapisane próby (1)” widać osoby, pytania z etykietą „własne pytanie” i czas                                       |
| 8   | Przełącz na **„Wynik i wskazówki”**                                | Te same osoby z literami D–K w innej kolejności. Na każdej karcie widać „Co wynika z aplikacji” (3 zdania) i „O co zapytać” (2 pytania) |
| 9   | Kliknij „Użyj pytania” przy 3 osobach, jedno pytanie zmień         | Osoba zaznacza się sama, pytanie trafia do pola                                                                                         |
| 10  | „Zapisz odpowiedź”                                                 | „Zapisane próby (2)”: etykiety „pytanie z propozycji” / „propozycja zmieniona”, licznik „pytania z propozycji: 3/3”                     |
| 11  | „Pobierz wyniki (JSON)”                                            | Plik `doroboty-przeglad-aplikacji.json` z obiema próbami                                                                                |
| 12  | Odśwież stronę                                                     | Zapisane próby nadal są                                                                                                                 |

Scenariusz przeszedł 2026-11-22 agent w przeglądarce. Kroki 1–10 i 12 dały opisany wynik, a zawartość zapisu sprawdzono w localStorage. Krok 11 (pobranie pliku) nie był klikany.

### 2b. Czy rozwiązanie pomaga rekruterom (sesje E2, 5–8 osób)

Progi **zatwierdzone 2026-11-22, przed sesjami.** Nie zmieniam ich po wynikach.

| Miara (z pliku JSON)                                 | Działa, jeśli                                                                | Nie działa, jeśli                                       |
| ---------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------- |
| Użycie propozycji w wersji B                         | ≥ 5 z 8 rekruterów bierze ≥ 1 pytanie z propozycji (wprost lub zmienione)    | ≤ 2 z 8                                                 |
| Pytania o własną rolę / decyzję / rezultat kandydata | Odsetek w B wyższy niż w A o ≥ 20 pp, osobno dla „A najpierw” i „B najpierw” | Brak różnicy albo różnica tylko w jednej kolejności     |
| Koszt czasu                                          | Czas w B ≤ 1,5 × czas w A                                                    | B wyraźnie dłużej i rekruterzy mówią „za dużo czytania” |
| Pomocniczo                                           | W B więcej wskazań osób z przykładem pracy                                   | —                                                       |

Przy 5–8 osobach to sygnał jakościowy, nie dowód statystyczny. Prototyp nie sprawdza wpływu na ponowny zakup (30% → 60% w 90 dni). Do tego potrzebny jest test E3.

---

## 3. Co działa naprawdę, a co jest symulacją

| Działa naprawdę (kod w przeglądarce)                                                               | Przygotowane / symulowane                                                                                                                                                                                                                        |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Wybór osoby i rola pracodawcy (kandydatka Anna dostaje „Ten widok jest dostępny dla pracodawcy”)   | **Trzy zdania (I1) i dwa pytania (I2)** przy każdej aplikacji: **napisane ręcznie przeze mnie** z tekstu aplikacji. **Żaden model AI ich nie generuje i nie analizuje aplikacji.** Ekran mówi rekruterowi: „W tym prototypie zastępują wynik AI” |
| Przełączanie wersji A/B, nowe litery i kolejność w B                                               | **8 aplikacji** to stały zestaw z E2 (zanonimizowane rekordy z ogłoszenia `pub-003513`, V 2026), wpisany w kod. Nie pochodzi z formularza aplikowania                                                                                            |
| Limit 3 osób, wymagane pytanie przy każdej, komunikaty błędów                                      | **Match Score** to liczba z danych case'u (zaokrąglona), a nie wynik liczony przez model                                                                                                                                                         |
| „Użyj pytania” i rozpoznanie, czy pytanie jest z propozycji, zmienione czy własne                  | Ogłoszenie Lead AI jest wpisane w ekran. Nie jest to oferta z listy ofert Karoliny                                                                                                                                                               |
| Pomiar czasu, zapis prób w przeglądarce (localStorage), eksport JSON, czyszczenie z potwierdzeniem | Zapis działa tylko w tej przeglądarce. Nie ma serwera ani wspólnej bazy                                                                                                                                                                          |

**Czego nie wiem:** czy prawdziwy model napisze takie zdania rzetelnie, bez zmyślania przykładów. Prototyp to sprawdza **wartość** wskazówek dla rekrutera, nie **jakość AI**.

---

## 4. Jak prototyp korzysta z projektu

| Element DoRoboty.ai                                                                                                                                       | Jak użyty                                                                         |
| --------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Osoby i role z danych przykładowych (`people.json`)                                                                                                       | Karolina jako pracodawca. Strażnik roli `RequireRole` blokuje ekran dla kandydata |
| Lista Kandydaci (`/#/app/kandydaci`)                                                                                                                      | Punkt wejścia: przycisk „Od kogo zacząć? (test)”                                  |
| Komponenty design systemu Poster People: `MatchScore`, `BackLink`, `Button`, `Checkbox`, `Textarea`, `Input`, `ConfirmDialog`, panele, `prototype-notice` | Cały ekran, bez nowych wariantów. Własny CSS tylko na układ                       |
| Routing (hash), Zod, wzorzec zapisu w localStorage                                                                                                        | Nowa trasa, walidacja zapisów, osobny klucz (dane produktu nietknięte)            |

**Dlaczego nowy ekran, a nie karta aplikacji (`/#/app/kandydaci/:id`):** „od kogo zacząć” to wybór kolejności spośród wielu osób. Na karcie jednej aplikacji nie da się ich porównać.

**Dlaczego aplikacje z E2, a nie z danych przykładowych:** Karolina ma w danych przykładowych jedną aplikację (Marek), więc nie ma czego porównywać. Osiem aplikacji z E2 ma dobrane wyniki i przykłady pracy (po 2 z każdej kombinacji: wynik ≥ 75 / < 75, z przykładem / bez). To też te same karty, które dostaną rekruterzy w E2.

**Wcześniejsze funkcje na tej ścieżce nadal działają (sprawdzone 2026-11-22):**

| Funkcja                                                                                                    | Wynik                                                       |
| ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Wybór osoby: Karolina, Anna                                                                                | ✅                                                          |
| Kandydaci: lista, wyszukiwarka, pusty wynik „Brak aplikacji spełniających kryteria.”                       | ✅                                                          |
| Karta aplikacji Marka: odpowiedź, CV, Match Score, historia                                                | ✅                                                          |
| Decyzja rekrutacyjna „W przeglądzie” zapisuje się w historii                                               | ✅                                                          |
| Kandydatka: „Moje aplikacje” bez przycisku testu                                                           | ✅                                                          |
| Ustawienia → „Resetuj scenariusz” przywraca dane                                                           | ✅ (zapisanych prób testu nie kasuje, bo mają osobny klucz) |
| Kontrole automatyczne: format, lint, typy, 34 testy jednostkowe (7 nowych), build, kontrola design systemu | ✅                                                          |
| Testy przeglądarkowe Playwright                                                                            | ⚠️ nieuruchomione: brak przeglądarki Chromium na komputerze |

---

## 5. Ograniczenia

- Ten sam rekruter widzi te same osoby dwa razy (efekt uczenia). Dlatego jest rotacja: nieparzyści zaczynają od A, parzyści od B. Wyniki liczę osobno dla obu grup.
- Plan E2 rev. 2 testował w wersji B same pytania. Prototyp pokazuje zdania i pytania, zgodnie z decyzją z 2026-11-02.
- Prototyp nie dotyka przejścia od szkicu do płatności (O09), gdzie leży największy zmierzony spadek zakupów.
