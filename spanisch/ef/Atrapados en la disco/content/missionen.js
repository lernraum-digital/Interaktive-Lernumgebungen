// ============================================================================
// content/missionen.js
// ----------------------------------------------------------------------------
// Verbindet die einzelnen Aufgaben zu zusammenhängenden Missionen. Eine Etappe
// kann aus mehreren Aufgaben bestehen; diese werden ohne Rückkehr ins alte
// Aufgabenmenü nacheinander gespielt. Neue Aufgaben können später einfach an
// taskIds angehängt oder als neue Etappe ergänzt werden.
// ============================================================================

const MISSIONEN = {
  hub: {
    id: "mission_guardarropa",
    title: "Das Rätsel am Eingang",
    briefing: "Ordne die Fundstücke und folge den Hinweisen. Am Ende erhältst du das erste Codefragment.",
    npc: null,
    stages: [
      {
        id: "objetos",
        title: "Die verlorenen Gegenstände",
        description: "Untersuche die Gegenstände und erkenne ihr grammatisches Geschlecht.",
        taskIds: ["hub_hotspot_generos_01"]
      },
      {
        id: "genero",
        title: "El oder la?",
        description: "Ordne die Wortkarten dem richtigen Artikel zu.",
        taskIds: ["hub_genero_01"]
      },
      {
        id: "articulos",
        title: "Unvollständige Fundkarten",
        description: "Ergänze die fehlenden unbestimmten Artikel.",
        taskIds: ["hub_articulo_01"]
      },
      {
        id: "plural",
        title: "Eine Sache, viele Sachen",
        description: "Entscheide über Pluralartikel und Pluralendung.",
        taskIds: ["hub_plural_01"]
      },
      {
        id: "mapa",
        title: "Die Spur auf der Karte",
        description: "Ordne die Hinweise den passenden Orten in Spanien zu.",
        taskIds: ["hub_mapa_01"]
      }
    ],
    bonusTaskIds: ["hub_bonus_01"]
  },

  barra: {
    id: "mission_barra",
    title: "Die Gäste an der Bar",
    briefing: "Hör den internationalen Gästen zu und hilf der Kellnerin, ihre Gästekarten zu vervollständigen.",
    npc: "camarera",
    stages: [
      {
        id: "mensajes",
        title: "Sprachnachrichten der Gäste",
        description: "Hör Mercedes, Camille und Luca zu und beantworte die Fragen.",
        taskIds: ["bar_hoerstation_gaeste"]
      },
      {
        id: "ficha",
        title: "Gästekarten verstehen und ergänzen",
        description: "Ordne die richtigen Fragen zu und vervollständige anschließend Camilles Vorstellung.",
        taskIds: ["bar_preguntas_respuestas", "bar_perfil_invitada"]
      },
      {
        id: "perfiles",
        title: "Land, Sprache und Person",
        description: "Unterscheide Länder, Sprachen und Einwohnerbezeichnungen.",
        taskIds: ["bar_paises_lenguas_01", "bar_profil_portugal", "bar_schreibung_turquia", "bar_sprache_austria"]
      },
      {
        id: "ronda",
        title: "Internationale Schnellrunde",
        description: "Prüfe Fachwissen und Rechtschreibung unter Zeitdruck.",
        taskIds: ["bar_quiz_paises"]
      }
    ],
    bonusTaskIds: ["bar_bonus_01"]
  },

  pista: {
    id: "mission_pista",
    title: "El ritmo de los verbos",
    briefing: "Ayuda a Marta y Lucía a preparar las tarjetas de su grupo de baile.",
    npc: "bailarines",
    stages: [
      {
        id: "pronombres",
        title: "¿Quién habla?",
        description: "Reconoce el pronombre por la forma del verbo.",
        taskIds: ["pista_pronombres_ritmo"]
      },
      {
        id: "terminaciones",
        title: "El ritmo de las terminaciones",
        description: "Completa el esquema de los verbos regulares en -ar.",
        taskIds: ["pista_terminaciones_ar"]
      },
      {
        id: "verbos",
        title: "Los verbos en ritmo",
        description: "Löse mehrere Verbformen gemeinsam, ohne für jeden Satz eine neue Aufgabe zu öffnen.",
        taskIds: ["pista_verbformen_block_01", "pista_verbformen_block_02"]
      },
      {
        id: "correccion",
        title: "Frases con errores",
        description: "Corrige las formas verbales y una frase negativa.",
        taskIds: ["pista_korrektur_block"]
      },
      {
        id: "dialogo",
        title: "Una conversación mezclada",
        description: "Ordena el diálogo antes de que empiece la música.",
        taskIds: ["pista_reorder_dialogo"]
      }
    ],
    bonusTaskIds: ["pista_bonus_01"]
  },

  dj: {
    id: "mission_dj",
    title: "Las dos pistas del DJ",
    briefing: "Separa las frases de ser y estar y prepara la próxima presentación del DJ.",
    npc: "dj",
    stages: [
      {
        id: "clasificar",
        title: "Dos pistas: SER y ESTAR",
        description: "Decide qué función necesita cada frase.",
        taskIds: ["dj_clasifica_ser_estar"]
      },
      {
        id: "ser_estar",
        title: "Pista SER / Pista ESTAR",
        description: "Completa las descripciones de España.",
        taskIds: ["dj_ser_estar_01", "dj_ser_estar_02"]
      },
      {
        id: "corregir",
        title: "Los errores del DJ",
        description: "Corrige dos frases antes de empezar la canción.",
        taskIds: ["dj_error_01", "dj_error_02"]
      },
      {
        id: "argentina",
        title: "La presentación de Argentina",
        description: "Prepara el texto para la próxima canción.",
        taskIds: ["dj_describe_argentina", "dj_describe_argentina_02"]
      }
    ],
    bonusTaskIds: ["dj_bonus_01"]
  },

  finale: {
    id: "mission_finale",
    title: "Der Code der Sicherheitstür",
    briefing: "Nutze die vier Codefragmente aus deiner Sammlung und sprich anschließend mit dem Hausmeister.",
    npc: "conserje",
    stages: [
      {
        id: "codigo",
        title: "Das Sicherheitsterminal",
        description: "Ordne die vier Codefragmente ihren Fundorten zu.",
        customType: "codeLock",
        solution: ["03", "27", "14", "58"],
        slotLabels: ["Eingang", "Bar", "Tanzfläche", "DJ-Kabine"]
      },
      {
        id: "preguntas",
        title: "Las preguntas del conserje",
        description: "Elige las palabras interrogativas correctas.",
        taskIds: ["finale_preguntas_01", "finale_preguntas_02"]
      },
      {
        id: "pronombres",
        title: "¿Quién hace qué?",
        description: "Une cada frase con el pronombre correcto.",
        taskIds: ["finale_pronombres_01"]
      },
      {
        id: "despedida",
        title: "La conversación final",
        description: "Ordena la última conversación y abre la puerta.",
        taskIds: ["finale_dialogo_huecos", "finale_conversacion_final"]
      }
    ],
    bonusTaskIds: ["finale_bonus_01"]
  }
};

// Kernweg für eine Spielzeit von ungefähr 30 Minuten. Alle übrigen Aufgaben
// bleiben im Kurzmodus als freiwillige Vertiefung sichtbar. Im vollständigen
// Modus zählen weiterhin sämtliche 31 Nicht-Bonusaufgaben zum Fortschritt.
const CORE_TASK_IDS = [
  // Entrada / Guardarropa: Genus, Artikel und Plural als grammatischer Kern.
  "hub_genero_01", "hub_articulo_01", "hub_plural_01",

  // Barra: Hörverstehen, Frageabsicht, Gesamtprofil und systematische Länderarbeit.
  "bar_hoerstation_gaeste", "bar_preguntas_respuestas", "bar_perfil_invitada", "bar_paises_lenguas_01",

  // Pista: Pronomen, Endungen, zwei größere Verbblöcke und ein Dialog.
  "pista_pronombres_ritmo", "pista_terminaciones_ar", "pista_verbformen_block_01",
  "pista_verbformen_block_02", "pista_reorder_dialogo",

  // DJ: Regel erkennen, anwenden und auf Argentinien übertragen.
  "dj_clasifica_ser_estar", "dj_ser_estar_01", "dj_describe_argentina_02",

  // Finale: Fragewörter, Pronomen und ein vollständiger Abschlussdialog.
  "finale_preguntas_01", "finale_pronombres_01", "finale_conversacion_final"
];
