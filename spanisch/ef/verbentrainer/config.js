(function () {
  "use strict";
  const defaults = {
    version: "2.0.0",
    curriculumRevision: 2,
    currentStage: 2,
    roundLength: 8,
    showLockedStages: true,
    activeLessons: ["U1", "U2", "U3", "U4"],
    activeGroups: ["-ar", "-er", "-ir", "e→ie", "o→ue", "u→ue", "yo-Sonderform", "mehrfach unregelmäßig", "vollständig unregelmäßig"],
    enabledTaskTypes: ["write", "choice", "person", "verbGroup", "sentence", "mixed"],
    releasedDifficulty: 3,
    distribution: { newestStage: 0.45, olderStages: 0.35, adaptiveReview: 0.20 },
    repetition: { minimumOlderItemsPerRound: 2, avoidImmediateRepetition: true, maximumSameVerbPerRound: 2, overdueAfterDays: 7 },
    specialCharacters: ["á", "é", "í", "ó", "ú", "ü", "ñ"],
    stages: [
      { id:1, title:"Eingangshalle", subtitle:"Sein und erste Verben auf -ar", image:"assets/images/eingangshalle.webp" },
      { id:2, title:"Erste Sprachkräfte", subtitle:"Arbeiten und sich unterhalten", image:"assets/images/eingangshalle.webp" },
      { id:3, title:"Werkstatt der Endungen", subtitle:"Weitere Verben auf -ar", image:"assets/images/eingangshalle.webp" },
      { id:4, title:"Werkstatt der Endungen", subtitle:"Weitere regelmäßige Verben", image:"assets/images/eingangshalle.webp" },
      { id:5, title:"Neue Endungen", subtitle:"Verben auf -er erkennen", image:"assets/images/eingangshalle.webp" },
      { id:6, title:"Neue Endungen", subtitle:"Verben auf -ir und bekannte Muster", image:"assets/images/eingangshalle.webp" },
      { id:7, title:"Galerie der Verwandlungen", subtitle:"Erste Stammwechsel", image:"assets/images/galerie-verwandlungen.webp" },
      { id:8, title:"Galerie der Verwandlungen", subtitle:"Weitere Stammwechsel", image:"assets/images/galerie-verwandlungen.webp" },
      { id:9, title:"Kammer der Sonderformen", subtitle:"Besondere yo-Formen", image:"assets/images/kammer-sonderformen.webp" },
      { id:10, title:"Galerie der Verwandlungen", subtitle:"Muster sicher anwenden", image:"assets/images/galerie-verwandlungen.webp" },
      { id:11, title:"Archiv der Meisterformen", subtitle:"Unregelmäßige Formen", image:"assets/images/kammer-sonderformen.webp" },
      { id:12, title:"Archiv der Meisterformen", subtitle:"Unregelmäßige Formen", image:"assets/images/kammer-sonderformen.webp" }
    ]
  };
  function readDraft() {
    try { return JSON.parse(localStorage.getItem("vamos-teacher-draft-v1") || "null"); }
    catch (_) { return null; }
  }
  function normalizeModes(modes) {
    return modes.map(mode => mode === "infinitive" ? "verbGroup" : mode).filter((mode,index,list) => defaults.enabledTaskTypes.includes(mode) && list.indexOf(mode) === index);
  }
  function mergeCustomVerbs(items) {
    if (!Array.isArray(items)) return;
    items.forEach(raw => {
      if (!raw || !raw.id || !raw.infinitive || !raw.meaning || !Array.isArray(raw.forms) || raw.forms.length !== 6 || !raw.sources?.length) return;
      const custom = {
        id:String(raw.id), infinitive:String(raw.infinitive), meaning:String(raw.meaning), forms:raw.forms.map(String),
        group:String(raw.group || "vollständig unregelmäßig"), lesson:String(raw.lesson || "U1"), topic:String(raw.topic || "Aktueller Unterricht"),
        regular:raw.regular !== false, irregularity:raw.irregularity || null, stemChange:raw.stemChange || null, yoSpecial:raw.yoSpecial || null,
        difficulty:Number(raw.difficulty) || 1, persons:window.VERB_DATA.persons, sentences:Array.isArray(raw.sentences) ? raw.sentences : [],
        sources:raw.sources.map(String), active:raw.active !== false, taskTypes:normalizeModes(Array.isArray(raw.taskTypes) ? raw.taskTypes : ["write","choice","person","verbGroup"]),
        sequence:Number(raw.sequence) || window.VERB_DATA.verbs.length + 1, stage:Number(raw.stage) || 1, introduced:false, prerequisites:[], custom:true
      };
      const index = window.VERB_DATA.verbs.findIndex(verb => verb.id === custom.id);
      if (index >= 0) {
        if (window.VERB_DATA.verbs[index].custom) window.VERB_DATA.verbs[index] = custom;
      } else window.VERB_DATA.verbs.push(custom);
    });
  }
  function applyOverride(config, override) {
    if (!override) return config;
    mergeCustomVerbs(override.customVerbs);
    if (Number.isInteger(override.currentStage)) config.currentStage = Math.max(1, Math.min(config.stages.length, override.currentStage));
    if ([5,8,10,15,20].includes(override.roundLength)) config.roundLength = override.roundLength;
    if (override.distribution) {
      const candidate = Object.assign({}, config.distribution, override.distribution);
      const sum = candidate.newestStage + candidate.olderStages + candidate.adaptiveReview;
      if (Math.abs(sum - 1) < 0.001) config.distribution = candidate;
    }
    if (override.repetition) config.repetition = Object.assign({}, config.repetition, override.repetition);
    if (Array.isArray(override.enabledTaskTypes)) config.enabledTaskTypes = normalizeModes(override.enabledTaskTypes);
    if (Array.isArray(override.verbs) && override.curriculumRevision === defaults.curriculumRevision) {
      const byId = new Map(override.verbs.map(v => [v.id, v]));
      window.VERB_DATA.verbs.forEach(verb => {
        const edited = byId.get(verb.id);
        if (!edited) return;
        if (Number.isInteger(edited.sequence)) verb.sequence = edited.sequence;
        if (Number.isInteger(edited.stage)) verb.stage = Math.max(1, Math.min(config.stages.length, edited.stage));
        if (typeof edited.active === "boolean") verb.active = edited.active;
      });
      window.VERB_DATA.verbs.sort((a,b) => a.sequence - b.sequence);
    }
    return config;
  }
  window.TEACHER_DEFAULTS = JSON.parse(JSON.stringify(defaults));
  const published = window.PUBLISHED_TEACHER_OVERRIDE || null;
  const draft = readDraft();
  window.TEACHER_CONFIG = applyOverride(applyOverride(defaults, published), draft);
  window.TRAINER_CONFIG = window.TEACHER_CONFIG;
})();
