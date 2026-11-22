/**
 * Prepared E2 session fixture: one Lead AI role and eight anonymised applications.
 * Evidence sentences (I1) and suggested questions (I2) are hand-written from the
 * application text. They simulate an AI output; no model produces them.
 * Company decisions from the answer key are intentionally absent.
 */
export type Mode = "a" | "b";

export interface ReviewApplication {
  id: string;
  letters: Record<Mode, string>;
  score: number;
  answer: string;
  note: string;
  materials: string;
  evidence: { confirmed: string; declared: string; missing: string };
  questions: [string, string];
}

export const reviewJob = {
  title: "Lead AI (senior)",
  facts: "Kraków · praca w biurze · B2B · 23 500–27 500 PLN netto",
  description:
    "Nasza firma rozwija rozwiązania AI wspierające obszar: obsługa zgłoszeń. Przed pierwszym wdrożeniem ustalisz kolejność inicjatyw, zakres decyzji i zasady zatrzymania projektu. Odpowiadasz za priorytety i uzgodnienia. Decyzję o zwiększeniu budżetu podejmuje sponsor z zarządu. Możesz ustalić kolejność inicjatyw w zatwierdzonym budżecie. Do projektu przypisano właściciela procesu i osobę techniczną.",
  need: "Potrzebujemy osoby, która potrafi rozmawiać o swojej dotychczasowej pracy, współpracować z innymi i wyjaśnić decyzje.",
};

const ending = " Mogę omówić przykład i rolę pozostałych osób.";

export const reviewApplications: ReviewApplication[] = [
  {
    id: "app-025820",
    letters: { a: "A", b: "D" },
    score: 82,
    answer:
      "Chodzi o projekt z obszaru: wiedza zespołu. Zarządzałem kolejnością inicjatyw w zatwierdzonym budżecie. Ustalaliśmy kryteria zatrzymania i dalszego finansowania." +
      ending,
    note: "Chciałem poznać szczegóły.",
    materials: "Notatka o mandacie, decyzjach i kompromisach. Część danych jest prywatna.",
    evidence: {
      confirmed:
        "Własny mandat: ustalał kolejność inicjatyw w zatwierdzonym budżecie (notatka o mandacie i decyzjach).",
      declared:
        "Kryteria zatrzymania i finansowania ustalało „my”; nie wiadomo, jaka była jego część.",
      missing: "Żadnego przykładu, że projekt zatrzymano lub dofinansowano według tych kryteriów.",
    },
    questions: [
      "Czy któryś projekt został wstrzymany według tych kryteriów? Co wtedy ustalono?",
      "Jaką część kolejności ustaliłeś sam, a jaką sponsor?",
    ],
  },
  {
    id: "app-026802",
    letters: { a: "B", b: "E" },
    score: 91,
    answer:
      "Chodzi o projekt z obszaru: katalog produktów. Przygotowywałem materiały do spotkań. Priorytety i budżet ustalał dyrektor." +
      ending,
    note: "Jeszcze się zastanawiam.",
    materials: "Materiały spotkania i przegląd narzędzi. Część danych jest prywatna.",
    evidence: {
      confirmed: "Udział w projekcie: przygotowywał materiały do spotkań.",
      declared: "Brak własnych decyzji do sprawdzenia: priorytety i budżet ustalał dyrektor.",
      missing:
        "Przykładu decyzji, którą podjął lub współtworzył. Materiały nie pokazują jego roli.",
    },
    questions: [
      "Jaką decyzję w tym projekcie podjąłeś lub współtworzyłeś?",
      "Czym różniła się Twoja rola od roli dyrektora?",
    ],
  },
  {
    id: "app-026124",
    letters: { a: "C", b: "F" },
    score: 82,
    answer:
      "Chodzi o projekt z obszaru: kontrola dokumentacji. Miałem mandat do ustalenia zakresu pierwszego wdrożenia. Opisałem kompromis między kosztem a pokryciem potrzeb zespołów." +
      ending,
    note: "",
    materials:
      "Notatka o mandacie, decyzjach i kompromisach. Za zgodą zespołu mogę udostępnić fragment.",
    evidence: {
      confirmed:
        "Mandat do zakresu pierwszego wdrożenia i opisany kompromis koszt–pokrycie (notatka, fragment do wglądu).",
      declared: "Nic istotnego ponad to, co opisuje notatka.",
      missing: "Czy pierwsze wdrożenie ruszyło w ustalonym zakresie i z jakim efektem.",
    },
    questions: [
      "Jaki kompromis wybrałeś i co odrzuciłeś?",
      "Czy pierwsze wdrożenie ruszyło w ustalonym zakresie?",
    ],
  },
  {
    id: "app-025770",
    letters: { a: "D", b: "G" },
    score: 81,
    answer:
      "Chodzi o projekt z obszaru: obsługa zgłoszeń. Uzgadniałem priorytety i kryteria decyzji ze sponsorem. Budżet zatwierdzał zarząd, a ja odpowiadałem za kolejność prac." +
      ending,
    note: "",
    materials:
      "Notatka o mandacie, decyzjach i kompromisach. Publiczny opis nie zawiera wszystkich szczegółów.",
    evidence: {
      confirmed:
        "Odpowiadał za kolejność prac w obszarze obsługi zgłoszeń, tym samym co w ogłoszeniu.",
      declared: "Uzgadniał kryteria decyzji ze sponsorem, ale nie podaje żadnego kryterium.",
      missing: "Co zmieniło się dzięki tym kryteriom. Publiczny opis jest niepełny.",
    },
    questions: [
      "Jakie kryteria decyzji uzgodniliście ze sponsorem?",
      "Co zmieniło się w kolejności prac dzięki nim?",
    ],
  },
  {
    id: "app-022437",
    letters: { a: "E", b: "H" },
    score: 67,
    answer:
      "Chodzi o projekt z obszaru: dokumenty operacyjne. Zarządzałem kolejnością inicjatyw w zatwierdzonym budżecie. Ustalaliśmy kryteria zatrzymania i dalszego finansowania." +
      ending,
    note: "",
    materials:
      "Notatka o mandacie, decyzjach i kompromisach. Za zgodą zespołu mogę udostępnić fragment.",
    evidence: {
      confirmed:
        "Własny mandat: ustalał kolejność inicjatyw w zatwierdzonym budżecie (notatka, fragment do wglądu).",
      declared:
        "Kryteria zatrzymania i finansowania ustalało „my”; nie wiadomo, jaka była jego część.",
      missing: "Która inicjatywa została wstrzymana lub dofinansowana i jak duży był budżet.",
    },
    questions: [
      "Którą inicjatywę wstrzymano lub dofinansowano według tych kryteriów?",
      "Jak duży był budżet i kto go zatwierdzał?",
    ],
  },
  {
    id: "app-024933",
    letters: { a: "F", b: "I" },
    score: 61,
    answer:
      "Chodzi o projekt z obszaru: katalog produktów. Miałem mandat do ustalenia zakresu pierwszego wdrożenia. Opisałem kompromis między kosztem a pokryciem potrzeb zespołów." +
      ending,
    note: "Chciałem poznać szczegóły.",
    materials:
      "Notatka o mandacie, decyzjach i kompromisach. Za zgodą zespołu mogę udostępnić fragment.",
    evidence: {
      confirmed:
        "Mandat do zakresu pierwszego wdrożenia i opisany kompromis koszt–pokrycie (notatka, fragment do wglądu).",
      declared: "Nic istotnego ponad to, co opisuje notatka.",
      missing: "Kto z zespołów wybrał ostateczny zakres i co wynikło z kompromisu.",
    },
    questions: [
      "Co konkretnie opisałeś w kompromisie i co z niego wynikło?",
      "Kto z zespołów wybrał ten zakres?",
    ],
  },
  {
    id: "app-024269",
    letters: { a: "G", b: "J" },
    score: 63,
    answer:
      "Chodzi o projekt z obszaru: kontrola dokumentacji. Koordynowałem kalendarz warsztatów i zbierałem pomysły. Decyzję o rozpoczęciu wdrożenia podejmował sponsor." +
      ending,
    note: "",
    materials:
      "Materiały spotkania i przegląd narzędzi. Za zgodą zespołu mogę udostępnić fragment.",
    evidence: {
      confirmed: "Udział w projekcie: koordynował warsztaty i zbierał pomysły.",
      declared: "Brak własnych decyzji do sprawdzenia: o wdrożeniu decydował sponsor.",
      missing: "Przykładu, że pomysł z warsztatów zamienił w plan lub decyzję.",
    },
    questions: [
      "Którą decyzję z warsztatów przekształciłeś w plan?",
      "Kto ustalał priorytety i na jakiej podstawie?",
    ],
  },
  {
    id: "app-022735",
    letters: { a: "H", b: "K" },
    score: 69,
    answer:
      "Chodzi o projekt z obszaru: wiedza zespołu. Koordynowałem kalendarz warsztatów i zbierałem pomysły. Decyzję o rozpoczęciu wdrożenia podejmował sponsor." +
      ending,
    note: "",
    materials: "Materiały spotkania i przegląd narzędzi. Część danych jest prywatna.",
    evidence: {
      confirmed: "Udział w projekcie: koordynował warsztaty i zbierał pomysły.",
      declared: "Brak własnych decyzji do sprawdzenia: o wdrożeniu decydował sponsor.",
      missing: "Co stało się z zebranymi pomysłami i czy brał udział w wyborze.",
    },
    questions: [
      "Co zrobiono z pomysłami zebranymi na warsztatach?",
      "Czy uczestniczyłeś w wyborze, które pomysły wdrożyć?",
    ],
  },
];

/** Card order per mode; mode B reshuffles so the second pass is not a copy of the first. */
export const reviewOrder: Record<Mode, string[]> = {
  a: reviewApplications.map((application) => application.id),
  b: [
    "app-022437",
    "app-026802",
    "app-022735",
    "app-025820",
    "app-024269",
    "app-026124",
    "app-024933",
    "app-025770",
  ],
};

export const modeLabels: Record<Mode, string> = {
  a: "Sam wynik",
  b: "Wynik i wskazówki",
};
