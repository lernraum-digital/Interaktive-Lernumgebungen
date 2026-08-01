(function () {
  'use strict';

  const MODES = [
    { max: 20, name: 'Órbita', subtitle: 'Bases de vuelo' },
    { max: 100, name: 'Nebulosa', subtitle: 'Campo de asteroides' },
    { max: 1000, name: 'Luna cristal', subtitle: 'Sector avanzado' },
    { max: 10000, name: 'Vórtice', subtitle: 'Frontera final' }
  ];

  const LEVELS = {
    20: [
      { min:0, max:10, speed:58, count:3, tasks:5, motion:0, stagger:1.55, label:'Gerader Übungsflug' },
      { min:11, max:20, speed:68, count:4, tasks:7, motion:12, stagger:1.35, label:'Langsamer Seitenwechsel' },
      { min:0, max:20, speed:88, count:3, tasks:8, motion:18, stagger:1.15, label:'Schneller Ausweichkurs' },
      { min:0, max:20, speed:104, count:4, tasks:9, motion:23, stagger:1.02, label:'Orbit-Meisterschaft' }
    ],
    100: [
      { min:0, max:30, speed:58, count:3, tasks:5, motion:0, stagger:1.55, label:'Gerader Übungsflug' },
      { min:31, max:60, speed:68, count:4, tasks:7, motion:12, stagger:1.35, label:'Langsamer Seitenwechsel' },
      { min:61, max:100, speed:88, count:3, tasks:8, motion:18, stagger:1.15, label:'Schneller Ausweichkurs' },
      { min:0, max:100, speed:104, count:4, tasks:9, motion:23, stagger:1.02, label:'Gemischte Nebel' },
      { min:0, max:100, speed:122, count:4, tasks:10, motion:29, stagger:.88, label:'Zehner-Alarm' },
      { min:0, max:100, speed:138, count:5, tasks:11, motion:34, stagger:.78, label:'Cien-Meisterschaft' }
    ],
    1000: [
      { min:0, max:100, speed:58, count:3, tasks:5, motion:0, stagger:1.55, label:'Gerader Übungsflug' },
      { min:101, max:500, speed:68, count:4, tasks:7, motion:12, stagger:1.35, label:'Langsamer Seitenwechsel' },
      { min:501, max:1000, speed:88, count:3, tasks:8, motion:18, stagger:1.15, label:'Schneller Ausweichkurs' },
      { min:0, max:1000, speed:104, count:4, tasks:9, motion:23, stagger:1.02, label:'Kristallmix' },
      { min:0, max:1000, speed:118, count:4, tasks:10, motion:28, stagger:.9, label:'Hundertwechsel' },
      { min:0, max:1000, speed:132, count:5, tasks:10, motion:32, stagger:.82, label:'Kristall-Elite' },
      { min:0, max:1000, speed:146, count:5, tasks:11, motion:36, stagger:.74, label:'Mil-Meisterschaft' }
    ],
    10000: [
      { min:0, max:1000, speed:58, count:3, tasks:5, motion:0, stagger:1.55, label:'Gerader Übungsflug' },
      { min:1001, max:3000, speed:68, count:4, tasks:7, motion:12, stagger:1.35, label:'Langsamer Seitenwechsel' },
      { min:3001, max:5000, speed:88, count:3, tasks:8, motion:18, stagger:1.15, label:'Schneller Ausweichkurs' },
      { min:5001, max:7500, speed:104, count:4, tasks:8, motion:23, stagger:1.02, label:'Miles III' },
      { min:7501, max:10000, speed:116, count:4, tasks:9, motion:27, stagger:.92, label:'Hasta diez mil' },
      { min:0, max:10000, speed:128, count:5, tasks:10, motion:31, stagger:.84, label:'Vortex-Mix' },
      { min:0, max:10000, speed:140, count:5, tasks:11, motion:35, stagger:.76, label:'Vortex-Elite' },
      { min:0, max:10000, speed:152, count:5, tasks:12, motion:39, stagger:.7, label:'Finale Meisterschaft' }
    ]
  };

  const $ = (id) => document.getElementById(id);
  const canvas = $('gameCanvas');
  const ctx = canvas.getContext('2d');
  const state = {
    mode: 20, level: 1, playStyle: 'mission', handed: 'right', shipIndex: 0, running: false,
    paused: false, resolving: false, score: 0, lives: 3, combo: 0, shots: 0,
    hits: 0, answered: 0, correct: 0, target: 0, questionIndex: 0,
    questions: [], targets: [], spawnQueue: [], bullets: [], particles: [], obstacles: [], keys: {},
    sound: true, last: 0, spawnTimer: 0, waveStarted: false, raf: 0
  };
  const ship = { x: 0, y: 0, w: 58, h: 48, speed: 340, cooldown: 0, invincible: 0 };
  const SHIPS = [
    { name:'Cadete', need:0, reward:'Startschiff' },
    { name:'Cometa', need:1, reward:'1 Abzeichen' },
    { name:'Nova', need:3, reward:'3 Abzeichen' },
    { name:'Titán', need:6, reward:'6 Abzeichen' }
  ];
  const PROGRESS_VERSION = 'final-levels-v1';
  const shipAtlas = new Image(); shipAtlas.src = 'assets/images/ship-atlas.png';
  let dpr = 1, width = 0, height = 0, feedbackTimer;

  function ensureProgressVersion() {
    try {
      if (localStorage.getItem('numeroInvasoresProgressVersion') !== PROGRESS_VERSION) {
        localStorage.removeItem('numeroInvasoresProgress');
        localStorage.removeItem('numeroInvasoresBadges');
        localStorage.setItem('numeroInvasoresProgressVersion', PROGRESS_VERSION);
      }
    } catch (error) { /* Local storage is optional. */ }
  }

  function resetProgress() {
    const confirmed = window.confirm('Alle freigeschalteten Level und Abzeichen auf diesem Gerät zurücksetzen?');
    if (!confirmed) return;
    try {
      localStorage.removeItem('numeroInvasoresProgress');
      localStorage.removeItem('numeroInvasoresBadges');
      localStorage.setItem('numeroInvasoresProgressVersion', PROGRESS_VERSION);
    } catch (error) { /* Continue with an in-memory reset. */ }
    state.level = 1; state.shipIndex = 0; saveSettings(); buildMenu(); beep(320, .08);
  }

  function readSaved() {
    try {
      const settings = JSON.parse(localStorage.getItem('numeroInvasoresSettings') || '{}');
      state.handed = settings.handed === 'left' ? 'left' : 'right';
      state.playStyle = settings.playStyle === 'training' ? 'training' : 'mission';
      state.shipIndex = Number.isInteger(settings.shipIndex) ? Math.max(0, Math.min(3, settings.shipIndex)) : 0;
    } catch (error) { /* Local storage is optional. */ }
  }

  function saveSettings() {
    try { localStorage.setItem('numeroInvasoresSettings', JSON.stringify({ handed: state.handed, playStyle: state.playStyle, shipIndex: state.shipIndex })); } catch (error) { /* Continue without persistence. */ }
  }

  function unlockedLevel(mode) {
    try {
      const progress = JSON.parse(localStorage.getItem('numeroInvasoresProgress') || '{}');
      return Math.max(1, Math.min(LEVELS[mode].length, Number(progress[mode]) || 1));
    } catch (error) { return 1; }
  }

  function unlockNextLevel() {
    if (state.level >= LEVELS[state.mode].length) return;
    try {
      const progress = JSON.parse(localStorage.getItem('numeroInvasoresProgress') || '{}');
      progress[state.mode] = Math.max(Number(progress[state.mode]) || 1, state.level + 1);
      localStorage.setItem('numeroInvasoresProgress', JSON.stringify(progress));
    } catch (error) { /* Continue without persistence. */ }
  }

  function levelConfig() { return LEVELS[state.mode][state.level - 1]; }

  function masteredKeys() {
    try { return JSON.parse(localStorage.getItem('numeroInvasoresBadges') || '[]'); } catch (error) { return []; }
  }

  function badgeTotal() { return new Set(masteredKeys()).size; }

  function markMastered() {
    const before = badgeTotal(), key = `${state.mode}-${state.level}`;
    try {
      const keys = masteredKeys();
      if (!keys.includes(key)) keys.push(key);
      localStorage.setItem('numeroInvasoresBadges', JSON.stringify(keys));
    } catch (error) { return null; }
    const after = badgeTotal();
    return SHIPS.find((item) => item.need === after && after > before) || null;
  }

  function spanishNumber(n) {
    if (n === 0) return 'cero';
    const unit = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
    const special = {10:'diez',11:'once',12:'doce',13:'trece',14:'catorce',15:'quince',16:'dieciséis',17:'diecisiete',18:'dieciocho',19:'diecinueve',20:'veinte',21:'veintiuno',22:'veintidós',23:'veintitrés',24:'veinticuatro',25:'veinticinco',26:'veintiséis',27:'veintisiete',28:'veintiocho',29:'veintinueve'};
    if (special[n]) return special[n];
    const tens = ['', '', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
    const under100 = (x) => x < 10 ? unit[x] : special[x] || (tens[Math.floor(x / 10)] + (x % 10 ? ' y ' + unit[x % 10] : ''));
    const under1000 = (x) => {
      if (x < 100) return under100(x);
      if (x === 100) return 'cien';
      const h = Math.floor(x / 100), rest = x % 100;
      const hundreds = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];
      return hundreds[h] + (rest ? ' ' + under100(rest) : '');
    };
    if (n < 1000) return under1000(n);
    if (n < 10000) {
      const th = Math.floor(n / 1000), rest = n % 1000;
      return (th === 1 ? 'mil' : under100(th) + ' mil') + (rest ? ' ' + under1000(rest) : '');
    }
    return 'diez mil';
  }

  function buildMenu() {
    state.level = unlockedLevel(state.mode);
    $('modeGrid').innerHTML = MODES.map((mode) => `<button class="mode-card${mode.max === state.mode ? ' is-selected' : ''}" data-mode="${mode.max}"><small>${mode.name.toUpperCase()}</small><strong>0–${mode.max.toLocaleString('de-DE')}</strong><em>${mode.subtitle}</em></button>`).join('');
    $('levelJourney').innerHTML = LEVELS[state.mode].map((level, index) => {
      const number = index + 1;
      const status = number < state.level ? ' is-complete' : number === state.level ? ' is-current' : '';
      return `<span class="journey-step${status}" title="Level ${number}: ${level.label}">${number < state.level ? '✓' : number}</span>`;
    }).join('');
    const cfg = levelConfig();
    $('journeyCopy').innerHTML = `<strong>Weiter mit Level ${state.level}</strong><br>${cfg.label} · ${cfg.tasks} Aufgaben · Zahlen ${cfg.min.toLocaleString('de-DE')}–${cfg.max.toLocaleString('de-DE')}<br><small>Freischaltung ab 80 % – unabhängig vom Punktestand.</small>`;
    $('modeTip').innerHTML = state.playStyle === 'training'
      ? '<span>∞</span><p><strong>Training</strong> · Übe ohne Game-over und nutze Fehler zum Wiederholen.</p>'
      : '<span>♥ ♥ ♥</span><p><strong>3 Leben</strong> · Fehler zeigen dir sofort die richtige Lösung.</p>';
    document.querySelectorAll('.mode-card').forEach((button) => button.addEventListener('click', () => {
      state.mode = Number(button.dataset.mode); buildMenu(); beep(390, .04);
    }));
    document.querySelectorAll('[data-play-style]').forEach((button) => button.classList.toggle('is-selected', button.dataset.playStyle === state.playStyle));
    document.querySelectorAll('[data-handed]').forEach((button) => button.classList.toggle('is-selected', button.dataset.handed === state.handed));
    renderHangar();
  }

  function renderHangar() {
    const badges = badgeTotal();
    if (SHIPS[state.shipIndex].need > badges) { state.shipIndex = 0; saveSettings(); }
    $('badgeCount').textContent = badges;
    $('shipGrid').innerHTML = SHIPS.map((item, index) => {
      const locked = badges < item.need;
      return `<button class="ship-card${locked ? ' is-locked' : ''}${index === state.shipIndex ? ' is-selected' : ''}" data-ship="${index}" ${locked ? 'disabled' : ''}><span class="ship-preview" aria-hidden="true"></span><span class="ship-copy"><strong>${item.name}</strong><small>${locked ? `Noch ${item.need - badges} Abzeichen` : index === state.shipIndex ? 'Ausgewählt' : item.reward}</small></span>${locked ? '<span class="ship-lock">🔒</span>' : ''}</button>`;
    }).join('');
    document.querySelectorAll('.ship-card:not(.is-locked)').forEach((button) => button.addEventListener('click', () => {
      state.shipIndex = Number(button.dataset.ship); saveSettings(); renderHangar(); beep(560, .06);
    }));
  }

  function resize() {
    const rect = $('playfield').getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width; height = rect.height;
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ship.y = height - Math.max(118, height * .14);
    ship.x = Math.max(ship.w / 2 + 8, Math.min(width - ship.w / 2 - 8, ship.x || width / 2));
  }

  function randomBetween(min, max) { return min + Math.floor(Math.random() * (max - min + 1)); }

  function makeQuestions() {
    const cfg = levelConfig(), result = [];
    while (result.length < cfg.tasks) {
      const value = randomBetween(cfg.min, cfg.max);
      if (result.length && value === result[result.length - 1]) continue;
      result.push(value);
    }
    return result;
  }

  function startGame() {
    const cfg = levelConfig();
    state.running = true; state.paused = false; state.resolving = false;
    state.score = 0; state.lives = 3; state.combo = 0; state.shots = 0; state.hits = 0;
    state.answered = 0; state.correct = 0; state.questionIndex = 0;
    state.questions = makeQuestions(); state.targets = []; state.spawnQueue = []; state.bullets = []; state.particles = []; state.obstacles = [];
    state.spawnTimer = 0; state.waveStarted = false; ship.invincible = 1;
    $('startScreen').classList.remove('is-active'); $('gameScreen').classList.add('is-active');
    $('playfield').classList.toggle('is-left-handed', state.handed === 'left');
    $('gameBg').className = 'game-bg mode-' + state.mode;
    resize(); ship.x = width / 2;
    const mode = MODES.find((item) => item.max === state.mode);
    $('missionLabel').textContent = `${mode.name.toUpperCase()} · LVL ${state.level}`;
    $('sideMode').textContent = `${mode.name.toUpperCase()} 0–${state.mode.toLocaleString('de-DE')}`;
    $('sideLevel').textContent = String(state.level).padStart(2, '0');
    $('sideRange').textContent = `Zahlen ${cfg.min.toLocaleString('de-DE')}–${cfg.max.toLocaleString('de-DE')} · ${cfg.label}`;
    $('sideShip').textContent = SHIPS[state.shipIndex].name;
    $('livesLabel').textContent = state.playStyle === 'training' ? 'MODUS' : 'LEBEN';
    nextQuestion(); updateHud();
    cancelAnimationFrame(state.raf); state.last = performance.now(); state.raf = requestAnimationFrame(loop);
  }

  function nextQuestion() {
    if (!state.running || state.questionIndex >= state.questions.length) return;
    state.resolving = false; state.target = state.questions[state.questionIndex];
    state.targets = []; state.spawnQueue = []; state.bullets = []; state.obstacles = []; state.spawnTimer = .2; state.waveStarted = false;
    $('wordPrompt').textContent = spanishNumber(state.target);
    updateHud();
  }

  function distractor(excluded) {
    const cfg = levelConfig();
    const span = cfg.max - cfg.min;
    const candidates = [state.target - 1, state.target + 1, state.target - 2, state.target + 2];
    if (state.target >= 10) {
      candidates.push(Math.floor(state.target / 10), state.target - 10, state.target + 10);
      const digits = String(state.target).split('').reverse().join('');
      candidates.push(Number(digits));
    }
    const valid = candidates.filter((value) => value >= cfg.min && value <= cfg.max && value !== state.target && !excluded.includes(value));
    if (valid.length) return valid[Math.floor(Math.random() * valid.length)];
    let value;
    do { value = randomBetween(cfg.min, cfg.max); } while (value === state.target || excluded.includes(value) || span < excluded.length);
    return value;
  }

  function spawnWave() {
    const cfg = levelConfig(), values = [state.target];
    while (values.length < cfg.count) values.push(distractor(values));
    values.sort(() => Math.random() - .5);
    const positions = values.length === 3 ? [.18, .5, .82] : values.length === 4 ? [.14, .38, .62, .86] : [.11, .3, .5, .7, .89];
    state.spawnQueue = values.map((value, index) => ({ value, startX: width * positions[index], slot: index, waveCount: values.length }));
    state.waveStarted = true; state.spawnTimer = 0;
    const obstacleCount = state.level < 2 ? 1 : Math.min(3, 1 + Math.floor(state.level / 3));
    state.obstacles = Array.from({ length: obstacleCount }, (_, index) => ({
      x: width * (.2 + Math.random() * .6), y: height * (.28 + index * .16), r: 9 + Math.random() * 10,
      speed: 9 + Math.random() * 9, spin: Math.random() * 6
    }));
  }

  function spawnNextTarget() {
    const cfg = levelConfig(), queued = state.spawnQueue.shift();
    if (!queued) return;
    let destinationX = queued.startX;
    if (cfg.motion > 0) {
      do { destinationX = width * (.14 + Math.random() * .72); } while (Math.abs(destinationX - queued.startX) < width * .18);
    }
    const radius = cfg.count >= 5 ? 23 : 26;
    state.targets.push({
      value: queued.value, startX: queued.startX, destinationX, x: queued.startX, y: -42,
      r: radius, speed: cfg.speed, phase: Math.random() * Math.PI * 2, slot: queued.slot, waveCount: queued.waveCount,
      time: 0, frequency: .24 + state.level * .03, wiggle: cfg.motion
    });
    state.spawnTimer = Math.max(cfg.stagger, (radius * 2 + 48) / cfg.speed);
  }

  function separateTargetLanes() {
    if (state.targets.length < 2) return;
    const active = [...state.targets].sort((a, b) => a.slot - b.slot);
    const edge = Math.max(...active.map((target) => target.r)) + 8;
    const desiredGap = Math.max(...active.map((target) => target.r)) * 2 + 22;
    const availableGap = (width - edge * 2) / Math.max(1, active.length - 1);
    const gap = Math.min(desiredGap, availableGap);
    for (let index = 1; index < active.length; index++) active[index].x = Math.max(active[index].x, active[index - 1].x + gap);
    const overflow = active[active.length - 1].x - (width - edge);
    if (overflow > 0) active.forEach((target) => { target.x -= overflow; });
    const underflow = edge - active[0].x;
    if (underflow > 0) active.forEach((target) => { target.x += underflow; });
  }

  function shoot() {
    if (!state.running || state.paused || state.resolving || ship.cooldown > 0) return;
    ship.cooldown = .24; state.shots++;
    state.bullets.push({ x: ship.x, y: ship.y - 28, speed: 620 }); beep(680, .035);
  }

  function scheduleNext() {
    if (state.questionIndex >= state.questions.length) {
      setTimeout(() => finishLevel(), 500);
    } else {
      setTimeout(nextQuestion, 520);
    }
  }

  function resolveQuestion(isCorrect, message, losesLife = true) {
    if (state.resolving || !state.running) return;
    state.resolving = true; state.answered++;
    if (isCorrect) {
      state.correct++; state.hits++; state.combo++;
      state.score += 100 + Math.max(0, state.combo - 1) * 20 + state.level * 15;
      showFeedback(`¡CORRECTO! ${spanishNumber(state.target)} = ${state.target}`, true); beep(880, .09);
    } else {
      state.combo = 0; state.score = Math.max(0, state.score - (losesLife ? 25 : 10));
      if (losesLife && state.playStyle === 'mission') state.lives--;
      const retryAt = Math.min(state.questionIndex + 3, state.questions.length);
      if (state.questions.length < levelConfig().tasks + 6) state.questions.splice(retryAt, 0, state.target);
      showFeedback(`${message} · Lösung: ${state.target}`, false); beep(140, .16);
    }
    state.targets = []; state.spawnQueue = []; state.bullets = []; state.obstacles = []; state.waveStarted = false;
    state.questionIndex++; updateHud();
    if (!isCorrect && losesLife && state.playStyle === 'mission' && state.lives <= 0) {
      setTimeout(() => finishLevel(true), 520); return;
    }
    scheduleNext();
  }

  function hitTarget(index) {
    const target = state.targets[index], correct = target.value === state.target;
    burst(target.x, target.y, correct);
    resolveQuestion(correct, `CASI · ${target.value} ≠ ${spanishNumber(state.target)}`);
  }

  function update(dt) {
    const right = state.keys.ArrowRight || state.keys.d || state.keys.D || state.keys.right;
    const left = state.keys.ArrowLeft || state.keys.a || state.keys.A || state.keys.left;
    const direction = (right ? 1 : 0) - (left ? 1 : 0);
    ship.x = Math.max(ship.w / 2 + 8, Math.min(width - ship.w / 2 - 8, ship.x + direction * ship.speed * dt));
    ship.cooldown = Math.max(0, ship.cooldown - dt); ship.invincible = Math.max(0, ship.invincible - dt);
    if (state.keys[' '] || state.keys.fire) shoot();
    if (!state.resolving && !state.waveStarted) { state.spawnTimer -= dt; if (state.spawnTimer <= 0) spawnWave(); }
    if (!state.resolving && state.waveStarted && state.spawnQueue.length) { state.spawnTimer -= dt; if (state.spawnTimer <= 0) spawnNextTarget(); }
    state.targets.forEach((target) => {
      target.time += dt; target.y += target.speed * dt;
      const progress = Math.max(0, Math.min(1, (target.y + 42) / Math.max(1, ship.y - 60)));
      const eased = progress * progress * (3 - 2 * progress);
      const routeX = target.startX + (target.destinationX - target.startX) * eased;
      target.x = Math.max(target.r + 6, Math.min(width - target.r - 6, routeX + Math.sin(target.time * target.frequency * Math.PI * 2 + target.phase) * target.wiggle));
    });
    separateTargetLanes();
    state.obstacles.forEach((obstacle) => { obstacle.y += obstacle.speed * dt; obstacle.spin += dt; if (obstacle.y > height + 20) obstacle.y = -20; });
    state.bullets.forEach((bullet) => { bullet.y -= bullet.speed * dt; });
    state.particles.forEach((particle) => { particle.x += particle.vx * dt; particle.y += particle.vy * dt; particle.life -= dt; });
    state.bullets = state.bullets.filter((bullet) => bullet.y > -20);
    state.particles = state.particles.filter((particle) => particle.life > 0);

    for (let bulletIndex = state.bullets.length - 1; bulletIndex >= 0; bulletIndex--) {
      for (let targetIndex = state.targets.length - 1; targetIndex >= 0; targetIndex--) {
        const bullet = state.bullets[bulletIndex], target = state.targets[targetIndex];
        if (Math.hypot(bullet.x - target.x, bullet.y - target.y) < target.r + 5) {
          state.bullets.splice(bulletIndex, 1); hitTarget(targetIndex); break;
        }
      }
    }

    for (let index = state.targets.length - 1; index >= 0 && !state.resolving; index--) {
      const target = state.targets[index];
      if (Math.abs(target.x - ship.x) < target.r + ship.w * .35 && Math.abs(target.y - ship.y) < target.r + ship.h * .34) {
        burst(target.x, target.y, false); resolveQuestion(false, 'GETROFFEN');
      } else if (target.y > height + 45) {
        state.targets.splice(index, 1);
        if (target.value === state.target) resolveQuestion(false, 'AUSGEWICHEN · Kein Leben verloren', false);
      }
    }
  }

  function drawObstacle(obstacle) {
    ctx.save(); ctx.translate(obstacle.x, obstacle.y); ctx.rotate(obstacle.spin * .35);
    ctx.globalAlpha = .58; ctx.fillStyle = '#5a6280'; ctx.strokeStyle = '#9ca7c8'; ctx.lineWidth = 1;
    ctx.beginPath();
    for (let point = 0; point < 8; point++) {
      const angle = point / 8 * Math.PI * 2, radius = obstacle.r * (point % 2 ? .78 : 1);
      const x = Math.cos(angle) * radius, y = Math.sin(angle) * radius;
      if (!point) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
  }

  function drawShip() {
    const hue = [190, 320, 155, 38][MODES.findIndex((mode) => mode.max === state.mode)];
    if (ship.invincible > 0 && Math.floor(ship.invincible * 10) % 2 === 0) return;
    ctx.save(); ctx.translate(ship.x, ship.y); ctx.shadowColor = `hsl(${hue} 100% 65%)`; ctx.shadowBlur = 22;
    ctx.fillStyle = '#ff9d51'; ctx.beginPath(); ctx.moveTo(-10, 27); ctx.lineTo(-3, 43 + Math.random() * 7); ctx.lineTo(2, 27); ctx.fill();
    ctx.beginPath(); ctx.moveTo(5, 27); ctx.lineTo(11, 40 + Math.random() * 8); ctx.lineTo(16, 27); ctx.fill();
    if (shipAtlas.complete && shipAtlas.naturalWidth) {
      const cellW = shipAtlas.naturalWidth / 2, cellH = shipAtlas.naturalHeight / 2;
      const sourceX = state.shipIndex % 2 * cellW, sourceY = Math.floor(state.shipIndex / 2) * cellH;
      ctx.imageSmoothingEnabled = false; ctx.drawImage(shipAtlas, sourceX, sourceY, cellW, cellH, -48, -55, 96, 96);
    }
    ctx.restore();
  }

  function drawTarget(target) {
    ctx.save(); ctx.translate(target.x, target.y); ctx.shadowColor = '#ff4ab8'; ctx.shadowBlur = 14;
    ctx.fillStyle = 'rgba(10,14,45,.94)'; ctx.strokeStyle = '#aab7ff'; ctx.lineWidth = 2;
    const r = target.r; ctx.beginPath(); ctx.moveTo(-r * .55, -r); ctx.lineTo(r * .55, -r); ctx.lineTo(r, -r * .42); ctx.lineTo(r, r * .5); ctx.lineTo(r * .5, r); ctx.lineTo(-r * .5, r); ctx.lineTo(-r, r * .5); ctx.lineTo(-r, -r * .42); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ff4ab8'; ctx.fillRect(-r - 7, -4, 7, 9); ctx.fillRect(r, -4, 7, 9); ctx.fillRect(-r * .58, -r - 5, 5, 7); ctx.fillRect(r * .38, -r - 5, 5, 7);
    ctx.shadowBlur = 0; ctx.fillStyle = '#fff';
    ctx.font = `700 ${target.value >= 1000 ? 14 : target.value >= 100 ? 17 : 21}px "Chakra Petch"`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(target.value.toLocaleString('de-DE'), 0, 1); ctx.restore();
  }

  function draw() {
    ctx.clearRect(0, 0, width, height); state.obstacles.forEach(drawObstacle); state.targets.forEach(drawTarget);
    ctx.fillStyle = '#75f7ff'; ctx.shadowColor = '#75f7ff'; ctx.shadowBlur = 10;
    state.bullets.forEach((bullet) => ctx.fillRect(bullet.x - 2, bullet.y - 12, 4, 17)); ctx.shadowBlur = 0;
    state.particles.forEach((particle) => { ctx.globalAlpha = Math.max(0, particle.life); ctx.fillStyle = particle.color; ctx.fillRect(particle.x, particle.y, 4, 4); });
    ctx.globalAlpha = 1; drawShip();
  }

  function burst(x, y, good) {
    for (let index = 0; index < 18; index++) state.particles.push({ x, y, vx:(Math.random() - .5) * 190, vy:(Math.random() - .5) * 190, life:.5 + Math.random() * .4, color:good ? '#4ff6ff' : '#ff5f8f' });
  }

  function loop(now) {
    if (!state.running) return;
    const dt = Math.min(.033, (now - state.last) / 1000); state.last = now;
    if (!state.paused) update(dt); draw(); state.raf = requestAnimationFrame(loop);
  }

  function updateHud() {
    const total = state.questions.length || levelConfig().tasks;
    $('scoreValue').textContent = String(state.score).padStart(4, '0');
    $('progressValue').textContent = `${Math.min(state.questionIndex + 1, total)} / ${total}`;
    $('livesValue').textContent = state.playStyle === 'training' ? '∞' : '♥'.repeat(Math.max(0, state.lives));
    $('livesValue').setAttribute('aria-label', state.playStyle === 'training' ? 'Trainingsmodus ohne Game-over' : `${state.lives} Leben`);
    $('comboValue').textContent = `COMBO ×${Math.max(1, state.combo)}`; $('comboValue').classList.toggle('is-on', state.combo > 1);
    $('sideCorrect').textContent = state.correct; $('sideAccuracy').textContent = state.answered ? `${Math.round(state.correct / state.answered * 100)} %` : '–';
  }

  function showFeedback(text, good) {
    clearTimeout(feedbackTimer); $('feedback').textContent = text; $('feedback').className = `feedback is-on ${good ? 'good' : 'bad'}`;
    feedbackTimer = setTimeout(() => { $('feedback').className = 'feedback'; }, 1450);
  }

  function finishLevel(outOfLives = false) {
    if (!state.running) return;
    state.running = false; cancelAnimationFrame(state.raf);
    const accuracy = state.answered ? Math.round(state.correct / state.answered * 100) : 0;
    const mastered = !outOfLives && accuracy >= 80;
    const maxLevel = LEVELS[state.mode].length;
    let shipReward = null;
    if (mastered) { unlockNextLevel(); shipReward = markMastered(); }
    $('resultStars').textContent = mastered ? (accuracy >= 95 ? '★★★' : accuracy >= 85 ? '★★☆' : '★☆☆') : '☆☆☆';
    $('resultKicker').textContent = mastered ? 'Misión cumplida' : outOfLives ? 'Schilde erschöpft' : 'Noch nicht gemeistert';
    $('resultTitle').textContent = mastered ? '¡Excelente!' : '¡Otra vez!';
    $('resultText').textContent = mastered
      ? `Du hast Level ${state.level} mit ${accuracy} % gemeistert.${state.level < maxLevel ? ' Das nächste Level ist freigeschaltet.' : ' Du hast diesen Zahlenraum abgeschlossen!'}${shipReward ? ` Neues Schiff freigeschaltet: ${shipReward.name}!` : ''}`
      : `${accuracy} % richtig. Für das nächste Level brauchst du mindestens 80 %. Wiederhole diese Mission.`;
    $('finalScore').textContent = state.score; $('accuracyValue').textContent = `${accuracy}%`;
    $('nextButton').textContent = mastered && state.level < maxLevel ? 'Nächstes Level' : 'Level wiederholen';
    $('nextButton').dataset.mastered = mastered ? 'true' : 'false'; $('resultModal').hidden = false;
  }

  let audioCtx;
  function beep(frequency, duration) {
    if (!state.sound) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator(), gain = audioCtx.createGain(); oscillator.type = 'square'; oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(.035, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(.001, audioCtx.currentTime + duration);
      oscillator.connect(gain).connect(audioCtx.destination); oscillator.start(); oscillator.stop(audioCtx.currentTime + duration);
    } catch (error) { /* Sound is optional. */ }
  }

  function bindHold(id, key) {
    const element = $(id);
    const down = (event) => { event.preventDefault(); state.keys[key] = true; };
    const up = (event) => { event.preventDefault(); state.keys[key] = false; };
    element.addEventListener('pointerdown', down); ['pointerup', 'pointercancel', 'pointerleave'].forEach((name) => element.addEventListener(name, up));
  }

  $('launchButton').addEventListener('click', startGame);
  $('resetProgressButton').addEventListener('click', resetProgress);
  $('howButton').addEventListener('click', () => { $('howModal').hidden = false; });
  document.querySelectorAll('[data-close]').forEach((button) => button.addEventListener('click', () => { button.closest('.modal').hidden = true; }));
  document.querySelectorAll('[data-play-style]').forEach((button) => button.addEventListener('click', () => { state.playStyle = button.dataset.playStyle; saveSettings(); buildMenu(); beep(430, .04); }));
  document.querySelectorAll('[data-handed]').forEach((button) => button.addEventListener('click', () => { state.handed = button.dataset.handed; saveSettings(); buildMenu(); beep(510, .04); }));
  $('pauseButton').addEventListener('click', () => { state.paused = !state.paused; $('pauseButton').textContent = state.paused ? '▶' : 'Ⅱ'; showFeedback(state.paused ? 'PAUSE' : 'WEITER', true); });
  $('soundButton').addEventListener('click', () => { state.sound = !state.sound; $('soundButton').textContent = state.sound ? '♪' : '×'; });
  $('fireButton').addEventListener('pointerdown', (event) => { event.preventDefault(); shoot(); });
  bindHold('leftButton', 'left'); bindHold('rightButton', 'right');
  addEventListener('keydown', (event) => { if (['ArrowLeft', 'ArrowRight', ' '].includes(event.key)) event.preventDefault(); state.keys[event.key] = true; });
  addEventListener('keyup', (event) => { state.keys[event.key] = false; }); addEventListener('resize', resize);
  $('menuButton').addEventListener('click', () => { $('resultModal').hidden = true; $('gameScreen').classList.remove('is-active'); $('startScreen').classList.add('is-active'); buildMenu(); });
  $('nextButton').addEventListener('click', () => {
    if ($('nextButton').dataset.mastered === 'true' && state.level < LEVELS[state.mode].length) state.level++;
    $('resultModal').hidden = true; startGame();
  });

  ensureProgressVersion(); readSaved(); buildMenu();
})();
