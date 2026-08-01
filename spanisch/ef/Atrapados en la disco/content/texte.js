// ============================================================================
// content/texte.js
// ----------------------------------------------------------------------------
// Alle "Rahmen"-Texte des Spiels: die Story auf Deutsch (Einleitung, große
// Szenenübergänge), die spanischen Systemmeldungen (kurz, A1-Niveau) und
// feste UI-Beschriftungen. Lehrkräfte können hier Texte anpassen, ohne die
// Spiellogik (js/game.js, js/ui.js) anzufassen.
//
// WICHTIG (Sprachkonzept):
// - Die Rahmenhandlung/Story-Übergänge sind auf DEUTSCH, weil sie Wortschatz
//   enthalten, den Anfänger:innen in den ersten Wochen noch nicht kennen.
// - Bedienung und Arbeitsaufträge sind auf DEUTSCH; der eigentliche
//   Lernstoff, die Beispielsätze und Dialoge bleiben auf SPANISCH.
// ============================================================================

const TEXTE = {

  // --------------------------------------------------------------------
  // AVATARE — Auswahl am Anfang des Spiels (2 männlich, 2 weiblich).
  // Bild wird unter assets/sprites/avatar/avatar_<id>.png erwartet,
  // fällt sonst automatisch auf einen Textplatzhalter zurück.
  // --------------------------------------------------------------------
  avatares: [
    { id: "diego", nombre: "Diego", genero: "chico" },
    { id: "carlos", nombre: "Carlos", genero: "chico" },
    { id: "sofia", nombre: "Sofía", genero: "chica" },
    { id: "lucia", nombre: "Lucía", genero: "chica" }
  ],

  // --------------------------------------------------------------------
  // PEGATINAS — kleine Sammel-Belohnung pro abgeschlossenem Bereich
  // (zusätzlich zum Code/Schlüssel), nur zur Motivation, kein Lerninhalt.
  // --------------------------------------------------------------------
  pegatinas: {
    hub:    { emoji: "🗺️", icon: "assets/icons/sticker_hub.png", nombre: "Explorador/a de España", nombreDE: "Spanien-Entdecker:in" },
    barra:  { emoji: "🍹", icon: "assets/icons/sticker_barra.png", nombre: "Camarero/a honorario/a", nombreDE: "Ehren-Barkeeper:in" },
    pista:  { emoji: "⭐", icon: "assets/icons/sticker_pista.png", nombre: "Estrella de la pista", nombreDE: "Star der Tanzfläche" },
    dj:     { emoji: "🎧", icon: "assets/icons/sticker_dj.png", nombre: "DJ de honor", nombreDE: "Ehren-DJ" },
    finale: { emoji: "🏆", icon: "assets/icons/sticker_finale.png", nombre: "¡Escapaste de la disco!", nombreDE: "Du bist der Disco entkommen!" }
  },

  // --------------------------------------------------------------------
  // STORY (Deutsch) — wird nur an wenigen großen Übergängen gezeigt
  // --------------------------------------------------------------------
  story: {
    intro: {
      titel: "Atrapados en la disco",
      absaetze: [
        "Eure Spanischkurs-Gruppe ist auf Kursfahrt in Spanien. Heute ist der letzte Abend.",
        "Ihr geht in eine Disco, die heute Nacht eine große „Erasmus Night“ veranstaltet — viele internationale Jugendgruppen aus ganz Europa sind zu Gast.",
        "Kurz vor Mitternacht schließt der Hausmeister versehentlich die Türen ab. Er dachte, alle Gäste seien schon gegangen.",
        "Jetzt sitzt ihr mit ein paar anderen internationalen Jugendlichen fest — aus Frankreich, Polen, Italien und anderen Ländern.",
        "Niemand hier spricht dieselbe Muttersprache. Aber alle haben in der Schule ein bisschen Spanisch gelernt — und das ist heute Nacht die einzige Sprache, die euch alle verbindet.",
        "Um Hinweise zu sammeln, Codes zu finden und am Ende die Tür zu öffnen, müsst ihr also Spanisch sprechen. ¡Vamos, no hay tiempo que perder!"
      ],
      button: "Spiel starten"
    },
    zwischenHub: {
      titel: "De vuelta en la entrada",
      text: "Du bist zurück im Eingangsbereich der Disco. Von hier aus kannst du jeden Teil der Disco besuchen, in der Reihenfolge, die du möchtest."
    },
    finaleFreigeschaltet: {
      titel: "¡Un momento!",
      text: "Du hast in der Bar, auf der Tanzfläche und in der DJ-Kabine geholfen — und die Hub-Aufgaben erledigt. Der Hausmeister hat gehört, dass ihr helfen konntet. Jetzt will er mit dir sprechen. Geh zur Sicherheitstür."
    },
    ende: {
      titel: "¡La puerta está abierta!",
      absaetze: [
        "Der Hausmeister lächelt, steckt den Schlüssel ins Schloss und dreht ihn um.",
        "„¡Gracias por tu ayuda esta noche! Habéis hablado muy bien español.“",
        "Die Tür geht auf. Draußen wartet schon der Bus. Ihr habt es geschafft — ganz ohne ein einziges deutsches oder englisches Wort im entscheidenden Moment.",
        "¡Enhorabuena! Du hast „Atrapados en la disco“ erfolgreich abgeschlossen."
      ]
    }
  },

  // --------------------------------------------------------------------
  // SYSTEMMELDUNGEN (Spanisch, kurz, A1) — mit deutscher Übersetzung
  // für den optionalen Tooltip. key -> {es, de}
  // --------------------------------------------------------------------
  systemMeldungen: {
    codigoGuardado:      { es: "¡Código guardado!", de: "Code gespeichert!" },
    puertaAbierta:       { es: "¡Puerta abierta!", de: "Tür geöffnet!" },
    areaCompleta:        { es: "¡Área completada!", de: "Bereich abgeschlossen!" },
    casiInténtaloOtraVez:{ es: "¡Casi! Inténtalo de nuevo.", de: "Fast! Versuch es noch einmal." },
    muyBien:             { es: "¡Muy bien!", de: "Sehr gut!" },
    correcto:            { es: "¡Correcto!", de: "Richtig!" },
    progresoGuardado:    { es: "Progreso guardado.", de: "Fortschritt gespeichert." },
    progresoReiniciado:  { es: "Progreso reiniciado.", de: "Fortschritt zurückgesetzt." },
    finaleBloqueado:     { es: "Esta puerta está cerrada todavía. Completa los otros lugares primero.", de: "Diese Tür ist noch verschlossen. Schließe zuerst die anderen Bereiche ab." },
    rondaReiniciada:     { es: "Ronda reiniciada. ¡Tú puedes!", de: "Runde neu gestartet. Du schaffst das!" },
    tiempoAgotado:       { es: "¡Se acabó el tiempo!", de: "Die Zeit ist abgelaufen!" },
    rachaTexto:          { es: "¡Racha de", de: "Serie von" } // wird mit Zahl kombiniert: "¡Racha de 3!"
  },

  // --------------------------------------------------------------------
  // FESTE UI-BESCHRIFTUNGEN (Spanisch) — Buttons, Panels, Navigation
  // --------------------------------------------------------------------
  ui: {
    nombreEingabe: {
      titel: "¿Cómo te llamas?",
      hint: "Escribe tu nombre o tus iniciales para guardar tu progreso en este iPad.",
      placeholder: "p. ej. Mia",
      boton: "Continuar",
      hintDE: "Gib deinen Namen oder deine Initialen ein, um deinen Fortschritt auf diesem iPad zu speichern."
    },
    avatarEingabe: {
      titel: "Wähle deine Spielfigur",
      hint: "Mit wem möchtest du heute Nacht die Disco erkunden?",
      boton: "Weiter",
      hintDE: "Wer bist du heute Nacht in der Disco? Wähle dein Aussehen für das Spiel."
    },
    modusAuswahl: {
      titel: "Wähle deine Mission",
      untertitel: "Wähle den Umfang deines Trainings. Alle Lernbereiche kommen in beiden Varianten vor.",
      coreTitel: "Hauptmission",
      coreDauer: "ca. 30 Minuten",
      coreText: "Der klausurrelevante Kernweg. Zusätzliche Übungen bleiben freiwillig erreichbar.",
      fullTitel: "Komplettes Training",
      fullDauer: "ca. 45–55 Minuten",
      fullText: "Alle Pflichtaufgaben für eine besonders intensive Wiederholung."
    },
    hub: {
      titulo: "Entrada",
      subtitulo: "Wähle einen Bereich der Disco.",
      volver: "Zurück zum Eingang"
    },
    botones: {
      continuar: "Weiter",
      cerrar: "Schließen",
      comprobar: "Überprüfen",
      pista: "Hilfe",
      inventario: "Sammlung",
      progreso: "Fortschritt",
      reiniciar: "Fortschritt löschen",
      sonidoOn: "Ton eingeschaltet",
      sonidoOff: "Ton ausgeschaltet",
      empezarRonda: "Runde starten",
      siguiente: "Weiter",
      volverEntrada: "Zurück zum Eingang",
      vocabulario: "Vocabulario"
    },
    reiniciarConfirm: {
      titulo: "Den gesamten Fortschritt löschen?",
      texto: "Alle Punkte, Codes und erledigten Aufgaben werden auf diesem Gerät gelöscht. Das kann nicht rückgängig gemacht werden.",
      confirmar: "Ja, löschen",
      cancelar: "Nein, weiterspielen",
      confirmarDE: "Ja, zurücksetzen",
      cancelarDE: "Nein, weiterspielen",
      tituloDE: "Den gesamten Fortschritt zurücksetzen?",
      textoDE: "Alle Punkte, Codes und erledigten Aufgaben werden auf diesem Gerät gelöscht. Das kann nicht rückgängig gemacht werden."
    },
    areas: {
      hub:    { nombre: "Entrada", nombreDE: "Eingang" },
      barra:  { nombre: "La barra", nombreDE: "Die Bar" },
      pista:  { nombre: "La pista de baile", nombreDE: "Die Tanzfläche" },
      dj:     { nombre: "Cabina del DJ", nombreDE: "Die DJ-Kabine" },
      finale: { nombre: "Puerta de seguridad", nombreDE: "Die Sicherheitstür" }
    },
    inventario: {
      titulo: "Deine Sammlung",
      vacio: "Du hast noch kein Codefragment gefunden.",
      tituloDE: "Dein Inventar",
      vacioDE: "Du hast noch keinen Code.",
      seccionCodigos: "Codefragmente und Schlüssel",
      seccionPegatinas: "Deine Auszeichnungen",
      vacioPegatinas: "Du hast noch keine Auszeichnung gesammelt.",
      erklärungCodes: "Die vier Fragmente bilden den Türcode. Am Sicherheitsterminal musst du sie später ihren Fundorten zuordnen.",
      erklärungAuszeichnungen: "Diese Bilder sind Sammelbelohnungen für abgeschlossene Bereiche. Du brauchst sie nicht, um die Tür zu öffnen."
    },
    progresoPanel: {
      titulo: "Dein Fortschritt",
      completado: "abgeschlossen",
      tituloDE: "Dein Fortschritt"
    },
    vocabularioPanel: {
      titulo: "Tu vocabulario",
      tituloDE: "Dein Vokabelheft",
      vacio: "Aquí aparecerán las palabras que vayas aprendiendo en cada lugar de la discoteca.",
      bloqueado: "Todavía no has empezado aquí."
    },
    bonus: {
      etiqueta: "⭐ Extra",
      encabezado: "Zusatzaufgaben (freiwillig)",
      hintDE: "Zusatzaufgaben — freiwillig, für alle, die schon fertig sind und noch mehr üben möchten."
    },
    vertiefung: {
      encabezado: "Vertiefung – freiwillig",
      zusammenfassung: "Weitere Übungen dieser Mission",
      hintDE: "Diese Aufgaben sind im 30-Minuten-Modus freiwillig. Sie geben Punkte, blockieren aber weder Code noch Finale."
    }
  }
};
