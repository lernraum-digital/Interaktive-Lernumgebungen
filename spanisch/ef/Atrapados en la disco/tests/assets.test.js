const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const teacherHtml = fs.readFileSync(path.join(root, "lehrkraft.html"), "utf8");
assert.ok(teacherHtml.includes('data-teacher-mode="true"'), "lehrkraft.html muss den Lehrkraftmodus automatisch aktivieren");
assert.match(teacherHtml, /js\/ui\.js\?v=\d+/, "lehrkraft.html muss die aktuelle gemeinsame UI laden");

function inspectPng(relativePath) {
  const file = path.join(root, relativePath);
  assert.ok(fs.existsSync(file), `Asset fehlt: ${relativePath}`);
  const data = fs.readFileSync(file);
  assert.equal(data.subarray(1, 4).toString("ascii"), "PNG", `${relativePath} ist keine PNG-Datei`);
  return {
    width: data.readUInt32BE(16),
    height: data.readUInt32BE(20),
    colorType: data[25]
  };
}

["diego", "carlos", "sofia", "lucia"].forEach((id) => {
  const info = inspectPng(`assets/sprites/avatar/avatar_${id}.png`);
  assert.ok(info.width >= 512 && info.height >= 512, `${id}: Auflösung ist zu klein`);
  assert.equal(info.colorType, 6, `${id}: Avatar braucht einen Alpha-Kanal`);
});

["camarera", "bailarines", "dj", "conserje"].forEach((id) => {
  const info = inspectPng(`assets/sprites/npc/npc_${id}_idle.png`);
  assert.ok(info.width >= 512 && info.height >= 512, `${id}: NPC-Auflösung ist zu klein`);
  assert.equal(info.colorType, 6, `${id}: NPC braucht einen Alpha-Kanal`);
});

["hub", "barra", "pista", "dj", "finale"].forEach((id) => {
  const info = inspectPng(`assets/backgrounds/background_${id}.png`);
  assert.ok(info.width >= 1200 && info.height >= 700, `${id}: Hintergrund ist für das iPad zu klein`);
  assert.ok(info.width / info.height >= 1.45, `${id}: Hintergrund ist nicht breit genug angelegt`);
});

const map = inspectPng("assets/backgrounds/background_hub_mapa.png");
assert.ok(map.width >= 1200 && map.height >= 700, "Spanienkarte ist für das iPad zu klein");

["guardarropa_generos", "bar_camille", "pista_dialogo", "dj_ser_estar", "finale_dialogo"].forEach((id) => {
  const info = inspectPng(`assets/scenes/scene_${id}.png`);
  assert.ok(info.width >= 1200 && info.height >= 700, `${id}: Aufgabenszene ist für das iPad zu klein`);
});

["icon_codigo", "icon_llave", "sticker_hub", "sticker_barra", "sticker_pista", "sticker_dj", "sticker_finale"].forEach((id) => {
  const info = inspectPng(`assets/icons/${id}.png`);
  assert.ok(info.width >= 512 && info.height >= 512, `${id}: Icon-Auflösung ist zu klein`);
  assert.equal(info.colorType, 6, `${id}: Icon braucht einen Alpha-Kanal`);
});

["mercedes", "camille", "luca_male", "ines"].forEach((id) => {
  const file = path.join(root, `assets/audio/bar_${id}.wav`);
  assert.ok(fs.existsSync(file), `Hördatei fehlt: bar_${id}.wav`);
  const data = fs.readFileSync(file);
  assert.equal(data.subarray(0, 4).toString("ascii"), "RIFF", `bar_${id}.wav ist keine gültige WAV-Datei`);
  assert.ok(data.length > 100000, `bar_${id}.wav ist auffällig klein`);
});

console.log("Assetchecks erfolgreich.");
