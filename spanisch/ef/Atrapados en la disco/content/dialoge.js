// ============================================================================
// content/dialoge.js
// ----------------------------------------------------------------------------
// Alle NPC-Dialoge. Jeder Dialog ist ein Baum: jeder "Knoten" (node) hat einen
// Sprecher (speaker), einen spanischen Text (text), optional eine deutsche
// Hilfe (hintDE), optional Antwortmöglichkeiten (options) und optional:
//   - startsMission:   startet/fortsetzt die Mission dieses Bereichs
//   - startsTask:      startet eine einzelne Aufgabe (nur für ältere Knoten)
//   - afterTaskNode:   zu welchem Knoten nach ERFOLGREICHEM Lösen gesprungen
//                       wird (Standard, falls weggelassen: "gracias")
//   - givesReward:     schaltet ein Code-Fragment/Item frei und beendet den
//                       Dialog (Bereich gilt danach als abgeschlossen, wenn
//                       auch alle Aufgaben des Bereichs erledigt sind)
//   - end: true        beendet den Dialog ohne Belohnung (z. B. Höflichkeits-
//                       Enden bei Ablehnung, führt zurück zur Szene)
//
// Diese Datei enthält NUR Inhalte, keine Spiellogik. Lehrkräfte können hier
// Sprechertexte, Antwortoptionen etc. anpassen.
// ============================================================================

const DIALOGOS = {

  // --------------------------------------------------------------------
  // BEREICH 1 — La barra — Camarera/Camarero
  // --------------------------------------------------------------------
  barra: {
    start: {
      speaker: "Camarera",
      text: "¡Hola! ¿Qué tal?",
      hintDE: "Hallo! Wie geht es dir?",
      options: [
        { label: "Muy bien, gracias. ¿Y tú?", next: "necesita_ayuda" },
        { label: "Hablo español.", next: "respuesta_rara" }
      ]
    },
    respuesta_rara: {
      speaker: "Camarera",
      text: "Sí, hablas español. Pero... ¿qué tal?",
      hintDE: "Ja, du sprichst Spanisch. Aber … wie geht es dir?",
      options: [
        { label: "Muy bien, gracias. ¿Y tú?", next: "necesita_ayuda" }
      ]
    },
    necesita_ayuda: {
      speaker: "Camarera",
      text: "Bien, gracias. Necesito ayuda.",
      hintDE: "Gut, danke. Ich brauche Hilfe.",
      options: [
        { label: "Vale.", next: "explica_tarea" },
        { label: "No comprendo. ¿Hablas inglés?", next: "ingles" }
      ]
    },
    ingles: {
      speaker: "Camarera",
      text: "Un poco. I need help.",
      hintDE: "Ein bisschen. Ich brauche Hilfe.",
      options: [
        { label: "Vale. I can help.", next: "explica_tarea" },
        { label: "No hablo inglés.", next: "con_gestos" }
      ]
    },
    con_gestos: {
      speaker: "Camarera",
      text: "No problem. Mira... las fichas.",
      hintDE: "Kein Problem. Schau … die Karten.",
      options: [
        { label: "Ah, vale.", next: "explica_tarea" }
      ]
    },
    explica_tarea: {
      speaker: "Camarera",
      text: "¡Gracias! Escucha a los invitados.",
      hintDE: "Danke! Hör dir die Gäste an.",
      startsMission: true
    },
    entre_tareas_1: {
      speaker: "Camarera",
      text: "¡Perfecto! Ahora dime también: ¿de qué país es cada persona... y qué idioma se habla allí?",
      hintDE: "Perfekt! Jetzt sag mir auch: Aus welchem Land kommt jede Person... und welche Sprache spricht man dort?",
      startsTask: "bar_paises_lenguas_01",
      afterTaskNode: "entre_tareas_2"
    },
    entre_tareas_2: {
      speaker: "Camarera",
      text: "Una cosa más: en la fiesta de esta noche hay gente de muchos países. ¿Sabes rápido quién habla qué idioma? ¡Vamos a comprobarlo con un juego rápido!",
      hintDE: "Noch etwas: Bei der Party heute Nacht sind Leute aus vielen Ländern. Weißt du schnell, wer welche Sprache spricht? Lass uns das mit einem kurzen Spiel testen!",
      startsTask: "bar_quiz_paises",
      afterTaskNode: "gracias"
    },
    gracias: {
      speaker: "Camarera",
      text: "¡Genial! Muchas gracias. Toma: un código.",
      hintDE: "Klasse! Vielen Dank. Hier: ein Code.",
      givesReward: { type: "code", value: "27", area: "barra" }
    }
  },

  // --------------------------------------------------------------------
  // BEREICH 2 — La pista de baile — Marta y Lucía (Austauschschülerinnen)
  // --------------------------------------------------------------------
  pista: {
    start: {
      speaker: "Marta",
      text: "¡Hola! Soy Marta, y ella es Lucía. Estamos aquí atrapadas también. ¿Hablamos un poco mientras esperamos?",
      hintDE: "Hallo! Ich bin Marta, und das ist Lucía. Wir stecken hier auch fest. Reden wir ein bisschen, während wir warten?",
      options: [
        { label: "¡Sí, claro!", next: "explica_tarea" },
        { label: "¿De dónde eres?", next: "de_donde" }
      ]
    },
    de_donde: {
      speaker: "Marta",
      text: "Soy de Polonia, y Lucía es de Italia. Pero aquí en la disco, todos hablamos español para entendernos.",
      hintDE: "Ich komme aus Polen, und Lucía kommt aus Italien. Aber hier in der Disco sprechen wir alle Spanisch, um uns zu verstehen.",
      options: [
        { label: "Vale, ¡empecemos!", next: "explica_tarea" }
      ]
    },
    explica_tarea: {
      speaker: "Lucía",
      text: "Nuestras tarjetas de verbos y la conversación final están mezcladas. ¿Nos ayudas a poner todo en orden?",
      hintDE: "Unsere Verbkarten und das Abschlussgespräch sind durcheinander. Hilfst du uns, alles richtig zu ordnen?",
      startsMission: true
    },
    entre_tareas_1: {
      speaker: "Marta",
      text: "¡Muy bien! Ahora prueba con más verbos: trabajar, estudiar, charlar...",
      hintDE: "Sehr gut! Jetzt probier es mit mehr Verben: arbeiten, lernen/studieren, plaudern...",
      startsTask: "pista_verbformen_block_02",
      afterTaskNode: "entre_tareas_2"
    },
    entre_tareas_2: {
      speaker: "Lucía",
      text: "Última cosa: pon en orden nuestra conversación de antes. ¡Se ha mezclado toda!",
      hintDE: "Eine letzte Sache: Bring unser Gespräch von vorhin in die richtige Reihenfolge. Es ist alles durcheinandergeraten!",
      startsTask: "pista_reorder_dialogo",
      afterTaskNode: "gracias"
    },
    gracias: {
      speaker: "Marta",
      text: "¡Hablas muy bien español! Toma este código, seguro que te sirve para la puerta.",
      hintDE: "Du sprichst sehr gutes Spanisch! Nimm diesen Code, der hilft dir sicher bei der Tür.",
      givesReward: { type: "code", value: "14", area: "pista" }
    }
  },

  // --------------------------------------------------------------------
  // BEREICH 3 — Cabina del DJ
  // --------------------------------------------------------------------
  dj: {
    start: {
      speaker: "DJ",
      text: "¡Hola! Soy Nico, el DJ. ¿Cómo te llamas?",
      hintDE: "Hallo! Ich bin Nico, der DJ. Wie heißt du?",
      options: [
        { label: "Me llamo Alex. ¿Y tú?", next: "necesita_ayuda" },
        { label: "No comprendo. ¿Hablas inglés?", next: "ingles" }
      ]
    },
    ingles: {
      speaker: "DJ",
      text: "Un poco. My name is Nico. I need help.",
      hintDE: "Ein bisschen. Ich heiße Nico. Ich brauche Hilfe.",
      options: [
        { label: "Vale. I can help.", next: "explica_tarea" }
      ]
    },
    necesita_ayuda: {
      speaker: "DJ",
      text: "Muy bien. Necesito ayuda.",
      hintDE: "Sehr gut. Ich brauche Hilfe.",
      options: [
        { label: "Vale.", next: "explica_tarea" },
        { label: "No comprendo. ¿Hablas inglés?", next: "ingles" }
      ]
    },
    explica_tarea: {
      speaker: "DJ",
      text: "Mira: ser o estar. ¿Vale?",
      hintDE: "Schau: ser oder estar. Einverstanden?",
      startsMission: true
    },
    entre_tareas_1: {
      speaker: "DJ",
      text: "¡Genial! Ahora ayúdame a describir Argentina para la próxima canción.",
      hintDE: "Klasse! Jetzt hilf mir, Argentinien für den nächsten Song zu beschreiben.",
      startsTask: "dj_describe_argentina",
      afterTaskNode: "gracias"
    },
    gracias: {
      speaker: "DJ",
      text: "¡Muy bien! Gracias. Toma: un código.",
      hintDE: "Sehr gut! Danke. Hier: ein Code.",
      givesReward: { type: "code", value: "58", area: "dj" }
    }
  },

  // --------------------------------------------------------------------
  // BEREICH 4 — FINALE — Conserje
  // --------------------------------------------------------------------
  finale: {
    start: {
      speaker: "Conserje",
      text: "¡Hola! Soy Pablo. Trabajo aquí. ¿Cómo te llamas?",
      hintDE: "Hallo! Ich bin Pablo. Ich arbeite hier. Wie heißt du?",
      options: [
        { label: "Me llamo Alex.", next: "pide_hablar" },
        { label: "No comprendo. ¿Hablas inglés?", next: "ingles" }
      ]
    },
    ingles: {
      speaker: "Conserje",
      text: "Un poco. My name is Pablo. What is your name?",
      hintDE: "Ein bisschen. Ich heiße Pablo. Wie heißt du?",
      options: [
        { label: "Me llamo Alex.", next: "pide_hablar" }
      ]
    },
    pide_hablar: {
      speaker: "Conserje",
      text: "Muy bien. Primero: el código. Después hablamos.",
      hintDE: "Sehr gut. Zuerst der Code. Danach sprechen wir.",
      options: [
        { label: "Vale.", next: "pregunta_1" }
      ]
    },
    pregunta_1: {
      speaker: "Conserje",
      text: "Mira: cuatro códigos.",
      hintDE: "Schau: vier Codes.",
      startsMission: true
    },
    entre_tareas_1: {
      speaker: "Conserje",
      text: "Bien hecho. Ahora completa estas frases con el pronombre correcto: yo, tú, él/ella, nosotros, ellos...",
      hintDE: "Gut gemacht. Jetzt ergänze diese Sätze mit dem richtigen Pronomen: ich, du, er/sie, wir, sie...",
      startsTask: "finale_pronombres_01",
      afterTaskNode: "entre_tareas_2"
    },
    entre_tareas_2: {
      speaker: "Conserje",
      text: "Muy bien. Y ahora, para terminar: hablemos un momento tú y yo, como en una fiesta de verdad.",
      hintDE: "Sehr gut. Und jetzt, zum Schluss: Lass uns kurz reden, du und ich, wie auf einer echten Party.",
      startsTask: "finale_conversacion_final",
      afterTaskNode: "gracias"
    },
    gracias: {
      speaker: "Conserje",
      text: "¡Muy bien! Gracias. La puerta está abierta. ¡Adiós!",
      hintDE: "Sehr gut! Danke. Die Tür ist offen. Auf Wiedersehen!",
      givesReward: { type: "final", value: "puerta_abierta", area: "finale" }
    }
  }
};
