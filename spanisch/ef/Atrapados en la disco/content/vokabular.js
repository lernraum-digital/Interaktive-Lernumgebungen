// ============================================================================
// content/vokabular.js
// ----------------------------------------------------------------------------
// Laufendes Vokabelheft: kurze Liste der wichtigsten Wörter/Ausdrücke pro
// Bereich, passend zu den Aufgaben in content/aufgaben.js. Wird im Spiel erst
// sichtbar, sobald man mindestens eine Aufgabe im jeweiligen Bereich gelöst
// hat (siehe GAME.getVocabForArea in js/game.js) — wächst also mit dem
// Fortschritt mit. Gute Wiederholungsliste kurz vor der Klausur.
//
// Lehrkraft kann hier jederzeit Einträge ergänzen/ändern/löschen, ohne
// Spiellogik anzufassen. Format: { es: "...", de: "..." }
// ============================================================================

const VOKABULAR = {

  hub: [
    { es: "el país", de: "das Land" },
    { es: "la ciudad", de: "die Stadt" },
    { es: "la capital", de: "die Hauptstadt" },
    { es: "la montaña", de: "der Berg" },
    { es: "la isla", de: "die Insel" },
    { es: "un/una (artículo indeterminado)", de: "ein/eine" }
  ],

  barra: [
    { es: "se llama / me llamo", de: "er/sie heißt / ich heiße" },
    { es: "¿de dónde es?", de: "woher kommt er/sie?" },
    { es: "hablar un idioma", de: "eine Sprache sprechen" },
    { es: "el país — la lengua — el/la habitante", de: "das Land — die Sprache — der/die Einwohner:in" },
    { es: "trabajar de...", de: "arbeiten als..." }
  ],

  pista: [
    { es: "hablar / hablo / hablas / habla / hablamos / habláis / hablan", de: "sprechen (alle Formen, Präsens)" },
    { es: "estudiar", de: "lernen / studieren" },
    { es: "trabajar", de: "arbeiten" },
    { es: "charlar", de: "plaudern" },
    { es: "leer / aprender", de: "lesen / lernen" },
    { es: "vivir / escribir", de: "wohnen, leben / schreiben" },
    { es: "no + verbo", de: "Verneinung: no direkt vor dem Verb" },
    { es: "¿qué tal?", de: "wie geht's?" }
  ],

  dj: [
    { es: "ser", de: "sein (dauerhafte Eigenschaft)" },
    { es: "estar", de: "sein (Ort/Zustand)" },
    { es: "interesante / difícil / grande", de: "interessant / schwierig / groß" },
    { es: "en el centro / en el sur / en el este", de: "in der Mitte / im Süden / im Osten" },
    { es: "el continente", de: "der Kontinent" }
  ],

  finale: [
    { es: "¿qué? / ¿quién? / ¿quiénes? / ¿cómo?", de: "was? / wer? / wer (Plural)? / wie?" },
    { es: "¿de dónde? / ¿dónde? / ¿por qué? / ¿cuándo? / ¿cuál?", de: "woher? / wo? / warum? / wann? / welcher, welche?" },
    { es: "yo / tú / él / ella / nosotros/as / ellos/ellas", de: "ich / du / er / sie / wir / sie (Plural)" },
    { es: "¡muchas gracias por tu ayuda!", de: "vielen Dank für deine Hilfe!" },
    { es: "¡buen viaje!", de: "gute Reise!" }
  ]
};
