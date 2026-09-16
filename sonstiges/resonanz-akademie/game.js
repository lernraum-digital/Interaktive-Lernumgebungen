const CRYSTAL_COLORS = {
  cyan: "#4dd0e1",
  purple: "#8b5cf6",
  gold: "#f5b942",
  amber: "#f59e0b",
  magenta: "#ec4899",
  silver: "#cbd5e1",
  teal: "#2dd4bf",
  rose: "#fb7185",
  indigo: "#818cf8",
  lime: "#a3e635"
};

let audioCtx = null;
function playChime(kind) {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const notes = kind === "success" ? [523.25, 659.25, 783.99] : [660];
    const now = audioCtx.currentTime;
    notes.forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      const start = now + i * 0.1;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.12, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(start);
      osc.stop(start + 0.4);
    });
  } catch (e) {
    /* Audio nicht verfügbar, kein Problem für das Spiel */
  }
}

const KAEL_COMMENTS = [
  "Neun Kristalle warten noch auf euch. Kein schlechter Anfang!",
  "Acht Kristalle offen – ihr kommt Nima wirklich näher.",
  "Sieben Kristalle noch. Ich spüre, wie ihr Rhythmus reinkommt.",
  "Sechs Kristalle übrig – ihr seid schon ein gutes Stück gekommen.",
  "Fünf Kristalle noch, die Hälfte ist geschafft!",
  "Vier Kristalle übrig – weiter so.",
  "Drei Kristalle noch, es wird spannend.",
  "Nur noch zwei Kristalle – gleich habt ihr es geschafft.",
  "Ein einziger Kristall trennt euch noch von Nimas ganzer Geschichte.",
  "Der letzte Kristall ist erwacht. Euer Wappen ist vollständig!"
];

const MODULES = [
  {
    id: "staerken",
    type: "match",
    bg: "assets/eisstadt.jpg",
    crystalColor: "cyan",
    crystalName: "Kristall der Stärken",
    title: "Die Beobachtungsfragmente",
    story: "Nimas Erinnerungen an ihre eigenen Stärken sind in Fragmente zerfallen. Kael hat vier Beobachtungen aus ihrem letzten Praktikum gerettet – doch die Reihenfolge fehlt.",
    task: "Ordnet jedes Fragment der passenden Stärke zu und gebt die vierstellige Zahlenfolge ein.",
    legend: [
      { n: 1, label: "Kommunikation" },
      { n: 2, label: "Teamgeist" },
      { n: 3, label: "Organisation" },
      { n: 4, label: "Kreativität" }
    ],
    clues: [
      "Als der Plan durcheinandergeriet, war Nima die Einzige, die noch wusste, wer was bis wann erledigen sollte.",
      "Nima merkte, dass zwei Mitschüler aneinander vorbeiredeten – sie übersetzte beiden Seiten, bis sie sich verstanden.",
      "Aus drei übrig gebliebenen Materialresten baute Nima ein Modell, das vorher niemand so gesehen hatte.",
      "Obwohl die Aufgabe nicht ihre war, blieb Nima da und half dem Team, rechtzeitig fertig zu werden."
    ],
    code: "3142",
    hints: [
      "Lest jedes Fragment einzeln und überlegt, welche der vier Stärken aus der Legende am besten passt.",
      "Fragment 1 beschreibt jemanden, der den Überblick über Aufgaben und Zeit behält.",
      "Fragment 4 beschreibt jemanden, der einfach mithilft, ohne dass es verlangt wird – das ist eher Teamgeist als Kommunikation."
    ],
    reflection: {
      question: "Welche Stärke habt ihr bei euch selbst schon beobachtet? Nennt eine konkrete Situation.",
      next: "Weiter: Berufsfelder erkunden →"
    }
  },
  {
    id: "berufsfelder",
    type: "exclusion",
    bg: "assets/studierraum.jpg",
    crystalColor: "purple",
    crystalName: "Kristall der Berufsfelder",
    title: "Die vertauschten Wegweiser",
    story: "Im Archiv der Akademie hängen vier Wegweiser zu Nimas möglichen Praktikumsstationen – die Beschriftungen sind abgefallen.",
    task: "Wählt bei jeder Beschreibung das passende Berufsfeld aus den Optionen aus. Richtige Antworten ergeben Ziffer für Ziffer den Code.",
    legend: [
      { n: 1, label: "Technik & IT" },
      { n: 2, label: "Gesundheit & Soziales" },
      { n: 3, label: "Wirtschaft & Verwaltung" },
      { n: 4, label: "Gestaltung & Medien" }
    ],
    clues: [
      "Hier schneidet jemand ein Video zusammen und wählt die passende Musik für die Stimmung.",
      "Hier repariert jemand einen Roboterarm und schreibt danach den Fehlerbericht ins System.",
      "Hier begleitet jemand einen älteren Menschen zum Arzttermin und hört sich in Ruhe seine Sorgen an.",
      "Hier kalkuliert jemand, wie viel Material bestellt werden muss, damit das Budget nicht überschritten wird."
    ],
    code: "4123",
    hints: [
      "Überlegt bei jeder Beschreibung: Geht es hier eher um Technik, Menschen, Zahlen oder Gestaltung?",
      "Fragment 1 beschreibt eine kreative, gestalterische Tätigkeit.",
      "Fragment 4 dreht sich um Zahlen und Budgets statt um direkten Kontakt mit Menschen – das grenzt es von Fragment 3 ab."
    ],
    reflection: {
      question: "Welches Berufsfeld würdet ihr gern erkunden, auch wenn ihr noch wenig darüber wisst?",
      next: "Weiter: Entscheidungskompetenz I →"
    }
  },
  {
    id: "entscheidungskompetenz-i",
    type: "slider",
    bg: "assets/observatorium.jpg",
    crystalColor: "gold",
    crystalName: "Kristall der Entscheidungskompetenz",
    title: "Der Weg der Entscheidung",
    story: "Nima stand vor einer wichtigen Wahl. Kael zeigt vier Momentaufnahmen aus dieser Zeit – doch sie liegen ungeordnet vor euch.",
    task: "Stellt für jede Momentaufnahme den passenden Regler auf die richtige Nummer aus der Legende ein.",
    legend: [
      { n: 1, label: "Informationen sammeln" },
      { n: 2, label: "Optionen abwägen" },
      { n: 3, label: "Entscheidung treffen" },
      { n: 4, label: "Entscheidung überprüfen & anpassen" }
    ],
    clues: [
      "Nima trifft sich mit drei Betrieben, um herauszufinden, wie der Arbeitsalltag dort wirklich aussieht.",
      "Eine Weile später merkt Nima, dass ihr die Arbeit doch nicht so gut gefällt wie gedacht – sie überlegt, ob sie etwas ändern sollte.",
      "Nima schreibt Vor- und Nachteile der drei Möglichkeiten auf eine Liste.",
      "Nima unterschreibt den Ausbildungsvertrag."
    ],
    code: "1423",
    hints: [
      "Überlegt: Was macht man zuerst, wenn man eine gute Entscheidung treffen will – und was erst ganz am Ende?",
      "Fragment 1 gehört an den Anfang des Entscheidungsprozesses.",
      "Fragment 4 ist der letzte sichtbare Moment der Geschichte – überlegt, ob er eher zum Abwägen oder zum eigentlichen Entschluss gehört."
    ],
    reflection: {
      question: "Wie trefft ihr normalerweise wichtige Entscheidungen – eher spontan oder gut abgewogen? Erzählt euch ein Beispiel.",
      next: "Weiter: Praxiserfahrungen erkunden →"
    }
  },
  {
    id: "praxiselemente",
    type: "hotspot",
    bg: "assets/inseln.jpg",
    crystalColor: "amber",
    crystalName: "Kristall der Praxiserfahrung",
    title: "Die Praxis-Fährten",
    story: "Kael hat vier Spuren aus Nimas Erfahrungsbuch gefunden. Jede zeigt eine andere Art, wie sie sich der Arbeitswelt genähert hat – doch die Etiketten sind verwischt.",
    task: "Klickt jede Station an, um ihre Spur aufzudecken. Ordnet dann jede Spur der passenden Praxisform zu und gebt die vierstellige Zahlenfolge ein.",
    legend: [
      { n: 1, label: "Praktikum" },
      { n: 2, label: "Schnuppertag" },
      { n: 3, label: "Ehrenamt" },
      { n: 4, label: "Ferienjob" }
    ],
    clues: [
      "Nima schaut sich für einen einzigen Vormittag an, wie eine Tierärztin arbeitet.",
      "In den Sommerferien verkauft Nima Eis an einem Kiosk, um eigenes Geld zu verdienen.",
      "Nima verbringt eine ganze Woche in einem Betrieb und übernimmt dort echte Aufgaben.",
      "Nima hilft jeden Samstag freiwillig bei der Hausaufgabenbetreuung für jüngere Kinder."
    ],
    code: "2413",
    hints: [
      "Überlegt bei jeder Spur: Wie lange dauert sie, und wird sie bezahlt oder nicht?",
      "Fragment 1 beschreibt die kürzeste der vier Erfahrungen – nur einen Vormittag lang.",
      "Fragment 3 dauert deutlich länger als ein einzelner Ferientag und findet in einem festen Betrieb statt."
    ],
    reflection: {
      question: "Welche dieser Praxiserfahrungen hast du schon gemacht oder planst du als Nächstes? Was hat dir dabei gefallen oder nicht gefallen?",
      next: "Weiter: Entscheidungskompetenz II →"
    }
  },
  {
    id: "entscheidungskompetenz-ii",
    type: "cloze",
    bg: "assets/kristallstadt-nacht.jpg",
    crystalColor: "magenta",
    crystalName: "Kristall der Weitsicht",
    title: "Der Zwiespalt",
    story: "Nima stand vor vier möglichen Wegen nach der Schule. Kael zeigt euch vier kurze Ausschnitte aus ihren Überlegungen – doch sie sind vertauscht.",
    task: "Tragt hinter jedem Ausschnitt die Ziffer des passenden Wegs aus der Legende ein.",
    legend: [
      { n: 1, label: "Ausbildung" },
      { n: 2, label: "Studium" },
      { n: 3, label: "Duales Studium" },
      { n: 4, label: "Freiwilliges Soziales Jahr (FSJ)" }
    ],
    clues: [
      "Nima nimmt sich ein Jahr Zeit, um in einem sozialen Projekt zu arbeiten, bevor sie sich endgültig entscheidet.",
      "Nima lernt direkt in einem Betrieb und besucht parallel die Berufsschule.",
      "Nima wechselt im Rhythmus zwischen Vorlesungen an der Hochschule und einem festen Ausbildungsbetrieb.",
      "Nima verbringt die meiste Zeit an der Hochschule, mit viel Theorie und eigenen Hausarbeiten."
    ],
    code: "4132",
    hints: [
      "Überlegt bei jedem Ausschnitt: Wie viel Theorie, wie viel Praxis steckt darin – und ist es überhaupt schon eine feste Richtung?",
      "Fragment 1 beschreibt eine Auszeit vor einer endgültigen Entscheidung, keinen festen Ausbildungsweg.",
      "Fragment 4 findet fast nur an der Hochschule statt, ganz ohne festen Ausbildungsbetrieb – das unterscheidet es von Fragment 3."
    ],
    reflection: {
      question: "Ausbildung, Studium, duales Studium oder eine Auszeit wie ein FSJ – was spricht dich davon aktuell am meisten an, und warum?",
      next: "Weiter: Interessen & Werte →"
    }
  },
  {
    id: "interessen",
    type: "match",
    bg: "assets/kristallstadt-tag.jpg",
    crystalColor: "teal",
    crystalName: "Kristall der Werte",
    title: "Nimas Tagebuch",
    story: "Kael hat vier Tagebucheinträge gefunden, in denen Nima aufschreibt, was ihr bei einem Job wirklich wichtig ist.",
    task: "Ordnet jeden Tagebucheintrag dem passenden Wert zu und gebt die vierstellige Zahlenfolge ein.",
    legend: [
      { n: 1, label: "Sicherheit" },
      { n: 2, label: "Kreativität" },
      { n: 3, label: "Gemeinschaft" },
      { n: 4, label: "Freiheit" }
    ],
    clues: [
      "Nima schreibt: \"Am wichtigsten ist mir, dass ich meine eigenen Ideen einbringen und Dinge gestalten kann.\"",
      "Nima schreibt: \"Ich will einen Job, bei dem ich weiß, dass ich ihn auch in zehn Jahren noch habe.\"",
      "Nima schreibt: \"Am liebsten arbeite ich dort, wo ich mir meine Zeit selbst einteilen kann.\"",
      "Nima schreibt: \"Am Ende des Tages will ich das Gefühl haben, anderen wirklich geholfen zu haben.\""
    ],
    code: "2143",
    hints: [
      "Überlegt bei jedem Eintrag: Geht es um Planbarkeit, um eigene Ideen, um Zeit oder um andere Menschen?",
      "Eintrag 1 dreht sich ums Gestalten und Erfinden – nicht ums Absichern.",
      "Eintrag 4 unterscheidet sich von Eintrag 3 dadurch, dass es nicht um Zeiteinteilung geht, sondern darum, wem die Arbeit nützt."
    ],
    reflection: {
      question: "Welcher dieser vier Werte ist dir persönlich am wichtigsten – Sicherheit, Kreativität, Gemeinschaft oder Freiheit? Warum?",
      next: "Weiter: Digitale & soziale Kompetenzen →"
    }
  },
  {
    id: "kompetenzen",
    type: "exclusion",
    bg: "assets/studierraum.jpg",
    crystalColor: "rose",
    crystalName: "Kristall der Kompetenzen",
    title: "Die vier Fähigkeiten",
    story: "Kael zeigt euch vier Momente, in denen Nima eine besondere Fähigkeit gezeigt hat – doch welche war es jeweils?",
    task: "Wählt bei jeder Beschreibung die passende Kompetenz aus den Optionen aus.",
    legend: [
      { n: 1, label: "Digitale Kompetenz" },
      { n: 2, label: "Kommunikationsfähigkeit" },
      { n: 3, label: "Belastbarkeit" },
      { n: 4, label: "Problemlösefähigkeit" }
    ],
    clues: [
      "Nima findet sich in jedem neuen Programm schnell zurecht und hilft anderen dabei.",
      "Als der Zeitplan durcheinandergeriet, blieb Nima ruhig und arbeitete konzentriert weiter.",
      "Nima erklärt komplizierte Sachverhalte so, dass alle im Team sie verstehen.",
      "Als ein Gerät kaputtging, fand Nima als Erste einen improvisierten Ersatz."
    ],
    code: "1324",
    hints: [
      "Überlegt: Geht es um Technik, um Sprache, um Nerven behalten oder ums Tüfteln?",
      "Fragment 1 hat klar mit Technik und Programmen zu tun.",
      "Fragment 4 unterscheidet sich von Fragment 1: Hier geht es nicht um Technikwissen, sondern um kreatives Improvisieren in einer schwierigen Situation."
    ],
    reflection: {
      question: "Welche dieser vier Kompetenzen traust du dir selbst schon gut zu – und bei welcher würdest du gern noch dazulernen?",
      next: "Weiter: Unterstützung & Netzwerk →"
    }
  },
  {
    id: "netzwerk",
    type: "slider",
    bg: "assets/observatorium.jpg",
    crystalColor: "indigo",
    crystalName: "Kristall des Netzwerks",
    title: "Wer Nima hilft",
    story: "Niemand findet seinen Weg ganz allein. Kael zeigt euch vier Situationen, in denen sich Nima Unterstützung geholt hat.",
    task: "Stellt für jede Situation den passenden Regler auf die richtige Nummer aus der Legende ein.",
    legend: [
      { n: 1, label: "Familie" },
      { n: 2, label: "Lehrkräfte & Berufsberatung" },
      { n: 3, label: "Freundeskreis" },
      { n: 4, label: "Online-Angebote" }
    ],
    clues: [
      "Nima bespricht ihre Berufswahl beim Abendessen immer wieder mit ihren Eltern.",
      "Nima nutzt einen Online-Interessentest, um herauszufinden, welche Berufe zu ihr passen könnten.",
      "Nima vereinbart einen Termin bei der Berufsberatung ihrer Schule.",
      "Nima tauscht sich mit ihrer besten Freundin aus, die ein ähnliches Praktikum gemacht hat."
    ],
    code: "1423",
    hints: [
      "Überlegt bei jeder Situation: Wer oder was hilft Nima hier konkret weiter?",
      "Fragment 1 findet zu Hause statt, nicht in der Schule.",
      "Fragment 4 unterscheidet sich von Fragment 3 dadurch, dass es keine offizielle Beratungsstelle ist, sondern eine persönliche Freundschaft."
    ],
    reflection: {
      question: "Wen oder was nutzt ihr selbst schon, wenn ihr Fragen zu eurer Berufswahl habt? Fehlt euch noch eine dieser vier Unterstützungsformen?",
      next: "Weiter: Zeitplan zur Berufswahl →"
    }
  },
  {
    id: "zeitplan",
    type: "hotspot",
    bg: "assets/inseln.jpg",
    crystalColor: "lime",
    crystalName: "Kristall des Zeitplans",
    title: "Der Bewerbungsweg",
    story: "Kael hat vier Stationen auf Nimas Weg zum Praktikumsplatz markiert – doch die Reihenfolge ist durcheinandergeraten.",
    task: "Klickt jede Station an, um ihre Spur aufzudecken. Ordnet dann jede Spur dem passenden Schritt zu und gebt die vierstellige Zahlenfolge ein.",
    legend: [
      { n: 1, label: "Praktikum organisieren" },
      { n: 2, label: "Bewerbung schreiben" },
      { n: 3, label: "Vorstellungsgespräch üben" },
      { n: 4, label: "Zu- oder Absage erhalten" }
    ],
    clues: [
      "Nima übt mit ihrem Klassenlehrer typische Fragen für das Gespräch.",
      "Nima öffnet gespannt den Brief mit der Rückmeldung des Betriebs.",
      "Nima sucht sich rechtzeitig einen Betrieb und fragt nach einem Praktikumsplatz.",
      "Nima formuliert ihren Lebenslauf und ihr Anschreiben sorgfältig."
    ],
    code: "3412",
    hints: [
      "Überlegt: Welcher Schritt gehört an den Anfang, welcher ganz ans Ende des Bewerbungsprozesses?",
      "Station 2 ist der letzte Schritt im ganzen Prozess – danach steht die Entscheidung fest.",
      "Station 3 findet vor der eigentlichen Bewerbung statt, nicht danach – Nima sucht hier erst den Praktikumsplatz."
    ],
    reflection: {
      question: "An welchem Punkt dieses Ablaufs steht ihr gerade selbst – oder wollt ihr als Nächstes stehen?",
      next: "Weiter: Orientierung finden →"
    }
  },
  {
    id: "orientierung",
    type: "recap",
    bg: "assets/galaxie.jpg",
    crystalColor: "silver",
    crystalName: "Kristall der Klarheit",
    title: "Nimas Kompass",
    story: "Nur noch ein Kristall bleibt dunkel. Kael zeigt euch vier letzte Notizen aus Nimas Kompass – ihrem Plan für die nächsten Schritte.",
    task: "Ordnet jede Notiz dem passenden Teil ihres Kompasses zu und gebt die vierstellige Zahlenfolge ein.",
    legend: [
      { n: 1, label: "Kurzfristiges Ziel" },
      { n: 2, label: "Mittelfristiges Ziel" },
      { n: 3, label: "Persönliches Vorbild" },
      { n: 4, label: "Unterstützung, die sie sich holt" }
    ],
    clues: [
      "Nima nimmt sich vor, beim nächsten Elternsprechtag gezielt die Berufsberatung anzusprechen.",
      "Wenn Nima nicht weiterweiß, fragt sie ihre große Schwester, die den gleichen Weg schon gegangen ist.",
      "Nima möchte sich bis zum Ende des Monats für einen Praktikumsplatz bewerben.",
      "Nima plant, in einem Jahr ihre Ausbildung begonnen zu haben."
    ],
    code: "4312",
    hints: [
      "Überlegt: Ist die Notiz eher kurzfristig, eher langfristig, eine Person oder eine Anlaufstelle?",
      "Fragment 1 beschreibt, wer oder was Nima ganz konkret weiterhelfen kann.",
      "Fragment 4 liegt zeitlich weiter in der Zukunft als Fragment 3 – das unterscheidet ein mittelfristiges von einem kurzfristigen Ziel."
    ],
    reflection: {
      question: "Was nimmst du dir nach diesem Spiel konkret vor – welchen nächsten Schritt gehst du in den nächsten Wochen? Wer könnte dich dabei unterstützen?",
      next: "Weiter zum Abschluss →"
    }
  }
];

const TOTAL_SECONDS = 68 * 60;
const STORAGE_KEY = "resonanz-akademie-state";
const START_BG = "assets/kristallstadt-tag.jpg";
const FINAL_BG = "assets/kristallstadt-nacht.jpg";
const EMBLEM_IMAGES = {
  c: "assets/emblem-c.jpg",
  s: "assets/emblem-s.png"
};

let isTestMode = window.__forceTestMode === true;

let state = {
  teamName: "",
  players: "",
  emblem: null,
  moduleIndex: 0,
  hintsUsedThisModule: 0,
  crystalsCollected: [],
  secondsLeft: TOTAL_SECONDS,
  started: false
};

let timerInterval = null;
let timerPaused = false;
let activeModule = null;

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      state = Object.assign(state, parsed);
    } catch (e) {
      console.warn("Konnte gespeicherten Fortschritt nicht laden.", e);
    }
  }
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function setBackground(url) {
  document.getElementById("bg-layer").style.backgroundImage =
    `linear-gradient(rgba(10, 10, 26, 0.72), rgba(10, 10, 26, 0.88)), url('${url}')`;
}

function selectEmblem(key) {
  state.emblem = key;
  saveState();
  document.querySelectorAll(".emblem-choice").forEach(btn => {
    btn.classList.toggle("selected", btn.dataset.emblem === key);
  });
  updateEmblemDisplays();
}

function updateEmblemDisplays() {
  const url = state.emblem ? EMBLEM_IMAGES[state.emblem] : null;
  const hudEmblem = document.getElementById("hud-emblem");
  if (url) {
    hudEmblem.src = url;
    hudEmblem.classList.remove("hidden");
  } else {
    hudEmblem.classList.add("hidden");
  }
}

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const s = Math.floor(totalSeconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function updateTimerDisplay() {
  document.getElementById("timer").textContent = formatTime(state.secondsLeft);
}

function startTimer() {
  if (timerInterval) return;
  timerInterval = setInterval(() => {
    if (timerPaused) return;
    if (state.secondsLeft <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      return;
    }
    state.secondsLeft--;
    updateTimerDisplay();
    saveState();
  }, 1000);
}

function pauseTimer() {
  timerPaused = true;
  document.getElementById("timer").classList.add("paused");
  document.getElementById("timer-paused-note").classList.remove("hidden");
}

function resumeTimer() {
  timerPaused = false;
  document.getElementById("timer").classList.remove("paused");
  document.getElementById("timer-paused-note").classList.add("hidden");
}

function renderCrystalTracker(targetId) {
  const el = document.getElementById(targetId);
  el.innerHTML = "";
  MODULES.forEach(mod => {
    const dot = document.createElement("div");
    dot.className = "crystal-dot";
    dot.style.color = CRYSTAL_COLORS[mod.crystalColor];
    dot.style.background = CRYSTAL_COLORS[mod.crystalColor];
    if (state.crystalsCollected.includes(mod.id)) {
      dot.classList.add("collected");
    } else {
      dot.style.background = "#3a3a5c";
    }
    dot.title = mod.crystalName;
    el.appendChild(dot);
  });
}

function updateModuleProgressBar() {
  const pct = (state.moduleIndex / MODULES.length) * 100;
  document.querySelector("#module-progress-bar .progress-fill").style.width = pct + "%";
}

function startGame() {
  state.teamName = document.getElementById("team-name").value.trim() || "Unbenanntes Team";
  state.players = document.getElementById("player-names").value.trim();
  if (!state.emblem) state.emblem = "c";
  state.started = true;
  saveState();
  document.getElementById("hud").classList.remove("hidden");
  updateEmblemDisplays();
  renderCrystalTracker("crystal-tracker");
  startTimer();
  renderModule();
}

function shuffled(arr) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function renderLegend(mod, contentEl) {
  const legendEl = document.createElement("div");
  legendEl.className = "legend";
  legendEl.innerHTML = "<strong>Legende:</strong> " +
    mod.legend.map(l => `${l.n} = ${l.label}`).join(" · ");
  contentEl.appendChild(legendEl);
}

function buildPuzzleContent(mod, contentEl) {
  const renderers = {
    match: renderMatchPuzzle,
    exclusion: renderExclusionPuzzle,
    slider: renderSliderPuzzle,
    hotspot: renderHotspotPuzzle,
    cloze: renderClozePuzzle,
    recap: renderRecapPuzzle
  };
  (renderers[mod.type] || renderMatchPuzzle)(mod, contentEl);
}

function renderMatchPuzzle(mod, contentEl) {
  renderLegend(mod, contentEl);
  const cluesEl = document.createElement("ol");
  cluesEl.className = "clue-list";
  mod.clues.forEach(c => {
    const li = document.createElement("li");
    li.textContent = c;
    cluesEl.appendChild(li);
  });
  contentEl.appendChild(cluesEl);
}

function renderExclusionPuzzle(mod, contentEl) {
  const intro = document.createElement("p");
  intro.className = "task";
  intro.textContent = "Wählt für jedes Fragment die richtige Antwort aus.";
  contentEl.appendChild(intro);

  mod.clues.forEach((clueText, i) => {
    const correctN = Number(mod.code[i]);
    const otherNs = mod.legend.map(l => l.n).filter(n => n !== correctN);
    const options = shuffled([correctN, ...shuffled(otherNs).slice(0, 2)]);

    const round = document.createElement("div");
    round.className = "exclusion-round";

    const label = document.createElement("p");
    label.className = "exclusion-clue";
    label.textContent = `${i + 1}. ${clueText}`;
    round.appendChild(label);

    const optionsWrap = document.createElement("div");
    optionsWrap.className = "exclusion-options";

    options.forEach(n => {
      const legendItem = mod.legend.find(l => l.n === n);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "exclusion-btn";
      btn.textContent = legendItem.label;
      btn.addEventListener("click", () => {
        if (n === correctN) {
          btn.classList.add("correct");
          optionsWrap.querySelectorAll("button").forEach(b => (b.disabled = true));
          round.dataset.solved = "true";
          playChime("tick");
          updateClozeOrExclusionCode(mod, contentEl);
        } else {
          btn.classList.add("wrong");
          setTimeout(() => btn.classList.remove("wrong"), 500);
        }
      });
      optionsWrap.appendChild(btn);
    });

    round.appendChild(optionsWrap);
    contentEl.appendChild(round);
  });
}

function updateClozeOrExclusionCode(mod, contentEl) {
  const rounds = contentEl.querySelectorAll(".exclusion-round, .cloze-blank");
  let code = "";
  if (contentEl.querySelector(".exclusion-round")) {
    contentEl.querySelectorAll(".exclusion-round").forEach(round => {
      const correctBtn = round.querySelector(".exclusion-btn.correct");
      code += correctBtn ? mod.code[[...contentEl.querySelectorAll(".exclusion-round")].indexOf(round)] : "_";
    });
  } else {
    contentEl.querySelectorAll(".cloze-blank").forEach(input => {
      code += input.value.trim() || "_";
    });
  }
  const codeInput = document.getElementById("code-input");
  codeInput.value = code.includes("_") ? "" : code;
  const preview = contentEl.querySelector(".live-code-preview");
  if (preview) preview.textContent = "Aktueller Stand: " + code.replace(/_/g, "·");
}

function renderSliderPuzzle(mod, contentEl) {
  renderLegend(mod, contentEl);

  const preview = document.createElement("p");
  preview.className = "live-code-preview";
  contentEl.appendChild(preview);

  mod.clues.forEach((clueText, i) => {
    const row = document.createElement("div");
    row.className = "slider-row";

    const label = document.createElement("p");
    label.textContent = `${i + 1}. ${clueText}`;
    row.appendChild(label);

    const sliderWrap = document.createElement("div");
    sliderWrap.className = "slider-wrap";

    const slider = document.createElement("input");
    slider.type = "range";
    slider.min = "1";
    slider.max = "4";
    slider.step = "1";
    slider.value = "1";
    slider.className = "slider-input";

    const valueDisplay = document.createElement("span");
    valueDisplay.className = "slider-value";
    valueDisplay.textContent = "1";

    slider.addEventListener("input", () => {
      valueDisplay.textContent = slider.value;
      updateSliderCode(mod, contentEl);
    });

    sliderWrap.appendChild(slider);
    sliderWrap.appendChild(valueDisplay);
    row.appendChild(sliderWrap);
    contentEl.appendChild(row);
  });

  updateSliderCode(mod, contentEl);
}

function updateSliderCode(mod, contentEl) {
  const sliders = contentEl.querySelectorAll(".slider-input");
  const code = [...sliders].map(s => s.value).join("");
  document.getElementById("code-input").value = code;
  const preview = contentEl.querySelector(".live-code-preview");
  if (preview) preview.textContent = "Aktueller Stand: " + code;
}

function renderHotspotPuzzle(mod, contentEl) {
  renderLegend(mod, contentEl);

  const intro = document.createElement("p");
  intro.className = "task";
  intro.textContent = "Klickt jede Station an, um ihre Spur aufzudecken:";
  contentEl.appendChild(intro);

  const grid = document.createElement("div");
  grid.className = "hotspot-grid";

  mod.clues.forEach((clueText, i) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "hotspot-card";
    card.innerHTML = `<span class="hotspot-num">Station ${i + 1}</span><span class="hotspot-icon">🔍</span>`;
    card.addEventListener("click", () => {
      card.innerHTML = `<span class="hotspot-num">Station ${i + 1}</span><span class="hotspot-text">${clueText}</span>`;
      card.classList.add("revealed");
      playChime("tick");
      card.disabled = true;
    });
    grid.appendChild(card);
  });

  contentEl.appendChild(grid);

  const cluesHint = document.createElement("p");
  cluesHint.className = "hint-small";
  cluesHint.textContent = "Ordnet die aufgedeckten Spuren den Nummern aus der Legende zu und gebt die vierstellige Zahlenfolge ein.";
  contentEl.appendChild(cluesHint);
}

function renderClozePuzzle(mod, contentEl) {
  renderLegend(mod, contentEl);

  const preview = document.createElement("p");
  preview.className = "live-code-preview";
  contentEl.appendChild(preview);

  mod.clues.forEach((clueText, i) => {
    const row = document.createElement("div");
    row.className = "cloze-row";

    const label = document.createElement("span");
    label.className = "cloze-text";
    label.textContent = `${i + 1}. ${clueText}`;

    const input = document.createElement("input");
    input.type = "text";
    input.maxLength = 1;
    input.inputMode = "numeric";
    input.className = "cloze-blank";
    input.placeholder = "?";
    input.addEventListener("input", () => updateClozeOrExclusionCode(mod, contentEl));

    row.appendChild(label);
    row.appendChild(input);
    contentEl.appendChild(row);
  });
}

const RECAP_CHIP_COLORS = ["cyan", "purple", "gold", "magenta"];

function renderRecapPuzzle(mod, contentEl) {
  const legendEl = document.createElement("div");
  legendEl.className = "legend recap-legend";
  legendEl.innerHTML = "<strong>Legende:</strong>";
  mod.legend.forEach((l, i) => {
    const chip = document.createElement("span");
    chip.className = "recap-chip";
    chip.style.background = CRYSTAL_COLORS[RECAP_CHIP_COLORS[i % RECAP_CHIP_COLORS.length]];
    chip.textContent = `${l.n} = ${l.label}`;
    legendEl.appendChild(chip);
  });
  contentEl.appendChild(legendEl);

  const cluesEl = document.createElement("ol");
  cluesEl.className = "clue-list";
  mod.clues.forEach(c => {
    const li = document.createElement("li");
    li.textContent = c;
    cluesEl.appendChild(li);
  });
  contentEl.appendChild(cluesEl);
}

function renderModule() {
  if (state.moduleIndex >= MODULES.length) {
    finishGame();
    return;
  }
  const mod = MODULES[state.moduleIndex];
  state.hintsUsedThisModule = 0;
  setBackground(mod.bg);

  showScreen("screen-module");
  updateModuleProgressBar();

  document.getElementById("phase-puzzle").classList.remove("hidden");
  document.getElementById("phase-reward").classList.add("hidden");
  document.getElementById("phase-reflection").classList.add("hidden");

  document.getElementById("puzzle-title").textContent = mod.title;
  document.getElementById("puzzle-story").textContent = mod.story;
  document.getElementById("puzzle-task").textContent = mod.task;

  const contentEl = document.getElementById("puzzle-content");
  contentEl.innerHTML = "";
  buildPuzzleContent(mod, contentEl);

  document.getElementById("code-input").value = "";
  document.getElementById("code-feedback").textContent = "";
  document.getElementById("code-feedback").className = "feedback";
  document.getElementById("hint-list").innerHTML = "";
  document.getElementById("btn-hint").disabled = false;
  document.getElementById("btn-hint").textContent = "Tipp anfordern (kostet Punkte)";

  document.getElementById("btn-test-autosolve").classList.toggle("hidden", !isTestMode);
}

function checkCode() {
  const mod = MODULES[state.moduleIndex];
  const input = document.getElementById("code-input").value.trim();
  const feedback = document.getElementById("code-feedback");

  if (input === mod.code) {
    feedback.textContent = "Richtig! Der Kristall erwacht.";
    feedback.className = "feedback correct";
    if (!state.crystalsCollected.includes(mod.id)) {
      state.crystalsCollected.push(mod.id);
    }
    saveState();
    playChime("success");
    setTimeout(() => showReward(mod), 500);
  } else {
    feedback.textContent = "Das passt noch nicht ganz. Versucht es erneut oder nutzt einen Tipp.";
    feedback.className = "feedback wrong";
  }
}

function showHint() {
  const mod = MODULES[state.moduleIndex];
  if (state.hintsUsedThisModule >= mod.hints.length) return;

  const hintText = mod.hints[state.hintsUsedThisModule];
  const hintEl = document.createElement("div");
  hintEl.className = "hint-item";
  hintEl.textContent = `Tipp ${state.hintsUsedThisModule + 1}: ${hintText}`;
  document.getElementById("hint-list").appendChild(hintEl);

  state.hintsUsedThisModule++;
  if (state.hintsUsedThisModule >= mod.hints.length) {
    document.getElementById("btn-hint").disabled = true;
    document.getElementById("btn-hint").textContent = "Keine weiteren Tipps";
  }
}

function showReward(mod) {
  activeModule = mod;
  document.getElementById("phase-puzzle").classList.add("hidden");
  document.getElementById("phase-reward").classList.remove("hidden");

  const iconEl = document.getElementById("crystal-icon");
  iconEl.style.color = CRYSTAL_COLORS[mod.crystalColor];
  iconEl.style.background = CRYSTAL_COLORS[mod.crystalColor];

  document.getElementById("reward-title").textContent = mod.crystalName + " erhalten";
  document.getElementById("reward-text").textContent =
    "Ein neuer Kristall rastet in euer Wappen ein.";

  const commentIndex = Math.min(state.crystalsCollected.length, KAEL_COMMENTS.length) - 1;
  document.getElementById("kael-comment").textContent = KAEL_COMMENTS[commentIndex] || "";

  renderCrystalTracker("crystal-tracker");
}

function goToReflection() {
  const mod = activeModule;
  document.getElementById("phase-reward").classList.add("hidden");
  document.getElementById("phase-reflection").classList.remove("hidden");
  document.getElementById("reflection-question").textContent = mod.reflection.question;
  document.getElementById("btn-continue").textContent = mod.reflection.next;
  pauseTimer();
}

function continueToNext() {
  resumeTimer();
  state.moduleIndex++;
  saveState();
  renderModule();
}

function initTestBar() {
  document.getElementById("test-bar").classList.remove("hidden");
  const select = document.getElementById("test-jump");
  select.innerHTML = "";

  const startOpt = document.createElement("option");
  startOpt.value = "-1";
  startOpt.textContent = "Startbildschirm";
  select.appendChild(startOpt);

  MODULES.forEach((mod, i) => {
    const opt = document.createElement("option");
    opt.value = String(i);
    opt.textContent = `${i + 1}. ${mod.title}`;
    select.appendChild(opt);
  });

  const finalOpt = document.createElement("option");
  finalOpt.value = String(MODULES.length);
  finalOpt.textContent = "Abschluss-Screen";
  select.appendChild(finalOpt);

  select.value = String(state.moduleIndex);
  select.addEventListener("change", () => jumpToModule(Number(select.value)));
}

function jumpToModule(index) {
  if (index === -1) {
    setBackground(START_BG);
    showScreen("screen-start");
    return;
  }
  if (!state.started) {
    state.teamName = state.teamName || "Testteam";
    state.emblem = state.emblem || "c";
    state.started = true;
    document.getElementById("hud").classList.remove("hidden");
    updateEmblemDisplays();
    startTimer();
  }
  state.crystalsCollected = MODULES.slice(0, index).map(m => m.id);
  state.moduleIndex = index;
  saveState();
  renderCrystalTracker("crystal-tracker");
  renderModule();
}

function autosolveCurrent() {
  const mod = MODULES[state.moduleIndex];
  if (!mod) return;
  document.getElementById("code-input").value = mod.code;
  checkCode();
}

function finishGame() {
  clearInterval(timerInterval);
  timerInterval = null;
  setBackground(FINAL_BG);
  showScreen("screen-final");
  renderCrystalTracker("final-crystals");
  document.getElementById("final-emblem").src = EMBLEM_IMAGES[state.emblem] || EMBLEM_IMAGES.c;
  document.getElementById("final-time").textContent = formatTime(TOTAL_SECONDS - state.secondsLeft) + " gespielt";
}

document.querySelectorAll(".emblem-choice").forEach(btn => {
  btn.addEventListener("click", () => selectEmblem(btn.dataset.emblem));
});

setBackground(START_BG);

document.getElementById("btn-start").addEventListener("click", startGame);
document.getElementById("btn-submit-code").addEventListener("click", checkCode);
document.getElementById("code-input").addEventListener("keydown", e => {
  if (e.key === "Enter") checkCode();
});
document.getElementById("btn-hint").addEventListener("click", showHint);
document.getElementById("btn-to-reflection").addEventListener("click", goToReflection);
document.getElementById("btn-continue").addEventListener("click", continueToNext);
document.getElementById("btn-test-autosolve").addEventListener("click", autosolveCurrent);

loadState();
if (state.emblem) {
  document.querySelectorAll(".emblem-choice").forEach(btn => {
    btn.classList.toggle("selected", btn.dataset.emblem === state.emblem);
  });
}
if (isTestMode) {
  initTestBar();
}
