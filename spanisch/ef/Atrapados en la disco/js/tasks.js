// ============================================================================
// js/tasks.js
// ----------------------------------------------------------------------------
// Render-Logik für jeden Aufgabentyp aus content/aufgaben.js (siehe Schema
// dort). Jeder Eintrag in TASKS hat eine render(container, task, onSuccess,
// onWrong) Funktion, die die Aufgabe in "container" aufbaut. Optional gibt
// render() eine "dispose"-Funktion zurück (wird von UI.openTask beim
// Schließen aufgerufen, z. B. um einen laufenden Timer zu stoppen).
//
// Designentscheidung (iPad/Safari-Robustheit): Statt echtem HTML5-Drag&Drop
// (das native iOS Safari nicht unterstützt) verwenden dragMatch/reorder ein
// robustes "antippen statt ziehen"-Muster: Element antippen zum Auswählen,
// Ziel antippen zum Platzieren. Das ist auf Touchscreens zuverlässiger als
// Zeigergesten-Drag und erfüllt denselben didaktischen Zweck (Zuordnen).
//
// Alle Aufgaben erlauben unbegrenzte Versuche und geben konstruktives
// Feedback (nie ein hartes "Falsch").
// ============================================================================

function normalizeAnswer(str, ignoreCase, ignoreAccents) {
  let s = String(str).trim();
  if (ignoreCase) s = s.toLowerCase();
  if (ignoreAccents) s = s.normalize("NFD").replace(/[̀-ͯ]/g, "");
  return s;
}

function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function columnKeyFromLabel(label) {
  return label.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function feedbackNode(container) {
  let fb = container.querySelector(".task-feedback");
  if (!fb) {
    fb = UI.h("div", { class: "task-feedback" });
    container.appendChild(fb);
  }
  return fb;
}

function showFeedback(container, msgObj, isPositive) {
  const fb = feedbackNode(container);
  fb.textContent = msgObj.es;
  fb.className = "task-feedback visible " + (isPositive ? "positive" : "gentle");
  setTimeout(() => fb.classList.remove("visible"), 2200);
}

// Liefert beim ersten Fehler die allgemeine Ermutigung und danach – sofern
// vorhanden – zunehmend konkrete, aufgabenspezifische Hilfen.
function createWrongFeedback(task) {
  let attempts = 0;
  return function nextFeedback() {
    attempts++;
    const hints = Array.isArray(task.feedbackHints) ? task.feedbackHints : [];
    if (attempts === 1 || hints.length === 0) return TEXTE.systemMeldungen.casiInténtaloOtraVez;
    const hint = hints[Math.min(attempts - 2, hints.length - 1)];
    return { es: hint, de: task.hintDE || "" };
  };
}

const TASKS = {

  // ------------------------------------------------------------------
  multipleChoice: {
    render(container, task, onSuccess, onWrong) {
      const wrongFeedback = createWrongFeedback(task);
      const optionsWrap = UI.h("div", { class: "options-wrap" });
      // Reihenfolge der Antworten mischen, damit man sich beim wiederholten
      // Spielen nicht einfach die Position statt der Antwort merkt.
      const order = shuffleArray(task.options.map((_, i) => i));
      order.forEach((origIdx) => {
        const btn = UI.h("button", {
          class: "btn btn-option",
          onclick: () => {
            if (origIdx === task.correctIndex) {
              onSuccess();
            } else {
              onWrong();
              btn.classList.add("shake");
              setTimeout(() => btn.classList.remove("shake"), 400);
              showFeedback(container, wrongFeedback(), false);
            }
          }
        }, [task.options[origIdx]]);
        optionsWrap.appendChild(btn);
      });
      container.appendChild(optionsWrap);
      container.appendChild(UI.h("div", { class: "task-feedback" }));
    }
  },

  // ------------------------------------------------------------------
  // Mehrere Auswahlfragen bleiben als zusammenhängender Übungsblock in
  // demselben Fenster. Erst wenn alle Antworten gewählt wurden, wird der
  // gesamte Block überprüft.
  multipleChoiceSet: {
    render(container, task, onSuccess, onWrong) {
      const wrongFeedback = createWrongFeedback(task);
      const selections = new Array(task.questions.length).fill(null);
      const questionOrders = task.questions.map((question) =>
        shuffleArray(question.options.map((_, index) => index))
      );
      const wrap = UI.h("div", { class: "choice-set" });
      container.appendChild(wrap);

      function renderAll() {
        UI.clear(wrap);
        task.questions.forEach((question, questionIndex) => {
          const options = UI.h("div", { class: "choice-set-options" });
          questionOrders[questionIndex].forEach((originalIndex) => {
            options.appendChild(UI.h("button", {
              class: "btn btn-option" + (selections[questionIndex] === originalIndex ? " selected" : ""),
              type: "button",
              onclick: () => {
                selections[questionIndex] = originalIndex;
                renderAll();
              }
            }, [question.options[originalIndex]]));
          });
          wrap.appendChild(UI.h("section", { class: "choice-set-question" }, [
            UI.h("h4", { text: question.prompt }),
            options
          ]));
        });

        wrap.appendChild(UI.h("button", {
          class: "btn btn-primary btn-comprobar",
          type: "button",
          text: TEXTE.ui.botones.comprobar,
          onclick: () => {
            const complete = selections.every((selection) => selection !== null);
            const correct = complete && selections.every((selection, index) =>
              selection === task.questions[index].correctIndex
            );
            if (correct) onSuccess();
            else {
              onWrong();
              showFeedback(container, wrongFeedback(), false);
            }
          }
        }));
      }

      renderAll();
      container.appendChild(UI.h("div", { class: "task-feedback" }));
    }
  },

  // ------------------------------------------------------------------
  // listeningProfiles: mehrere lokale Hörtexte bilden eine gemeinsame
  // Hörstation. Die Antworten werden erst nach dem ersten Abspielen aktiv;
  // ein Transkript bleibt als freiwillige Hilfe erreichbar.
  // ------------------------------------------------------------------
  listeningProfiles: {
    render(container, task, onSuccess, onWrong) {
      let profileIndex = 0;
      let questionIndex = 0;
      let playCount = 0;
      let activeAudio = null;
      let disposed = false;
      const completed = [];
      const wrap = UI.h("div", { class: "listening-station" });
      container.appendChild(wrap);

      function stopAudio() {
        if (!activeAudio) return;
        activeAudio.pause();
        activeAudio.currentTime = 0;
        activeAudio = null;
      }

      function renderProfile() {
        if (disposed) return;
        stopAudio();
        UI.clear(wrap);
        const profile = task.profiles[profileIndex];
        const question = profile.questions[questionIndex];

        const audio = UI.h("audio", {
          src: profile.audio,
          preload: "metadata",
          playsinline: "playsinline"
        });
        activeAudio = audio;

        const status = UI.h("span", {
          class: "listening-status",
          text: playCount ? "Bereits angehört" : "Noch nicht angehört"
        });
        const answers = UI.h("div", { class: "options-wrap listening-options" });
        const transcript = UI.h("p", {
          class: "listening-transcript",
          text: profile.transcript,
          hidden: "hidden"
        });
        const transcriptButton = UI.h("button", {
          class: "btn btn-small listening-transcript-button",
          type: "button",
          text: "Transkript als Hilfe anzeigen",
          onclick: (event) => {
            const hidden = transcript.hasAttribute("hidden");
            if (hidden) transcript.removeAttribute("hidden");
            else transcript.setAttribute("hidden", "hidden");
            event.currentTarget.textContent = hidden ? "Transkript ausblenden" : "Transkript als Hilfe anzeigen";
          }
        });

        const playButton = UI.h("button", {
          class: "btn btn-primary listening-play-button",
          type: "button",
          text: "▶ Aufnahme abspielen",
          onclick: () => {
            audio.currentTime = 0;
            audio.play().then(() => {
              playCount += 1;
              status.textContent = playCount === 1 ? "Einmal angehört" : playCount + "-mal angehört";
              answers.querySelectorAll("button").forEach((button) => button.removeAttribute("disabled"));
              playButton.textContent = "↻ Noch einmal anhören";
            }).catch(() => {
              status.textContent = "Die Aufnahme konnte nicht gestartet werden.";
            });
          }
        });

        const order = shuffleArray(question.options.map((_, index) => index));
        order.forEach((originalIndex) => {
          const optionButton = UI.h("button", {
            class: "btn btn-option",
            disabled: playCount ? null : "true",
            onclick: () => {
              if (originalIndex !== question.correctIndex) {
                onWrong();
                optionButton.classList.add("shake");
                setTimeout(() => optionButton.classList.remove("shake"), 400);
                showFeedback(container, TEXTE.systemMeldungen.casiInténtaloOtraVez, false);
                return;
              }
              questionIndex += 1;
              if (questionIndex < profile.questions.length) {
                setTimeout(renderProfile, 240);
                return;
              }
              completed.push(profile.name);
              UI.showToast({ es: "¡Perfil completo!", de: "Gästekarte von " + profile.name + " vervollständigt." });
              profileIndex += 1;
              questionIndex = 0;
              playCount = 0;
              if (profileIndex >= task.profiles.length) {
                stopAudio();
                setTimeout(onSuccess, 280);
              } else {
                setTimeout(renderProfile, 300);
              }
            }
          }, [question.options[originalIndex]]);
          answers.appendChild(optionButton);
        });

        wrap.appendChild(UI.h("div", { class: "listening-progress" }, [
          UI.h("span", { text: "Sprachnachricht " + (profileIndex + 1) + "/" + task.profiles.length }),
          UI.h("span", { text: "Frage " + (questionIndex + 1) + "/" + profile.questions.length })
        ]));
        wrap.appendChild(UI.h("div", { class: "listening-card" }, [
          UI.h("div", { class: "listening-avatar", text: profile.name.slice(0, 1) }),
          UI.h("div", { class: "listening-controls" }, [
            UI.h("strong", { text: profile.name }),
            playButton,
            status,
            transcriptButton
          ]),
          audio
        ]));
        wrap.appendChild(transcript);
        wrap.appendChild(UI.h("h4", { class: "listening-question", text: question.prompt }));
        wrap.appendChild(answers);
        if (completed.length) {
          wrap.appendChild(UI.h("div", {
            class: "listening-completed",
            text: "✓ Fertige Gästekarten: " + completed.join(", ")
          }));
        }
      }

      renderProfile();
      container.appendChild(UI.h("div", { class: "task-feedback" }));
      return () => {
        disposed = true;
        stopAudio();
      };
    }
  },

  // ------------------------------------------------------------------
  dragMatch: {
    render(container, task, onSuccess, onWrong) {
      const wrongFeedback = createWrongFeedback(task);
      const assignments = {}; // bucket -> [itemText,...]
      task.buckets.forEach((b) => (assignments[b] = []));
      const originalPool = task.items.map((it) => it.text);
      let pool = shuffleArray(originalPool);
      // Auch hier darf die Zufallsmischung nicht ausgerechnet wieder die
      // redaktionelle Lösungsreihenfolge ergeben.
      if (pool.length > 1 && pool.every((text, index) => text === originalPool[index])) {
        pool = pool.slice(1).concat(pool[0]);
      }
      let selected = null;

      const wrap = UI.h("div", { class: "dragmatch-wrap" });
      container.appendChild(wrap);

      const usesPins = Array.isArray(task.bucketPositions) && task.bucketPositions.length > 0;

      function assignSelected(bucket) {
        if (!selected) return;
        assignments[bucket].push(selected);
        pool.splice(pool.indexOf(selected), 1);
        selected = null;
        renderAll();
      }

      function itemChip(text, where) {
        return UI.h("button", {
          class: "chip" + (selected === text ? " selected" : ""),
          onclick: () => {
            if (where === "pool") {
              selected = selected === text ? null : text;
            } else {
              // Chip zurück in den Pool holen
              const bucketArr = assignments[where];
              bucketArr.splice(bucketArr.indexOf(text), 1);
              pool.push(text);
              selected = null;
            }
            renderAll();
          }
        }, [text]);
      }

      function renderAll() {
        UI.clear(wrap);

        const poolBox = UI.h("div", { class: "chip-pool" },
          pool.length ? pool.map((t) => itemChip(t, "pool")) : [UI.h("span", { class: "muted", text: "Alles zugeordnet!" })]
        );
        wrap.appendChild(UI.h("div", { class: "dragmatch-pool-label", text: "Tippe zuerst auf eine Karte und danach auf die passende Gruppe:" }));
        wrap.appendChild(poolBox);

        if (usesPins) {
          const scene = UI.h("div", { class: "scene-pin-area" });
          scene.appendChild(UI.createImageOrPlaceholder(task.sceneBackground, task.sceneLabel || "[escena]", "scene-pin-bg"));
          task.bucketPositions.forEach((bp) => {
            const pin = UI.h("div", {
              class: "map-pin",
              style: "left:" + bp.x + "%; top:" + bp.y + "%;"
            }, [
              UI.h("button", {
                class: "map-pin-target",
                "data-bucket": bp.bucket,
                "aria-label": "Asignar a " + bp.bucket,
                onclick: () => assignSelected(bp.bucket)
              }, [
                UI.h("span", { class: "map-pin-dot" }),
                UI.h("span", { class: "map-pin-label" }, [bp.bucket])
              ])
            ]);
            scene.appendChild(pin);
          });
          wrap.appendChild(scene);
          wrap.appendChild(UI.h("div", { class: "map-assignments" }, task.buckets.map((bucket) =>
            UI.h("div", { class: "map-assignment-row" }, [
              UI.h("span", { class: "map-assignment-label", text: bucket }),
              ...assignments[bucket].map((text) => itemChip(text, bucket))
            ])
          )));
        } else {
          const bucketsWrap = UI.h("div", { class: "buckets-wrap" });
          task.buckets.forEach((b) => {
            bucketsWrap.appendChild(UI.h("div", {
              class: "bucket"
            }, [
              UI.h("button", {
                class: "bucket-target",
                "data-bucket": b,
                "aria-label": "Asignar a " + b,
                onclick: () => assignSelected(b)
              }, [b]),
              UI.h("div", { class: "bucket-items" }, assignments[b].map((t) => itemChip(t, b)))
            ]));
          });
          wrap.appendChild(bucketsWrap);
        }

        wrap.appendChild(UI.h("button", {
          class: "btn btn-primary btn-comprobar",
          text: TEXTE.ui.botones.comprobar,
          onclick: () => {
            const allCorrect = task.items.every((it) => assignments[it.bucket].indexOf(it.text) !== -1);
            const allPlaced = pool.length === 0;
            if (allCorrect && allPlaced) {
              onSuccess();
            } else {
              onWrong();
              showFeedback(container, wrongFeedback(), false);
            }
          }
        }));
      }
      renderAll();
      container.appendChild(UI.h("div", { class: "task-feedback" }));
    }
  },

  // ------------------------------------------------------------------
  fillBlankChips: {
    render(container, task, onSuccess, onWrong) {
      const wrongFeedback = createWrongFeedback(task);
      const correctChips = task.correctChips || [task.correctChip];
      const blankCount = correctChips.length;
      const filled = new Array(blankCount).fill(null);
      // Pro Öffnen einmal mischen und danach stabil lassen. So ist die
      // Wortbank nie bereits als Lösung sortiert, springt aber beim Antippen
      // auch nicht störend an eine neue Position.
      let randomizedWordBank = shuffleArray(task.wordBank);
      // Bei kleinen Wortbanken kann ein korrektes Mischen zufällig wieder die
      // Ausgangsreihenfolge ergeben. Dann wird bewusst rotiert, damit etwa
      // die Verbendungen nie bereits als fertige Lösung dastehen.
      if (randomizedWordBank.length > 1 && randomizedWordBank.every((word, index) => word === task.wordBank[index])) {
        randomizedWordBank = randomizedWordBank.slice(1).concat(randomizedWordBank[0]);
      }
      let blankIndexCounter;

      const wrap = UI.h("div", { class: "fillblank-wrap" });
      container.appendChild(wrap);

      function renderAll() {
        UI.clear(wrap);
        blankIndexCounter = -1;
        const sentence = UI.h("div", { class: "fillblank-sentence" });
        task.promptParts.forEach((part) => {
          if (part === "___") {
            blankIndexCounter++;
            const idx = blankIndexCounter;
            sentence.appendChild(UI.h("button", {
              class: "blank-slot" + (filled[idx] ? " filled" : ""),
              onclick: () => { filled[idx] = null; renderAll(); }
            }, [filled[idx] || "___"]));
          } else {
            sentence.appendChild(document.createTextNode(part));
          }
        });
        wrap.appendChild(sentence);

        const bank = UI.h("div", { class: "chip-pool" }, randomizedWordBank.map((word) =>
          UI.h("button", {
            class: "chip",
            onclick: () => {
              const firstEmpty = filled.indexOf(null);
              if (firstEmpty !== -1) { filled[firstEmpty] = word; renderAll(); }
            }
          }, [word])
        ));
        wrap.appendChild(UI.h("div", { class: "dragmatch-pool-label", text: "Tippe auf ein Wort, um es in die nächste freie Lücke einzusetzen:" }));
        wrap.appendChild(bank);

        wrap.appendChild(UI.h("button", {
          class: "btn btn-primary btn-comprobar",
          text: TEXTE.ui.botones.comprobar,
          onclick: () => {
            const allFilled = filled.every((f) => f !== null);
            const allCorrect = allFilled && filled.every((f, i) => f === correctChips[i]);
            if (allCorrect) onSuccess();
            else {
              onWrong();
              showFeedback(container, wrongFeedback(), false);
            }
          }
        }));
      }
      renderAll();
      container.appendChild(UI.h("div", { class: "task-feedback" }));
    }
  },

  // ------------------------------------------------------------------
  fillBlankText: {
    render(container, task, onSuccess, onWrong) {
      const wrongFeedback = createWrongFeedback(task);
      const sentence = UI.h("div", { class: "fillblank-sentence" });
      const input = UI.h("input", { type: "text", class: "text-input", autocapitalize: "none", autocorrect: "off", spellcheck: "false" });
      task.promptParts.forEach((part) => {
        if (part === "___") sentence.appendChild(input);
        else sentence.appendChild(document.createTextNode(part));
      });
      container.appendChild(sentence);

      function check() {
        const norm = normalizeAnswer(input.value, task.ignoreCase !== false, task.ignoreAccents !== false);
        const isCorrect = task.acceptedAnswers.some((a) => normalizeAnswer(a, task.ignoreCase !== false, task.ignoreAccents !== false) === norm);
        if (isCorrect && norm.length > 0) {
          onSuccess();
        } else {
          onWrong();
          showFeedback(container, wrongFeedback(), false);
        }
      }

      input.addEventListener("keydown", (e) => { if (e.key === "Enter") check(); });
      container.appendChild(UI.h("button", { class: "btn btn-primary btn-comprobar", text: TEXTE.ui.botones.comprobar, onclick: check }));
      container.appendChild(UI.h("div", { class: "task-feedback" }));
    }
  },

  // ------------------------------------------------------------------
  reorder: {
    render(container, task, onSuccess, onWrong) {
      const wrongFeedback = createWrongFeedback(task);
      let order = shuffleArray(task.correctOrder);
      const wrap = UI.h("div", { class: "reorder-wrap" });
      container.appendChild(wrap);

      function move(i, dir) {
        const j = i + dir;
        if (j < 0 || j >= order.length) return;
        [order[i], order[j]] = [order[j], order[i]];
        renderAll();
      }

      function renderAll() {
        UI.clear(wrap);
        order.forEach((line, i) => {
          wrap.appendChild(UI.h("div", { class: "reorder-row" }, [
            UI.h("span", { class: "reorder-index", text: (i + 1) + "." }),
            UI.h("span", { class: "reorder-text", text: line }),
            UI.h("div", { class: "reorder-buttons" }, [
              UI.h("button", { class: "btn btn-small", "aria-label": "Subir", disabled: i === 0 ? "true" : null, onclick: () => move(i, -1) }, ["▲"]),
              UI.h("button", { class: "btn btn-small", "aria-label": "Bajar", disabled: i === order.length - 1 ? "true" : null, onclick: () => move(i, 1) }, ["▼"])
            ])
          ]));
        });
        wrap.appendChild(UI.h("button", {
          class: "btn btn-primary btn-comprobar",
          text: TEXTE.ui.botones.comprobar,
          onclick: () => {
            const isCorrect = order.every((line, i) => line === task.correctOrder[i]);
            if (isCorrect) onSuccess();
            else {
              onWrong();
              showFeedback(container, wrongFeedback(), false);
            }
          }
        }));
      }
      renderAll();
      container.appendChild(UI.h("div", { class: "task-feedback" }));
    }
  },

  // ------------------------------------------------------------------
  memoryMatch: {
    render(container, task, onSuccess, onWrong) {
      const wrongFeedback = createWrongFeedback(task);
      const keys = task.columns.map(columnKeyFromLabel);
      const columnsData = keys.map((key) => shuffleArray(task.pairs.map((p, idx) => ({ idx, text: p[key] }))));
      const matched = new Set();
      const selected = new Array(keys.length).fill(null);

      const wrap = UI.h("div", { class: "memory-wrap" });
      container.appendChild(wrap);

      function renderAll() {
        UI.clear(wrap);
        const cols = UI.h("div", { class: "memory-columns" });
        task.columns.forEach((label, c) => {
          const colBox = UI.h("div", { class: "memory-column" }, [
            UI.h("div", { class: "memory-column-title", text: label })
          ]);
          columnsData[c].forEach((card) => {
            const isMatched = matched.has(card.idx);
            const isSelected = selected[c] === card.idx;
            colBox.appendChild(UI.h("button", {
              class: "memory-card" + (isMatched ? " matched" : "") + (isSelected ? " selected" : ""),
              disabled: isMatched ? "true" : null,
              onclick: () => {
                selected[c] = isSelected ? null : card.idx;
                if (selected.every((s) => s !== null)) {
                  const allSame = selected.every((s) => s === selected[0]);
                  if (allSame) {
                    matched.add(selected[0]);
                    selected.fill(null);
                    if (matched.size === task.pairs.length) {
                      renderAll();
                      setTimeout(onSuccess, 400);
                      return;
                    }
                  } else {
                    onWrong();
                    showFeedback(container, wrongFeedback(), false);
                    selected.fill(null);
                  }
                }
                renderAll();
              }
            }, [card.text]));
          });
          cols.appendChild(colBox);
        });
        wrap.appendChild(cols);
      }
      renderAll();
      container.appendChild(UI.h("div", { class: "task-feedback" }));
    }
  },

  // ------------------------------------------------------------------
  hotspotClick: {
    render(container, task, onSuccess, onWrong) {
      const wrongFeedback = createWrongFeedback(task);
      const selectedIds = new Set();
      const scene = UI.h("div", { class: "hotspot-scene" });
      scene.appendChild(UI.createImageOrPlaceholder(task.sceneBackground || "", task.sceneLabel || "[escena]", "hotspot-bg"));

      const choices = UI.h("div", { class: "hotspot-choice-grid" });

      function toggleHotspot(id) {
        if (selectedIds.has(id)) selectedIds.delete(id);
        else selectedIds.add(id);
        renderHotspots();
      }

      function renderHotspots() {
        scene.querySelectorAll(".hotspot-marker").forEach((n) => n.remove());
        UI.clear(choices);
        task.hotspots.forEach((h, index) => {
          const marker = UI.h("span", {
            class: "hotspot-marker" + (selectedIds.has(h.id) ? " selected" : ""),
            style: "left:" + h.x + "%; top:" + h.y + "%;",
            "aria-hidden": "true",
            text: String(index + 1)
          });
          scene.appendChild(marker);
          choices.appendChild(UI.h("button", {
            class: "hotspot-choice" + (selectedIds.has(h.id) ? " selected" : ""),
            type: "button",
            "aria-pressed": selectedIds.has(h.id) ? "true" : "false",
            onclick: () => toggleHotspot(h.id)
          }, [String(index + 1) + " · " + (h.label || h.id)]));
        });
      }
      renderHotspots();
      container.appendChild(scene);
      container.appendChild(choices);
      container.appendChild(UI.h("button", {
        class: "btn btn-primary btn-comprobar",
        text: TEXTE.ui.botones.comprobar,
        onclick: () => {
          const isCorrect = task.hotspots.every((h) => selectedIds.has(h.id) === !!h.correct);
          if (isCorrect) onSuccess();
          else {
            onWrong();
            showFeedback(container, wrongFeedback(), false);
          }
        }
      }));
      container.appendChild(UI.h("div", { class: "task-feedback" }));
    }
  },

  // ------------------------------------------------------------------
  // quizRound: Bündel von Fragen mit Countdown pro Frage. Eine nicht gelöste
  // Frage wandert ans Ende der Runde, statt alle bereits richtigen Antworten
  // zu löschen.
  // ------------------------------------------------------------------
  quizRound: {
    render(container, task, onSuccess, onWrong) {
      const questionQueue = task.questions.map((_, index) => index);
      let queuePosition = 0;
      let streak = 0;
      let intervalId = null;
      const totalMs = (task.timePerQuestionSeconds || 12) * 1000;
      let remainingMs = totalMs;

      const wrap = UI.h("div", { class: "quiz-wrap" });
      container.appendChild(wrap);

      function clearTimer() {
        if (intervalId) { clearInterval(intervalId); intervalId = null; }
      }

      function retryQuestionLater(reasonMsg) {
        clearTimer();
        questionQueue.push(questionQueue[queuePosition]);
        queuePosition += 1;
        streak = 0;
        UI.showToast(reasonMsg);
        UI.showToast({ es: "La pregunta vuelve al final.", de: "Diese Frage kommt am Ende noch einmal." });
        setTimeout(renderQuestion, 350);
      }

      function renderQuestion() {
        clearTimer();
        remainingMs = totalMs;
        UI.clear(wrap);
        const q = task.questions[questionQueue[queuePosition]];
        const openCount = questionQueue.length - queuePosition;

        const headerRow = UI.h("div", { class: "quiz-header" }, [
          UI.h("span", { class: "quiz-progress", text: "Noch offen: " + openCount }),
          streak >= 2 ? UI.h("span", { class: "quiz-streak", text: "🔥 ¡Racha de " + streak + "!" }) : null
        ]);
        wrap.appendChild(headerRow);

        const timerOuter = UI.h("div", { class: "quiz-timer-outer" });
        const timerInner = UI.h("div", { class: "quiz-timer-inner" });
        timerOuter.appendChild(timerInner);
        wrap.appendChild(timerOuter);

        wrap.appendChild(UI.h("div", { class: "quiz-question", text: q.prompt }));
        const optsWrap = UI.h("div", { class: "options-wrap" });
        const order = shuffleArray(q.options.map((_, i) => i));
        order.forEach((origIdx) => {
          optsWrap.appendChild(UI.h("button", {
            class: "btn btn-option",
            onclick: () => {
              clearTimer();
              if (origIdx === q.correctIndex) {
                streak++;
                UI.playCorrect();
                queuePosition++;
                if (queuePosition >= questionQueue.length) {
                  setTimeout(onSuccess, 250);
                } else {
                  setTimeout(renderQuestion, 350);
                }
              } else {
                UI.playWrong();
                retryQuestionLater(TEXTE.systemMeldungen.casiInténtaloOtraVez);
              }
            }
          }, [q.options[origIdx]]));
        });
        wrap.appendChild(optsWrap);

        const tickMs = 100;
        intervalId = setInterval(() => {
          remainingMs -= tickMs;
          const frac = Math.max(0, remainingMs / totalMs);
          timerInner.style.width = (frac * 100) + "%";
          timerInner.className = "quiz-timer-inner " + (frac < 0.2 ? "danger" : frac < 0.5 ? "warn" : "");
          if (remainingMs <= 0) {
            UI.playWrong();
            retryQuestionLater(TEXTE.systemMeldungen.tiempoAgotado);
          }
        }, tickMs);
      }

      renderQuestion();
      return function dispose() { clearTimer(); };
    }
  }
};
