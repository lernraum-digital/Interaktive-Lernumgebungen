(function () {
  "use strict";
  const defaults = {
    version: "2.0.0",
    currentStage: 2,
    roundLength: 8,
    showLockedStages: true,
    activeLessons: ["U1", "U2", "U3", "U4"],
    activeGroups: ["-ar", "-er", "-ir", "e→ie", "o→ue", "u→ue", "yo-Sonderform", "mehrfach unregelmäßig", "vollständig unregelmäßig"],
    enabledTaskTypes: ["write", "choice", "person", "infinitive", "sentence", "mixed"],
    releasedDifficulty: 3,
    distribution: { newestStage: 0.45, olderStages: 0.35, adaptiveReview: 0.20 },
    repetition: { minimumOlderItemsPerRound: 2, avoidImmediateRepetition: true, maximumSameVerbPerRound: 2, overdueAfterDays: 7 },
    specialCharacters: ["á", "é", "í", "ó", "ú", "ü", "ñ"],
    stages: [
      { id:1, title:"Eingangshalle", subtitle:"Die ersten Grundformen", image:"assets/images/eingangshalle.webp" },
      { id:2, title:"Erste Sprachkräfte", subtitle:"Sprechen und arbeiten", image:"assets/images/eingangshalle.webp" },
      { id:3, title:"Werkstatt der Endungen", subtitle:"Bekannte Muster erweitern", image:"assets/images/eingangshalle.webp" },
      { id:4, title:"Werkstatt der Endungen", subtitle:"Weitere regelmäßige Verben", image:"assets/images/eingangshalle.webp" },
      { id:5, title:"Werkstatt der Endungen", subtitle:"Sicher kombinieren", image:"assets/images/eingangshalle.webp" },
      { id:6, title:"Neue Endungen", subtitle:"-er und -ir erkennen", image:"assets/images/eingangshalle.webp" },
      { id:7, title:"Akademie-Alltag", subtitle:"Bekanntes ausbauen", image:"assets/images/eingangshalle.webp" },
      { id:8, title:"Galerie der Verwandlungen", subtitle:"Erste Stammwechsel", image:"assets/images/galerie-verwandlungen.webp" },
      { id:9, title:"Galerie der Verwandlungen", subtitle:"Weitere Stammwechsel", image:"assets/images/galerie-verwandlungen.webp" },
      { id:10, title:"Kammer der Sonderformen", subtitle:"Besondere yo-Formen", image:"assets/images/kammer-sonderformen.webp" },
      { id:11, title:"Galerie der Verwandlungen", subtitle:"Muster sicher anwenden", image:"assets/images/galerie-verwandlungen.webp" },
      { id:12, title:"Archiv der Meisterformen", subtitle:"Unregelmäßige Formen", image:"assets/images/kammer-sonderformen.webp" }
    ]
  };
  function readDraft() {
    try { return JSON.parse(localStorage.getItem("vamos-teacher-draft-v1") || "null"); }
    catch (_) { return null; }
  }
  function applyOverride(config, override) {
    if (!override) return config;
    if (Number.isInteger(override.currentStage)) config.currentStage = Math.max(1, Math.min(config.stages.length, override.currentStage));
    if ([5,8,10,15,20].includes(override.roundLength)) config.roundLength = override.roundLength;
    if (override.distribution) {
      const candidate = Object.assign({}, config.distribution, override.distribution);
      const sum = candidate.newestStage + candidate.olderStages + candidate.adaptiveReview;
      if (Math.abs(sum - 1) < 0.001) config.distribution = candidate;
    }
    if (override.repetition) config.repetition = Object.assign({}, config.repetition, override.repetition);
    if (Array.isArray(override.enabledTaskTypes)) config.enabledTaskTypes = override.enabledTaskTypes.filter(x => defaults.enabledTaskTypes.includes(x));
    if (Array.isArray(override.verbs)) {
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
