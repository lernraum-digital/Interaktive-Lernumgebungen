(function () {
  "use strict";

  const tasks = [];
  let id = 1;
  const add = (task) => tasks.push({ id: `Q${String(id++).padStart(3, "0")}`, ...task });
  const text = (category, prompt, answers, hint, explanation, extra = {}) => add({ category, type: "text", prompt, answers, hint, explanation, ...extra });
  const choice = (category, prompt, options, answer, hint, explanation, extra = {}) => add({ category, type: "choice", prompt, options, answer, hint, explanation, ...extra });
  const order = (category, prompt, tokens, answer, hint, explanation, extra = {}) => add({ category, type: "order", prompt, tokens, answers: [answer], hint, explanation, ...extra });
  const imageChoice = (prompt, options, answer, hint, explanation, vocab = []) => add({ category: "Bildimpuls", type: "image", image: "assets/verbos-plaza.jpg", prompt, options, answer, hint, explanation, vocab });
  const audioChallenge = (stimulus, questions, hint, explanation) => add({ category: "Hörimpuls", type: "audio", prompt: "Escucha y responde a las tres preguntas.", stimulus, questions, hint, explanation, challenge: true });

  const persons = [
    { label: "yo", subject: "Yo", ending: 0 },
    { label: "tú", subject: "Tú", ending: 1 },
    { label: "él / ella / usted", subject: "Ella", ending: 2 },
    { label: "nosotros/-as", subject: "Nosotros", ending: 3 },
    { label: "vosotros/-as", subject: "Vosotros", ending: 4 },
    { label: "ellos / ellas / ustedes", subject: "Ellas", ending: 5 }
  ];

  const verbs = [
    { infinitive: "ser", group: "unregelmäßig", forms: ["soy", "eres", "es", "somos", "sois", "son"], complement: "estudiante", vocab: [{ es: "estudiante(s)", de: "Schüler/in(nen)" }] },
    { infinitive: "estar", group: "unregelmäßig", forms: ["estoy", "estás", "está", "estamos", "estáis", "están"], complement: "en Madrid" },
    { infinitive: "hablar", group: "-ar", forms: ["hablo", "hablas", "habla", "hablamos", "habláis", "hablan"], complement: "español" },
    { infinitive: "charlar", group: "-ar", forms: ["charlo", "charlas", "charla", "charlamos", "charláis", "charlan"], complement: "con Ana", vocab: [{ es: "charlar", de: "sich unterhalten" }, { es: "con", de: "mit" }] },
    { infinitive: "leer", group: "-er", forms: ["leo", "lees", "lee", "leemos", "leéis", "leen"], complement: "un libro", vocab: [{ es: "un libro", de: "ein Buch" }] },
    { infinitive: "comer", group: "-er", forms: ["como", "comes", "come", "comemos", "coméis", "comen"], complement: "pizza" },
    { infinitive: "aprender", group: "-er", forms: ["aprendo", "aprendes", "aprende", "aprendemos", "aprendéis", "aprenden"], complement: "español" },
    { infinitive: "estudiar", group: "-ar", forms: ["estudio", "estudias", "estudia", "estudiamos", "estudiáis", "estudian"], complement: "español" },
    { infinitive: "trabajar", group: "-ar", forms: ["trabajo", "trabajas", "trabaja", "trabajamos", "trabajáis", "trabajan"], complement: "en un hotel" },
    { infinitive: "comprender", group: "-er", forms: ["comprendo", "comprendes", "comprende", "comprendemos", "comprendéis", "comprenden"], complement: "el texto", vocab: [{ es: "el texto", de: "der Text" }] },
    { infinitive: "vivir", group: "-ir", forms: ["vivo", "vives", "vive", "vivimos", "vivís", "viven"], complement: "en Madrid" },
    { infinitive: "escribir", group: "-ir", forms: ["escribo", "escribes", "escribe", "escribimos", "escribís", "escriben"], complement: "un mensaje", vocab: [{ es: "un mensaje", de: "eine Nachricht" }] }
  ];

  const regularEndings = {
    "-ar": ["-o", "-as", "-a", "-amos", "-áis", "-an"],
    "-er": ["-o", "-es", "-e", "-emos", "-éis", "-en"],
    "-ir": ["-o", "-es", "-e", "-imos", "-ís", "-en"]
  };

  function hintFor(verb, personIndex) {
    if (verb.infinitive === "ser") return `Ser ist unregelmäßig. Ordne ${persons[personIndex].label} der passenden Form aus soy, eres, es, somos, sois, son zu.`;
    if (verb.infinitive === "estar") return `Estar ist unregelmäßig. Der Stamm est- bleibt erkennbar; achte bei tú, él/ella/usted, vosotros/-as und ellos/ellas/ustedes auf den Akzent.`;
    return `Entferne ${verb.group}. Für ${persons[personIndex].label} brauchst du die Endung ${regularEndings[verb.group][personIndex]}.`;
  }

  function rotatedOptions(values, offset) {
    const copy = [...values];
    const shift = offset % copy.length;
    return [...copy.slice(shift), ...copy.slice(0, shift)];
  }

  function formOptions(verb, personIndex, taskIndex) {
    const indexes = [personIndex, (personIndex + 1) % 6, (personIndex + 3) % 6, (personIndex + 5) % 6];
    return rotatedOptions(indexes.map((index) => verb.forms[index]), taskIndex % 4);
  }

  function complementFor(verb, personIndex) {
    if (verb.infinitive === "ser" && personIndex >= 3) return "estudiantes";
    return verb.complement;
  }

  function sentenceFor(verb, personIndex) {
    return `${persons[personIndex].subject} ${verb.forms[personIndex]} ${complementFor(verb, personIndex)}`;
  }

  function scrambleTokens(tokens, seed) {
    const copy = [...tokens];
    let value = seed + 19;
    for (let index = copy.length - 1; index > 0; index -= 1) {
      value = (value * 37 + 17) % 997;
      const swapIndex = value % (index + 1);
      [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
    }
    if (copy.join(" ") === tokens.join(" ")) copy.reverse();
    return copy;
  }

  function buildOrderTask(verb, verbIndex, personIndex, answer, hint, vocab) {
    const taskComplement = complementFor(verb, personIndex);
    const complement = taskComplement.split(" ");
    let tokens;
    let sentence;
    let subjectHint;

    if (personIndex === 0) {
      tokens = ["Yo", "no", answer, ...complement];
      sentence = `Yo no ${answer} ${taskComplement}`;
      subjectHint = "Yo verlangt die 1. Person Singular; no steht direkt vor dem Verb.";
    } else if (personIndex === 1) {
      tokens = ["Paco,", `¿${answer}`, ...complement.slice(0, -1), `${complement.at(-1)}?`];
      sentence = `Paco, ¿${answer} ${taskComplement}?`;
      subjectHint = "Paco wird direkt angesprochen. Deshalb brauchst du die Form für tú.";
    } else if (personIndex === 2) {
      tokens = ["Luisa", answer, ...complement];
      sentence = `Luisa ${answer} ${taskComplement}`;
      subjectHint = "Luisa entspricht ella, also der 3. Person Singular.";
    } else if (personIndex === 3) {
      tokens = ["Luisa", "y", "yo", answer, ...complement];
      sentence = `Luisa y yo ${answer} ${taskComplement}`;
      subjectHint = "Luisa y yo entspricht nosotros/nosotras.";
    } else if (personIndex === 4) {
      tokens = ["Paco", "y", "tú", answer, ...complement];
      sentence = `Paco y tú ${answer} ${taskComplement}`;
      subjectHint = "Paco y tú entspricht in Spanien vosotros.";
    } else {
      tokens = ["Juani", "y", "Paco", "no", answer, ...complement];
      sentence = `Juani y Paco no ${answer} ${taskComplement}`;
      subjectHint = "Juani y Paco entspricht ellos; no steht direkt vor dem Verb.";
    }

    order(
      "Satz ordnen",
      `Ordne einen korrekten Satz mit ${verb.infinitive}. Achte darauf, wer handelt oder angesprochen wird.`,
      scrambleTokens(tokens, verbIndex * 11 + personIndex),
      sentence,
      `${subjectHint} ${hint}`,
      `<strong>${sentence}</strong> ${subjectHint}`,
      { vocab }
    );
  }

  // 72 Grundaufgaben: jede Kombination aus 12 Verben und 6 Personen kommt genau einmal vor.
  verbs.forEach((verb, verbIndex) => {
    persons.forEach((person, personIndex) => {
      const taskIndex = verbIndex * persons.length + personIndex;
      const answer = verb.forms[personIndex];
      const hint = hintFor(verb, personIndex);
      const explanation = `<strong>${person.label} + ${verb.infinitive} = ${answer}</strong>. Der vollständige Beispielsatz lautet: ${sentenceFor(verb, personIndex)}.`;
      const vocab = verb.vocab || [];
      // Der Versatz verhindert, dass ein Aufgabenformat immer an dieselbe Person gekoppelt ist.
      const format = (verbIndex + personIndex) % 6;

      if (format === 0) {
        text("Konjugieren", `Konjugiere ${verb.infinitive} für ${person.label}. Gib nur die Verbform ein.`, [answer], hint, explanation);
      } else if (format === 1) {
        choice("Form wählen", `Welche Form von ${verb.infinitive} passt zu ${person.label}?`, formOptions(verb, personIndex, taskIndex), answer, hint, explanation);
      } else if (format === 2) {
        const wrong = verb.forms[(personIndex + 2) % 6];
        text("Fehler korrigieren", `Korrigiere nur die Verbform: ${person.subject} ${wrong} ${complementFor(verb, personIndex)}.`, [answer], hint, explanation, { vocab });
      } else if (format === 3) {
        const labels = persons.map((item) => item.label);
        choice("Subjekt erkennen", `Welche Person passt zur Form „${answer}“ von ${verb.infinitive}?`, rotatedOptions(labels, taskIndex % labels.length), person.label, `Vergleiche die Endung mit den sechs Personenformen von ${verb.infinitive}.`, explanation);
      } else if (format === 4) {
        buildOrderTask(verb, verbIndex, personIndex, answer, hint, vocab);
      } else {
        const sourceIndex = (personIndex + 5) % 6;
        text("Form wechseln", `Wechsle die Person: ${persons[sourceIndex].label} ${verb.forms[sourceIndex]} → ${person.label} ___. Gib nur die neue Verbform ein.`, [answer], hint, explanation);
      }
    });
  });

  // 12 zusätzliche Anwendungssätze zu ser und estar.
  const serEstarTasks = [
    ["Yo ___ estudiante.", ["soy", "estoy", "eres", "somos"], "soy", "Name, Rolle oder Identität: ser. Yo verlangt soy.", "Yo <strong>soy</strong> estudiante.", [{ es: "estudiante", de: "Schüler/in" }]],
    ["Tú ___ en Madrid.", ["eres", "estás", "está", "sois"], "estás", "Für einen Ort verwendest du estar. Tú verlangt estás.", "Tú <strong>estás</strong> en Madrid."],
    ["Ana ___ española.", ["está", "es", "son", "eres"], "es", "Herkunft oder Nationalität: ser. Ana entspricht ella.", "Ana <strong>es</strong> española."],
    ["Nosotros ___ en el instituto.", ["somos", "estáis", "estamos", "son"], "estamos", "Für einen Ort verwendest du estar. Nosotros verlangt estamos.", "Nosotros <strong>estamos</strong> en el instituto.", [{ es: "el instituto", de: "die Schule" }]],
    ["Vosotros ___ amigos.", ["estáis", "sois", "somos", "son"], "sois", "Identität oder Beziehung: ser. Vosotros verlangt sois.", "Vosotros <strong>sois</strong> amigos."],
    ["Ellas ___ en casa.", ["son", "están", "estáis", "es"], "están", "Für einen Ort verwendest du estar. Ellas verlangt están.", "Ellas <strong>están</strong> en casa."],
    ["Carlos y yo ___ de Alemania.", ["estamos", "somos", "son", "sois"], "somos", "Herkunft: ser. Carlos y yo entspricht nosotros.", "Carlos y yo <strong>somos</strong> de Alemania."],
    ["Madrid ___ en España.", ["es", "está", "están", "soy"], "está", "Für die geografische Lage verwendest du estar. Madrid ist Singular.", "Madrid <strong>está</strong> en España."],
    ["La profesora ___ simpática.", ["está", "es", "son", "eres"], "es", "Eine allgemeine Eigenschaft wird mit ser ausgedrückt.", "La profesora <strong>es</strong> simpática.", [{ es: "simpática", de: "sympathisch" }]],
    ["Hoy yo ___ bien.", ["soy", "estoy", "está", "somos"], "estoy", "Ein momentaner Zustand wird mit estar ausgedrückt. Yo verlangt estoy.", "Hoy yo <strong>estoy</strong> bien."],
    ["Ustedes ___ estudiantes.", ["están", "sois", "son", "somos"], "son", "Identität oder Rolle: ser. Ustedes verlangt die Form der 3. Person Plural.", "Ustedes <strong>son</strong> estudiantes.", [{ es: "estudiantes", de: "Schüler/innen" }]],
    ["El libro ___ en la mesa.", ["es", "está", "están", "soy"], "está", "Für den Ort einer bestimmten Sache verwendest du estar.", "El libro <strong>está</strong> en la mesa.", [{ es: "el libro", de: "das Buch" }, { es: "la mesa", de: "der Tisch" }]]
  ];
  serEstarTasks.forEach(([prompt, options, answer, hint, explanation, vocab = []]) => choice("Ser o estar", prompt, options, answer, hint, explanation, { vocab }));

  // 6 Bildimpulse mit sehr begrenztem Wortschatz.
  imageChoice("Mira la imagen. La mesa ___ en la plaza.", ["es", "está", "están", "soy"], "está", "Der Ort einer bestimmten Sache wird mit estar beschrieben. La mesa ist Singular.", "La mesa <strong>está</strong> en la plaza.", [{ es: "la mesa", de: "der Tisch" }]);
  imageChoice("Mira la imagen. Las tarjetas ___ en la mesa.", ["son", "está", "están", "sois"], "están", "Für einen Ort verwendest du estar. Las tarjetas ist Plural.", "Las tarjetas <strong>están</strong> en la mesa.", [{ es: "las tarjetas", de: "die Karten" }, { es: "la mesa", de: "der Tisch" }]);
  imageChoice("Mira la imagen. ¿Dónde ___ las plantas?", ["son", "está", "están", "es"], "están", "Die Frage zielt auf einen Ort. Las plantas ist 3. Person Plural.", "¿Dónde <strong>están</strong> las plantas?", [{ es: "las plantas", de: "die Pflanzen" }]);
  imageChoice("Mira la imagen. La imagen ___ de una plaza española.", ["está", "es", "son", "están"], "es", "Zur Identifikation verwendest du ser. La imagen ist Singular.", "La imagen <strong>es</strong> de una plaza española.");
  imageChoice("Mira la imagen. Las tarjetas ___ amarillas, rosas, azules y naranjas.", ["están", "es", "son", "sois"], "son", "Farben sind hier allgemeine Eigenschaften. Las tarjetas ist Plural.", "Las tarjetas <strong>son</strong> amarillas, rosas, azules y naranjas.", [{ es: "las tarjetas", de: "die Karten" }]);
  imageChoice("Mira la imagen. La puerta ___ de color turquesa.", ["están", "está", "es", "son"], "es", "Eine Farbe als Eigenschaft wird mit ser ausgedrückt. La puerta ist Singular.", "La puerta <strong>es</strong> de color turquesa.", [{ es: "la puerta", de: "die Tür" }]);

  // 6 Hörimpulse. Sie liegen fair verteilt auf den Zügen 6, 12 und 18.
  audioChallenge("Yo hablo español. Ana habla alemán. Nosotros hablamos con la profesora.", [
    { prompt: "Welche Form hörst du nach yo?", options: ["hablo", "habla", "hablamos"], answer: "hablo" },
    { prompt: "Welche Form gehört im Hörtext zu Ana?", options: ["hablas", "habla", "hablan"], answer: "habla" },
    { prompt: "Welche Form hörst du bei nosotros?", options: ["hablamos", "habláis", "hablan"], answer: "hablamos" }
  ], "Achte auf die Subjekte yo, Ana und nosotros.", "Du hörst <strong>hablo</strong>, <strong>habla</strong> und <strong>hablamos</strong>.");
  audioChallenge("Tú lees un libro. Carlos lee un mensaje. Vosotros leéis un texto.", [
    { prompt: "Welche Form hörst du bei tú?", options: ["leo", "lees", "lee"], answer: "lees" },
    { prompt: "Welche Form gehört zu Carlos?", options: ["lee", "leen", "leéis"], answer: "lee" },
    { prompt: "Welche Form hörst du bei vosotros?", options: ["leemos", "leéis", "leen"], answer: "leéis" }
  ], "Konzentriere dich auf die drei Formen von leer.", "Du hörst <strong>lees</strong>, <strong>lee</strong> und <strong>leéis</strong>.");
  audioChallenge("Nosotros comemos pizza. Yo como en casa. Ellos comen en un hotel.", [
    { prompt: "Welche Form hörst du bei nosotros?", options: ["comemos", "coméis", "comen"], answer: "comemos" },
    { prompt: "Welche Form hörst du bei yo?", options: ["como", "come", "comes"], answer: "como" },
    { prompt: "Welche Form gehört zu ellos?", options: ["coméis", "comemos", "comen"], answer: "comen" }
  ], "Achte auf die Endungen -emos, -o und -en.", "Du hörst <strong>comemos</strong>, <strong>como</strong> und <strong>comen</strong>.");
  audioChallenge("Lucía vive en Madrid y escribe mensajes. Sus amigos viven en Bonn y escriben mucho.", [
    { prompt: "Welche Form von vivir gehört zu Lucía?", options: ["vive", "vives", "viven"], answer: "vive" },
    { prompt: "Welche Form von escribir gehört zu Lucía?", options: ["escribes", "escribe", "escriben"], answer: "escribe" },
    { prompt: "Welche beiden Pluralformen hörst du?", options: ["vivimos y escribimos", "vivís y escribís", "viven y escriben"], answer: "viven y escriben" }
  ], "Lucía ist Singular, sus amigos ist Plural.", "Lucía <strong>vive</strong> und <strong>escribe</strong>; ihre Freunde <strong>viven</strong> und <strong>escriben</strong>.");
  audioChallenge("Yo soy estudiante y estoy en Madrid. Ana es española y está en casa.", [
    { prompt: "Welche Form von ser hörst du bei yo?", options: ["soy", "eres", "es"], answer: "soy" },
    { prompt: "Welche Form von estar hörst du bei yo?", options: ["está", "estoy", "estás"], answer: "estoy" },
    { prompt: "Welche beiden Formen gehören zu Ana?", options: ["eres y estás", "es y está", "son y están"], answer: "es y está" }
  ], "Unterscheide Identität mit ser und Ort mit estar.", "Du hörst <strong>soy</strong>, <strong>estoy</strong> sowie bei Ana <strong>es</strong> und <strong>está</strong>.");
  audioChallenge("Nosotros estudiamos español. Vosotros trabajáis en un hotel. Ellas aprenden y comprenden mucho.", [
    { prompt: "Welche Form von estudiar hörst du?", options: ["estudiamos", "estudiáis", "estudian"], answer: "estudiamos" },
    { prompt: "Welche Form von trabajar gehört zu vosotros?", options: ["trabajamos", "trabajáis", "trabajan"], answer: "trabajáis" },
    { prompt: "Welche Formen gehören zu ellas?", options: ["aprendéis y comprendéis", "aprendemos y comprendemos", "aprenden y comprenden"], answer: "aprenden y comprenden" }
  ], "Achte auf die Subjekte nosotros, vosotros und ellas.", "Du hörst <strong>estudiamos</strong>, <strong>trabajáis</strong>, <strong>aprenden</strong> und <strong>comprenden</strong>.");

  tasks.filter((task) => task.type === "audio").forEach((task) => {
    task.audio = `assets/audio/${task.id.toLowerCase()}.wav`;
  });

  window.QUESTION_BANK = tasks;
  window.QUESTION_TYPES = {
    text: "Freie Eingabe",
    choice: "Auswahl",
    order: "Satz ordnen",
    image: "Bildimpuls",
    audio: "Hörimpuls"
  };
})();
