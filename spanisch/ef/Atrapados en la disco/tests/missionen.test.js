const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const storage = new Map();
const context = vm.createContext({
  console,
  localStorage: {
    getItem(key) { return storage.has(key) ? storage.get(key) : null; },
    setItem(key, value) { storage.set(key, String(value)); },
    removeItem(key) { storage.delete(key); }
  }
});

[
  "content/texte.js",
  "content/vokabular.js",
  "content/aufgaben.js",
  "content/missionen.js",
  "content/dialoge.js",
  "js/game.js"
].forEach((file) => {
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename: file });
});

const GAME = vm.runInContext("GAME", context);
const AUFGABEN = vm.runInContext("AUFGABEN", context);
const MISSIONEN = vm.runInContext("MISSIONEN", context);
const DIALOGOS = vm.runInContext("DIALOGOS", context);
const TEXTE = vm.runInContext("TEXTE", context);

GAME.state = GAME.createEmptyState("Test");

assert.equal(new Set(AUFGABEN.map((task) => task.id)).size, AUFGABEN.length, "Aufgaben-IDs müssen eindeutig sein");
assert.equal(
  Object.values(MISSIONEN).reduce((sum, mission) => sum + mission.stages.length, 0),
  22,
  "Das Spiel soll 22 zusammenhängende Pflichtetappen enthalten"
);

AUFGABEN.filter((task) => task.type === "fillBlankChips").forEach((task) => {
  const blanks = task.promptParts.filter((part) => part === "___").length;
  const answers = (task.correctChips || [task.correctChip]).length;
  assert.equal(blanks, answers, `${task.id}: Jede Lücke braucht genau eine Lösung`);
});

const learningText = JSON.stringify(AUFGABEN).toLowerCase();
["número de teléfono", "teléfono", "querer", "tener"].forEach((excluded) => {
  assert.equal(learningText.includes(excluded), false, `Ausgeschlossener Lernstoff gefunden: ${excluded}`);
});

Object.entries(MISSIONEN).forEach(([area, mission]) => {
  const assignedIds = mission.stages.flatMap((stage) => stage.taskIds || []);
  const requiredIds = AUFGABEN.filter((task) => task.area === area && !task.bonus).map((task) => task.id);

  assignedIds.forEach((id) => {
    assert.ok(AUFGABEN.some((task) => task.id === id), `Unbekannte Aufgaben-ID ${id}`);
  });
  assert.deepEqual(
    assignedIds.slice().sort(),
    requiredIds.slice().sort(),
    `Alle Pflichtaufgaben von ${area} müssen genau einer Missionsetappe zugeordnet sein`
  );
});

["barra", "pista", "dj", "finale"].forEach((area) => {
  const seen = new Set();
  const visit = (nodeId) => {
    if (seen.has(nodeId)) return false;
    seen.add(nodeId);
    const node = DIALOGOS[area][nodeId];
    if (!node) return false;
    if (node.startsMission) return true;
    return (node.options || []).some((option) => visit(option.next));
  };
  assert.equal(visit("start"), true, `Der Startdialog von ${area} muss zur vollständigen Mission führen`);
});

["hub", "barra", "pista", "dj"].forEach((area) => {
  GAME.getRequiredTasksForArea(area).forEach((task) => GAME.completeTask(task.id));
  assert.equal(GAME.isAreaFullyDone(area), true, `${area} sollte abgeschlossen sein`);
  assert.equal(GAME.getMissionProgress(area).percent, 100, `${area} sollte 100 % Missionsfortschritt haben`);
});

assert.equal(GAME.isFinaleUnlocked(), true, "Das Finale sollte nach den vier Bereichen freigeschaltet sein");
assert.equal(
  GAME.state.inventory.filter((item) => item.type === "code").map((item) => item.value).join("-"),
  "03-27-14-58",
  "Alle vier Codefragmente sollten im Inventar liegen"
);
const temporarilyMissingCode = GAME.state.inventory.find((item) => item.type === "code" && item.area === "dj");
GAME.state.inventory = GAME.state.inventory.filter((item) => item !== temporarilyMissingCode);
assert.equal(GAME.isFinaleUnlocked(), false, "Ohne eines der vier Codefragmente muss die Sicherheitstür gesperrt bleiben");
GAME.state.inventory.push(temporarilyMissingCode);
assert.equal(GAME.isFinaleUnlocked(), true, "Mit allen vier Codefragmenten darf das Finale wieder freigeschaltet sein");

const codeStage = MISSIONEN.finale.stages[0];
assert.equal(GAME.isMissionStageDone("finale", codeStage), false);
GAME.completeCustomMissionStage("finale", codeStage.id);
assert.equal(GAME.isMissionStageDone("finale", codeStage), true);

storage.set("atrapados_disco_save_v1", JSON.stringify({ studentName: "Alt" }));
const migrated = GAME.load();
assert.equal(migrated.version, 3);
assert.ok(migrated.areas.hub);
assert.equal(Object.keys(migrated.missions).length, 0);
assert.equal(migrated.gameMode, "full", "Alte Spielstände müssen den bisherigen vollständigen Weg behalten");

// Der 30-Minuten-Weg enthält in jeder normalen Etappe mindestens eine
// Kernaufgabe; freiwillige Vertiefungen blockieren Codes und Finale nicht.
GAME.state = GAME.createEmptyState("Kurztest");
GAME.state.gameMode = "core";
assert.equal(
  ["hub", "barra", "pista", "dj", "finale"].flatMap((area) => GAME.getRequiredTasksForArea(area)).length,
  18,
  "Der Kernweg soll 18 Pflichtaufgaben enthalten"
);
assert.equal(
  Object.values(MISSIONEN).flatMap((mission) => mission.stages).filter((stage) => GAME.isMissionStageActive(stage)).length,
  17,
  "Der Kernweg soll 17 zusammenhängende Missionsetappen enthalten"
);
["hub", "barra", "pista", "dj"].forEach((area) => {
  GAME.getRequiredTasksForArea(area).forEach((task) => GAME.completeTask(task.id));
  assert.equal(GAME.isAreaFullyDone(area), true, `${area} sollte im Kernweg abgeschlossen sein`);
  assert.ok(GAME.getOptionalTasksForArea(area).some((task) => !GAME.isTaskDone(area, task.id)));
});
assert.equal(GAME.isFinaleUnlocked(), true, "Freiwillige Vertiefungen dürfen das Finale nicht blockieren");
assert.equal(GAME.state.inventory.filter((item) => item.type === "code").length, 4);

// Der Lehrkraftmodus verwendet einen eigenen Speicher und kann direkt einen
// Zustand kurz vor dem Finale herstellen, ohne den Schülerstand anzutasten.
const studentSaveBeforeTeacherMode = storage.get("atrapados_disco_save_v1");
GAME.setTeacherMode(true);
GAME.state = GAME.createTeacherState();
GAME.save();
assert.ok(storage.has("atrapados_disco_teacher_save_v1"));
assert.equal(storage.get("atrapados_disco_save_v1"), studentSaveBeforeTeacherMode);

GAME.applyTeacherPreset("finale");
assert.equal(GAME.isFinaleUnlocked(), true, "Das Lehrkraft-Preset soll das Finale direkt freischalten");
assert.equal(GAME.state.inventory.filter((item) => item.type === "code").length, 4);
assert.equal(GAME.state.areas.finale.completed, false);
assert.equal(storage.get("atrapados_disco_save_v1"), studentSaveBeforeTeacherMode);

GAME.applyTeacherPreset("start");
assert.equal(GAME.state.points, 0);
assert.equal(GAME.state.avatar, TEXTE.avatares[0].id);
assert.equal(GAME.state.introSeen, true);

console.log("Missions- und Speicherchecks erfolgreich.");
