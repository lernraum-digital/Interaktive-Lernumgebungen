// ============================================================================
// js/ui.js
// ----------------------------------------------------------------------------
// Rendering-Schicht: baut alle Bildschirme, Karten, Dialoge und Aufgaben-UI
// als DOM-Elemente. Ruft für alle Zustandsänderungen Funktionen aus
// js/game.js auf. Enthält keine Lerninhalte (die kommen aus content/*.js).
// ============================================================================

const UI = {
  appRoot: null,
  currentTaskDispose: null,
  modalRoot: null,
  toastRoot: null,
  audioCtx: null,

  init() {
    this.appRoot = document.getElementById("app");
    this.modalRoot = document.getElementById("modal-root");
    this.toastRoot = document.getElementById("toast-root");

    const teacherMode = new URLSearchParams(window.location.search).get("lehrkraft") === "1"
      || document.body.dataset.teacherMode === "true";
    GAME.setTeacherMode(teacherMode);

    if (teacherMode) {
      GAME.state = GAME.load() || GAME.createTeacherState();
      GAME.save();
      document.body.classList.add("teacher-mode");
      this.renderHub();
      return;
    }

    if (!GAME.hasSave()) {
      GAME.startNewGame("");
      this.renderAvatarScreen();
    } else {
      GAME.state = GAME.load();
      if (!GAME.state.avatar) {
        // Betrifft auch ältere Spielstände von vor der Avatar-Funktion.
        this.renderAvatarScreen();
      } else if (!GAME.state.gameMode) {
        this.renderModeScreen();
      } else if (!GAME.state.introSeen) {
        this.renderIntro();
      } else {
        this.renderHub();
      }
    }
  },

  // ------------------------------------------------------------------
  // Kleine DOM-Helfer
  // ------------------------------------------------------------------
  h(tag, props, children) {
    const el = document.createElement(tag);
    props = props || {};
    Object.keys(props).forEach((key) => {
      if (key === "class") el.className = props[key];
      else if (key === "text") el.textContent = props[key];
      else if (key.indexOf("on") === 0 && typeof props[key] === "function") {
        el.addEventListener(key.slice(2).toLowerCase(), props[key]);
      } else if (key === "html") {
        el.innerHTML = props[key];
      } else if (props[key] === null || props[key] === undefined || props[key] === false) {
        // Attribut absichtlich weglassen (z. B. "disabled: null" => nicht deaktiviert)
      } else {
        el.setAttribute(key, props[key]);
      }
    });
    (children || []).forEach((c) => {
      if (c === null || c === undefined) return;
      if (typeof c === "string") el.appendChild(document.createTextNode(c));
      else el.appendChild(c);
    });
    return el;
  },

  clear(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  },

  // Erstellt ein <img>, das automatisch auf ein Textplatzhalter-Feld
  // zurückfällt, wenn die Datei (noch) nicht existiert. So bleibt das
  // Spiel ohne fertige Grafiken vollständig spielbar.
  createImageOrPlaceholder(src, label, className) {
    const wrap = this.h("div", { class: (className || "") + " placeholder-wrap" });
    const img = document.createElement("img");
    img.className = className || "";
    img.alt = label || "";
    img.addEventListener("error", () => {
      img.remove();
      wrap.classList.add("placeholder-fallback");
      wrap.appendChild(this.h("span", { class: "placeholder-label", text: label || "[imagen]" }));
    });
    img.src = src;
    wrap.appendChild(img);
    return wrap;
  },

  // Kleines "?"-Icon, das auf Tap eine deutsche Erklärung als Tooltip/Modal zeigt.
  hintButton(hintDE) {
    if (!hintDE) return null;
    const btn = this.h("button", {
      class: "hint-btn",
      "aria-label": "Deutsche Hilfe",
      type: "button",
      onclick: (e) => {
        e.stopPropagation();
        this.showHintPopover(btn, hintDE);
      }
    }, ["?"]);
    return btn;
  },

  showHintPopover(anchor, textDE) {
    const existing = document.querySelector(".hint-popover");
    if (existing) existing.remove();
    const pop = this.h("div", { class: "hint-popover" }, [
      this.h("div", { class: "hint-popover-label", text: "Deutsche Hilfe" }),
      this.h("div", { class: "hint-popover-text", text: textDE }),
      this.h("button", { class: "btn btn-small", text: "Schließen", onclick: () => pop.remove() })
    ]);
    document.body.appendChild(pop);
    const rect = anchor.getBoundingClientRect();
    const top = Math.min(window.innerHeight - 140, rect.bottom + 8);
    const left = Math.min(window.innerWidth - 280, Math.max(8, rect.left - 100));
    pop.style.top = top + window.scrollY + "px";
    pop.style.left = left + "px";
    const closeOnOutside = (ev) => {
      if (!pop.contains(ev.target) && ev.target !== anchor) {
        pop.remove();
        document.removeEventListener("click", closeOnOutside, true);
      }
    };
    setTimeout(() => document.addEventListener("click", closeOnOutside, true), 0);
  },

  showToast(msgObj) {
    const toast = this.h("div", { class: "toast" }, [
      this.h("span", { class: "toast-es", text: msgObj.es }),
      msgObj.de ? this.h("span", { class: "toast-de", text: msgObj.de }) : null,
    ]);
    this.toastRoot.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("visible"));
    setTimeout(() => {
      toast.classList.remove("visible");
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  },

  // ------------------------------------------------------------------
  // Konfetti — kleine Feier-Animation, wenn ein Bereich abgeschlossen wird.
  // Reines CSS/JS, keine Bibliothek nötig.
  // ------------------------------------------------------------------
  triggerConfetti() {
    const colors = ["#ff3d81", "#ffc93d", "#35d0ba", "#8a7dff", "#35c98d"];
    const container = this.h("div", { class: "confetti-layer" });
    const pieceCount = 40;
    for (let i = 0; i < pieceCount; i++) {
      const piece = this.h("div", { class: "confetti-piece" });
      const left = Math.random() * 100;
      const delay = Math.random() * 0.3;
      const duration = 1.6 + Math.random() * 1.1;
      const rotate = Math.random() * 360;
      const color = colors[i % colors.length];
      piece.style.left = left + "vw";
      piece.style.backgroundColor = color;
      piece.style.animationDelay = delay + "s";
      piece.style.animationDuration = duration + "s";
      piece.style.transform = "rotate(" + rotate + "deg)";
      container.appendChild(piece);
    }
    document.body.appendChild(container);
    setTimeout(() => container.remove(), 3200);
  },

  // ------------------------------------------------------------------
  // Sound (optional, ohne Autoplay, nur nach Nutzer-Interaktion)
  // ------------------------------------------------------------------
  ensureAudio() {
    if (!this.audioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) this.audioCtx = new Ctx();
    }
    return this.audioCtx;
  },

  playTone(freq, durationMs) {
    if (!GAME.state || !GAME.state.soundEnabled) return;
    const ctx = this.ensureAudio();
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = freq;
    osc.type = "sine";
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationMs / 1000);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + durationMs / 1000);
  },
  playCorrect() { this.playTone(880, 180); setTimeout(() => this.playTone(1175, 200), 120); },
  playWrong() { this.playTone(220, 220); },
  playTick() { this.playTone(500, 60); },

  toggleSound() {
    GAME.state.soundEnabled = !GAME.state.soundEnabled;
    GAME.save();
    if (GAME.state.soundEnabled) this.ensureAudio();
  },

  // ==================================================================
  // BILDSCHIRM: Namenseingabe
  // ==================================================================
  renderNameScreen() {
    this.clear(this.appRoot);
    const t = TEXTE.ui.nombreEingabe;
    let value = "";
    const input = this.h("input", {
      type: "text",
      class: "name-input",
      placeholder: t.placeholder,
      maxlength: "20",
      autocapitalize: "words"
    });
    const goBtn = this.h("button", {
      class: "btn btn-primary btn-large",
      text: t.boton,
      onclick: () => {
        const name = input.value.trim() || "Jugador/a";
        GAME.startNewGame(name);
        this.renderAvatarScreen();
      }
    });
    const screen = this.h("div", { class: "screen center-screen" }, [
      this.h("div", { class: "card name-card" }, [
        this.h("div", { class: "row-inline" }, [
          this.h("h1", { text: t.titel }),
          this.hintButton(t.hintDE)
        ]),
        this.h("p", { text: t.hint }),
        input,
        goBtn
      ])
    ]);
    this.appRoot.appendChild(screen);
    input.focus();
  },

  // ==================================================================
  // BILDSCHIRM: Avatar-Auswahl (2 chicos, 2 chicas)
  // ==================================================================
  renderAvatarScreen() {
    this.clear(this.appRoot);
    const t = TEXTE.ui.avatarEingabe;
    let selected = null;

    const grid = this.h("div", { class: "avatar-grid" });
    const goBtn = this.h("button", {
      class: "btn btn-primary btn-large",
      text: t.boton,
      disabled: true,
      onclick: () => {
        if (!selected) return;
        GAME.setAvatar(selected);
        if (!GAME.state.gameMode) this.renderModeScreen();
        else if (!GAME.state.introSeen) this.renderIntro();
        else this.renderHub();
      }
    });

    TEXTE.avatares.forEach((av) => {
      const card = this.h("button", {
        class: "avatar-card",
        onclick: () => {
          selected = av.id;
          grid.querySelectorAll(".avatar-card").forEach((c) => c.classList.remove("selected"));
          card.classList.add("selected");
          goBtn.removeAttribute("disabled");
        }
      }, [
        this.createImageOrPlaceholder("assets/sprites/avatar/avatar_" + av.id + ".png", "[" + av.nombre + "]", "avatar-card-img"),
        this.h("div", { class: "avatar-card-name", text: av.nombre })
      ]);
      grid.appendChild(card);
    });

    const screen = this.h("div", { class: "screen center-screen" }, [
      this.h("div", { class: "card avatar-screen-card" }, [
        this.h("div", { class: "row-inline" }, [
          this.h("h1", { text: t.titel }),
          this.hintButton(t.hintDE)
        ]),
        this.h("p", { text: t.hint }),
        grid,
        goBtn
      ])
    ]);
    this.appRoot.appendChild(screen);
  },

  // ==================================================================
  // BILDSCHIRM: Umfang des Trainings
  // ==================================================================
  renderModeScreen() {
    this.clear(this.appRoot);
    const t = TEXTE.ui.modusAuswahl;
    const modeCard = (mode, title, duration, description, icon) => this.h("button", {
      class: "mode-card mode-card-" + mode,
      onclick: () => {
        GAME.setGameMode(mode);
        if (!GAME.state.introSeen) this.renderIntro();
        else this.renderHub();
      }
    }, [
      this.h("span", { class: "mode-card-icon", text: icon }),
      this.h("span", { class: "mode-card-title", text: title }),
      this.h("span", { class: "mode-card-duration", text: duration }),
      this.h("span", { class: "mode-card-description", text: description })
    ]);

    const screen = this.h("div", { class: "screen center-screen" }, [
      this.h("div", { class: "card mode-screen-card" }, [
        this.h("h1", { text: t.titel }),
        this.h("p", { text: t.untertitel }),
        this.h("div", { class: "mode-grid" }, [
          modeCard("core", t.coreTitel, t.coreDauer, t.coreText, "⏱️"),
          modeCard("full", t.fullTitel, t.fullDauer, t.fullText, "🎓")
        ])
      ])
    ]);
    this.appRoot.appendChild(screen);
  },

  // ==================================================================
  // BILDSCHIRM: Einleitung (Deutsch, Rahmenhandlung)
  // ==================================================================
  renderIntro() {
    this.clear(this.appRoot);
    const s = TEXTE.story.intro;
    const paragraphs = s.absaetze.map(() => this.h("p", { class: "intro-paragraph" }));
    const startButton = this.h("button", {
      class: "btn btn-primary btn-large intro-start-btn",
      text: s.button,
      hidden: "hidden",
      onclick: () => {
        GAME.state.introSeen = true;
        GAME.save();
        this.renderHub();
      }
    });
    const screen = this.h("div", { class: "screen intro-screen" }, [
      this.createImageOrPlaceholder(this.backgroundAsset("hub"), "[Eingang der Disco]", "intro-background"),
      this.h("div", { class: "intro-shade" }),
      this.h("div", { class: "intro-layout" }, [
        this.h("div", { class: "intro-story-panel" }, [
          this.h("div", { class: "pixel-kicker", text: "MADRID · 23:57 UHR" }),
          this.h("h1", { text: s.titel }),
          this.h("div", { class: "intro-copy" }, paragraphs),
          startButton
        ])
      ])
    ]);
    this.appRoot.appendChild(screen);

    const revealInstantly = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (revealInstantly) {
      paragraphs.forEach((node, index) => { node.textContent = s.absaetze[index]; });
      startButton.removeAttribute("hidden");
      return;
    }

    let paragraphIndex = 0;
    let characterIndex = 0;
    const typeNextCharacter = () => {
      if (!document.body.contains(screen)) return;
      if (paragraphIndex >= s.absaetze.length) {
        paragraphs.forEach((node) => node.classList.remove("typing"));
        startButton.removeAttribute("hidden");
        startButton.focus({ preventScroll: true });
        return;
      }
      const node = paragraphs[paragraphIndex];
      const text = s.absaetze[paragraphIndex];
      node.classList.add("typing");
      node.textContent = text.slice(0, characterIndex + 1);
      characterIndex += 1;
      if (characterIndex >= text.length) {
        node.classList.remove("typing");
        paragraphIndex += 1;
        characterIndex = 0;
        setTimeout(typeNextCharacter, 260);
      } else {
        setTimeout(typeNextCharacter, 18);
      }
    };
    setTimeout(typeNextCharacter, 450);
  },

  // ==================================================================
  // TOP BAR (gemeinsam für Hub + Szenen)
  // ==================================================================
  renderTopBar(showBackToHub) {
    const b = TEXTE.ui.botones;
    const avatar = GAME.getAvatar();
    const avatarBadge = avatar
      ? this.createImageOrPlaceholder("assets/sprites/avatar/avatar_" + avatar.id + ".png", "[" + avatar.nombre + "]", "topbar-avatar")
      : null;
    if (avatarBadge && avatar) {
      avatarBadge.appendChild(this.h("span", { class: "topbar-avatar-name", text: avatar.nombre }));
    }
    const bar = this.h("div", { class: "topbar" }, [
      this.h("div", { class: "topbar-left" }, [
        avatarBadge,
        this.h("div", { class: "topbar-stats" }, [
          this.h("div", { class: "topbar-points" }, ["⭐ " + GAME.state.points]),
          !GAME.teacherMode ? this.h("div", {
            class: "topbar-mode",
            text: GAME.isCoreMode() ? "⏱️ 30 Min." : "🎓 Komplett"
          }) : null
        ])
      ]),
      this.h("div", { class: "topbar-actions" }, [
        showBackToHub ? this.h("button", { class: "btn btn-topbar", text: "🏠 " + b.volverEntrada, onclick: () => this.returnToHub() }) : null,
        GAME.teacherMode ? this.h("button", {
          class: "btn btn-topbar teacher-panel-button",
          text: "🧑‍🏫 Lehrkraft",
          onclick: () => this.openTeacherPanel()
        }) : null,
        this.h("button", { class: "btn btn-topbar", text: "📊 " + b.progreso, onclick: () => this.openProgress() })
      ])
    ]);
    return bar;
  },

  renderInventoryStrip() {
    const areas = ["hub", "barra", "pista", "dj"];
    const areaLabels = { hub: "Eingang", barra: "Bar", pista: "Tanzfläche", dj: "DJ-Kabine" };
    const codes = GAME.state.inventory.filter((item) => item.type === "code");
    const stickers = GAME.state.inventory.filter((item) => item.type === "sticker");
    const codeSlots = areas.map((area) => {
      const item = codes.find((entry) => entry.area === area);
      return this.h("span", {
        class: "door-code-card" + (item ? " collected" : " locked"),
        title: item ? areaLabels[area] + ": Codefragment " + item.value : areaLabels[area] + ": noch nicht gefunden"
      }, [
        this.h("span", { class: "door-code-area", text: areaLabels[area] }),
        this.h("span", { class: "door-code-value", text: item ? item.value : "?" }),
        this.h("span", { class: "door-code-status", text: item ? "gefunden" : "offen" })
      ]);
    });
    const stickerIcons = stickers.map((item) => {
      const sticker = TEXTE.pegatinas && TEXTE.pegatinas[item.area];
      const name = sticker ? sticker.nombreDE : item.nombre;
      return this.h("span", { class: "award-chip", title: name }, [
        this.createImageOrPlaceholder(
          item.icon || ("assets/icons/sticker_" + item.area + ".png"),
          "[" + name + "]",
          "award-chip-art"
        ),
        this.h("span", { class: "award-chip-name", text: name })
      ]);
    });
    return this.h("div", { class: "collection-panel" }, [
      this.h("section", { class: "collection-section collection-code-section" }, [
        this.h("div", { class: "collection-heading" }, [
          this.h("strong", { text: "Türcode" }),
          this.h("small", { text: codes.length + "/4 Fragmente für das Finale" })
        ]),
        this.h("button", {
          class: "collection-group collection-code-group",
          type: "button",
          "aria-label": "Türcode und Codefragmente öffnen",
          onclick: () => this.openInventory()
        }, [
          this.h("span", { class: "door-code-cards" }, codeSlots)
        ])
      ]),
      this.h("section", { class: "collection-section collection-award-section" }, [
        this.h("div", { class: "collection-heading" }, [
          this.h("strong", { text: "Auszeichnungen" }),
          this.h("small", { text: "Sammelbelohnungen – nicht für den Türcode nötig" })
        ]),
        this.h("button", {
          class: "collection-group collection-award-group",
          type: "button",
          "aria-label": "Gesammelte Auszeichnungen öffnen",
          onclick: () => this.openInventory()
        }, [
          stickerIcons.length
            ? this.h("span", { class: "award-chips" }, stickerIcons)
            : this.h("span", { class: "collection-empty", text: "Noch keine Auszeichnung" })
        ])
      ])
    ]);
  },

  // ==================================================================
  // BILDSCHIRM: HUB
  // ==================================================================
  renderHub() {
    this.clear(this.appRoot);
    const uiTxt = TEXTE.ui.hub;
    const areasTxt = TEXTE.ui.areas;

    const grid = this.h("div", { class: "hub-grid hub-grid-fallback" });
    const world = this.h("div", { class: "hub-world" });
    world.appendChild(this.createImageOrPlaceholder(this.backgroundAsset("hub"), "[" + areasTxt.hub.nombre + "]", "hub-world-image"));
    const worldNav = this.h("div", { class: "hub-world-nav" });
    const positions = {
      hub: { x: 18, y: 43, icon: "🎟️" },
      barra: { x: 44, y: 38, icon: "🍹" },
      pista: { x: 57, y: 38, icon: "💃" },
      dj: { x: 72, y: 38, icon: "🎧" },
      finale: { x: 90, y: 44, icon: "🔐" }
    };

    const openArea = (area) => {
      if (area === "finale" && !GAME.isFinaleUnlocked()) {
        this.showToast(TEXTE.systemMeldungen.finaleBloqueado);
        return;
      }
      if (area === "hub") this.renderHubTasksScene();
      else this.renderNpcScene(area);
    };

    ["hub", "barra", "pista", "dj", "finale"].forEach((area) => {
      const isFinale = area === "finale";
      const locked = isFinale && !GAME.isFinaleUnlocked();
      const done = GAME.isAreaFullyDone(area);
      const progress = GAME.getMissionProgress(area);
      const position = positions[area];
      const card = this.h("div", {
        class: "hub-card" + (locked ? " locked" : "") + (done ? " done" : ""),
        role: "button",
        "aria-disabled": locked ? "true" : "false",
        onclick: locked ? null : () => openArea(area)
      }, [
        this.createImageOrPlaceholder(this.backgroundAsset(area), "[" + areasTxt[area].nombre + "]", "hub-card-img"),
        this.h("div", { class: "hub-card-title" }, [areasTxt[area].nombre]),
        locked
          ? this.h("div", { class: "hub-card-status locked-status" }, ["🔒"])
          : this.h("div", { class: "hub-card-status" }, [
              done ? "✅" : (progress.total ? progress.done + "/" + progress.total : "")
            ])
      ]);
      grid.appendChild(card);

      worldNav.appendChild(this.h("button", {
        class: "hub-world-node" + (locked ? " locked" : "") + (done ? " done" : ""),
        style: "left:" + position.x + "%;top:" + position.y + "%;",
        "aria-label": areasTxt[area].nombre,
        disabled: locked ? "true" : null,
        onclick: locked ? null : () => openArea(area)
      }, [
        this.h("span", { class: "hub-world-icon", text: locked ? "🔒" : (done ? "✓" : position.icon) }),
        this.h("span", { class: "hub-world-label", text: areasTxt[area].nombre }),
        !locked && !done ? this.h("span", { class: "hub-world-progress", text: progress.done + "/" + progress.total }) : null
      ]));
    });
    world.appendChild(worldNav);

    const avatar = GAME.getAvatar();
    if (avatar) {
      world.appendChild(this.createImageOrPlaceholder(
        "assets/sprites/avatar/avatar_" + avatar.id + ".png",
        "[" + avatar.nombre + "]",
        "hub-player"
      ));
    }

    const screen = this.h("div", { class: "screen hub-screen" }, [
      this.renderTopBar(false),
      this.h("div", { class: "hub-header" }, [
        this.h("div", { class: "pixel-kicker", text: "ATRAPADOS EN LA DISCO" }),
        this.h("h1", { text: uiTxt.titulo }),
        this.h("p", { text: uiTxt.subtitulo }),
        this.renderInventoryStrip()
      ]),
      world,
      grid,
      this.h("button", {
        class: "btn btn-danger btn-reset",
        text: TEXTE.ui.botones.reiniciar,
        onclick: () => this.openResetConfirm()
      })
    ]);
    this.appRoot.appendChild(screen);
  },

  returnToHub() {
    this.renderHub();
    let story = null;
    if (GAME.isFinaleUnlocked() && !GAME.state.finaleUnlockSeen) {
      GAME.state.finaleUnlockSeen = true;
      story = TEXTE.story.finaleFreigeschaltet;
    } else if (!GAME.state.hubReturnSeen) {
      GAME.state.hubReturnSeen = true;
      story = TEXTE.story.zwischenHub;
    }
    GAME.save();
    if (story) this.showStoryTransition(story);
  },

  showStoryTransition(story) {
    const paragraphs = story.absaetze || (story.text ? [story.text] : []);
    const box = this.h("div", { class: "modal-box story-transition" }, [
      this.h("h2", { text: story.titel }),
      ...paragraphs.map((p) => this.h("p", { text: p })),
      this.h("button", {
        class: "btn btn-primary btn-large",
        text: TEXTE.ui.botones.continuar,
        onclick: () => this.closeModal()
      })
    ]);
    this.showModal(box, false);
  },

  // ==================================================================
  // HUB-BEREICH (keine NPC — Aufgaben-Menü direkt)
  // ==================================================================
  renderHubTasksScene() {
    this.renderTaskMenuScene("hub", null);
  },

  // ==================================================================
  // BEREICHS-SZENE MIT NPC (barra, pista, dj, finale)
  // ==================================================================
  renderNpcScene(area) {
    if (area === "finale" && !GAME.isFinaleUnlocked()) {
      this.showToast(TEXTE.systemMeldungen.finaleBloqueado);
      this.renderHub();
      return;
    }
    this.renderTaskMenuScene(area, area);
  },

  renderTaskMenuScene(area, npcKey) {
    if (area === "finale" && !GAME.isFinaleUnlocked()) {
      this.showToast(TEXTE.systemMeldungen.finaleBloqueado);
      this.renderHub();
      return;
    }
    this.clear(this.appRoot);
    const areaTxt = TEXTE.ui.areas[area];
    const mission = GAME.getMission(area);
    if (!mission) return this.renderHub();
    const progress = GAME.getMissionProgress(area);
    const nextStageIndex = GAME.getNextMissionStageIndex(area);

    const makeStageCard = (stage, displayIndex, originalIndex) => {
      const done = GAME.isMissionStageDone(area, stage);
      const locked = !done && originalIndex !== nextStageIndex;
      const activeTaskIds = GAME.getActiveStageTaskIds(stage);
      const extensionCount = ((stage.taskIds || []).length - activeTaskIds.length);
      return this.h("button", {
        class: "mission-stage" + (done ? " done" : "") + (locked ? " locked" : "") + (!done && !locked ? " current" : ""),
        disabled: locked ? "true" : null,
        onclick: () => this.openMissionStage(area, originalIndex)
      }, [
        this.h("span", { class: "mission-stage-number", text: done ? "✓" : String(displayIndex + 1) }),
        this.h("span", { class: "mission-stage-copy" }, [
          this.h("span", { class: "mission-stage-title", text: stage.title }),
          this.h("span", { class: "mission-stage-description", text: stage.description }),
          GAME.isCoreMode() && extensionCount > 0
            ? this.h("span", {
                class: "mission-stage-extension",
                text: "+ " + extensionCount + (extensionCount === 1 ? " zusätzliche Aufgabe" : " zusätzliche Aufgaben")
              })
            : null
        ]),
          this.h("span", { class: "mission-stage-status", text: locked ? "🔒" : (done ? "Erledigt" : "Weiter") })
      ]);
    };

    const visibleStages = mission.stages
      .map((stage, originalIndex) => ({ stage, originalIndex }))
      .filter((entry) => GAME.isMissionStageActive(entry.stage));
    const stageList = this.h("div", { class: "mission-stage-list" }, visibleStages.map((entry, displayIndex) =>
      makeStageCard(entry.stage, displayIndex, entry.originalIndex)
    ));
    const bonusTasks = (mission.bonusTaskIds || []).map((id) => GAME.getTaskById(id)).filter(Boolean);
    const optionalTasks = GAME.isCoreMode() ? GAME.getOptionalTasksForArea(area) : bonusTasks;
    const showOptional = optionalTasks.length && (GAME.isCoreMode() || GAME.isAreaFullyDone(area));
    const bonusSection = showOptional ? this.h("details", { class: "bonus-section extension-section" }, [
      this.h("summary", { class: "extension-summary" }, [
        this.h("span", {
          text: GAME.isCoreMode() ? TEXTE.ui.vertiefung.zusammenfassung : TEXTE.ui.bonus.encabezado
        }),
        this.h("span", { class: "extension-count", text: String(optionalTasks.length) })
      ]),
      this.h("div", { class: "row-inline extension-heading" }, [
        this.h("h3", {
          class: "bonus-heading",
          text: GAME.isCoreMode() ? TEXTE.ui.vertiefung.encabezado : TEXTE.ui.bonus.encabezado
        }),
        this.hintButton(GAME.isCoreMode() ? TEXTE.ui.vertiefung.hintDE : TEXTE.ui.bonus.hintDE)
      ]),
      this.h("div", { class: "task-menu" }, optionalTasks.map((task) => {
        const done = GAME.isTaskDone(area, task.id);
        return this.h("button", {
          class: "task-card bonus" + (done ? " done" : ""),
          onclick: () => {
            const returnScrollY = window.scrollY;
            this.openTask(task.id, () => {
              this.renderTaskMenuScene(area, npcKey);
              requestAnimationFrame(() => {
                const extensionSection = this.appRoot.querySelector(".extension-section");
                if (extensionSection) extensionSection.open = true;
                window.scrollTo(0, returnScrollY);
              });
            });
          }
        }, [
          this.h("span", { class: "task-card-icon", text: done ? "✅" : "⭐" }),
          this.h("span", { class: "task-card-label", text: task.prompt })
        ]);
      }))
    ]) : null;

    const npcBlock = npcKey ? this.h("div", { class: "npc-block" }, [
      this.createImageOrPlaceholder("assets/sprites/npc/npc_" + this.npcAssetName(npcKey) + "_idle.png", "[NPC]", "npc-sprite"),
      this.h("button", {
        class: "btn btn-primary",
        text: GAME.isAreaFullyDone(area) ? "💬 Sprechen" : "💬 Mission",
        onclick: () => this.openDialog(area, GAME.getEntryDialogNode(area))
      })
    ]) : null;

    const screen = this.h("div", { class: "screen mission-screen" }, [
      this.renderTopBar(true),
      this.createImageOrPlaceholder(this.backgroundAsset(area), "[" + areaTxt.nombre + "]", "scene-bg"),
      this.h("div", { class: "scene-content" }, [
        this.h("div", { class: "mission-heading" }, [
          this.h("div", { class: "mission-kicker", text: areaTxt.nombre }),
          this.h("h2", { text: mission.title }),
          this.h("p", { class: "mission-briefing", text: mission.briefing }),
          this.renderInventoryStrip()
        ]),
        this.h("div", { class: "progress-bar-outer" }, [
          this.h("div", { class: "progress-bar-inner", style: "width:" + progress.percent + "%" })
        ]),
        this.h("div", { class: "progress-label", text: progress.done + "/" + progress.total + " Etappen abgeschlossen" }),
        npcBlock,
        !npcKey && !GAME.isAreaFullyDone(area) ? this.h("button", {
          class: "btn btn-primary mission-start-btn",
          text: progress.done ? "Mission fortsetzen" : "Mission starten",
          onclick: () => this.openMission(area)
        }) : null,
        stageList,
        bonusSection
      ])
    ]);
    this.appRoot.appendChild(screen);
  },

  npcAssetName(area) {
    return { barra: "camarera", pista: "bailarines", dj: "dj", finale: "conserje" }[area] || area;
  },

  backgroundAsset(area) {
    return "assets/backgrounds/background_" + area + ".png";
  },

  openMission(area) {
    const index = GAME.getNextMissionStageIndex(area);
    if (index >= 0) this.openMissionStage(area, index);
  },

  openMissionStage(area, stageIndex) {
    const mission = GAME.getMission(area);
    const stage = mission && mission.stages[stageIndex];
    if (!stage) return;

    if (stage.customType === "codeLock") {
      this.openCodeLock(area, stage);
      return;
    }

    const activeTaskIds = GAME.getActiveStageTaskIds(stage);
    const nextTaskId = activeTaskIds.find((id) => !GAME.isTaskDone(area, id));
    if (!nextTaskId) {
      this.renderTaskMenuScene(area, area === "hub" ? null : area);
      return;
    }

    const returnScrollY = window.scrollY;
    this.openTask(nextTaskId, () => {
      const nextIncomplete = activeTaskIds.find((id) => !GAME.isTaskDone(area, id));
      if (nextIncomplete) {
        this.openMissionStage(area, stageIndex);
      } else {
        this.showToast({ es: "¡Etapa completada!", de: "Etappe abgeschlossen!" });
        this.renderTaskMenuScene(area, area === "hub" ? null : area);
        requestAnimationFrame(() => window.scrollTo(0, returnScrollY));
        if (GAME.isAreaFullyDone(area) && area !== "hub") {
          this.openDialog(area, "gracias");
        }
      }
    });
  },

  openCodeLock(area, stage) {
    const available = GAME.state.inventory
      .filter((item) => item.type === "code")
      .map((item) => item.value);
    const chips = available.slice().sort(() => Math.random() - 0.5);
    const slots = new Array(stage.solution.length).fill(null);
    let selected = null;
    const body = this.h("div", { class: "code-lock" });

    const render = () => {
      this.clear(body);
      body.appendChild(this.h("div", { class: "code-terminal-title", text: "SICHERHEITSTERMINAL" }));
      body.appendChild(this.h("p", {
        class: "muted",
        text: "Tippe auf ein Fragment und setze es bei dem Ort ein, an dem du es gefunden hast."
      }));

      const slotWrap = this.h("div", { class: "code-slots" });
      slots.forEach((value, index) => {
        slotWrap.appendChild(this.h("button", {
          class: "code-slot" + (value ? " filled" : ""),
          onclick: () => {
            if (value) {
              slots[index] = null;
            } else if (selected) {
              const oldIndex = slots.indexOf(selected);
              if (oldIndex !== -1) slots[oldIndex] = null;
              slots[index] = selected;
              selected = null;
            }
            render();
          }
        }, [
          this.h("span", { class: "code-slot-label", text: (index + 1) + " · " + stage.slotLabels[index] }),
          this.h("span", { class: "code-slot-value", text: value || "__" })
        ]));
      });
      body.appendChild(slotWrap);

      body.appendChild(this.h("div", { class: "code-chip-pool" }, chips.map((value) => {
        const placed = slots.indexOf(value) !== -1;
        return this.h("button", {
          class: "code-chip" + (selected === value ? " selected" : ""),
          disabled: placed ? "true" : null,
          onclick: () => { selected = selected === value ? null : value; render(); }
        }, [value]);
      })));

      body.appendChild(this.h("button", {
        class: "btn btn-primary btn-comprobar",
        text: TEXTE.ui.botones.comprobar,
        disabled: slots.some((value) => !value) ? "true" : null,
        onclick: () => {
          const correct = slots.every((value, index) => value === stage.solution[index]);
          if (!correct) {
            this.playWrong();
            showFeedback(body, TEXTE.systemMeldungen.casiInténtaloOtraVez, false);
            return;
          }
          GAME.completeCustomMissionStage(area, stage.id);
          this.playCorrect();
          this.showToast(TEXTE.systemMeldungen.correcto);
          this.closeModal();
          this.renderTaskMenuScene(area, area);
          this.showToast({ es: "¡Terminal desbloqueado!", de: "Terminal entsperrt!" });
        }
      }));
      body.appendChild(this.h("div", { class: "task-feedback" }));
    };

    render();
    const box = this.h("div", { class: "modal-box task-box" }, [
      this.h("button", {
        class: "task-close-btn",
        "aria-label": TEXTE.ui.botones.cerrar,
        onclick: () => this.closeModal()
      }, ["✕"]),
      this.h("h3", { text: stage.title }),
      body
    ]);
    this.showModal(box, false);
  },

  // ==================================================================
  // DIALOG-SYSTEM
  // ==================================================================
  openDialog(area, nodeId) {
    const tree = DIALOGOS[area];
    if (!tree) return;
    const node = tree[nodeId] || tree.start;
    this.renderDialogNode(area, node);
  },

  renderDialogNode(area, node) {
    // Belohnungs-Knoten: nur wirklich vergeben, wenn der Bereich tatsächlich
    // fertig ist (kann sonst passieren, falls per Dialog vorgegriffen wird).
    if (node.givesReward && !GAME.isAreaFullyDone(area)) {
      this.renderDialogBox("—", {
        es: "Todavía tienes tareas sin terminar aquí. ¡Sigue practicando!",
        de: "Du hast hier noch Aufgaben offen. Mach weiter!"
      }, [{ label: TEXTE.ui.botones.cerrar, action: () => this.closeModal() }]);
      return;
    }

    const options = [];
    if (node.options) {
      node.options.forEach((opt) => {
        options.push({ label: opt.label, action: () => this.renderDialogNode(area, DIALOGOS[area][opt.next]) });
      });
    } else if (node.startsMission) {
      options.push({
        label: TEXTE.ui.botones.continuar,
        action: () => {
          this.closeModal();
          this.openMission(area);
        }
      });
    } else if (node.startsTask) {
      options.push({
        label: TEXTE.ui.botones.continuar,
        action: () => {
          this.closeModal();
          this.openTask(node.startsTask, () => {
            const nextId = node.afterTaskNode || "gracias";
            this.openDialog(area, nextId);
          });
        }
      });
    } else if (node.givesReward) {
      const isFinal = node.givesReward.type === "final";
      options.push({
        label: TEXTE.ui.botones.cerrar,
        action: () => { this.closeModal(); if (isFinal) this.renderEndScreen(); else this.returnToHub(); }
      });
    } else {
      options.push({ label: TEXTE.ui.botones.continuar, action: () => this.closeModal() });
    }

    this.renderDialogBox(node.speaker, { es: node.text, de: node.hintDE }, options);
  },

  renderDialogBox(speaker, textObj, options) {
    const box = this.h("div", { class: "modal-box dialog-box" }, [
      this.h("div", { class: "dialog-speaker" }, [speaker]),
      this.h("div", { class: "row-inline" }, [
        this.h("div", { class: "dialog-text", text: textObj.es }),
        textObj.de ? this.hintButton(textObj.de) : null
      ]),
      this.h("div", { class: "dialog-options" }, options.map((opt) =>
        this.h("button", { class: "btn btn-option", text: opt.label, onclick: opt.action })
      ))
    ]);
    this.showModal(box, false);
  },

  // ==================================================================
  // MODAL-Grundgerüst
  // ==================================================================
  showModal(contentEl, dismissable) {
    this.closeModal(); // räumt ein evtl. offenes Modal inkl. laufendem Timer auf
    const overlay = this.h("div", { class: "modal-overlay" }, [contentEl]);
    if (dismissable) {
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) this.closeModal();
      });
    }
    this.modalRoot.appendChild(overlay);
    this.modalRoot.classList.add("visible");
  },

  closeModal() {
    // Räumt IMMER einen laufenden Aufgaben-Timer auf (z. B. quizRound),
    // egal auf welchem Weg das Modal geschlossen wird.
    if (this.currentTaskDispose) {
      this.currentTaskDispose();
      this.currentTaskDispose = null;
    }
    this.clear(this.modalRoot);
    this.modalRoot.classList.remove("visible");
  },

  // ==================================================================
  // INVENTAR / FORTSCHRITT / RESET
  // ==================================================================
  openInventory() {
    const t = TEXTE.ui.inventario;
    const areas = ["hub", "barra", "pista", "dj"];
    const areaLabels = { hub: "Eingang", barra: "Bar", pista: "Tanzfläche", dj: "DJ-Kabine" };
    const codeItems = GAME.state.inventory.filter((i) => i.type === "code" || i.type === "final");
    const stickerItems = GAME.state.inventory.filter((i) => i.type === "sticker");

    const codeList = this.h("div", { class: "inventory-code-grid" }, areas.map((area) => {
      const item = codeItems.find((entry) => entry.type === "code" && entry.area === area);
      return this.h("div", { class: "inventory-code-detail" + (item ? " collected" : " locked") }, [
        this.h("div", { class: "door-code-card inventory-door-code" }, [
          this.h("span", { class: "door-code-area", text: areaLabels[area] }),
          this.h("span", { class: "door-code-value", text: item ? item.value : "?" }),
          this.h("span", { class: "door-code-status", text: item ? "gefunden" : "offen" })
        ]),
        this.h("span", {
          class: "inventory-item-name",
          text: item ? "Codefragment aus " + areaLabels[area] : areaLabels[area] + ": noch nicht gefunden"
        })
      ]);
    }));

    const stickerList = stickerItems.length
      ? this.h("div", { class: "sticker-grid" }, stickerItems.map((item) =>
          this.h("div", { class: "sticker-item" }, [
            this.createImageOrPlaceholder(
              item.icon || ("assets/icons/sticker_" + item.area + ".png"),
              "[" + item.nombre + "]",
              "sticker-art"
            ),
            this.h("span", {
              class: "sticker-name",
              text: TEXTE.pegatinas[item.area] ? TEXTE.pegatinas[item.area].nombreDE : item.nombre
            })
          ])
        ))
      : this.h("p", { class: "muted", text: t.vacioPegatinas });

    const box = this.h("div", { class: "modal-box" }, [
      this.h("h2", { text: t.titulo }),
      this.h("h3", { class: "inventory-subheading", text: t.seccionCodigos }),
      this.h("p", { class: "inventory-explanation", text: t.erklärungCodes }),
      codeList,
      this.h("h3", { class: "inventory-subheading", text: t.seccionPegatinas }),
      this.h("p", { class: "inventory-explanation", text: t.erklärungAuszeichnungen }),
      stickerList,
      this.h("button", { class: "btn btn-primary", text: TEXTE.ui.botones.cerrar, onclick: () => this.closeModal() })
    ]);
    this.showModal(box, true);
  },

  // ==================================================================
  // VOKABELHEFT — jederzeit abrufbar, wächst mit dem Fortschritt mit
  // ==================================================================
  openVocabulario() {
    const t = TEXTE.ui.vocabularioPanel;
    const sections = ["hub", "barra", "pista", "dj", "finale"].map((area) => {
      const words = GAME.getVocabForArea(area);
      if (!words.length) return null;
      return this.h("div", { class: "vocab-section" }, [
        this.h("h3", { class: "vocab-area-title", text: TEXTE.ui.areas[area].nombre }),
        this.h("div", { class: "vocab-list" }, words.map((w) =>
          this.h("div", { class: "vocab-row" }, [
            this.h("span", { class: "vocab-es", text: w.es }),
            this.h("span", { class: "vocab-de", text: w.de })
          ])
        ))
      ]);
    }).filter(Boolean);

    const box = this.h("div", { class: "modal-box" }, [
      this.h("h2", { text: t.titulo }),
      sections.length ? this.h("div", {}, sections) : this.h("p", { class: "muted", text: t.vacio }),
      this.h("button", { class: "btn btn-primary", text: TEXTE.ui.botones.cerrar, onclick: () => this.closeModal() })
    ]);
    this.showModal(box, true);
  },

  openProgress() {
    const t = TEXTE.ui.progresoPanel;
    const rows = ["hub", "barra", "pista", "dj", "finale"].map((area) => {
      const p = GAME.getMissionProgress(area);
      return this.h("div", { class: "progress-row" }, [
        this.h("span", { class: "progress-row-label", text: TEXTE.ui.areas[area].nombre }),
        this.h("div", { class: "progress-bar-outer small" }, [
          this.h("div", { class: "progress-bar-inner", style: "width:" + p.percent + "%" })
        ]),
        this.h("span", { class: "progress-row-count", text: p.done + "/" + p.total })
      ]);
    });
    const box = this.h("div", { class: "modal-box" }, [
      this.h("h2", { text: t.titulo }),
      this.h("p", { text: "⭐ " + GAME.state.points + " Punkte" }),
      ...rows,
      this.h("button", { class: "btn btn-primary", text: TEXTE.ui.botones.cerrar, onclick: () => this.closeModal() })
    ]);
    this.showModal(box, true);
  },

  openResetConfirm() {
    const t = TEXTE.ui.reiniciarConfirm;
    const box = this.h("div", { class: "modal-box" }, [
      this.h("div", { class: "row-inline" }, [
        this.h("h2", { text: t.titulo }),
        this.hintButton(t.tituloDE + " " + t.textoDE)
      ]),
      this.h("p", { text: t.texto }),
      this.h("div", { class: "dialog-options" }, [
        this.h("button", {
          class: "btn btn-danger", text: t.confirmar, onclick: () => {
            GAME.resetProgress();
            this.closeModal();
            this.renderAvatarScreen();
          }
        }),
        this.h("button", { class: "btn btn-secondary", text: t.cancelar, onclick: () => this.closeModal() })
      ])
    ]);
    this.showModal(box, true);
  },

  // ==================================================================
  // LEHRKRAFTMODUS — nur über ?lehrkraft=1 erreichbar
  // ==================================================================
  teacherTaskSequence() {
    const orderedIds = [];
    AREA_ORDER.forEach((area) => {
      const mission = GAME.getMission(area);
      if (!mission) return;
      mission.stages.forEach((stage) => (stage.taskIds || []).forEach((id) => orderedIds.push(id)));
      (mission.bonusTaskIds || []).forEach((id) => orderedIds.push(id));
    });
    // Falls später eine redaktionelle Aufgabe ergänzt, aber noch keiner
    // Mission zugeordnet wurde, bleibt sie im Testmodus trotzdem erreichbar.
    AUFGABEN.forEach((task) => {
      if (orderedIds.indexOf(task.id) === -1) orderedIds.push(task.id);
    });
    return orderedIds.map((id) => GAME.getTaskById(id)).filter(Boolean);
  },

  teacherSolutionText(task) {
    if (!task) return "Keine Lösung hinterlegt.";
    if (task.type === "multipleChoice") return task.options[task.correctIndex];
    if (task.type === "multipleChoiceSet") {
      return task.questions.map((question) => question.options[question.correctIndex]).join("; ");
    }
    if (task.type === "fillBlankText") return task.acceptedAnswers.join(" / ");
    if (task.type === "fillBlankChips") return (task.correctChips || [task.correctChip]).join(" · ");
    if (task.type === "reorder") return task.correctOrder.join(" → ");
    if (task.type === "dragMatch") return task.items.map((item) => item.text + " → " + item.bucket).join("; ");
    if (task.type === "hotspotClick") return task.hotspots.filter((spot) => spot.correct).map((spot) => spot.label).join(", ");
    if (task.type === "memoryMatch") {
      return task.pairs.map((pair) => Object.values(pair).join(" ↔ ")).join("; ");
    }
    if (task.type === "quizRound") {
      return task.questions.map((question) => question.prompt + " → " + question.options[question.correctIndex]).join("; ");
    }
    if (task.type === "listeningProfiles") {
      return task.profiles.map((profile) =>
        profile.name + ": " + profile.questions.map((question) =>
          question.prompt + " → " + question.options[question.correctIndex]
        ).join("; ")
      ).join(" | ");
    }
    return "Lösung direkt in der Aufgabe prüfen.";
  },

  openTeacherPanel() {
    if (!GAME.teacherMode) return;

    const presetButton = (label, preset) => this.h("button", {
      class: "btn btn-secondary teacher-preset-button",
      text: label,
      onclick: () => {
        GAME.applyTeacherPreset(preset);
        this.closeModal();
        this.renderHub();
        this.openTeacherPanel();
      }
    });

    const areaSections = AREA_ORDER.map((area) => {
      const mission = GAME.getMission(area);
      if (!mission) return null;
      const stages = mission.stages.map((stage, stageIndex) => {
        const taskButtons = (stage.taskIds || []).map((taskId) => {
          const task = GAME.getTaskById(taskId);
          if (!task) return null;
          const done = GAME.isTaskDone(area, task.id);
          return this.h("button", {
            class: "teacher-task-link" + (done ? " done" : ""),
            text: (done ? "✓ " : "") + task.prompt,
            onclick: () => this.openTask(task.id, () => this.openTeacherPanel())
          });
        }).filter(Boolean);

        if (stage.customType === "codeLock") {
          taskButtons.push(this.h("button", {
            class: "teacher-task-link" + (GAME.isMissionStageDone(area, stage) ? " done" : ""),
            text: (GAME.isMissionStageDone(area, stage) ? "✓ " : "") + "Terminal direkt öffnen",
            onclick: () => this.openCodeLock(area, stage)
          }));
        }

        return this.h("div", { class: "teacher-stage" }, [
          this.h("div", { class: "teacher-stage-title", text: (stageIndex + 1) + ". " + stage.title }),
          this.h("div", { class: "teacher-task-links" }, taskButtons)
        ]);
      });

      const bonusTasks = (mission.bonusTaskIds || []).map((taskId) => GAME.getTaskById(taskId)).filter(Boolean);
      if (bonusTasks.length) {
        stages.push(this.h("div", { class: "teacher-stage teacher-bonus-stage" }, [
          this.h("div", { class: "teacher-stage-title", text: "Bonus" }),
          this.h("div", { class: "teacher-task-links" }, bonusTasks.map((task) =>
            this.h("button", {
              class: "teacher-task-link" + (GAME.isTaskDone(area, task.id) ? " done" : ""),
              text: (GAME.isTaskDone(area, task.id) ? "✓ " : "") + task.prompt,
              onclick: () => this.openTask(task.id, () => this.openTeacherPanel())
            })
          ))
        ]));
      }

      return this.h("details", { class: "teacher-area", open: area === "hub" ? "open" : null }, [
        this.h("summary", { text: TEXTE.ui.areas[area].nombre + " · " + mission.title }),
        ...stages
      ]);
    }).filter(Boolean);

    const box = this.h("div", { class: "modal-box teacher-panel" }, [
      this.h("button", {
        class: "task-close-btn",
        "aria-label": "Schließen",
        onclick: () => this.closeModal()
      }, ["✕"]),
      this.h("div", { class: "teacher-panel-kicker", text: "GETRENNTER TESTSPIELSTAND" }),
      this.h("h2", { text: "Lehrkraft- und Testmodus" }),
      this.h("p", {
        class: "muted",
        text: "Öffne jede Aufgabe direkt. Der normale Schüler-Spielstand wird dabei nicht verändert."
      }),
      this.h("div", { class: "teacher-presets" }, [
        presetButton("↺ Teststand leeren", "start"),
        presetButton("🔓 Finale freischalten", "finale"),
        presetButton("✓ Alles abschließen", "complete")
      ]),
      this.h("div", { class: "teacher-area-list" }, areaSections)
    ]);
    this.showModal(box, true);
  },

  // ==================================================================
  // AUFGABEN-OVERLAY (Router für alle Aufgabentypen)
  // ==================================================================
  openTask(taskId, onSuccess) {
    const task = GAME.getTaskById(taskId);
    if (!task) return;
    const renderer = TASKS[task.type];
    if (!renderer) {
      console.error("Tipo de tarea desconocido:", task.type);
      return;
    }
    const handleSuccess = () => {
      const result = GAME.completeTask(taskId);
      this.playCorrect();
      this.showToast(TEXTE.systemMeldungen.correcto);
      this.closeModal(); // ruft auch currentTaskDispose auf
      if (result.areaJustCompleted) {
        this.showToast(TEXTE.systemMeldungen.areaCompleta);
        if (task.area === "finale") this.showToast(TEXTE.systemMeldungen.puertaAbierta);
        else this.showToast(TEXTE.systemMeldungen.codigoGuardado);
        this.triggerConfetti();
      }
      onSuccess && onSuccess(result);
    };
    const box = this.h("div", { class: "modal-box task-box" });
    box.appendChild(this.h("button", {
      class: "task-close-btn",
      "aria-label": TEXTE.ui.botones.cerrar,
      onclick: () => this.closeModal()
    }, ["✕"]));
    box.appendChild(this.h("div", { class: "task-header" }, [
      this.hintButton(task.hintDE),
      this.h("h3", { class: "task-prompt", text: task.prompt })
    ]));
    if (GAME.teacherMode) {
      const teacherTasks = this.teacherTaskSequence();
      const taskIndex = teacherTasks.findIndex((entry) => entry.id === task.id);
      const solution = this.h("div", {
        class: "teacher-solution",
        text: "Lösung: " + this.teacherSolutionText(task),
        hidden: "hidden"
      });
      const openNeighbor = (offset) => {
        const neighbor = teacherTasks[taskIndex + offset];
        if (neighbor) this.openTask(neighbor.id, () => this.openTeacherPanel());
      };
      box.appendChild(this.h("div", { class: "teacher-task-toolbar" }, [
        this.h("span", { class: "teacher-task-counter", text: "Aufgabe " + (taskIndex + 1) + "/" + teacherTasks.length }),
        this.h("button", {
          class: "btn btn-small",
          text: "← Vorherige",
          disabled: taskIndex <= 0 ? "true" : null,
          onclick: () => openNeighbor(-1)
        }),
        this.h("button", {
          class: "btn btn-small",
          text: "Lösung anzeigen",
          onclick: (event) => {
            const isHidden = solution.hasAttribute("hidden");
            if (isHidden) solution.removeAttribute("hidden");
            else solution.setAttribute("hidden", "hidden");
            event.currentTarget.textContent = isHidden ? "Lösung ausblenden" : "Lösung anzeigen";
          }
        }),
        this.h("button", {
          class: "btn btn-small teacher-complete-button",
          text: GAME.isTaskDone(task.area, task.id) ? "✓ Erledigt" : "Als erledigt markieren",
          onclick: () => {
            GAME.completeTask(task.id);
            const next = teacherTasks[taskIndex + 1];
            if (next) this.openTask(next.id, () => this.openTeacherPanel());
            else this.openTeacherPanel();
          }
        }),
        this.h("button", {
          class: "btn btn-small",
          text: "Nächste →",
          disabled: taskIndex >= teacherTasks.length - 1 ? "true" : null,
          onclick: () => openNeighbor(1)
        })
      ]));
      box.appendChild(solution);
    }
    if (task.illustration) {
      box.appendChild(this.createImageOrPlaceholder(
        task.illustration,
        task.illustrationLabel || "[ilustración]",
        "task-illustration"
      ));
    }
    const bodyContainer = this.h("div", { class: "task-body" });
    box.appendChild(bodyContainer);
    this.showModal(box, false);
    this.currentTaskDispose = renderer.render(bodyContainer, task, handleSuccess, () => this.playWrong()) || null;
  },

  // ==================================================================
  // ENDE — Tür geöffnet
  // ==================================================================
  renderEndScreen() {
    this.clear(this.appRoot);
    const e = TEXTE.story.ende;
    const screen = this.h("div", { class: "screen center-screen" }, [
      this.h("div", { class: "card story-card end-card" }, [
        this.h("h1", { text: e.titel }),
        ...e.absaetze.map((p) => this.h("p", { text: p })),
        this.h("p", { class: "end-points", text: "⭐ " + GAME.state.points + " Punkte" }),
        this.h("button", {
          class: "btn btn-secondary btn-large",
          text: TEXTE.ui.botones.reiniciar,
          onclick: () => this.openResetConfirm()
        })
      ])
    ]);
    this.appRoot.appendChild(screen);
  }
};
