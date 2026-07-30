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
- eigene, im aktuellen Unterricht eingeführte Verben mit Quelle und sechs geprüften Präsensformen

Jede Änderung wird als lokaler Entwurf unter `vamos-teacher-draft-v1` gespeichert und gilt sofort für die Trainervorschau im selben Browser. Die Schaltfläche „Datei für Veröffentlichung laden“ erzeugt eine fertige `teacher-settings.js`. Diese Datei ersetzt für eine Veröffentlichung die gleichnamige Projektdatei. Alternativ kann der Entwurf als JSON gesichert und später wieder eingelesen werden.

Da die Anwendung statisch ist, kann die Browserseite Projektdateien nicht selbst überschreiben. Es gibt bewusst keine vorgetäuschte Passwortsicherung.

Ein selbst ergänztes Verb wird im Browserentwurf sofort für die Vorschau nutzbar. Es wird erst öffentlich, wenn die neu exportierte `teacher-settings.js` in den Projektordner übernommen, committed und zu GitHub übertragen wurde. Eigene Verben lassen sich im Editor wieder löschen; bestehende materialbasierte Verben werden nur aktiviert, verschoben oder einer anderen Stufe zugeordnet.

## Aktuelle Freigabe und Stufentraining

In `config.js` steht `currentStage: 2`. Damit sind ausschließlich diese Verben sichtbar:

1. Stufe 1: `ser`, `estar`, `hablar`, `terminar`
2. Stufe 2: `trabajar`, `charlar`

Die nächsten Stufen sind vorbereitet, aber gesperrte Verben erscheinen weder in Aufgaben noch in Ablenkungen, Filtern oder Lernstatistiken.

Freigegebene Stufenkarten sind anklickbar. „Diese Stufe üben“ trainiert gezielt die Verben dieser Stufe. Der große Startknopf bleibt das kumulative Standardtraining mit neuen, älteren und persönlichen Wiederholungen. Die Anzeige „Bis Stufe … freigegeben“ bezeichnet deshalb die Grenze der Lehrkraftfreigabe und nicht die einzige wählbare Stufe.

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

## Neues Verb in der Lehrkraftversion ergänzen

1. Unter `lehrkraft.html` den Bereich „Eigenes Verb hinzufügen“ öffnen.
2. Infinitiv und deutsche Bedeutung eintragen.
3. Verbgruppe, Lernstufe und Lektion auswählen.
4. Alle sechs Präsensformen in der angegebenen Personenfolge eintragen.
5. Einen nachvollziehbaren Unterrichts- oder Materialhinweis als Quelle angeben.
6. Die fachliche Prüfung bestätigen und das Verb hinzufügen.
7. Das neue Verb bei Bedarf in der Liste verschieben oder einer anderen Stufe zuordnen.
8. In der Trainervorschau testen.
9. `teacher-settings.js` für die Veröffentlichung herunterladen und im Projekt ersetzen.

Die Anwendung erzeugt keine Formen durch Raten. Unregelmäßigkeiten und Stammwechsel müssen von der Lehrkraft fachlich geprüft eingegeben werden. Eigene Verben erhalten ohne belegten Satz keine Lückensatzaufgaben. Eine unsichere Passwortsimulation ist nicht enthalten.

## Verbgruppe erkennen

Der frühere Multiple-Choice-Modus „Infinitiv erkennen“ wurde durch „Verbgruppe erkennen“ ersetzt. Zu einer konjugierten Form stehen immer vier Kategorien zur Auswahl: Verb auf `-ar`, Verb auf `-er`, Verb auf `-ir` oder unregelmäßiges Verb. Die eigentliche Gruppe wird während der Aufgabe nicht in den Metadaten verraten; nach der Antwort nennt das Feedback zusätzlich den Infinitiv.

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
- `abzeichen-erste-formen.webp`
- `abzeichen-neue-sprachkraft.webp`
- `abzeichen-nicht-vergessen.webp`
- `abzeichen-fundament.webp`
- `training-kolibri.webp`

Sie wurden als zusammengehörige, textfreie Illustrationsserie für dieses Projekt erzeugt. Die Abzeichen besitzen sichtbare Bedingungen und Zustände; das Kolibri-Motiv begleitet die Aufgabenansicht. Lerninformationen stehen immer zusätzlich als HTML-Text bereit.
