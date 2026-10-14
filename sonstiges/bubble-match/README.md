# Bubble Match · Knotbert — lokaler Prototyp

Eigenständiges Spiel ohne Genially-SDK, externe Schriftserver, Tracking oder Schülerdaten. Bestehende Seiten werden nicht verändert. Für den ersten öffentlichen GitHub-Pages-/Genially-Test vorbereitet.

## Ausprobieren

Zum Spielen `index.html`, zum Einstellen `werkstatt.html` direkt im Browser öffnen (Doppelklick). Beide Dateien enthalten Spiel, Gestaltung und Beispielinhalte und benötigen keinen Server.

Alternativ für HTTP-/iFrame-Prüfungen aus dem Repository einen lokalen Webserver starten: `python3 -m http.server 8765`.

- Bearbeitung und Vorschau: http://localhost:8765/sonstiges/bubble-match/werkstatt.html
- Spielansicht: http://localhost:8765/sonstiges/bubble-match/?embed=1
- Schmaler iFrame-Test: http://localhost:8765/sonstiges/bubble-match/iframe-test.html

Die HTML-Datei funktioniert auch allein, wenn sie in einen anderen Ordner kopiert wird.

## Bedienung und Varianten

Je nach „Startart“ mit dem Button über dem Spielfeld oder dem großen Play-Button starten, beziehungsweise die Runde beim Öffnen der Spielansicht automatisch beginnen lassen. Dann vom Wort zum Ziel ziehen. Alternativ Wort und danach Ziel antippen; die Wörterliste ermöglicht Bedienung mit Tab und Enter. Es erscheinen bis zu sechs Wörter gleichzeitig, weitere rücken nach. Bei großen Kugeln und schmalem Spielfeld erscheinen weniger, damit alle erreichbar bleiben. Nur eine bewusste Zuordnung kostet Leben oder sammelt Wörter. Richtige Wörter gleiten 0,8 Sekunden zum Ziel. Es gibt nur eine Abschlusslogik und eine Animationsschleife. Verlassen des Browser-Tabs pausiert die Runde. Ein Wechsel des Rahmenformats erhält die laufende Runde, Leben, Timer und bereits gesammelte Wörter. Noch nicht sichtbare Wörter werden bei Platzmangel wieder in die Warteschlange gestellt.

Im Editor alle Felder einstellen und „Vorschau übernehmen“ wählen. Mit `|` mögliche Worttrennungen vorgeben; ohne diese Vorgabe werden Wörter nur als Ganzes verkleinert. Gemessen wird in der ausgewählten Systemschrift, niemals zwischen beliebigen Buchstaben umgebrochen. Bei extrem langen unteilbaren Wörtern wird eine verständliche Fehlermeldung angezeigt. Kugel- und Schriftgrößen sind unabhängige Vorgaben; die tatsächliche Textgröße wird bei Bedarf reduziert. Kleine Kugeln mit sehr großer Wunschschrift können daher deutlich kleiner dargestellten Text ergeben. Keine automatische deutsche Silbentrennung.

„Im Browser speichern“ sichert unter dem Szenarionamen; gleicher Name überschreibt die lokale Variante. „Als Kopie bearbeiten“ legt einen neuen Namen an. JSON herunterladen für dauerhafte Sicherung und Transfer zu einem anderen Browser. JSON laden ist unabhängig vom Dateinamen. Browser-Speicherung kann vom Browser gelöscht oder im privaten Modus verweigert werden.

„Bearbeitung schließen“ oder „Übernehmen und schließen“ übernimmt alle Eingaben und wechselt ohne Seitenwechsel zur reinen Spielansicht. Fehlerhafte Eingaben lassen die Werkstatt geöffnet. Zum erneuten Bearbeiten die Werkstatt-Datei öffnen und eine gespeicherte Variante laden; nicht gespeicherte Einstellungen stehen weiterhin in der Spieladresse, werden jedoch nicht automatisch als Browser-Variante gespeichert.

Die reine Spielansicht zeigt keine Überschriften, Beispielaufträge oder Bearbeitungslinks. Start, Pause, Neustart, Leben und gegebenenfalls Timer bleiben bedienbar. Die aufklappbare Tastatur-Wörterliste bleibt als alternative Bedienung erhalten. Der Rahmen wird ohne Verzerrung der Kreise ausgefüllt; sehr flache Rahmen lassen gegebenenfalls seitliche Ränder, damit Spielfeld und Ziele vollständig sichtbar bleiben. „Hintergrund transparent“ entfernt den Seiten- und Canvas-Hintergrund. Die Werkstatt markiert transparente Flächen mit einem Schachbrett; in der Spielansicht scheint der tatsächliche Elternhintergrund durch.

„Feste Spielansicht erzeugen“ erzeugt eine URL mit kompletter Szenario-Momentaufnahme im URL-Fragment sowie den iFrame-Code. Bearbeitungen anderer Varianten verändern diese Momentaufnahme nicht. Das gilt für Inhalte und Einstellungen; spätere Änderungen der Spielsoftware gelten weiterhin für alle Varianten. Für eine feste eingebettete Runde diesen erzeugten Link verwenden; die einfache `?embed=1`-Adresse lädt immer die Standard-JSON-Datei. Lange Links müssen noch im tatsächlichen Genially-Editor geprüft werden. Jeder mit der Spieladresse kann den Lösungscode auslesen; er ist ein Rätselcode, kein Zugriffsschutz.

## Dateien

- `build_standalone.py`: packt die gepflegten Quelltexte, CSS und Beispiel-JSON in die eigenständig lauffähigen `index.html` und `werkstatt.html`. Nach Quelltextänderungen mit `python3 sonstiges/bubble-match/build_standalone.py` aktualisieren.
- `engine.mjs`: Konfiguration prüfen, Zustände, Bewegung, Zuordnung, gemessene Textanpassung.
- `app.mjs`: Zeichnen, Pointer-Bedienung, Editor, lokale Varianten und JSON.
- `scenarios/knotberg.json`: klar gekennzeichnete Beispielinhalte; Code-Modus je Kategorie mit Beispielzeichen `4`, `2`, `7`, `3` (Gesamtcode `4273`). Alternativ gemeinsamer Beispielcode `WALD-42`.
- `engine.test.mjs`: automatisierte Mechanikprüfung, ohne zusätzliche Pakete: `node sonstiges/bubble-match/engine.test.mjs` aus der Repository-Wurzel.

## Hostingbefund und geplanter Ablauf

Remote: https://github.com/lernraum-digital/Interaktive-Lernumgebungen, öffentlich, Standardbranch `main`. GitHub-Plugin bestätigt Repository und Schreibrechte. Bestehende Website https://lernraum-digital.github.io/Interaktive-Lernumgebungen/ antwortet mit HTTP 200. Lokal gibt es keinen `.github/workflows`-Ordner. Die öffentliche, nicht authentifizierte Pages-Konfigurationsabfrage antwortet mit 404; daraus lässt sich der verwendete Veröffentlichungsbranch nicht sicher bestimmen.

Vor Veröffentlichung in Repository Settings → Pages Quelle (Branch/Ordner oder Actions) authentifiziert prüfen. Danach ausschließlich diesen Unterordner gezielt committen und auf die bestätigte Quelle bringen. Keine fremden, bereits vorhandenen Änderungen übernehmen. Der vorgesehene öffentliche Spielpfad ist `/Interaktive-Lernumgebungen/sonstiges/bubble-match/`; er wurde noch nicht bereitgestellt oder geprüft.

Genially-Referenz: https://view.genially.com/6abbf87274fde50f8ede2fb7 (sichtbarer Titel: „Knotbert und der verflixte Märchenknoten“). Die veröffentlichte Ansicht wurde geöffnet; sie ist kein Bearbeitungszugang. Nach einer gesonderten Testveröffentlichung den festen Spiel-Link im Genially-Editor in eine Testkopie einbetten. Im veröffentlichten Genially-Player insbesondere Pointer-Capture, Touch, Scrollen, Neustart, Seitenwechsel und Linklänge testen. Es gibt keine automatische Seitenweiterleitung oder native Aktionsmenü-Abhängigkeit.

## Prüfstand — 14.10.2026

Bestanden:

- Mechanik: alle drei Anordnungen × Kugelgrößen 64/108/150 × Spielfeld 1000×760 und 600×1000. Je fünf **simulierte** Minuten Bewegung mit festen Zufallsdaten, Randgrenzen, Kollisionsabständen, keine automatischen Zuordnungen, Niederlage, kompletter Reset, Sieg mit allen zwölf Wörtern. Das ist keine fünfminütige Prüfung auf einem echten iPad.
- Mechanik: Zeitablauf, Timer-Reset, ungültiges Szenario.
- Textmessung: zusätzliche lokale Canvas-Prüfung mit vier angebotenen Schriftarten × drei Kugelgrößen, allen Beispielwörtern und einem langen zusammengesetzten Wort. Extrem lange Wörter werden bei 64px gegebenenfalls mit Hinweis auf größere Kugeln abgewiesen, statt unter 10px verkleinert. Systemschrift-Ersatz kann zwischen Geräten abweichen; visuell im Browser wurde insbesondere Georgia geprüft.
- Browser: gezeichnete richtige Verbindung mit Maus, falsche Zuordnung mit Lebenverlust, Lebens-Niederlage und Neustart, vollständiger Sieg und sichtbarer Code WALD-42, Zeitablauf und Neustart.
- Browser: Speichern, Duplizieren, Laden, unabhängige Spieladresse mit Originalinhalt und ohne Editor.
- Lokaler 390-Pixel-iFrame: Spiel lädt, Start und Pause funktionieren, schmale Spielfeldgeometrie wird verwendet, Wortkreise und Ziele visuell geprüft.

Noch offen:

- Reales iPad/Safari mit Touch (kein Touchgerät in dieser Sitzung getestet).
- Echte Einbettung in Genially und Langzeitlauf im Player.
- Gezielte Pointer-Abgaben exakt auf jeder Zielkante und -ecke sowie Multi-Touch-Störfälle.
- Browserprüfung aller Schriftgrößen-/Schriftartenkombinationen und aller schmalen Anordnungen.
- JSON-Dateiimport/-export als vollständiger Download-/Upload-Rundlauf.
- Authentifizierte Pages-Konfiguration und Veröffentlichung.

Der Prototyp ist lokal prüfbar; diese offenen Prüfungen sind vor dem Unterrichtseinsatz abzuarbeiten.

## Korrektur: Direktes Öffnen

Die ursprüngliche Modul-/JSON-Ladeweise wurde für `index.html` durch eingebettete klassische JavaScript-, CSS- und Szenario-Inhalte ersetzt. Syntax sowie Mechanik erneut geprüft. Der integrierte Prüf-Browser erlaubt keine file://-Adressen; der direkte Doppelklick muss deshalb abschließend im Browser des Nutzers bestätigt werden.

## Ansichten und Transparenz — zusätzlicher Prüfstand

Browsergeprüft: Werkstatt-Datei öffnet die Bearbeitung; geänderte Anordnung und Transparenz werden durch „Bearbeitung schließen“ übernommen. Überschrift, Auftrag, Editor und Bearbeitungslink sind danach visuell verborgen. Erneutes Laden der Adresse erhält die Spielansicht und Konfiguration. Transparente Seiten- und Canvas-Flächen lassen in lokalen 800×450- und 390×600-iFrames einen sichtbaren Musterhintergrund durch. Alle vier Ziele bleiben im Rahmen, im Querformat ohne Scrollen. Automatisiert zusätzlich geprüft: Umformatierung während einer Gleitbewegung für alle drei Anordnungen und drei Kugelgrößen, anschließend Bewegung und vollständiger Sieg ohne Verlust von Wörtern, Leben oder Timer. Alte Szenarien ohne Transparenzfeld bleiben kompatibel. Genially und reales iPad wurden dabei nicht geprüft.

## Wörterlisten, Kategoriecode und Ablauf

Alle gesammelten Wörter werden als echte Textliste in der jeweiligen Kategorie angezeigt. Bei den drei Beispielwörtern je Kategorie sind alle gleichzeitig sichtbar. Bei sehr vielen oder langen Wörtern und kleinen Rahmen kann die vollständige Liste innerhalb der Kategorie gescrollt werden; es gibt kein „plus weitere“. Die Auswahl „Gesammelte Wörter anzeigen“ bleibt erhalten. Die Zielkarten nehmen Touch-/Mausabgaben und Wort-anschließend-Ziel-Tippen entgegen.

„Code anzeigen“ bietet einen gemeinsamen Code am Ende, einen Codeplatz je Kategorie oder eine reine Erfolgsmeldung ohne Code. „Codezeichen bei vollständiger Kategorie“ legt das zugehörige Zeichen fest. Eine Kategorie enthüllt ihren Code erst, nachdem alle ihre Wörter angekommen sind, und behält unabhängig von der Lösungsreihenfolge ihren Platz. Neustart leert Wörterlisten und Codeplätze. Der Gesamtcode im Erfolgsfenster setzt sich im Kategorie-Modus aus den Zeichen in Kategorienreihenfolge zusammen. Alte Szenarien ohne diese Felder bleiben im bisherigen Abschlussmodus. Kategorienzahl ist auf zwei bis vier einstellbar; die drei Anordnungen passen sich daran an. Beim Reduzieren werden die letzten Kategorien aus der aktuellen Variante entfernt; bei Erhöhen werden neue Beispielkategorien angelegt.

Der konkrete Ablauf:

1. `werkstatt.html` öffnen, gespeicherte Variante laden oder Einstellungen vornehmen.
2. „Im Browser speichern“ für spätere Bearbeitung, beziehungsweise „Szenario als Datei speichern“ für eine übertragbare Sicherung.
3. „iFrame-Code erzeugen“ klicken. Die erzeugte Spieladresse enthält einen festen Stand sämtlicher Einstellungen, einschließlich Farben und Codezeichen.
4. „Übernehmen und schließen“ zeigt dasselbe Spiel mit diesen Einstellungen als Vorschau. Dadurch werden weder `index.html` auf der Festplatte noch eine GitHub-Seite überschrieben.
5. Für eine spätere Einbettung den erzeugten Code mit einer öffentlich erreichbaren Spieladresse verwenden. `file://` und lokale Vorschau-Adressen sind in Genially nicht erreichbar; Veröffentlichung bleibt ein gesonderter späterer Schritt.

Zusätzlich geprüft: Kategoriecode, Enthüllung nach Ende der Gleitbewegung, feste Reihenfolge und Reset automatisiert für zwei bis vier Kategorien und alle Anordnungen. Im Browser alle zwölf Beispielwörter gelöst, alle drei Wörter je gelöster Kategorie sichtbar, Beispielcode 4273 bestätigt und Wörter-/Code-Reset geprüft. Zwei Kategorien im Editor gewählt und eine grüne Rahmenfarbe über die erzeugte unabhängige Spieladresse in die Spielansicht übertragen. Das Nachrücken von Wörtern aktualisiert jetzt auch die Tastatur-Wörterliste, wenn ein Wort erst etwas später Platz auf dem Spielfeld findet. Genially-Einbettung und reales iPad bleiben offen.

## Start, Leben und Abschluss — zusätzlicher Prüfstand

In der Werkstatt gibt es drei „Startart“-Optionen: Button über dem Spielfeld, automatischer Start beim Öffnen der Spielansicht, und einen großen Play-Button über dem verschwommenen Spielfeld. Die Startbutton-Beschriftung ist frei einstellbar. In der Bearbeitung bleiben Vorschauen zunächst bereit; die automatische Startart greift beim Schließen der Bearbeitung oder Öffnen des erzeugten Spiel-Links. Ein verborgenes Browserdokument wartet mit dem automatischen Start bis zur Sichtbarkeit. Eine laufende Runde pausiert beim Verlassen des Tabs weiterhin und lässt sich mit „Weiter“ fortsetzen.

Leben stehen in einer eigenen Anzeige links. Verbrauchte Herzen werden grau, damit Start-Leben und Rest-Leben erkennbar bleiben. Die Codeplätze sind vergrößert. Ein Neustartknopf erscheint ausschließlich im Abschlussfenster nach Lebensverlust, Zeitablauf oder Sieg. Der Spielhintergrund wird am Rundenende verschwommen; der Neustart beginnt direkt eine vollständig zurückgesetzte Runde, unabhängig von der ursprünglichen Startart.

„Nur Erfolgsmeldung, ohne Code“ zeigt weder Codeplätze während des Spiels noch einen Code nach dem Sieg. Die Erfolgsmeldung ist frei editierbar; die Beispielmeldung ist jetzt neutral und passt auch zu Übungen außerhalb eines Escape Rooms. Unbenutzte Code-Eingabefelder sind im Editor deaktiviert. Geschwindigkeit ist weiterhin von 0 bis 120 einstellbar. Die richtige Bubble wird erst nach ihrer weich beschleunigten und abgebremsten Gleitbewegung von 0,8 Sekunden gesammelt.

Browsergeprüft: Play-Start und frei gewählte Beschriftung, verschwommener Wartezustand, laufende Runde ohne sichtbaren Neustartknopf, drei Fehlzuordnungen, graue verbrauchte Herzen, Niederlage mit Neustart, vollständiger Reset, Auto-Start sowohl nach Schließen der Werkstatt als auch über einen neu geöffneten Spiel-Link, Sieg mit frei formulierter Meldung ohne Code, Zeitablauf und Neustart im automatisch startenden lokalen iFrame. Die großen Codeplätze bleiben im 390-Pixel-Rahmen innerhalb der Seitenbreite. Automatisiert zusätzlich geprüft: neue Startoptionen und Kompatibilität alter Szenarien, Abschluss ohne Code und messbare Zwischenposition der Gleitbewegung vor der Sammlung. Die bisherigen Bewegungs-, Layout-, Code- und Resetprüfungen bestehen weiterhin.

Offen bleibt das Verhalten beim echten Genially-Seitenwechsel: Ein Player kann eingebettete Frames bereits vor dem sichtbaren Wechsel laden oder später wiederverwenden. Der Auto-Start ist an das Laden bzw. die Browser-Sichtbarkeit der eigenständigen Spielansicht gebunden; Genially-spezifische Auslösung wird bei der späteren Einbettung geprüft. Reales iPad-Touch ist ebenfalls noch offen.

## Kopieren und Anzeigen

Das Ausgabefeld enthält ausschließlich den vollständigen iFrame-Code. „iFrame-Code kopieren“ kopiert genau diesen Inhalt über die Browser-Zwischenablage. Falls diese nicht verfügbar ist, wird klassisches Kopieren versucht; andernfalls wird der Code zum manuellen Kopieren markiert und ein Hinweis angezeigt. Es wird keine zusätzliche Spieladresse vorangestellt.

Die Herzen sind mittig, ohne sichtbares Wort „Leben“, Rahmen oder Hintergrund. Der Zuordnungszähler ist mit „Zuordnungszähler anzeigen“ optional; ein aktivierter Timer bleibt separat sichtbar. „Hintergrund der Spielanzeigen transparent“, „Hintergrundfarbe der Spielanzeigen“ und „Textfarbe der Spielanzeigen“ gelten für Zähler, Timer und Codebereich unabhängig vom Spielfeld. Bei transparentem Anzeigenhintergrund bleiben auch aufgedeckte Codefelder transparent. Die Bereiche neben den Herzen lassen Platz für einen in Genially darübergelegten Schloss-Button. Ein solcher Genially-Button wird nicht vom Spiel erzeugt.

Bestehende Szenarien ohne neue Anzeigefelder werden mit dem bisherigen Zähler und dunklem Anzeigenhintergrund geladen. Bereits gespeicherte eigene Szenarionamen werden nicht automatisch umbenannt; das neue Beispielszenario heißt „Knotbert“.

Zusätzlich geprüft: Das Ausgabefeld beginnt mit `<iframe` und endet mit `</iframe>`, der Kopierbutton wird nach Erzeugen aktiviert und die Browser-Zwischenablage-API meldet erfolgreiches Schreiben. Die endgültige Einfügeprobe im Prüf-Browser war wegen dessen separater virtueller Zwischenablage nicht möglich und bleibt als kurzer Nutzertest offen. Herzen sind auf 1406px und im 390px-iFrame exakt mittig. Transparente und frei gefärbte Anzeigen wurden über tatsächliche CSS-Werte geprüft; der Zähler lässt sich verbergen, während ein aktivierter Timer sichtbar bleibt. Die bisherigen Mechanikprüfungen bestehen.
