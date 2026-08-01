const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const context = vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(root, "content/aufgaben.js"), "utf8"), context);
const tasks = vm.runInContext("AUFGABEN", context);

assert.equal(tasks.length, 36, "Der gebündelte Aufgabenbestand soll 36 Aufgaben enthalten");
assert.equal(tasks.filter((task) => !task.bonus).length, 31, "Es sollen 31 reguläre Aufgaben vorhanden sein");
assert.equal(tasks.filter((task) => task.bonus).length, 5, "Es sollen fünf Bonusaufgaben vorhanden sein");
assert.equal(new Set(tasks.map((task) => task.id)).size, tasks.length, "Aufgaben-IDs müssen eindeutig sein");

const expectedTypes = [
  "dragMatch", "fillBlankChips", "fillBlankText", "hotspotClick",
  "listeningProfiles", "multipleChoice", "multipleChoiceSet", "quizRound", "reorder"
];
assert.deepEqual([...new Set(tasks.map((task) => task.type))].sort(), expectedTypes.sort());

tasks.forEach((task) => {
  assert.ok(task.id && task.area && task.type && task.prompt && task.hintDE, `${task.id}: Pflichtfeld fehlt`);
  assert.ok(Number.isFinite(task.points) && task.points > 0, `${task.id}: Punkte müssen positiv sein`);

  if (task.type === "multipleChoice") {
    assert.ok(Number.isInteger(task.correctIndex) && task.options[task.correctIndex], `${task.id}: ungültiger correctIndex`);
    assert.equal(new Set(task.options).size, task.options.length, `${task.id}: Antwortoptionen müssen eindeutig sein`);
  }
  if (task.type === "multipleChoiceSet") {
    assert.ok(Array.isArray(task.questions) && task.questions.length > 1, `${task.id}: Fragenblock fehlt`);
    task.questions.forEach((question, index) => {
      assert.ok(question.options[question.correctIndex], `${task.id}: Auswahlfrage ${index + 1} ohne Lösung`);
      assert.equal(new Set(question.options).size, question.options.length, `${task.id}: Antwortoptionen müssen eindeutig sein`);
    });
  }
  if (task.type === "fillBlankText") {
    assert.ok(Array.isArray(task.acceptedAnswers) && task.acceptedAnswers.length, `${task.id}: Textlösung fehlt`);
  }
  if (task.type === "fillBlankChips") {
    const answers = task.correctChips || [task.correctChip];
    const blanks = task.promptParts.filter((part) => part === "___").length;
    assert.equal(answers.length, blanks, `${task.id}: Jede Lücke braucht eine Lösung`);
    answers.forEach((answer) => assert.ok(task.wordBank.includes(answer), `${task.id}: ${answer} fehlt in der Wortbank`));
  }
  if (task.type === "dragMatch") {
    assert.ok(task.buckets.length && task.items.length, `${task.id}: Zuordnungsdaten fehlen`);
    task.items.forEach((item) => assert.ok(task.buckets.includes(item.bucket), `${task.id}: unbekannte Gruppe ${item.bucket}`));
  }
  if (task.type === "hotspotClick") {
    assert.ok(task.hotspots.some((spot) => spot.correct), `${task.id}: kein richtiger Hotspot`);
  }
  if (task.type === "quizRound") {
    task.questions.forEach((question, index) => {
      assert.ok(question.options[question.correctIndex], `${task.id}: Quizfrage ${index + 1} ohne Lösung`);
    });
  }
  if (task.type === "listeningProfiles") {
    assert.ok(task.profiles.length, `${task.id}: Hörprofile fehlen`);
    task.profiles.forEach((profile, profileIndex) => {
      assert.ok(profile.name && profile.audio && profile.transcript, `${task.id}: Hörprofil ${profileIndex + 1} ist unvollständig`);
      assert.ok(profile.questions.length, `${task.id}: Hörprofil ${profile.name} braucht Fragen`);
      profile.questions.forEach((question, questionIndex) => {
        assert.ok(question.options[question.correctIndex], `${task.id}: Hörfrage ${questionIndex + 1} ohne Lösung`);
      });
    });
  }
});

const learningText = JSON.stringify(tasks).toLowerCase();
["número de teléfono", "teléfono", "querer", "tener"].forEach((excluded) => {
  assert.equal(learningText.includes(excluded), false, `Ausgeschlossener Lernstoff gefunden: ${excluded}`);
});

const barListeningTask = tasks.find((task) => task.id === "bar_hoerstation_gaeste");
assert.equal(barListeningTask.type, "listeningProfiles", "Die Prominentenaufgabe soll durch eine Hörstation ersetzt sein");
assert.deepEqual(Array.from(barListeningTask.profiles, (profile) => profile.name), ["Mercedes", "Camille", "Luca"]);
assert.equal(learningText.includes("lionel messi"), false, "Die Bar soll kein Prominentenwissen mehr voraussetzen");
assert.equal(learningText.includes("speedy gonzález"), false, "Die Bar soll kein Prominentenwissen mehr voraussetzen");

console.log("Alle 36 Aufgaben-Schemacontrollen erfolgreich.");
