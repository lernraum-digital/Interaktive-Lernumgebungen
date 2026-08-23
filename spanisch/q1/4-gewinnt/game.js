(function () {
  "use strict";

  const ROWS = 6;
  const COLS = 6;
  const TURNS_PER_PLAYER = 18;
  const LINE_BONUS = 3;
  const BLOCKED = "x";

  const $ = (id) => document.getElementById(id);
  const screens = [$("startScreen"), $("gameScreen"), $("resultScreen")];
  const boardEl = $("gameBoard");
  const columnButtonsEl = $("columnButtons");
  const questionModal = $("questionModal");
  const feedbackModal = $("feedbackModal");
  const questionForm = $("questionForm");

  let state;
  let activeQuestion = null;
  let activeTarget = null;
  let hintUsed = false;
  let audioPlays = 0;
  let orderedTokens = [];
  let soundEnabled = true;
  let activeAudio = null;
  let activeAudioButton = null;

  function freshState(names) {
    const decks = buildFairDecks();
    return {
      board: Array.from({ length: ROWS }, () => Array(COLS).fill(null)),
      failedAttempts: Array.from({ length: ROWS }, () => Array(COLS).fill(0)),
      current: 0,
      totalTurns: 0,
      usedQuestions: new Set(),
      scoredLines: [new Set(), new Set()],
      decks,
      players: names.map((name, index) => ({
        name,
        score: 0,
        solved: 0,
        lines: 0,
        turns: 0,
        correctByCategory: {},
        wrongByCategory: {},
        color: index === 0 ? "terracotta" : "azul"
      }))
    };
  }

  function buildFairDecks() {
    const standard = window.QUESTION_BANK.filter((q) => !q.challenge);
    const challenges = shuffle(window.QUESTION_BANK.filter((q) => q.challenge));
    const categories = shuffle([...new Set(standard.map((q) => q.category))]);
    const used = new Set();
    const decks = [[], []];
    const selectedByPlayer = [[], []];

    for (let player = 0; player < 2; player += 1) {
      categories.forEach((category) => {
        const candidates = shuffle(standard.filter((q) => q.category === category && !used.has(q.id)));
        if (candidates[0]) {
          selectedByPlayer[player].push(candidates[0]);
          used.add(candidates[0].id);
        }
      });
    }

    for (let player = 0; player < 2; player += 1) {
      const selected = selectedByPlayer[player];
      const extras = shuffle(standard.filter((q) => !used.has(q.id))).slice(0, 15 - selected.length);
      extras.forEach((q) => used.add(q.id));
      const regularDeck = shuffle([...selected, ...extras]);
      const playerChallenges = challenges.splice(0, 3);
      let regularIndex = 0;
      let challengeIndex = 0;
      for (let turn = 1; turn <= TURNS_PER_PLAYER; turn += 1) {
        decks[player].push(turn % 6 === 0 ? playerChallenges[challengeIndex++] : regularDeck[regularIndex++]);
      }
    }
    return decks;
  }

  function showScreen(screen) {
    screens.forEach((item) => item.classList.toggle("is-active", item === screen));
  }

  function safeName(value, fallback) {
    return value.trim().replace(/[<>]/g, "").slice(0, 22) || fallback;
  }

  function startGame(keepNames = false) {
    const names = keepNames && state
      ? state.players.map((p) => p.name)
      : [safeName($("playerOneName").value, "Spieler:in 1"), safeName($("playerTwoName").value, "Spieler:in 2")];
    state = freshState(names);
    $("playerOneDisplay").textContent = names[0];
    $("playerTwoDisplay").textContent = names[1];
    buildBoard();
    updateHud();
    showScreen($("gameScreen"));
  }

  function buildBoard() {
    boardEl.innerHTML = "";
    columnButtonsEl.innerHTML = "";
    for (let col = 0; col < COLS; col += 1) {
      const button = document.createElement("button");
      button.className = "column-button";
      button.type = "button";
      button.textContent = `↓ ${col + 1}`;
      button.setAttribute("aria-label", `Spalte ${col + 1} wählen`);
      button.addEventListener("click", () => chooseColumn(col));
      columnButtonsEl.appendChild(button);
    }
    for (let row = 0; row < ROWS; row += 1) {
      for (let col = 0; col < COLS; col += 1) {
        const cell = document.createElement("div");
        cell.className = "board-cell";
        cell.setAttribute("role", "gridcell");
        cell.dataset.row = row;
        cell.dataset.col = col;
        boardEl.appendChild(cell);
      }
    }
    renderBoard();
  }

  function renderBoard(highlight = []) {
    const highlighted = new Set(highlight.map(([r, c]) => `${r}-${c}`));
    [...boardEl.children].forEach((cell) => {
      const row = Number(cell.dataset.row);
      const col = Number(cell.dataset.col);
      const value = state.board[row][col];
      cell.className = "board-cell";
      if (value === 1 || value === 2) cell.classList.add(`player-${value}`);
      if (value === BLOCKED) cell.classList.add("blocked");
      if (value === null && state.failedAttempts[row][col] === 1) cell.classList.add("pending");
      if (highlighted.has(`${row}-${col}`)) cell.classList.add("winning");
      const labels = { 1: state.players[0].name, 2: state.players[1].name, x: "blockiert" };
      cell.setAttribute("aria-label", value ? labels[value] : state.failedAttempts[row][col] ? "frei, zweite Chance" : "frei");
    });
    [...columnButtonsEl.children].forEach((button, col) => {
      button.disabled = nextOpenRow(col) === -1 || state.totalTurns >= TURNS_PER_PLAYER * 2;
    });
  }

  function nextOpenRow(col) {
    for (let row = ROWS - 1; row >= 0; row -= 1) {
      if (state.board[row][col] === null) return row;
    }
    return -1;
  }

  function chooseColumn(col) {
    const row = nextOpenRow(col);
    if (row < 0 || activeQuestion) return;
    activeTarget = { row, col };
    activeQuestion = selectQuestion();
    openQuestion(activeQuestion);
  }

  function shuffle(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function selectQuestion() {
    const ownTurn = state.players[state.current].turns + 1;
    const question = state.decks[state.current][ownTurn - 1];
    state.usedQuestions.add(question.id);
    return question;
  }

  function openQuestion(question) {
    hintUsed = false;
    audioPlays = 0;
    orderedTokens = [];
    $("hintBox").hidden = true;
    $("hintBox").textContent = "";
    $("hintButton").disabled = false;
    $("questionMeta").textContent = `${question.category} · ${window.QUESTION_TYPES[question.type]} · Feld ${activeTarget.row * COLS + activeTarget.col + 1}`;
    $("questionTitle").textContent = question.prompt;
    updatePointsBadge();
    renderQuestionMedia(question);
    renderAnswerArea(question);
    questionModal.hidden = false;
    setTimeout(() => {
      const firstInput = $("answerArea").querySelector("input, button");
      if (firstInput) firstInput.focus();
    }, 20);
  }

  function renderQuestionMedia(question) {
    const media = $("questionMedia");
    media.innerHTML = "";
    if (question.type === "image") {
      const img = document.createElement("img");
      img.className = "question-image";
      img.src = question.image;
      img.alt = "Illustrierte Plaza-Szene mit zwei Jugendlichen, zwei Stühlen, einem Tisch und einem grünen Buch";
      media.appendChild(img);
    }
    if (question.type === "audio") {
      const panel = document.createElement("div");
      panel.className = "audio-panel";
      panel.innerHTML = `<button class="audio-button" type="button" aria-label="Hörtext abspielen">▶</button><div><strong>Hörtext abspielen</strong><small>Feste Aufnahme · Das erste Hören ist kostenlos. Ab dem zweiten Hören wird 1 Punkt abgezogen.</small></div>`;
      const button = panel.querySelector("button");
      button.addEventListener("click", () => playAudio(question, button));
      media.appendChild(panel);
    }
    if (question.type === "reading") {
      const panel = document.createElement("div");
      panel.className = "audio-panel";
      panel.innerHTML = `<div><strong>Texto</strong><span>${escapeHtml(question.stimulus)}</span></div>`;
      media.appendChild(panel);
    }
    if (question.vocab && question.vocab.length) {
      const vocab = document.createElement("div");
      vocab.className = "vocab-strip";
      vocab.innerHTML = `<strong>Vocabulario</strong>${question.vocab.map((item) => `<span><b>${escapeHtml(item.es)}</b> = ${escapeHtml(item.de)}</span>`).join("")}`;
      media.appendChild(vocab);
    }
  }

  function renderAnswerArea(question) {
    const area = $("answerArea");
    area.innerHTML = "";
    if (["choice", "image"].includes(question.type)) {
      area.appendChild(makeChoices(question.options, "answer"));
    } else if (question.type === "text") {
      const input = document.createElement("input");
      input.className = "text-answer";
      input.name = "textAnswer";
      input.autocomplete = "off";
      input.placeholder = "Antwort auf Spanisch eingeben";
      input.required = true;
      area.appendChild(input);
    } else if (question.type === "order") {
      const selected = document.createElement("div");
      selected.className = "multi-item";
      selected.id = "orderedOutput";
      selected.innerHTML = "<p>Dein Satz:</p><div class=\"teacher-options\" id=\"chosenTokens\"></div>";
      const bank = document.createElement("div");
      bank.className = "answer-grid";
      bank.id = "tokenBank";
      area.append(selected, bank);
      shuffle(question.tokens).forEach((token, index) => makeTokenButton(token, index, bank));
      updateOrderedTokens();
    } else if (question.challenge) {
      const multi = document.createElement("div");
      multi.className = "multi-questions";
      question.questions.forEach((item, index) => {
        const block = document.createElement("div");
        block.className = "multi-item";
        const prompt = document.createElement("p");
        prompt.textContent = `${index + 1}. ${item.prompt}`;
        block.append(prompt, makeChoices(item.options, `multi-${index}`));
        multi.appendChild(block);
      });
      area.appendChild(multi);
    }
  }

  function makeChoices(options, name) {
    const grid = document.createElement("div");
    grid.className = "answer-grid";
    options.forEach((option, index) => {
      const label = document.createElement("label");
      label.className = "answer-option";
      const input = document.createElement("input");
      input.type = "radio";
      input.name = name;
      input.value = option;
      input.required = true;
      const span = document.createElement("span");
      span.textContent = option;
      label.append(input, span);
      grid.appendChild(label);
      if (index === 0) input.dataset.first = "true";
    });
    return grid;
  }

  function makeTokenButton(token, index, bank) {
    const button = document.createElement("button");
    button.className = "secondary-button compact";
    button.type = "button";
    button.textContent = token;
    button.dataset.tokenId = String(index);
    button.addEventListener("click", () => {
      orderedTokens.push({ token, index });
      button.hidden = true;
      updateOrderedTokens();
    });
    bank.appendChild(button);
  }

  function updateOrderedTokens() {
    const output = $("chosenTokens");
    if (!output) return;
    output.innerHTML = "";
    if (!orderedTokens.length) {
      output.textContent = "Tippe die Bausteine in der richtigen Reihenfolge an.";
      return;
    }
    orderedTokens.forEach((item, position) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "teacher-option";
      button.textContent = item.token;
      button.addEventListener("click", () => {
        orderedTokens.splice(position, 1);
        const source = document.querySelector(`[data-token-id=\"${item.index}\"]`);
        if (source) source.hidden = false;
        updateOrderedTokens();
      });
      output.appendChild(button);
    });
  }

  function stopAudio() {
    if (activeAudio) {
      activeAudio.pause();
      activeAudio.currentTime = 0;
    }
    if (activeAudioButton) activeAudioButton.textContent = "▶";
    activeAudio = null;
    activeAudioButton = null;
  }

  function playAudio(question, button) {
    if (activeAudio && !activeAudio.paused) {
      stopAudio();
      return;
    }
    stopAudio();
    activeAudio = new Audio(question.audio);
    activeAudioButton = button;
    button.textContent = "■";
    audioPlays += 1;
    updatePointsBadge();
    activeAudio.addEventListener("ended", stopAudio, { once: true });
    activeAudio.addEventListener("error", stopAudio, { once: true });
    const playback = activeAudio.play();
    if (playback) playback.catch(stopAudio);
  }

  function normalize(value) {
    return String(value)
      .trim()
      .toLocaleLowerCase("es")
      .replace(/[¡!¿?.,;:]+/g, "")
      .replace(/\s+/g, " ");
  }

  function withoutAccents(value) {
    return normalize(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function evaluateText(value, answers) {
    const exact = answers.some((answer) => normalize(value) === normalize(answer));
    if (exact) return { correct: true, accentIssue: false };
    const accentMatch = answers.some((answer) => withoutAccents(value) === withoutAccents(answer));
    return { correct: accentMatch, accentIssue: accentMatch };
  }

  function evaluateQuestion(question) {
    if (["choice", "image"].includes(question.type)) {
      const selected = questionForm.elements.answer.value;
      return { rawCorrect: selected === question.answer ? 1 : 0, correct: selected === question.answer, points: selected === question.answer ? (hintUsed ? 1 : 2) : 0, accentIssue: false };
    }
    if (question.type === "text") {
      const result = evaluateText(questionForm.elements.textAnswer.value, question.answers);
      return { rawCorrect: result.correct ? 1 : 0, correct: result.correct, points: result.correct ? (hintUsed ? 1 : 2) : 0, accentIssue: result.accentIssue };
    }
    if (question.type === "order") {
      const result = evaluateText(orderedTokens.map((item) => item.token).join(" "), question.answers);
      return { rawCorrect: result.correct ? 1 : 0, correct: result.correct, points: result.correct ? (hintUsed ? 1 : 2) : 0, accentIssue: result.accentIssue };
    }
    const correctCount = question.questions.reduce((count, item, index) => {
      const field = questionForm.elements[`multi-${index}`];
      return count + (field && field.value === item.answer ? 1 : 0);
    }, 0);
    const penalty = (hintUsed ? 1 : 0) + (question.type === "audio" && audioPlays >= 2 ? 1 : 0);
    return { rawCorrect: correctCount, correct: correctCount >= 2, points: Math.max(0, correctCount - penalty), accentIssue: false };
  }

  function submitQuestion(event) {
    event.preventDefault();
    if (activeQuestion.type === "order" && orderedTokens.length !== activeQuestion.tokens.length) {
      $("orderedOutput").scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const result = evaluateQuestion(activeQuestion);
    stopAudio();
    questionModal.hidden = true;
    resolveTurn(result);
  }

  function resolveTurn(result) {
    const player = state.players[state.current];
    player.turns += 1;
    state.totalTurns += 1;
    player.score += result.points;
    if (result.correct) {
      state.board[activeTarget.row][activeTarget.col] = state.current + 1;
      const usedSecondChance = state.failedAttempts[activeTarget.row][activeTarget.col] === 1;
      state.failedAttempts[activeTarget.row][activeTarget.col] = 0;
      player.solved += 1;
      player.correctByCategory[activeQuestion.category] = (player.correctByCategory[activeQuestion.category] || 0) + 1;
      const newLines = detectNewLines(state.current, activeTarget.row, activeTarget.col);
      const linePoints = newLines.length * LINE_BONUS;
      player.score += linePoints;
      player.lines += newLines.length;
      renderBoard(newLines.flatMap((line) => line.cells));
      showFeedback(result, linePoints, newLines.length, false, usedSecondChance);
      tone(true);
    } else {
      const fieldBlocked = state.failedAttempts[activeTarget.row][activeTarget.col] === 1;
      if (fieldBlocked) {
        state.board[activeTarget.row][activeTarget.col] = BLOCKED;
        state.failedAttempts[activeTarget.row][activeTarget.col] = 0;
      } else {
        state.failedAttempts[activeTarget.row][activeTarget.col] = 1;
      }
      player.wrongByCategory[activeQuestion.category] = (player.wrongByCategory[activeQuestion.category] || 0) + 1;
      renderBoard();
      showFeedback(result, 0, 0, fieldBlocked, false);
      tone(false);
    }
    updateHud();
  }

  function detectNewLines(playerIndex, row, col) {
    const value = playerIndex + 1;
    const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
    const found = [];
    directions.forEach(([dr, dc]) => {
      for (let offset = -3; offset <= 0; offset += 1) {
        const cells = [];
        for (let i = 0; i < 4; i += 1) cells.push([row + (offset + i) * dr, col + (offset + i) * dc]);
        if (cells.every(([r, c]) => r >= 0 && r < ROWS && c >= 0 && c < COLS && state.board[r][c] === value)) {
          const key = cells.map(([r, c]) => `${r}-${c}`).sort().join("|");
          if (!state.scoredLines[playerIndex].has(key)) {
            state.scoredLines[playerIndex].add(key);
            found.push({ key, cells });
          }
        }
      }
    });
    return found;
  }

  function showFeedback(result, linePoints, lineCount, fieldBlocked, usedSecondChance) {
    const card = feedbackModal.querySelector(".feedback-card");
    card.classList.toggle("is-wrong", !result.correct);
    $("feedbackIcon").textContent = result.correct ? "✓" : (fieldBlocked ? "◆" : "?");
    $("feedbackKicker").textContent = result.correct
      ? (usedSecondChance ? "¡Segunda oportunidad aprovechada!" : "¡Muy bien!")
      : (fieldBlocked ? "Dieses Feld ist jetzt blockiert" : "Dieses Feld erhält eine zweite Chance");
    $("feedbackTitle").textContent = result.correct
      ? (lineCount ? "Viererreihe geschafft!" : "Richtig gelöst")
      : (fieldBlocked ? "Zweiter Versuch nicht gelöst" : "Noch nicht gelöst");
    const parts = [];
    if (result.points) parts.push(`+${result.points} ${result.points === 1 ? "Punkt" : "Punkte"}`);
    if (linePoints) parts.push(`+${linePoints} Reihenbonus`);
    if (!parts.length) parts.push("0 Punkte");
    $("feedbackPoints").textContent = parts.join(" · ");
    let explanation = `<strong>Lösung und Erklärung</strong><br>${activeQuestion.explanation}`;
    if (activeQuestion.challenge) explanation += `<br><br>${result.rawCorrect} von 3 Teilantworten waren richtig.`;
    if (!result.correct && !fieldBlocked) explanation += "<br><br><strong>Das Feld bleibt frei.</strong> Beim nächsten Versuch in dieser Spalte erscheint eine andere Aufgabe.";
    if (!result.correct && fieldBlocked) explanation += "<br><br><strong>Das Feld ist nach dem zweiten Fehler dauerhaft blockiert.</strong> Oberhalb kann weitergespielt werden.";
    if (result.accentIssue) explanation += `<p class="accent-note"><strong>Fast perfekt:</strong> Die Lösung zählt. Achte beim nächsten Mal noch auf Akzent oder Tilde, zum Beispiel bei español.</p>`;
    $("feedbackExplanation").innerHTML = explanation;
    feedbackModal.hidden = false;
  }

  function continueGame() {
    feedbackModal.hidden = true;
    activeQuestion = null;
    activeTarget = null;
    if (state.totalTurns >= TURNS_PER_PLAYER * 2) {
      finishGame();
      return;
    }
    state.current = state.current === 0 ? 1 : 0;
    updateHud();
    renderBoard();
  }

  function updateHud() {
    const currentPlayer = state.players[state.current];
    const round = Math.min(TURNS_PER_PLAYER, Math.floor(state.totalTurns / 2) + 1);
    $("roundNumber").textContent = round;
    $("turnName").textContent = currentPlayer.name;
    $("turnPill").classList.toggle("is-blue", state.current === 1);
    $("playerOneCard").classList.toggle("is-active", state.current === 0);
    $("playerTwoCard").classList.toggle("is-active", state.current === 1);
    state.players.forEach((player, index) => {
      $(`player${index === 0 ? "One" : "Two"}Score`).textContent = player.score;
      $(`player${index === 0 ? "One" : "Two"}Solved`).textContent = player.solved;
      $(`player${index === 0 ? "One" : "Two"}Lines`).textContent = player.lines;
    });
  }

  function finishGame() {
    const [a, b] = state.players;
    const draw = a.score === b.score;
    const winner = a.score > b.score ? a : b;
    $("resultTitle").textContent = draw ? "¡Empate!" : `¡Enhorabuena, ${winner.name}!`;
    $("resultLead").textContent = draw ? "Eine ausgeglichene Partie – beide Seiten haben gleich viele Punkte gesammelt." : `${winner.name} gewinnt nach 18 Zügen pro Seite.`;
    $("finalScores").innerHTML = state.players.map((player) => `<article class="final-score ${!draw && player === winner ? "winner" : ""}"><span>${escapeHtml(player.name)}</span><strong>${player.score}</strong><small>${player.solved} gelöst · ${player.lines} Viererreihen</small></article>`).join("");
    $("learningSummary").innerHTML = state.players.map((player) => {
      const strong = topCategory(player.correctByCategory, "Noch keine sichere Kategorie");
      const review = topCategory(player.wrongByCategory, "Keine auffällige Baustelle");
      return `<article class="summary-box"><h3>${escapeHtml(player.name)}</h3><p><strong>Sicher:</strong> ${escapeHtml(strong)}<br><strong>Noch einmal ansehen:</strong> ${escapeHtml(review)}</p></article>`;
    }).join("");
    showScreen($("resultScreen"));
  }

  function topCategory(record, fallback) {
    const entries = Object.entries(record);
    if (!entries.length) return fallback;
    return entries.sort((a, b) => b[1] - a[1])[0][0];
  }

  function showHint() {
    hintUsed = true;
    $("hintBox").hidden = false;
    $("hintBox").textContent = activeQuestion.hint;
    $("hintButton").disabled = true;
    updatePointsBadge();
  }

  function updatePointsBadge() {
    if (!activeQuestion) return;
    let maximum = activeQuestion.challenge ? 3 : 2;
    if (hintUsed) maximum -= 1;
    if (activeQuestion.type === "audio" && audioPlays >= 2) maximum -= 1;
    maximum = Math.max(0, maximum);
    const notes = [];
    if (hintUsed) notes.push("Pista");
    if (activeQuestion.type === "audio" && audioPlays >= 2) notes.push("erneut gehört");
    $("pointsBadge").textContent = `${notes.length ? `${notes.join(" + ")}: max. ` : "bis "}${maximum} ${maximum === 1 ? "Punkt" : "Punkte"}`;
  }

  function tone(success) {
    if (!soundEnabled || !(window.AudioContext || window.webkitAudioContext)) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain).connect(ctx.destination);
    osc.frequency.value = success ? 620 : 210;
    gain.gain.setValueAtTime(.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .22);
    osc.start();
    osc.stop(ctx.currentTime + .22);
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));
  }

  $("startButton").addEventListener("click", () => startGame(false));
  $("rematchButton").addEventListener("click", () => startGame(true));
  $("newGameButton").addEventListener("click", () => showScreen($("startScreen")));
  $("continueButton").addEventListener("click", continueGame);
  $("hintButton").addEventListener("click", showHint);
  questionForm.addEventListener("submit", submitQuestion);
  $("soundButton").addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    $("soundButton").textContent = soundEnabled ? "♪" : "×";
    $("soundButton").setAttribute("aria-label", soundEnabled ? "Töne ausschalten" : "Töne einschalten");
  });
  $("homeButton").addEventListener("click", () => {
    if (window.confirm("Möchtest du die laufende Partie verlassen?")) {
      stopAudio();
      showScreen($("startScreen"));
    }
  });
  $("openRulesButton").addEventListener("click", () => { $("rulesModal").hidden = false; });
  document.querySelectorAll("[data-close-rules]").forEach((button) => button.addEventListener("click", () => { $("rulesModal").hidden = true; }));
})();
