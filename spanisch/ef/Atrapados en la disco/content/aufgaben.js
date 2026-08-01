// ============================================================================
// content/aufgaben.js
// ----------------------------------------------------------------------------
// Alle Aufgaben des Spiels als einfache JS-Objekte. Jede Aufgabe hat die
// gemeinsamen Grundfelder:
//   id       - eindeutige ID (wird von game.js zur Fortschrittsverfolgung
//              genutzt, NICHT verändern, wenn schon Spielstände existieren!)
//   area     - hub | barra | pista | dj | finale
//   type     - siehe unten, ein Typ pro Aufgabe
//   prompt   - Aufgabenstellung auf SPANISCH
//   hintDE   - deutsche Erklärung, erscheint nur nach Klick auf das "?"-Icon
//   points   - Punkte, die es für das Lösen gibt
//   bonus    - optional, true = freiwillige Zusatzaufgabe. Zählt NICHT für
//              den Fortschrittsbalken/die Freischaltung eines Bereichs mit,
//              gibt aber trotzdem Punkte. Für schnelle Schüler:innen, die
//              nicht auf die anderen warten wollen (siehe js/game.js,
//              getRequiredTasksForArea vs. getTasksForArea).
//
// Aufgabentypen (siehe js/ui.js für die jeweilige Render-Logik):
//   multipleChoice  - options[] + correctIndex
//   multipleChoiceSet - questions[{prompt,options,correctIndex}]
//   dragMatch       - buckets[] + items[{text,bucket}], optional bucketPositions
//                     (für Aufgaben, bei denen die "Eimer" Punkte auf einer
//                     Szene/Karte sind statt einer einfachen Liste)
//   fillBlankChips  - promptParts[] (Lücken als "___") + wordBank[] +
//                     correctChip (1 Lücke) ODER correctChips[] (mehrere Lücken)
//   fillBlankText   - promptParts[] (genau 1 Lücke) + acceptedAnswers[] +
//                     ignoreCase/ignoreAccents (für getippte Verbformen)
//   reorder         - correctOrder[] (wird gemischt angezeigt)
//   memoryMatch     - columns[] (Spaltenüberschriften) + pairs[{...}]
//   hotspotClick    - hotspots[{id,label,correct,x,y}] (x/y in % der Szene)
//   quizRound       - questions[{prompt,options,correctIndex}] mit Zeitdruck;
//                     nicht gelöste Fragen kehren am Rundenende wieder
//   listeningProfiles - profiles[{name,audio,transcript,questions[]}]: mehrere
//                       lokale Hörtexte mit Verständnisfragen in einer Mission
//
// Die Lehrkraft kann hier jederzeit einzelne Aufgaben austauschen, Optionen
// ändern oder neue Aufgaben desselben Typs ergänzen (dazu einfach ein neues
// Objekt nach demselben Schema in das passende Array einfügen).
// ============================================================================

const AUFGABEN = [

  // ==========================================================================
  // BEREICH 0 — HUB / TUTORIAL (Entrada / Guardarropa)
  // Fokus: Genus der Substantive, Artikel, Singular/Plural
  // Angelehnt an den Einstiegstext "Esto es España" aus dem Unterricht.
  // ==========================================================================

  {
    id: "hub_mapa_01",
    area: "hub",
    type: "dragMatch",
    prompt: "Ordne jeden spanischen Hinweis dem richtigen Ort auf der Karte zu.",
    hintDE: "Verbinde jede Beschreibung mit dem passenden Ort auf der Spanienkarte. Tippe zuerst die Beschreibung und dann den passenden Punkt an.",
    points: 10,
    sceneBackground: "assets/backgrounds/background_hub_mapa.png",
    sceneLabel: "[Mapa de España]",
    buckets: ["Madrid", "los Pirineos", "Mallorca", "Valencia", "Sevilla"],
    bucketPositions: [
      { bucket: "Madrid", x: 43, y: 45 },
      { bucket: "los Pirineos", x: 74, y: 20 },
      { bucket: "Mallorca", x: 85, y: 53 },
      { bucket: "Valencia", x: 65, y: 55 },
      { bucket: "Sevilla", x: 28, y: 77 }
    ],
    items: [
      { text: "la capital de España", bucket: "Madrid" },
      { text: "las montañas en el noreste", bucket: "los Pirineos" },
      { text: "una isla en el Mediterráneo", bucket: "Mallorca" },
      { text: "una ciudad en el este", bucket: "Valencia" },
      { text: "una ciudad en el sur", bucket: "Sevilla" }
    ]
  },
  {
    id: "hub_genero_01",
    area: "hub",
    type: "dragMatch",
    prompt: "Ordne die spanischen Wörter zu: el oder la?",
    hintDE: "Ordne die Wörter dem richtigen Artikel zu: der (el) oder die (la)?",
    points: 10,
    buckets: ["el", "la"],
    items: [
      { text: "capital", bucket: "la" },
      { text: "ciudad", bucket: "la" },
      { text: "centro", bucket: "el" },
      { text: "sur", bucket: "el" },
      { text: "país", bucket: "el" },
      { text: "isla", bucket: "la" },
      { text: "montaña", bucket: "la" },
      { text: "texto", bucket: "el" },
      { text: "chica", bucket: "la" },
      { text: "chico", bucket: "el" },
      { text: "pregunta", bucket: "la" }
    ]
  },
  {
    id: "hub_articulo_01",
    area: "hub",
    type: "fillBlankChips",
    prompt: "Ergänze bei jedem Wort den richtigen unbestimmten Artikel: un oder una.",
    hintDE: "Setze un bei männlichen und una bei weiblichen Substantiven ein.",
    points: 10,
    promptParts: ["", "___", " comunidad · ", "___", " país · ", "___", " ciudad · ", "___", " aeropuerto · ", "___", " isla · ", "___", " texto"],
    wordBank: ["un", "una"],
    correctChips: ["una", "un", "una", "un", "una", "un"]
  },
  {
    id: "hub_hotspot_generos_01",
    area: "hub",
    type: "hotspotClick",
    prompt: "Welche Wörter aus dem Bild gehören zu la? Wähle alle richtigen Wörter unter dem Bild aus.",
    hintDE: "Wähle alle weiblichen Substantive. Die kleinen Nummern zeigen dir, welcher Gegenstand gemeint ist.",
    points: 10,
    sceneBackground: "assets/scenes/scene_guardarropa_generos.png",
    sceneLabel: "[Guardarropa]",
    hotspots: [
      { id: "radio", label: "radio", correct: true, x: 17, y: 28 },
      { id: "programa", label: "programa", correct: false, x: 50, y: 28 },
      { id: "mano", label: "mano", correct: true, x: 83, y: 28 },
      { id: "texto", label: "texto", correct: false, x: 17, y: 72 },
      { id: "ciudad", label: "ciudad", correct: true, x: 50, y: 72 },
      { id: "pais", label: "país", correct: false, x: 83, y: 72 }
    ]
  },
  {
    id: "hub_plural_01",
    area: "hub",
    type: "dragMatch",
    prompt: "Ordne nach Pluralartikel und Endung: los oder las – und -s oder -es?",
    hintDE: "Achte gleichzeitig auf das Geschlecht und die Wortendung: Vokal + -s, Konsonant + -es.",
    points: 10,
    buckets: ["los + -s", "los + -es", "las + -s", "las + -es"],
    items: [
      { text: "el amigo", bucket: "los + -s" },
      { text: "el aeropuerto", bucket: "los + -s" },
      { text: "el país", bucket: "los + -es" },
      { text: "el móvil", bucket: "los + -es" },
      { text: "la amiga", bucket: "las + -s" },
      { text: "la playa", bucket: "las + -s" },
      { text: "la ciudad", bucket: "las + -es" },
      { text: "la universidad", bucket: "las + -es" },
      { text: "la capital", bucket: "las + -es" }
    ]
  },
  {
    id: "hub_bonus_01",
    area: "hub",
    type: "fillBlankText",
    bonus: true,
    prompt: "Tarea extra: completa el plural de 'país'.",
    hintDE: "Zusatzaufgabe: Bilde den Plural von 'país' (das Land). Achtung, der Akzent verschiebt sich nicht, aber es kommt ein -es dazu.",
    points: 10,
    promptParts: ["El singular es 'país'. El plural es '", "___", "'."],
    acceptedAnswers: ["países"],
    ignoreCase: true,
    ignoreAccents: true
  },

  // ==========================================================================
  // BEREICH 1 — LA BARRA
  // Fokus: Personen vorstellen (Name, Nationalität, Sprachen, Beruf),
  // Länder/Sprachen/Einwohner
  // ==========================================================================

  {
    id: "bar_hoerstation_gaeste",
    area: "barra",
    type: "listeningProfiles",
    prompt: "Hör den drei Gästen zu und beantworte die Fragen zu ihren Vorstellungen.",
    hintDE: "Du kannst jede Aufnahme beliebig oft abspielen. Das Transkript ist als Hilfe verfügbar, wenn du beim Hören nicht weiterkommst.",
    learningGoal: "Kurze Vorstellungen zu Herkunft, Nationalität und Sprachen verstehen",
    points: 25,
    profiles: [
      {
        id: "mercedes",
        name: "Mercedes",
        audio: "assets/audio/bar_mercedes.wav",
        transcript: "Hola, soy Mercedes. Soy de Barcelona, en España. Soy española. Hablo español y un poco de alemán.",
        questions: [
          { prompt: "¿De qué país es Mercedes?", options: ["Es de España.", "Es de Alemania.", "Es de Francia."], correctIndex: 0 },
          { prompt: "¿Qué lenguas habla?", options: ["Español y un poco de alemán.", "Francés y español.", "Italiano y alemán."], correctIndex: 0 }
        ]
      },
      {
        id: "camille",
        name: "Camille",
        audio: "assets/audio/bar_camille.wav",
        transcript: "Buenos días. Me llamo Camille y soy de Francia. Soy francesa. Hablo francés. También hablo inglés y estudio español en el instituto.",
        questions: [
          { prompt: "¿De dónde es Camille?", options: ["Es de Francia.", "Es de Inglaterra.", "Es de España."], correctIndex: 0 },
          { prompt: "¿Qué hace en el instituto?", options: ["Estudia español.", "Trabaja de profesora.", "Habla alemán."], correctIndex: 0 },
          { prompt: "¿Qué lenguas habla?", options: ["Francés e inglés.", "Español y alemán.", "Italiano y francés."], correctIndex: 0 }
        ]
      },
      {
        id: "luca",
        name: "Luca",
        audio: "assets/audio/bar_luca_male.wav",
        transcript: "Hola. Me llamo Luca. Soy italiano y soy de Roma, pero ahora vivo en Francia. Hablo italiano y francés. También hablo un poco de inglés.",
        questions: [
          { prompt: "¿De qué país es Luca?", options: ["Es de Italia.", "Es de Francia.", "Es de Inglaterra."], correctIndex: 0 },
          { prompt: "¿Dónde vive ahora?", options: ["En Francia.", "En Italia.", "En España."], correctIndex: 0 },
          { prompt: "¿Qué lenguas habla?", options: ["Italiano, francés y un poco de inglés.", "Solo italiano.", "Francés y español."], correctIndex: 0 }
        ]
      }
    ]
  },
  {
    id: "bar_profil_portugal",
    area: "barra",
    type: "fillBlankChips",
    prompt: "Vervollständige Inês’ Profil: Land, Nationalität und Sprache.",
    hintDE: "Portugal ist das Land, portuguesa die weibliche Nationalität und português die Sprache.",
    points: 10,
    promptParts: ["Inês es de ", "___", ". Es ", "___", " y habla ", "___", "."],
    wordBank: ["Portugal", "portuguesa", "portugués", "português", "portuguese"],
    correctChips: ["Portugal", "portuguesa", "portugués"]
  },
  {
    id: "bar_schreibung_turquia",
    area: "barra",
    type: "multipleChoice",
    prompt: "Emre es de Turquía. Es … y habla turco.",
    hintDE: "Wie lautet die männliche Einwohnerbezeichnung zu Turquía? Achte besonders auf die Schreibweise.",
    points: 10,
    options: ["turco", "turquo", "turko"],
    correctIndex: 0
  },
  {
    id: "bar_sprache_austria",
    area: "barra",
    type: "multipleChoice",
    prompt: "Anna es austriaca. ¿Qué lengua habla?",
    hintDE: "In Österreich spricht man Deutsch. Unterscheide Sprache und Nationalität.",
    points: 10,
    options: ["alemán", "austriaco", "suizo"],
    correctIndex: 0
  },
  {
    id: "bar_preguntas_respuestas",
    area: "barra",
    type: "dragMatch",
    prompt: "Une cada respuesta con la pregunta correcta.",
    hintDE: "Ordne jede Antwort der passenden Frage zu. Achte darauf, ob nach Name, Herkunft, Sprache oder Beruf gefragt wird.",
    learningGoal: "Frageabsichten bei einer Vorstellung unterscheiden",
    points: 15,
    feedbackHints: [
      "Mira la información de la respuesta: nombre, país, lengua o trabajo.",
      "'¿De dónde...?' pregunta por un país. '¿De qué trabaja?' pregunta por una profesión."
    ],
    buckets: ["¿Cómo se llama?", "¿De dónde es?", "¿Qué lenguas habla?", "¿De qué trabaja?"],
    items: [
      { text: "Se llama Camille.", bucket: "¿Cómo se llama?" },
      { text: "Es de Francia.", bucket: "¿De dónde es?" },
      { text: "Habla francés y un poco de español.", bucket: "¿Qué lenguas habla?" },
      { text: "Trabaja de cantante.", bucket: "¿De qué trabaja?" }
    ]
  },
  {
    id: "bar_perfil_invitada",
    area: "barra",
    type: "fillBlankChips",
    prompt: "Completa la ficha de la invitada.",
    hintDE: "Vervollständige die Gästekarte. Für Herkunft und Nationalität brauchst du 'ser', für Sprachen 'hablar' und für den Beruf 'trabajar'.",
    learningGoal: "Eine Person in mehreren zusammenhängenden Sätzen vorstellen",
    points: 15,
    illustration: "assets/scenes/scene_bar_camille.png",
    illustrationLabel: "Camille en la barra",
    feedbackHints: [
      "Primero mira qué información viene después del hueco.",
      "País y nacionalidad: 'es'. Lengua: 'habla'. Profesión: 'trabaja'."
    ],
    promptParts: [
      "Camille ", "___", " de Francia. ",
      "Es ", "___", ". ",
      "Ella ", "___", " francés y un poco de español. ",
      "También ", "___", " de cantante."
    ],
    wordBank: ["es", "francesa", "habla", "trabaja", "está", "estudia"],
    correctChips: ["es", "francesa", "habla", "trabaja"]
  },
  {
    id: "bar_paises_lenguas_01",
    area: "barra",
    type: "fillBlankChips",
    prompt: "Rekonstruiere die vier Gästekarten. Achte auf Land, Sprache und Nationalität.",
    hintDE: "Setze in jeder Karte zuerst das Land, dann die Nationalität und schließlich die Sprache ein.",
    points: 15,
    promptParts: [
      "Mara: ", "___", " · ", "___", " · ", "___", "\n",
      "Camille: ", "___", " · ", "___", " · ", "___", "\n",
      "Luca: ", "___", " · ", "___", " · ", "___", "\n",
      "Aylin: ", "___", " · ", "___", " · ", "___"
    ],
    wordBank: [
      "Alemania", "alemana", "alemán",
      "Francia", "francesa", "francés",
      "Italia", "italiano",
      "Turquía", "turca", "turco"
    ],
    correctChips: [
      "Alemania", "alemana", "alemán",
      "Francia", "francesa", "francés",
      "Italia", "italiano", "italiano",
      "Turquía", "turca", "turco"
    ]
  },
  {
    id: "bar_quiz_paises",
    area: "barra",
    type: "quizRound",
    prompt: "Ronda rápida: países, lenguas y nacionalidades.",
    hintDE: "Schnellrunde zu Ländern, Sprachen und Nationalitäten. Eine nicht gelöste Frage erscheint am Ende erneut; dein übriger Fortschritt bleibt erhalten.",
    points: 25,
    timePerQuestionSeconds: 14,
    onFailBehavior: "retryAtEnd",
    questions: [
      { prompt: "¿Qué lengua se habla en México?", options: ["mexicano", "español", "portugués"], correctIndex: 1 },
      { prompt: "Una persona de Portugal es …", options: ["portugués", "portgués", "portugues"], correctIndex: 0 },
      { prompt: "¿Qué lengua se habla en Austria?", options: ["alemán", "austriaco", "suizo"], correctIndex: 0 },
      { prompt: "Una chica de Turquía es …", options: ["turca", "turqua", "turka"], correctIndex: 0 },
      { prompt: "¿Cuál es la forma correcta?", options: ["francés", "frances", "françés"], correctIndex: 0 },
      { prompt: "Una chica de Alemania es …", options: ["alemana", "alemán", "alemanesa"], correctIndex: 0 }
    ]
  },
  {
    id: "bar_bonus_01",
    area: "barra",
    type: "listeningProfiles",
    bonus: true,
    prompt: "Freiwillige Hörvertiefung: Hör Inês zu und vervollständige ihre Gästekarte.",
    hintDE: "Achte besonders auf den Unterschied zwischen Portugal, portuguesa und portugués.",
    points: 15,
    profiles: [
      {
        id: "ines",
        name: "Inês",
        audio: "assets/audio/bar_ines.wav",
        transcript: "Buenas tardes. Soy Inês y soy de Lisboa. Soy portuguesa. Hablo portugués y un poco de español. Ahora estudio en Madrid.",
        questions: [
          { prompt: "Inês es …", options: ["portuguesa.", "portugués.", "española."], correctIndex: 0 },
          { prompt: "¿Qué lenguas habla?", options: ["Portugués y un poco de español.", "Español y francés.", "Portugués y alemán."], correctIndex: 0 },
          { prompt: "¿Dónde estudia ahora?", options: ["En Madrid.", "En Lisboa.", "En Barcelona."], correctIndex: 0 }
        ]
      }
    ]
  },

  // ==========================================================================
  // BEREICH 2 — LA PISTA DE BAILE
  // Fokus: Verbkonjugation Präsens, regelmäßige Verben auf -ar
  // ==========================================================================

  {
    id: "pista_pronombres_ritmo",
    area: "pista",
    type: "dragMatch",
    prompt: "Une cada forma de 'hablar' con el pronombre correcto.",
    hintDE: "Ordne jede Form von 'hablar' dem passenden Subjektpronomen zu.",
    learningGoal: "Subjektpronomen an regelmäßigen Verbendungen erkennen",
    points: 15,
    feedbackHints: [
      "Mira el final del verbo: -o, -as, -a, -amos, -áis o -an.",
      "yo → -o, tú → -as, nosotros → -amos, vosotros → -áis."
    ],
    buckets: ["yo", "tú", "él/ella", "nosotros/as", "vosotros/as", "ellos/ellas"],
    items: [
      { text: "hablo", bucket: "yo" },
      { text: "hablas", bucket: "tú" },
      { text: "habla", bucket: "él/ella" },
      { text: "hablamos", bucket: "nosotros/as" },
      { text: "habláis", bucket: "vosotros/as" },
      { text: "hablan", bucket: "ellos/ellas" }
    ]
  },
  {
    id: "pista_terminaciones_ar",
    area: "pista",
    type: "fillBlankChips",
    prompt: "Completa el ritmo de las terminaciones de los verbos en -ar.",
    hintDE: "Setze die Präsensendungen regelmäßiger Verben auf -ar in der Reihenfolge yo, tú, él/ella, nosotros, vosotros, ellos ein.",
    learningGoal: "Endungsschema regelmäßiger Verben auf -ar sichern",
    points: 15,
    feedbackHints: [
      "Empieza con yo: habl-o.",
      "El ritmo completo es -o, -as, -a, -amos, -áis, -an."
    ],
    promptParts: [
      "yo -", "___", " · tú -", "___", " · él/ella -", "___",
      " · nosotros -", "___", " · vosotros -", "___", " · ellos -", "___"
    ],
    wordBank: ["o", "as", "a", "amos", "áis", "an"],
    correctChips: ["o", "as", "a", "amos", "áis", "an"]
  },
  {
    id: "pista_verbformen_block_01",
    area: "pista",
    type: "fillBlankChips",
    prompt: "Completa con las formas correctas de los verbos.",
    hintDE: "Ergänze alle fünf Sätze. Achte zuerst auf das Subjekt und dann auf die passende Verbendung.",
    learningGoal: "Regelmäßige Verben in mehreren Personen und Verbgruppen anwenden",
    points: 25,
    feedbackHints: [
      "Marta y Lucía = ellas; nosotros und vosotros stehen bereits im Satz.",
      "Die Endungen lauten hier: -an, -amos, -áis, -o und -emos."
    ],
    promptParts: [
      "1. Marta y Lucía ", "___", " español muy bien.\n",
      "2. Nosotros ", "___", " español en el instituto.\n",
      "3. ¿Vosotros ", "___", " en la discoteca?\n",
      "4. Yo ", "___", " con mis amigos.\n",
      "5. Nosotros ", "___", " los textos en clase."
    ],
    wordBank: ["hablan", "estudiamos", "trabajáis", "charlo", "leemos"],
    correctChips: ["hablan", "estudiamos", "trabajáis", "charlo", "leemos"]
  },
  {
    id: "pista_verbformen_block_02",
    area: "pista",
    type: "fillBlankChips",
    prompt: "Completa las formas de los verbos en -er e -ir.",
    hintDE: "Ergänze die drei Sätze mit den passenden Formen. Marta und Pedro sind Singular, los estudiantes ist Plural.",
    learningGoal: "Regelmäßige Verben auf -er und -ir im Kontext anwenden",
    points: 15,
    feedbackHints: ["Marta = ella, Pedro = él, los estudiantes = ellos."],
    promptParts: [
      "1. Marta ", "___", " en Madrid.\n",
      "2. Pedro ", "___", " alemán en el instituto.\n",
      "3. Los estudiantes ", "___", " textos en español."
    ],
    wordBank: ["vive", "aprende", "escriben"],
    correctChips: ["vive", "aprende", "escriben"]
  },
  {
    id: "pista_korrektur_block",
    area: "pista",
    type: "multipleChoiceSet",
    prompt: "Corrige las frases.",
    hintDE: "Wähle bei jedem Satz die grammatisch richtige Variante.",
    learningGoal: "Kongruenz und Verneinung in mehreren Sätzen korrigieren",
    points: 15,
    feedbackHints: [
      "Mit yo endet das Verb auf -o; Marta y Lucía entsprechen ellas.",
      "Bei der Verneinung steht no direkt vor dem konjugierten Verb."
    ],
    questions: [
      {
        prompt: "1. Yo … español y alemán.",
        options: ["Yo hablo español y alemán.", "Yo hablas español y alemán.", "Yo hablan español y alemán."],
        correctIndex: 0
      },
      {
        prompt: "2. Marta y Lucía … alemán.",
        options: ["Marta y Lucía estudian alemán.", "Marta y Lucía estudiáis alemán.", "Marta y Lucía estudia alemán."],
        correctIndex: 0
      },
      {
        prompt: "3. Mi madre … en un hotel.",
        options: ["Mi madre no trabaja en un hotel.", "Mi madre trabaja no en un hotel.", "No mi madre trabaja en un hotel."],
        correctIndex: 0
      }
    ]
  },
  {
    id: "pista_reorder_dialogo",
    area: "pista",
    type: "reorder",
    prompt: "Ordena el diálogo en el orden correcto.",
    hintDE: "Bring den Dialog in die richtige Reihenfolge.",
    points: 15,
    illustration: "assets/scenes/scene_pista_dialogo.png",
    illustrationLabel: "Una conversación en la pista de baile",
    correctOrder: [
      "¡Hola! ¿Qué tal?",
      "Estoy muy bien, gracias. ¿Y tú?",
      "Bien también. ¿Cómo te llamas?",
      "Me llamo Marta."
    ]
  },
  {
    id: "pista_bonus_01",
    area: "pista",
    type: "fillBlankText",
    bonus: true,
    prompt: "Tarea extra: completa con la forma correcta del verbo 'hablar'.",
    hintDE: "Zusatzaufgabe: Ergänze mit der richtigen Form von 'hablar'. Tipp: 'vosotras' → Endung -áis.",
    points: 10,
    promptParts: ["Vosotras ", "___", " muy rápido en español."],
    acceptedAnswers: ["hablais", "habláis"],
    ignoreCase: true,
    ignoreAccents: true
  },

  // ==========================================================================
  // BEREICH 3 — CABINA DEL DJ
  // Fokus: ser vs. estar, Länder beschreiben
  // ==========================================================================

  {
    id: "dj_clasifica_ser_estar",
    area: "dj",
    type: "dragMatch",
    prompt: "Pon cada frase en la pista SER o en la pista ESTAR.",
    hintDE: "Sortiere nach Funktion: SER für Identität oder Eigenschaft, ESTAR für Ort und Befinden.",
    learningGoal: "Funktionen von ser und estar unterscheiden",
    points: 15,
    illustration: "assets/scenes/scene_dj_ser_estar.png",
    illustrationLabel: "Dos pistas: identidad y lugar",
    feedbackHints: [
      "Pregunta: ¿qué es o cómo es? → SER. ¿Dónde está? → ESTAR.",
      "Identidad y característica: SER. Lugar: ESTAR."
    ],
    buckets: ["SER: identidad o característica", "ESTAR: lugar"],
    items: [
      { text: "Madrid ___ la capital de España.", bucket: "SER: identidad o característica" },
      { text: "Barcelona ___ una ciudad grande.", bucket: "SER: identidad o característica" },
      { text: "Madrid ___ en el centro.", bucket: "ESTAR: lugar" },
      { text: "Bilbao ___ en el norte.", bucket: "ESTAR: lugar" },
      { text: "Las playas ___ bonitas.", bucket: "SER: identidad o característica" },
      { text: "Valencia y Sagunto ___ en el este.", bucket: "ESTAR: lugar" }
    ]
  },
  {
    id: "dj_ser_estar_01",
    area: "dj",
    type: "fillBlankChips",
    prompt: "Completa con 'es' o 'está'.",
    hintDE: "Ergänze mit 'es' (ser — für Eigenschaften) oder 'está' (estar — für Lage/Ort).",
    points: 15,
    promptParts: ["España ", "___", " interesante. Barcelona ", "___", " grande. Madrid ", "___", " en el centro del país."],
    wordBank: ["es", "está"],
    correctChips: ["es", "es", "está"]
  },
  {
    id: "dj_ser_estar_02",
    area: "dj",
    type: "fillBlankChips",
    prompt: "Completa con 'es' o 'está'.",
    hintDE: "Ergänze mit 'es' oder 'está'.",
    points: 15,
    promptParts: ["El texto ", "___", " difícil. Sagunto y Valencia ", "___", " en el este. La clase de español ", "___", " interesante."],
    wordBank: ["es", "está", "están"],
    correctChips: ["es", "están", "es"]
  },
  {
    id: "dj_error_01",
    area: "dj",
    type: "multipleChoice",
    prompt: "El DJ ha cometido un error. Elige la corrección.",
    hintDE: "Madrid befindet sich im Zentrum. Für einen Ort wird estar verwendet.",
    learningGoal: "Fehler bei Ortsangaben mit estar korrigieren",
    points: 10,
    feedbackHints: ["'En el centro' es un lugar. Usa estar."],
    options: ["Madrid está en el centro.", "Madrid es en el centro.", "Madrid están en el centro."],
    correctIndex: 0
  },
  {
    id: "dj_error_02",
    area: "dj",
    type: "multipleChoice",
    prompt: "El DJ ha cometido otro error. Elige la corrección.",
    hintDE: "'Interessant' ist hier eine Eigenschaft des Textes. Dafür wird ser verwendet.",
    learningGoal: "Fehler bei Eigenschaften mit ser korrigieren",
    points: 10,
    feedbackHints: ["'Interesante' describe cómo es el texto. Usa ser."],
    options: ["El texto es interesante.", "El texto está interesante.", "El texto son interesante."],
    correctIndex: 0
  },
  {
    id: "dj_describe_argentina",
    area: "dj",
    type: "fillBlankChips",
    prompt: "Describe Argentina: completa el texto.",
    hintDE: "Beschreibe Argentinien: Ergänze den Text mit 'es' oder 'está'.",
    points: 15,
    promptParts: ["Argentina ", "___", " un país muy grande. La capital ", "___", " Buenos Aires, y ", "___", " en el sur del continente."],
    wordBank: ["es", "está"],
    correctChips: ["es", "es", "está"]
  },
  {
    id: "dj_describe_argentina_02",
    area: "dj",
    type: "fillBlankChips",
    prompt: "Termina la presentación de Argentina.",
    hintDE: "Ergänze die Präsentation. Identität und Eigenschaften stehen mit ser, Ortsangaben mit estar.",
    learningGoal: "Ser und estar in einer Länderbeschreibung übertragen",
    points: 15,
    feedbackHints: [
      "'Un país' e 'interesante' van con ser. 'En América del Sur' va con estar.",
      "La solución usa: es – está – es."
    ],
    promptParts: ["Argentina ", "___", " un país. ", "___", " en América del Sur y ", "___", " muy interesante."],
    wordBank: ["es", "está", "son", "están"],
    correctChips: ["es", "está", "es"]
  },
  {
    id: "dj_bonus_01",
    area: "dj",
    type: "fillBlankChips",
    bonus: true,
    prompt: "Tarea extra: completa con 'es' o 'está'.",
    hintDE: "Zusatzaufgabe: Ergänze mit 'es' oder 'está'.",
    points: 10,
    promptParts: ["El DJ ", "___", " en la cabina ahora mismo, y la música ", "___", " muy buena."],
    wordBank: ["es", "está"],
    correctChips: ["está", "es"]
  },

  // ==========================================================================
  // BEREICH 4 — FINALE — PUERTA DE SEGURIDAD
  // Fokus: Fragewörter, Subjektpronomen, integrativer Kennenlern-Dialog
  // ==========================================================================

  {
    id: "finale_preguntas_01",
    area: "finale",
    type: "dragMatch",
    prompt: "Une cada respuesta con la palabra interrogativa correcta.",
    hintDE: "Ordne jeder Antwort das passende Fragewort zu.",
    points: 15,
    buckets: ["¿qué?", "¿quién?", "¿cómo?", "¿de dónde?"],
    items: [
      { text: "Es de España, de Madrid.", bucket: "¿de dónde?" },
      { text: "Es la camarera de la discoteca.", bucket: "¿quién?" },
      { text: "Estudio español y matemáticas.", bucket: "¿qué?" },
      { text: "Muy bien, gracias.", bucket: "¿cómo?" }
    ]
  },
  {
    id: "finale_preguntas_02",
    area: "finale",
    type: "dragMatch",
    prompt: "Une las demás respuestas con la palabra interrogativa correcta.",
    hintDE: "Ordne auch die übrigen eingeführten Fragewörter zu: wo, wer im Plural, warum, wann und welcher/welche.",
    learningGoal: "Weitere eingeführte Fragewörter sicher unterscheiden",
    points: 15,
    feedbackHints: [
      "Lugar → dónde; personas en plural → quiénes; razón → por qué.",
      "Momento → cuándo; elección o identificación → cuál."
    ],
    buckets: ["¿dónde?", "¿quiénes?", "¿por qué?", "¿cuándo?", "¿cuál?"],
    items: [
      { text: "En Madrid.", bucket: "¿dónde?" },
      { text: "Son Marta y Lucía.", bucket: "¿quiénes?" },
      { text: "Porque practicamos español.", bucket: "¿por qué?" },
      { text: "Mañana.", bucket: "¿cuándo?" },
      { text: "El español.", bucket: "¿cuál?" }
    ]
  },
  {
    id: "finale_pronombres_01",
    area: "finale",
    type: "dragMatch",
    prompt: "Une cada frase con el pronombre correcto.",
    hintDE: "Ordne jedem Satz das richtige Subjektpronomen zu.",
    points: 15,
    buckets: ["tú", "nosotros", "ellos", "yo", "ella"],
    items: [
      { text: "___ eres de Madrid.", bucket: "tú" },
      { text: "___ trabajamos mucho.", bucket: "nosotros" },
      { text: "___ comen en un hotel.", bucket: "ellos" },
      { text: "___ vivo en Alemania.", bucket: "yo" },
      { text: "___ habla inglés y alemán.", bucket: "ella" }
    ]
  },
  {
    id: "finale_conversacion_final",
    area: "finale",
    type: "reorder",
    prompt: "Ordena la conversación final con el conserje.",
    hintDE: "Bring das Abschlussgespräch mit dem Hausmeister in die richtige Reihenfolge.",
    points: 20,
    correctOrder: [
      "¡Hola! ¿Cómo te llamas?",
      "Me llamo Alex. ¿Y tú?",
      "Me llamo Pablo. ¿De dónde eres?",
      "Soy de Alemania. Hablo alemán, inglés y un poco de español.",
      "Muy bien, gracias.",
      "De nada. ¡Adiós!"
    ]
  },
  {
    id: "finale_dialogo_huecos",
    area: "finale",
    type: "fillBlankChips",
    prompt: "Completa el diálogo antes de ordenar la conversación final.",
    hintDE: "Vervollständige den Kennenlerndialog mit den passenden bekannten Formen.",
    learningGoal: "Begrüßung, Befinden, Name, Herkunft und Wohnort integriert anwenden",
    points: 20,
    illustration: "assets/scenes/scene_finale_dialogo.png",
    illustrationLabel: "La conversación con el conserje",
    feedbackHints: [
      "Mira quién habla y qué información se pregunta en cada frase.",
      "¿Cómo estás? – ¿Y tú? – Me llamo... – ¿De dónde eres? – Soy de... – vivo en..."
    ],
    promptParts: [
      "Laura: ¡Hola! ¿Cómo ", "___", "?\n",
      "Paco: Estoy muy bien. ¿Y ", "___", "?\n",
      "Laura: Bien también. Me ", "___", " Laura. ¿De dónde ", "___", "?\n",
      "Paco: ", "___", " de Cádiz, pero ", "___", " en Barcelona."
    ],
    wordBank: ["estás", "tú", "llamo", "eres", "soy", "vivo", "es", "estoy"],
    correctChips: ["estás", "tú", "llamo", "eres", "soy", "vivo"]
  },
  {
    id: "finale_bonus_01",
    area: "finale",
    type: "multipleChoice",
    bonus: true,
    prompt: "Tarea extra: ¿qué palabra interrogativa falta? '¿___ son ellos?' — 'Son mis amigos.'",
    hintDE: "Zusatzaufgabe: Welches Fragewort passt? 'Wer sind sie (Plural)?' — 'Das sind meine Freunde.'",
    points: 10,
    options: ["¿Quién?", "¿Quiénes?", "¿Qué?"],
    correctIndex: 1
  }
];
