// ============================================================================
// js/game.js
// ----------------------------------------------------------------------------
// Spiellogik: Zustand, Speichersystem, Bereichs-/Freischalt-Logik, Navigation.
// Enthält KEINE Inhalte (die liegen in content/*.js) und KEIN DOM-Rendering
// (das übernimmt js/ui.js). game.js ruft UI.render*() auf, UI ruft game.*()
// als Reaktion auf Klicks/Taps auf.
// ============================================================================

const SAVE_KEY = "atrapados_disco_save_v1";
const TEACHER_SAVE_KEY = "atrapados_disco_teacher_save_v1";

const AREA_ORDER = ["hub", "barra", "pista", "dj", "finale"];

// Bereiche, die alle abgeschlossen sein müssen, bevor "finale" betretbar ist.
const AREAS_REQUIRED_FOR_FINALE = ["hub", "barra", "pista", "dj"];

// Bereiche ohne eigenen NPC-Dialog (Hub) bekommen ihre Belohnung direkt hier.
const HUB_REWARD = { type: "code", value: "03", area: "hub" };

const GAME = {
  state: null,
  teacherMode: false,

  setTeacherMode(enabled) {
    this.teacherMode = !!enabled;
  },

  getSaveKey() {
    return this.teacherMode ? TEACHER_SAVE_KEY : SAVE_KEY;
  },

  // ------------------------------------------------------------------
  // Speichersystem
  // ------------------------------------------------------------------
  createEmptyState(studentName) {
    const areas = {};
    AREA_ORDER.forEach((a) => {
      areas[a] = { completedTasks: [], completed: false };
    });
    return {
      version: 3,
      studentName: studentName,
      avatar: null,
      gameMode: null,
      points: 0,
      soundEnabled: false,
      introSeen: false,
      areas: areas,
      missions: {},
      finaleUnlockSeen: false,
      hubReturnSeen: false,
      inventory: []
    };
  },

  hasSave() {
    return !!localStorage.getItem(this.getSaveKey());
  },

  load() {
    try {
      const raw = localStorage.getItem(this.getSaveKey());
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return null;
      // Fehlende Felder aus neueren Versionen sicher ergänzen. So bleiben
      // Spielstände aus Version 1 nach dem Missionsumbau verwendbar.
      if (!parsed.areas || typeof parsed.areas !== "object") parsed.areas = {};
      AREA_ORDER.forEach((a) => {
        if (!parsed.areas[a]) parsed.areas[a] = { completedTasks: [], completed: false };
        if (!Array.isArray(parsed.areas[a].completedTasks)) parsed.areas[a].completedTasks = [];
      });
      if (!parsed.missions || typeof parsed.missions !== "object") parsed.missions = {};
      if (typeof parsed.finaleUnlockSeen !== "boolean") parsed.finaleUnlockSeen = false;
      if (typeof parsed.hubReturnSeen !== "boolean") parsed.hubReturnSeen = false;
      if (!Array.isArray(parsed.inventory)) parsed.inventory = [];
      if (parsed.avatar === undefined) parsed.avatar = null; // ältere Spielstände ohne Avatar
      // Frühere Spielstände behalten exakt den bisherigen vollständigen Weg.
      if (parsed.gameMode !== "core" && parsed.gameMode !== "full") parsed.gameMode = "full";
      parsed.version = 3;
      return parsed;
    } catch (e) {
      console.warn("No se pudo leer el progreso guardado, se empieza de nuevo.", e);
      return null;
    }
  },

  save() {
    localStorage.setItem(this.getSaveKey(), JSON.stringify(this.state));
  },

  resetProgress() {
    localStorage.removeItem(this.getSaveKey());
    this.state = this.createEmptyState(this.state ? this.state.studentName : "");
    this.save();
  },

  startNewGame(studentName) {
    this.state = this.createEmptyState(studentName);
    this.save();
  },

  createTeacherState() {
    const state = this.createEmptyState("Lehrkraft");
    state.avatar = TEXTE.avatares[0] ? TEXTE.avatares[0].id : null;
    state.gameMode = "full";
    state.introSeen = true;
    return state;
  },

  // Vordefinierte Teststände für schnelle redaktionelle Kontrollen. Sie
  // arbeiten ausschließlich im getrennten Lehrkraft-Speicher.
  applyTeacherPreset(preset) {
    if (!this.teacherMode) return;
    this.state = this.createTeacherState();
    const areasToComplete = preset === "finale"
      ? AREAS_REQUIRED_FOR_FINALE
      : (preset === "complete" ? AREA_ORDER : []);

    areasToComplete.forEach((area) => {
      this.getRequiredTasksForArea(area).forEach((task) => this.completeTask(task.id));
      const mission = this.getMission(area);
      if (mission) {
        mission.stages.filter((stage) => stage.customType).forEach((stage) => {
          this.completeCustomMissionStage(area, stage.id);
        });
      }
    });
    this.save();
  },

  // ------------------------------------------------------------------
  // Aufgaben / Fortschritt
  // ------------------------------------------------------------------
  // Alle Aufgaben eines Bereichs, INKLUSIVE optionaler Extra-Aufgaben
  // (bonus: true) — wird für die Anzeige im Aufgaben-Menü genutzt.
  getTasksForArea(area) {
    return AUFGABEN.filter((t) => t.area === area);
  },

  setGameMode(mode) {
    if (mode !== "core" && mode !== "full") return;
    this.state.gameMode = mode;
    this.save();
  },

  isCoreMode() {
    return this.state && this.state.gameMode === "core";
  },

  isTaskRequired(task) {
    if (!task || task.bonus) return false;
    return !this.isCoreMode() || CORE_TASK_IDS.indexOf(task.id) !== -1;
  },

  // Nur die Pflichtaufgaben eines Bereichs (ohne bonus:true) — zählen für
  // Fortschrittsbalken und Freischalt-Logik (Extra-Aufgaben blockieren
  // nichts und werden für "abgeschlossen" nicht gebraucht).
  getRequiredTasksForArea(area) {
    return AUFGABEN.filter((t) => t.area === area && this.isTaskRequired(t));
  },

  getOptionalTasksForArea(area) {
    return AUFGABEN.filter((task) => task.area === area && !this.isTaskRequired(task));
  },

  getActiveStageTaskIds(stage) {
    const ids = (stage && stage.taskIds) || [];
    if (!this.isCoreMode()) return ids;
    return ids.filter((id) => CORE_TASK_IDS.indexOf(id) !== -1);
  },

  isMissionStageActive(stage) {
    if (!stage) return false;
    return !!stage.customType || !this.isCoreMode() || this.getActiveStageTaskIds(stage).length > 0;
  },

  getTaskById(id) {
    return AUFGABEN.find((t) => t.id === id);
  },

  getMission(area) {
    return typeof MISSIONEN !== "undefined" ? MISSIONEN[area] || null : null;
  },

  getMissionStage(area, stageId) {
    const mission = this.getMission(area);
    return mission ? mission.stages.find((s) => s.id === stageId) || null : null;
  },

  getMissionRecord(area) {
    if (!this.state.missions) this.state.missions = {};
    if (!this.state.missions[area]) this.state.missions[area] = { completedCustomStages: [] };
    if (!Array.isArray(this.state.missions[area].completedCustomStages)) {
      this.state.missions[area].completedCustomStages = [];
    }
    return this.state.missions[area];
  },

  isMissionStageDone(area, stage) {
    if (!stage) return false;
    if (stage.customType) {
      return this.getMissionRecord(area).completedCustomStages.indexOf(stage.id) !== -1;
    }
    const ids = this.getActiveStageTaskIds(stage);
    return ids.length > 0 && ids.every((id) => this.isTaskDone(area, id));
  },

  completeCustomMissionStage(area, stageId) {
    const record = this.getMissionRecord(area);
    if (record.completedCustomStages.indexOf(stageId) === -1) {
      record.completedCustomStages.push(stageId);
      this.save();
    }
  },

  getMissionProgress(area) {
    const mission = this.getMission(area);
    if (!mission) return { done: 0, total: 0, percent: 0 };
    const activeStages = mission.stages.filter((stage) => this.isMissionStageActive(stage));
    const done = activeStages.filter((stage) => this.isMissionStageDone(area, stage)).length;
    const total = activeStages.length;
    return { done, total, percent: total ? Math.round((done / total) * 100) : 0 };
  },

  getNextMissionStageIndex(area) {
    const mission = this.getMission(area);
    if (!mission) return -1;
    const index = mission.stages.findIndex((stage) => this.isMissionStageActive(stage) && !this.isMissionStageDone(area, stage));
    if (index !== -1) return index;
    for (let i = mission.stages.length - 1; i >= 0; i--) {
      if (this.isMissionStageActive(mission.stages[i])) return i;
    }
    return -1;
  },

  isTaskDone(area, taskId) {
    return this.state.areas[area].completedTasks.indexOf(taskId) !== -1;
  },

  getAreaProgress(area) {
    const requiredIds = this.getRequiredTasksForArea(area).map((t) => t.id);
    const total = requiredIds.length;
    const done = this.state.areas[area].completedTasks.filter((id) => requiredIds.indexOf(id) !== -1).length;
    return { done, total, percent: total === 0 ? 0 : Math.round((done / total) * 100) };
  },

  isAreaFullyDone(area) {
    const p = this.getAreaProgress(area);
    return p.total > 0 && p.done >= p.total;
  },

  isFinaleUnlocked() {
    const allAreasComplete = AREAS_REQUIRED_FOR_FINALE.every((a) => this.state.areas[a].completed);
    const codeAreas = this.state.inventory
      .filter((item) => item.type === "code")
      .map((item) => item.area);
    const allCodesPresent = AREAS_REQUIRED_FOR_FINALE.every((area) => codeAreas.indexOf(area) !== -1);
    return allAreasComplete && allCodesPresent;
  },

  // Vom UI aufgerufen, wenn eine Aufgabe erfolgreich gelöst wurde.
  // Gibt zurück, ob der Bereich dadurch NEU abgeschlossen wurde.
  completeTask(taskId) {
    const task = this.getTaskById(taskId);
    if (!task) return { areaJustCompleted: false };
    const area = this.state.areas[task.area];
    let pointsAwarded = 0;
    if (area.completedTasks.indexOf(taskId) === -1) {
      area.completedTasks.push(taskId);
      pointsAwarded = task.points || 0;
      this.state.points += pointsAwarded;
    }
    let areaJustCompleted = false;
    if (!area.completed && this.isAreaFullyDone(task.area)) {
      area.completed = true;
      areaJustCompleted = true;
      this.grantAreaReward(task.area);
    }
    this.save();
    return { areaJustCompleted, area: task.area, pointsAwarded };
  },

  grantAreaReward(area) {
    let reward = null;
    if (area === "hub") {
      reward = HUB_REWARD;
    } else if (DIALOGOS[area] && DIALOGOS[area].gracias && DIALOGOS[area].gracias.givesReward) {
      reward = DIALOGOS[area].gracias.givesReward;
    }
    if (reward) {
      const already = this.state.inventory.some((i) => i.area === reward.area && i.value === reward.value);
      if (!already) this.state.inventory.push(reward);
    }
    // Zusätzlich: kleine Sammel-Pegatina pro abgeschlossenem Bereich (nur Motivation).
    const pegatina = TEXTE.pegatinas && TEXTE.pegatinas[area];
    if (pegatina) {
      const alreadySticker = this.state.inventory.some((i) => i.type === "sticker" && i.area === area);
      if (!alreadySticker) {
        this.state.inventory.push({
          type: "sticker",
          area: area,
          emoji: pegatina.emoji,
          icon: pegatina.icon,
          nombre: pegatina.nombre
        });
      }
    }
  },

  // Für ein Areal mit NPC: welcher Dialog-Knoten soll beim Öffnen gezeigt werden?
  getEntryDialogNode(area) {
    if (this.isAreaFullyDone(area)) return "gracias";
    return "start";
  },

  addPoints(n) {
    this.state.points += n;
    this.save();
  },

  // ------------------------------------------------------------------
  // Avatar
  // ------------------------------------------------------------------
  setAvatar(avatarId) {
    this.state.avatar = avatarId;
    this.save();
  },

  getAvatar() {
    return TEXTE.avatares.find((a) => a.id === this.state.avatar) || null;
  },

  // ------------------------------------------------------------------
  // Vokabelheft — Wörter eines Bereichs erscheinen erst, sobald dort
  // mindestens eine Aufgabe gelöst wurde (wächst mit dem Fortschritt).
  // ------------------------------------------------------------------
  getVocabForArea(area) {
    const progress = this.getAreaProgress(area);
    if (progress.done <= 0) return [];
    return (typeof VOKABULAR !== "undefined" && VOKABULAR[area]) || [];
  }
};
