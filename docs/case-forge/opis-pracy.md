# Case Forge: „Od kogo zacząć?” — prototyp dla pracodawcy w DoRoboty.ai

**Data:** 2026-11-22 · **Projekt:** [[doroboty-ai]] · **Kod:** `prototypes/doroboty-ai` (własna kopia repo), ekran `/#/app/kandydaci/przeglad`

## 1. Wybór z discovery

|                             |                                                                                                                                                                                 |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Problem (O05)**           | „Sam wynik nie mówi mi, od kogo zacząć ani o co zapytać.”                                                                                                                       |
| **Rozwiązanie**             | Przy każdej aplikacji trzy zdania: co kandydat potwierdza przykładem, co tylko deklaruje, czego brakuje (I1). Do tego dwie propozycje pytań do kandydata (I2).                  |
| **Sygnał (obserwacja)**     | 4 950 aplikacji z rozmową: przewaga „continue” po rozmowie dla wyższego wyniku spadła z +38 pp (XI 2025) do +18 pp (V 2026) i +3 pp (VI 2026). Źródło: `data/applications.csv`. |
| **Sygnał (deklaracja)**     | 3 z 4 rekruterów (F1–F4: Monika, Anna, Paweł) mówią, że wynik nie wystarcza do wyboru ani do pytań. Joanna chce sortować po wyniku.                                             |
| **Sygnał (obserwacja, E1)** | Aplikacje z przykładem pracy: 41,0% „continue”, bez przykładu: 25,3%.                                                                                                           |
| **Decyzja**                 | Supersprint, 2026-11-02 (`decisions/2026-11-02-prototyp-tydzien-3.md`).                                                                                                         |

## 2. Dla kogo i co sprawdzam

- **Użytkownik:** pracodawca, czyli rekruter przeglądający aplikacje na jedną rolę.
- **Zadanie w prototypie:** przy ogłoszeniu Lead AI (senior) i 8 aplikacjach wskaż 3 osoby, które zaprosisz na rozmowę jako pierwsze, i zapisz po jednym pytaniu do każdej.
- **Co rekruter widzi jako wynik:** listę swoich trzech wyborów z pytaniami. Moderator widzi zapis próby: kogo wybrał, jakie pytania zadał, czy pytanie pochodzi z propozycji (wprost lub po zmianie), czy jest własne, i ile trwało zadanie.
- **Hipoteza:** z trzema zdaniami i propozycjami pytań rekruter zada pytania o własną rolę, decyzje i rezultat kandydata, zamiast pytań ogólnych. Częściej też wskaże osoby, które mają przykład pracy.

## 3. Po czym poznam, że prototyp działa

Progi **zatwierdzone 2026-11-22, przed sesjami**. Nie zmieniamy ich po zobaczeniu wyników:

| Miara (z zapisu prób)                  | Działa, jeśli                                                                             | Nie działa, jeśli                                       |
| -------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| Użycie propozycji w wersji B           | ≥ 5 z 8 rekruterów bierze co najmniej 1 pytanie z propozycji (wprost lub zmienione)       | ≤ 2 z 8                                                 |
| Pytania o własną rolę/decyzję/rezultat | Odsetek w B wyższy niż w A o ≥ 20 pp, liczony osobno dla grup „A najpierw” i „B najpierw” | Brak różnicy lub różnica tylko w jednej kolejności      |
| Koszt czasu                            | Czas w B ≤ 1,5 × czas w A                                                                 | B wyraźnie dłużej i rekruterzy mówią „za dużo czytania” |
| Pomocniczo: kogo wskazuje              | W B więcej wskazań aplikacji z przykładem pracy (A, C, E, F w wersji A)                   | —                                                       |

Uwaga: przy 5–8 osobach to sygnał jakościowy, nie dowód statystyczny. Prototyp nie dowodzi wpływu na ponowny zakup (30% → 60%). To sprawdzi dopiero E3 (90 dni, połowa firm z wskazówkami).

## 3a. Gdzie w projekcie i na jakich danych

**Co już jest w DoRoboty.ai (przegląd z agentem):**

| Element                                                                                                         | Co daje                                    | Czy użyte                                      |
| --------------------------------------------------------------------------------------------------------------- | ------------------------------------------ | ---------------------------------------------- |
| `/#/app/kandydaci` (EMP-07): lista aplikacji pracodawcy z Match Score i podsumowaniem                           | Punkt wejścia rekrutera                    | Tak, tu jest przycisk „Od kogo zacząć? (test)” |
| `/#/app/kandydaci/:id` (EMP-08): karta jednej aplikacji (odpowiedź, CV, historia, decyzje)                      | Naturalne miejsce na trzy zdania i pytania | Nie, uzasadnienie niżej                        |
| Komponenty: `MatchScore`, `BackLink`, `Button`, `Checkbox`, `Textarea`, `Notice`, `ConfirmDialog`, panele 24 px | Spójny wygląd z resztą portalu             | Tak, bez nowych wariantów                      |
| Dane przykładowe: `people.json`, `marketplace.json` (Anna, Marek, Karolina, Tomasz; 1 aplikacja u Karoliny)     | Gotowi użytkownicy i role                  | Użytkownik tak (Karolina), aplikacje nie       |

**Dlaczego nowy ekran, a nie karta aplikacji (EMP-08):** problem brzmi „od kogo zacząć”, a to decyzja o **kolejności wśród wielu aplikacji**, nie o jednej osobie. Na karcie pojedynczej aplikacji rekruter nie porówna kandydatów. Nowy ekran pozwala też przełączać wersję A/B bez zmiany działania reszty portalu.

**Dlaczego aplikacje z E2, a nie z danych przykładowych:** w danych przykładowych Karolina ma jedną aplikację (Marek), więc nie ma wyboru „trzech z ośmiu”. Osiem aplikacji z E2 (`pub-003513`, V 2026) ma dobrane wyniki i przykłady pracy (po 2 z każdej kombinacji: wynik ≥75 lub <75, z przykładem lub bez). Do tego są to te same karty, które dostaną rekruterzy w protokole E2, więc wyniki z prototypu da się porównać z planem. Użytkownik i uprawnienia pochodzą z danych przykładowych (Karolina, rola pracodawcy).

## 4. Co zbudowałam

- **Nowy ekran „Od kogo zacząć?”** w strefie pracodawcy, dostępny przyciskiem „Od kogo zacząć? (test)” na liście Kandydaci.
- **Przełącznik wersji:** „Sam wynik” (A) i „Wynik i wskazówki” (B). W B kandydaci mają inne litery (D–K) i inną kolejność, zgodnie z protokołem E2.
- **Karta aplikacji:** wynik, odpowiedź, notatka, materiały. W B dochodzi blok „Co wynika z aplikacji” (trzy zdania z kolorowym znacznikiem) i „O co zapytać” (dwa pytania z przyciskiem „Użyj pytania”).
- **Wybór:** pole „Zapraszam jako jedną z trzech pierwszych osób”, limit 3 z komunikatem, pole na pytanie.
- **Zapis prób:** numer rekrutera, rotacja (nieparzyści zaczynają od A), czas, źródło pytania. Eksport do JSON i czyszczenie z potwierdzeniem.
- **Design system:** Poster People: białe karty 24 px, czarny kontur, różowy przycisk główny, MatchScore, Notice, BackLink, Checkbox i Textarea z projektu.

## 5. Scenariusz testu

1. Uruchom aplikację (`npm run dev` w `prototypes/doroboty-ai`), otwórz http://127.0.0.1:3001.
2. „Wybierz osobę” → **Karolina Wiśniewska** (pracodawca, BrightLabs) → Kandydaci → „Od kogo zacząć? (test)”.
3. Ustaw „Rekruter nr” (1–8). Podpowiedź mówi, od której wersji zacząć.
4. Zadanie 1 w pierwszej wersji: 3 osoby + 3 pytania → „Zapisz odpowiedź”.
5. Przełącz wersję, powtórz zadanie → „Zapisz odpowiedź”.
6. Rozmowa: co pomogło, co przeszkadzało, czemu nie użył pytań.
7. Po wszystkich sesjach: „Pobierz wyniki (JSON)” → policz miary z tabeli w sekcji 3.

Przejście scenariusza sprawdziłam 2026-11-22 w przeglądarce (rekruter 1, A potem B). Zapis i rozpoznanie źródła pytania działają.

## 6. Przygotowane odpowiedzi AI (uczciwie)

- Trzy zdania i dwa pytania przy każdej aplikacji **napisałam ręcznie** na podstawie tekstu aplikacji. Żaden model ich nie generuje, a ekran informuje o tym rekrutera.
- Pytania pochodzą z `e2-materialy.md`, zdania z liczby elementów przykładu (reguła E1).
- Wynik dopasowania pochodzi z danych case'u, zaokrąglony do pełnych procent.
- Osiem aplikacji to zanonimizowane rekordy z ogłoszenia `pub-003513` (V 2026). Decyzje firm nie są pokazywane (są tylko w kluczu).
- Nietestowane: czy model napisze takie zdania rzetelnie i bez halucynacji.

## 7. Ograniczenia

- Dane zapisują się tylko w przeglądarce, na której prowadzisz sesję. Pobierz JSON po każdej sesji.
- Ten sam rekruter widzi te same osoby dwa razy (efekt uczenia). Dlatego rotacja i liczenie osobno dla „A najpierw” i „B najpierw”.
- Rozbieżność z E2 rev. 2: tam wersja B miała tylko pytania (I2). Prototyp pokazuje I1 + I2, zgodnie z decyzją z 2026-11-02. Jeśli chcesz testować samo I2, trzeba dodać trzeci tryb.
- Testy przeglądarkowe Playwright nie były uruchomione (brak Chromium). Pozostałe kontrole (format, lint, typy, 34 testy jednostkowe, build, design system) przeszły.
