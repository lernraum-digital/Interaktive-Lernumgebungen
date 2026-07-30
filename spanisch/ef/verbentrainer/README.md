# ¡Vamos! Verb für Verb

Statischer, kumulativer Spanisch-Verbentrainer für die EF. `index.html` funktioniert ohne Installation oder Server und ist für GitHub Pages geeignet.

## Grafische Lehrkraftversion

Die Lehrkraftseite liegt unter `lehrkraft.html`. Dort lassen sich ohne Quellcode bearbeiten:

- aktuelle Freigabestufe und Rundengröße
- Reihenfolge aller Verben
- Stufenzuordnung und Aktivstatus
- Anteile neuer, älterer und persönlicher Aufgaben
- Mindestzahl älterer Aufgaben und Wiederholungsgrenze
- verfügbare Aufgabentypen

Jede Änderung wird als lokaler Entwurf unter `vamos-teacher-draft-v1` gespeichert und gilt sofort für die Trainervorschau im selben Browser. Die Schaltfläche „Datei für Veröffentlichung laden“ erzeugt eine fertige `teacher-settings.js`. Diese Datei ersetzt für eine Veröffentlichung die gleichnamige Projektdatei. Alternativ kann der Entwurf als JSON gesichert und später wieder eingelesen werden.

Da die Anwendung statisch ist, kann die Browserseite Projektdateien nicht selbst überschreiben. Es gibt bewusst keine vorgetäuschte Passwortsicherung.

## Aktuelle Freigabe

In `config.js` steht `currentStage: 2`. Damit sind ausschließlich diese Verben sichtbar:

1. Stufe 1: `ser`, `estar`
2. Stufe 2: `hablar`, `trabajar`

Die nächsten Stufen sind vorbereitet, aber gesperrte Verben erscheinen weder in Aufgaben noch in Ablenkungen, Filtern oder Lernstatistiken.

## Reihenfolge und Lernstufen ändern

Die verbindliche Abfolge steht am Ende von `data/verbs.js` im Array `curriculum`. Jede Zeile enthält Verb-ID und Stufe. Die Position bestimmt `sequence`.

```js
["ser", 1],
["estar", 1],
["hablar", 2]
```

Eine Stufe wird in `config.js` mit `currentStage` freigegeben. `showLockedStages` steuert, ob spätere Akademiebereiche sichtbar gesperrt erscheinen.

## Kumulative Wiederholung

Jede Runde wird vor der ersten Aufgabe vollständig geplant. Ab mehreren freigegebenen Stufen gelten standardmäßig:

- 45 % neueste Stufe
- 35 % ältere Stufen
- 20 % persönliche Wiederholung
- mindestens zwei Aufgaben mit älteren Verben
- möglichst keine direkte Wiederholung
- standardmäßig höchstens zwei Vorkommen desselben Verbs, sofern die kleine Datenbasis das mathematisch erlaubt

Die Kontingente verhindern, dass persönliche Problemfälle alle anderen Inhalte verdrängen. Innerhalb des persönlichen Kontingents werden Trefferquote, Personenfehler, Fälligkeit und Zeit seit der letzten Bearbeitung gewichtet. Sicher beherrschte Verben erscheinen seltener, bleiben aber im festen Anteil älterer Verben erhalten.

Alle Werte stehen in `TEACHER_CONFIG.distribution` und `TEACHER_CONFIG.repetition`.

## Neues Verb ergänzen

1. Infinitiv und eindeutige ID in `data/verbs.js` ergänzen.
2. Materialbelegte deutsche Bedeutung eintragen.
3. Sechs Präsensformen in der Reihenfolge `yo`, `tú`, `él/ella`, `nosotros/-as`, `vosotros/-as`, `ellos/ellas` prüfen.
4. Gruppe, Lektion, Besonderheiten und mindestens eine Quelldatei angeben.
5. Nur belegte Aufgabentypen freigeben.
6. Einen Satz nur mit vollständigem Wortschatz- und Quellenbeleg ergänzen.
7. Verb im `curriculum` an der gewünschten Position mit Stufe eintragen.
8. Gewünschte Stufe in `config.js` freigeben.
9. `node tests/quality-check.mjs` ausführen.

Die künftige Lehrkraftansicht kann auf diesen getrennten Datenstrukturen aufbauen; eine unsichere Passwortsimulation ist nicht enthalten.

## Lehrkraftkonfiguration

`config.js` steuert ohne Eingriff in die Aufgabenlogik:

- aktuelle Stufe und sichtbare Sperren
- Rundengröße
- Lektionen und Verbgruppen
- Aufgabentypen
- Schwierigkeitsfreigabe
- Verteilung neuer, älterer und persönlicher Aufgaben
- Mindestwiederholung und Wiederholungsgrenzen
- Namen und Bilder der Akademiebereiche

Ein einzelnes Verb kann in `data/verbs.js` mit `active: false` deaktiviert werden.

## Lokale Daten und Migration

Der aktuelle Schlüssel lautet `vamos-verb-fuer-verb-progress-v2`. Beim ersten Start werden vorhandene Daten aus `conjura-ef-progress-v1` automatisch übernommen und um Wiederholungsfelder ergänzt.

Lokal gespeichert werden: freiwilliger Name/Kürzel, XP, Abzeichen, Ergebnisse pro Verb und Person, Fehlertypen, Serien, Wiederholungen, letzte Bearbeitung, nächste empfohlene Wiederholung und Rundenmischung. Der JSON-Export entsteht ausschließlich lokal. Zurücksetzen löscht neuen und alten Schlüssel nach Bestätigung.

## Bildwelt

Die KI-generierten WebP-Dateien liegen in `assets/images/`:

- `akademie-hero.webp`
- `eingangshalle.webp`
- `galerie-verwandlungen.webp`
- `kammer-sonderformen.webp`

Sie wurden als zusammengehörige, textfreie Illustrationsserie für dieses Projekt erzeugt. Lerninformationen stehen immer zusätzlich als HTML-Text bereit.
