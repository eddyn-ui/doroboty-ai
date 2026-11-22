import { useEffect, useMemo, useState } from "react";
import { BackLink } from "@/components/back-link";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MatchScore } from "@/features/prototype/match-score";
import { PageTitle } from "@/features/prototype/shell";
import {
  modeLabels,
  reviewApplications,
  reviewJob,
  reviewOrder,
  type Mode,
  type ReviewApplication,
} from "./data";
import {
  REQUIRED_PICKS,
  appendAttempt,
  browserStorage,
  clearAttempts,
  questionSourceFor,
  readAttempts,
  sourceLabels,
  startModeFor,
  summarize,
  validatePicks,
  type Attempt,
} from "./session";

type Pick = { question: string; suggestion: string | null };
type Picks = Record<string, Pick>;
const byId = new Map(reviewApplications.map((item) => [item.id, item]));
const emptyPicks = (): Record<Mode, Picks> => ({ a: {}, b: {} });

export function ScreeningReview() {
  const storage = useMemo(browserStorage, []);
  const [participant, setParticipant] = useState(1);
  const [mode, setMode] = useState<Mode>("a");
  const [picks, setPicks] = useState(emptyPicks);
  const [order, setOrder] = useState<Record<Mode, string[]>>({ a: [], b: [] });
  const [startedAt, setStartedAt] = useState<Record<Mode, number | null>>({ a: null, b: null });
  const [attempts, setAttempts] = useState<Attempt[]>(() => readAttempts(storage));
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);

  const current = picks[mode];
  const pickedIds = order[mode].filter((id) => current[id]);

  useEffect(() => {
    setStartedAt((value) => (value[mode] === null ? { ...value, [mode]: Date.now() } : value));
  }, [mode]);

  function updatePick(id: string, next: Pick | null) {
    setError("");
    setPicks((value) => {
      const modePicks = { ...value[mode] };
      if (next) modePicks[id] = next;
      else delete modePicks[id];
      return { ...value, [mode]: modePicks };
    });
    setOrder((value) => {
      const list = value[mode].filter((item) => item !== id);
      return { ...value, [mode]: next ? [...list, id] : list };
    });
  }

  function toggle(application: ReviewApplication, checked: boolean) {
    if (!checked) return updatePick(application.id, null);
    if (pickedIds.length >= REQUIRED_PICKS) {
      setError(
        `Możesz wskazać tylko ${REQUIRED_PICKS} osoby. Odznacz kogoś, żeby wybrać kandydata ${application.letters[mode]}.`,
      );
      return;
    }
    updatePick(application.id, { question: "", suggestion: null });
  }

  function applySuggestion(application: ReviewApplication, suggestion: string) {
    if (!current[application.id] && pickedIds.length >= REQUIRED_PICKS) {
      setError(
        `Masz już ${REQUIRED_PICKS} osoby. Odznacz kogoś, żeby zapytać kandydata ${application.letters[mode]}.`,
      );
      return;
    }
    updatePick(application.id, { question: suggestion, suggestion });
  }

  function save() {
    const chosen = pickedIds.map((id) => ({ id, ...current[id] }));
    const check = validatePicks(chosen);
    if (check !== "ok") {
      setError(
        check === "too-few"
          ? `Wskaż dokładnie ${REQUIRED_PICKS} osoby (teraz: ${chosen.length}).`
          : "Wpisz pytanie przy każdej wskazanej osobie.",
      );
      return;
    }
    const attempt: Attempt = {
      participant,
      mode,
      savedAt: new Date().toISOString(),
      seconds: Math.round((Date.now() - (startedAt[mode] ?? Date.now())) / 1000),
      picks: chosen.map((pick) => ({
        applicationId: pick.id,
        letter: byId.get(pick.id)!.letters[mode],
        question: pick.question.trim(),
        source: questionSourceFor(pick.question, pick.suggestion),
      })),
    };
    const { attempts: next, stored } = appendAttempt(storage, attempts, attempt);
    setAttempts(next);
    setPicks((value) => ({ ...value, [mode]: {} }));
    setOrder((value) => ({ ...value, [mode]: [] }));
    setStartedAt((value) => ({ ...value, [mode]: Date.now() }));
    setError("");
    setStatus(
      stored
        ? `Zapisano próbę: rekruter ${participant}, wersja „${modeLabels[mode]}”.`
        : "Zapisano tylko do końca tej wizyty. Przeglądarka blokuje zapis. Pobierz wyniki przed zamknięciem.",
    );
  }

  function exportAttempts() {
    const blob = new Blob([JSON.stringify(attempts, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "doroboty-przeglad-aplikacji.json";
    document.body.append(link);
    link.click();
    link.remove();
    // Revoking synchronously can cancel the download in Safari and Firefox.
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <section className="review-page">
      <BackLink to="/app/kandydaci">Kandydaci</BackLink>
      <PageTitle>Od kogo zacząć?</PageTitle>
      <p className="review-lead">
        Wskaż trzy osoby, które zaprosisz na rozmowę jako pierwsze, i zapisz, o co każdą zapytasz.
        Nie ma dobrej odpowiedzi.
      </p>

      <div className="review-toolbar prototype-panel">
        <label className="review-participant">
          <span>Rekruter nr</span>
          <Input
            type="number"
            min={1}
            max={99}
            value={participant}
            onChange={(event) => {
              const value = Number(event.target.value);
              if (Number.isInteger(value) && value >= 1 && value <= 99) setParticipant(value);
            }}
          />
        </label>
        <p className="record-caption">
          Rekruter {participant} zaczyna od wersji „{modeLabels[startModeFor(participant)]}”.
        </p>
        <div className="review-mode" role="group" aria-label="Wersja widoku">
          {(["a", "b"] as const).map((item) => (
            <Button
              key={item}
              variant="outline"
              aria-pressed={mode === item}
              onClick={() => {
                setMode(item);
                setError("");
                setStatus("");
              }}
            >
              {modeLabels[item]}
            </Button>
          ))}
        </div>
      </div>

      <article className="prototype-panel review-job" aria-labelledby="review-job-title">
        <p className="record-caption">Ogłoszenie</p>
        <h2 id="review-job-title">{reviewJob.title}</h2>
        <p className="review-facts">{reviewJob.facts}</p>
        <p>{reviewJob.description}</p>
        <p>{reviewJob.need}</p>
      </article>

      {mode === "b" && (
        <p className="prototype-notice">
          Zdania i pytania przy aplikacjach przygotowano ręcznie z tekstu aplikacji. W tym
          prototypie zastępują wynik AI.
        </p>
      )}

      <ol className="review-list" aria-label={`Aplikacje, wersja ${modeLabels[mode]}`}>
        {reviewOrder[mode].map((id) => {
          const application = byId.get(id)!;
          return (
            <li key={`${mode}-${id}`}>
              <ReviewCard
                application={application}
                mode={mode}
                pick={current[id]}
                onToggle={(checked) => toggle(application, checked)}
                onQuestion={(question) =>
                  updatePick(id, { question, suggestion: current[id]?.suggestion ?? null })
                }
                onSuggestion={(suggestion) => applySuggestion(application, suggestion)}
              />
            </li>
          );
        })}
      </ol>

      <div className="review-savebar prototype-panel">
        <p aria-live="polite">
          Wybrano {pickedIds.length} z {REQUIRED_PICKS}
          {pickedIds.length > 0 &&
            `: ${pickedIds.map((id) => byId.get(id)!.letters[mode]).join(", ")}`}
        </p>
        <Button onClick={save}>Zapisz odpowiedź</Button>
        {error && (
          <p role="alert" className="error-message review-error">
            {error}
          </p>
        )}
        <p role="status" className="review-status">
          {status}
        </p>
      </div>

      <section className="prototype-panel review-results" aria-labelledby="review-results-title">
        <h2 id="review-results-title">Zapisane próby ({attempts.length})</h2>
        <p className="record-caption">
          Zapis zostaje tylko w tej przeglądarce. Decyzje firm nie są tu pokazywane.
        </p>
        {attempts.length ? (
          <>
            <ul className="review-attempts">
              {attempts.map((attempt) => {
                const summary = summarize(attempt);
                return (
                  <li key={attempt.savedAt}>
                    <strong>
                      Rekruter {attempt.participant} · {modeLabels[attempt.mode]}
                    </strong>
                    <span>
                      Osoby: {summary.letters} · pytania z propozycji: {summary.used}/
                      {REQUIRED_PICKS} · czas: {summary.minutes} min {summary.seconds} s
                    </span>
                    <ul>
                      {attempt.picks.map((pick) => (
                        <li key={pick.applicationId}>
                          {pick.letter}: „{pick.question}” ({sourceLabels[pick.source]})
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ul>
            <div className="record-actions">
              <Button variant="outline" onClick={exportAttempts}>
                Pobierz wyniki (JSON)
              </Button>
              <Button variant="outline" onClick={() => setConfirmClear(true)}>
                Wyczyść zapisy
              </Button>
            </div>
          </>
        ) : (
          <p>Brak zapisanych prób.</p>
        )}
      </section>

      <ConfirmDialog
        open={confirmClear}
        onOpenChange={setConfirmClear}
        title="Wyczyścić zapisane próby?"
        description="Usuniesz wszystkie zapisane odpowiedzi z tej przeglądarki. Pobierz je wcześniej, jeśli są potrzebne."
        label="Wyczyść"
        pending={false}
        onConfirm={() => {
          clearAttempts(storage);
          setAttempts([]);
          setConfirmClear(false);
          setStatus("Wyczyszczono zapisane próby.");
        }}
      />
    </section>
  );
}

function ReviewCard({
  application,
  mode,
  pick,
  onToggle,
  onQuestion,
  onSuggestion,
}: {
  application: ReviewApplication;
  mode: Mode;
  pick: Pick | undefined;
  onToggle: (checked: boolean) => void;
  onQuestion: (question: string) => void;
  onSuggestion: (suggestion: string) => void;
}) {
  const letter = application.letters[mode];
  const questionId = `review-question-${mode}-${application.id}`;
  return (
    <article
      className="prototype-panel review-card"
      data-picked={pick ? "" : undefined}
      aria-label={`Kandydat ${letter}`}
    >
      <header className="review-card-header">
        <h2>Kandydat {letter}</h2>
        <MatchScore score={application.score} />
      </header>
      <h3>Odpowiedź</h3>
      <p>{application.answer}</p>
      <dl className="review-meta">
        <div>
          <dt>Notatka kandydata</dt>
          <dd>{application.note || "Brak"}</dd>
        </div>
        <div>
          <dt>Materiały</dt>
          <dd>{application.materials}</dd>
        </div>
      </dl>

      {mode === "b" && (
        <div className="review-hints">
          <h3>Co wynika z aplikacji</h3>
          <dl className="review-evidence">
            <div data-kind="confirmed">
              <dt>Potwierdza przykładem</dt>
              <dd>{application.evidence.confirmed}</dd>
            </div>
            <div data-kind="declared">
              <dt>Tylko deklaruje</dt>
              <dd>{application.evidence.declared}</dd>
            </div>
            <div data-kind="missing">
              <dt>Brakuje</dt>
              <dd>{application.evidence.missing}</dd>
            </div>
          </dl>
          <h3>O co zapytać</h3>
          <ol className="review-questions">
            {application.questions.map((question, index) => (
              <li key={question}>
                <span>{question}</span>
                <Button
                  size="sm"
                  variant="outline"
                  aria-label={`Użyj pytania ${index + 1} dla kandydata ${letter}`}
                  onClick={() => onSuggestion(question)}
                >
                  Użyj pytania
                </Button>
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="review-choice">
        <label className="review-check">
          <Checkbox checked={Boolean(pick)} onCheckedChange={(checked) => onToggle(checked)} />
          <span>Zapraszam jako jedną z trzech pierwszych osób</span>
        </label>
        {pick && (
          <div className="review-question-field">
            <label htmlFor={questionId}>Twoje pytanie do kandydata {letter}</label>
            <Textarea
              id={questionId}
              rows={2}
              maxLength={1000}
              value={pick.question}
              onChange={(event) => onQuestion(event.target.value)}
              placeholder="O co zapytasz na rozmowie?"
            />
          </div>
        )}
      </div>
    </article>
  );
}
