# Missionskonzept – Atrapados en la disco

## 1. Ziel des Umbaus

Das Spiel soll sich nicht wie eine Sammlung einzelner Übungen anfühlen, sondern wie ein zusammenhängendes 2D-Pixel-Adventure mit fünf größeren Missionen. Jede Mission verbindet mehrere kurze Lernhandlungen mit einem konkreten Problem in der Disco.

Zielgruppe ist der Spanisch-Anfangsunterricht. Das Spiel dient als motivierende Wiederholung vor einer Klausur und soll bei normalem Arbeitstempo ungefähr 30 bis 35 Minuten dauern.

### Leitlinien

- Jede Aufgabe muss einen erkennbaren Zweck innerhalb der Handlung haben.
- Jede Mission besteht aus mehreren Etappen und dauert ungefähr 5 bis 7 Minuten.
- Nach jeder Etappe wird automatisch gespeichert.
- Innerhalb einer Mission steigt die Schwierigkeit von Erkennen über Anwenden bis Transfer.
- Fehler führen nicht zu Punktverlust oder zum Verlust bereits gelöster Etappen.
- Hilfen werden gestuft angeboten: allgemeiner Hinweis, Regelhilfe, Teilhilfe.
- Codefragmente sind echte Spielgegenstände und werden im Finale benötigt.
- Freiwillige Extras bleiben möglich, sind aber visuell von der Hauptmission getrennt.

## 2. Geplanter Gesamtumfang

| Abschnitt | Richtzeit | Pflichtetappen | Schwerpunkt |
|---|---:|---:|---|
| Intro und Avatar | 2–3 Min. | – | Rahmenhandlung |
| Mission 1: Entrada / Guardarropa | 5–6 Min. | 5 | Genus, Artikel, Plural, Spanien |
| Mission 2: La barra | 6–7 Min. | 5 | Personen, Herkunft, Sprachen, Berufe |
| Mission 3: La pista de baile | 6–7 Min. | 5 | regelmäßige Verben auf `-ar` |
| Mission 4: Cabina del DJ | 5–6 Min. | 4 | `ser` und `estar`, Länder beschreiben |
| Mission 5: Puerta de seguridad | 4–5 Min. | 4 | Fragewörter, Pronomen, Transfer, Code |
| **Gesamt** | **ca. 30–35 Min.** | **23 Etappen** | Wiederholung Anfangsunterricht |

Die Zeitangaben sind Zielwerte. Nach dem ersten vollständigen Testdurchlauf müssen sie mit Lernenden oder mindestens mit realistischem Lesetempo überprüft werden.

## 3. Missionsmodell für den späteren Code

Eine Mission soll später nicht mehr nur eine ungeordnete Liste von Aufgaben anzeigen. Sie erhält eine feste Abfolge von Etappen:

```text
Auftrag durch NPC oder Szene
→ Etappe 1
→ kurze Reaktion / sichtbare Veränderung
→ Etappe 2
→ Etappe 3
→ Transfer- oder Abschlussaufgabe
→ Belohnungsdialog
→ Codefragment / Schlüssel / Sticker
```

Für den Speicherstand sollte jede Mission mindestens diese Zustände kennen:

- `locked`: noch nicht zugänglich
- `available`: kann begonnen werden
- `inProgress`: mindestens eine Etappe gelöst
- `completed`: alle Pflichtetappen gelöst
- `rewardClaimed`: Belohnung wurde gezeigt und gespeichert

Jede Etappe erhält zusätzlich einen eigenen Status. Dadurch können Lernende eine Mission verlassen und später an der richtigen Stelle fortsetzen.

## 4. Mission 1 – El guardarropa perdido

### Handlung

Im Eingangsbereich sind Garderobenmarken, Gegenstandskarten und eine Spanienkarte durcheinandergeraten. Die Spielfigur muss alles ordnen, um das erste Codefragment zu finden.

### Lernziele

- Genus spanischer Substantive erkennen
- bestimmte und unbestimmte Artikel anwenden
- Singular- und Pluralformen bilden
- grundlegenden Spanienwortschatz wiederholen

### Etappen

| Nr. | Etappe | Aufgabentyp | Grundlage | Entscheidung |
|---:|---|---|---|---|
| 1 | Gegenstände in der Garderobe finden | visuelle Hotspots | `hub_hotspot_generos_01` | **stark überarbeiten** |
| 2 | Fundstücke auf `el` und `la` verteilen | Zuordnung | `hub_genero_01` | **behalten, kürzen und ins Szenario einbetten** |
| 3 | Fehlende Artikel auf Garderobenkarten ergänzen | Chip-Lücken | `hub_articulo_01` | **erweitern** |
| 4 | Singular- und Pluralkarten zusammensetzen | Zuordnung | `hub_plural_01` | **behalten, visuell verbessern** |
| 5 | Hinweise auf der Spanienkarte lokalisieren | Kartenaufgabe | `hub_mapa_01` | **inhaltlich neu bauen** |

### Notwendige Korrekturen

- Die Hotspots dürfen die Lösung nicht bereits durch `el` oder `la` verraten. Im Bild werden Gegenstände direkt angetippt; der Begriff erscheint erst danach.
- Die Spanienkarte darf keine allgemeinen Begriffe willkürlich Punkten zuordnen. Verwendet werden konkrete, erkennbare Ziele, zum Beispiel `Madrid`, `los Pirineos`, `Mallorca`, `Valencia` und `Andalucía`.
- Für die Hotspot-Aufgabe muss ein eigener Szenenhintergrund eingetragen werden.

### Neue oder erweiterte Inhalte

- Etappe 3 benötigt mindestens vier kurze Sätze statt nur einer Lücke.
- Nach Etappe 2 sollte eine knappe Regelkarte zu häufigen Endungen erscheinen, ohne sie als ausnahmslose Regel darzustellen.
- Bonus: schwierige Pluralformen wie `país → países` und `capital → capitales`.

### Belohnung

- Codefragment `03`
- Sticker „Explorador/a de España“
- In der Hub-Szene geht das Licht am Weg zur Bar an.

## 5. Mission 2 – Los invitados de la barra

### Handlung

Die Camarera hat die Namens-, Länder-, Sprach- und Berufskarten mehrerer internationaler Gäste verwechselt. Die Lernenden erstellen korrekte Gästekarten und helfen bei der Verständigung.

### Lernziele

- nach Namen und Herkunft fragen
- Personen vorstellen
- Länder, Sprachen und Nationalitäten verbinden
- Berufe benennen
- passende Verbformen in der dritten Person verwenden

### Etappen

| Nr. | Etappe | Aufgabentyp | Grundlage | Entscheidung |
|---:|---|---|---|---|
| 1 | Mercedes, Camille und Luca verstehen | lokale Hörstation mit Detailfragen | `bar_hoerstation_gaeste` | **umgesetzt** |
| 2 | Fragen zuordnen und Camilles Karte ergänzen | Zuordnung + Lückentext | `bar_preguntas_respuestas`, `bar_perfil_invitada` | **umgesetzt** |
| 3 | Land, Sprache und Nationalität unterscheiden | Profilrekonstruktion + Rechtschreibvarianten | `bar_paises_lenguas_01` und Vertiefungen | **umgesetzt** |
| 4 | Internationale Schnellrunde | adaptive Quizrunde | `bar_quiz_paises` | **umgesetzt** |

### Notwendige Korrekturen

- Prominentenwissen wurde vollständig durch fiktive, dauerhaft verwendbare Gäste ersetzt.
- Die Hörstation verwendet vier lokale Audiodateien und funktioniert ohne Internetverbindung.
- Land, Sprache und Nationalität werden in vollständigen Profilen unterschieden; typische Schreibfehler dienen als plausible Ablenker.
- Nicht gelöste Fragen der Schnellrunde kehren am Ende wieder, bereits richtige Antworten bleiben erhalten.

### Inhaltliche Ausgestaltung

Für eine dauerhafte und visuell konsistente Version werden ausschließlich fiktive internationale Discogäste verwendet.

Beispiel für eine Gästekarte:

```text
Nombre: Camille
País: Francia
Nacionalidad: francesa
Lenguas: francés y un poco de español
Profesión: estudiante
```

### Neue Inhalte

- Mindestens vier Frage-Antwort-Paare mit `¿Cómo se llama?`, `¿De dónde es?`, `¿Qué idiomas habla?` und `¿De qué trabaja?`.
- Drei kurze Steckbriefe mit ansteigender Unterstützung.
- Bonus: Eine freie Mini-Vorstellung mit auswählbaren Satzbausteinen.

### Belohnung

- Codefragment `27`
- Sticker „Camarero/a honorario/a“
- Die Neonbeleuchtung der Bar wechselt von Rot zu Cyan.

## 6. Mission 3 – El ritmo de los verbos

### Handlung

Marta und Lucía wollen eine internationale Tanzgruppe organisieren. Dafür müssen Gesprächs- und Aktionskarten im richtigen Rhythmus zusammengesetzt werden.

### Lernziele

- Personalpronomen und regelmäßige Verbformen verbinden
- Präsensformen regelmäßiger Verben auf `-ar` bilden
- `hablar`, `estudiar`, `trabajar` und `charlar` anwenden
- einen einfachen Kennenlerndialog verstehen

### Etappen

| Nr. | Etappe | Aufgabentyp | Grundlage | Entscheidung |
|---:|---|---|---|---|
| 1 | Pronomen auf die passenden Beat-Spuren setzen | Zuordnung | neu | **neu erstellen** |
| 2 | Verbendungen ergänzen | mehrteilige Chip-Lücken | neu | **neu erstellen** |
| 3 | Vier Verben in kurzen Situationen konjugieren | Aufgabenfolge | `pista_hablar_01`, `pista_verbos_tabla`, `pista_verbo_trabajar`, `pista_verbo_charlar` | **zu einer Etappe bündeln** |
| 4 | Fehler in einem Party-Chat verbessern | Fehlerkorrektur | neu | **neuen Aufgabentyp oder Auswahlvariante erstellen** |
| 5 | Kennenlerndialog ordnen | Sortieren | `pista_reorder_dialogo` | **behalten und leicht erweitern** |

### Notwendige Korrekturen

- Die vier Einzellücken dürfen nicht länger als vier getrennte Menüeinträge erscheinen.
- Die Dialogkette muss `trabajar` und `charlar` einschließen; derzeit werden beide Pflichtaufgaben übersprungen.
- Bei Akzentfehlern sollte die Antwort als sprachlich richtig mit Korrekturhinweis behandelt werden: `trabajais` wird akzeptiert, aber als korrekte Schreibweise wird `trabajáis` angezeigt.

### Neue Inhalte

- Ein vollständiges, aber kompaktes Endungsschema `-o, -as, -a, -amos, -áis, -an`.
- Eine Fehlerkorrektur mit typischen Verwechslungen wie `yo hablas` oder `nosotros estudian`.
- Optional eine kurze Rhythmusrunde ohne harten Neustart bei Fehlern.

### Visuelles Feedback

- Mit jeder gelösten Etappe werden mehr Figuren auf der Tanzfläche sichtbar.
- Eine Beat- oder Equalizeranzeige füllt sich.
- Beim Missionsabschluss geht die Spiegelkugel an.

### Belohnung

- Codefragment `14`
- Sticker „Estrella de la pista“

## 7. Mission 4 – Las dos pistas del DJ

### Handlung

Der DJ hat Sätze auf zwei Tonspuren verteilt: `SER` und `ESTAR`. Einige Karten liegen auf der falschen Spur. Danach muss eine Länderbeschreibung für die nächste Ansage vorbereitet werden.

### Lernziele

- Eigenschaften und Identifikation mit `ser` ausdrücken
- Ort und Lage mit `estar` ausdrücken
- Singular- und Pluralformen anwenden
- Spanien und Argentinien in einfachen Sätzen beschreiben

### Etappen

| Nr. | Etappe | Aufgabentyp | Grundlage | Entscheidung |
|---:|---|---|---|---|
| 1 | Sätze auf die Spuren `SER` und `ESTAR` legen | Zuordnung | neu aus vorhandenen Sätzen | **neu gruppieren** |
| 2 | Spanien beschreiben | mehrteilige Chip-Lücken | `dj_ser_estar_01` und `dj_ser_estar_02` | **zu einer Etappe bündeln** |
| 3 | Fehler des DJs korrigieren | Auswahl/Fehlerkorrektur | neu | **neu erstellen** |
| 4 | Argentinien als Transfer beschreiben | mehrteilige Chip-Lücken | `dj_describe_argentina` | **behalten und erweitern** |

### Notwendige Korrekturen

- `dj_ser_estar_02` muss in die Dialogkette aufgenommen werden.
- Feedback soll die jeweilige Entscheidung erklären: Eigenschaft, Identifikation, Ort oder Lage.
- Die Regel darf nicht pauschal als „dauerhaft gegen vorübergehend“ vermittelt werden; für diesen Lernstand werden die tatsächlich verwendeten Funktionen benannt.

### Neue Inhalte

- Vier bis sechs Sortiersätze für die beiden DJ-Spuren.
- Zwei typische Fehler zur Korrektur, beispielsweise `Madrid es en el centro`.
- In der Transferetappe mindestens vier Lücken oder Satzbausteine.

### Belohnung

- Codefragment `58`
- Sticker „DJ de honor“
- Der DJ spielt nach Abschluss hörbar beziehungsweise sichtbar den vollständigen Track.

## 8. Mission 5 – El código de la puerta

### Handlung

Die Sicherheitstür besitzt ein Terminal mit vier Steckplätzen. Die gesammelten Codefragmente müssen in der Reihenfolge der besuchten beziehungsweise auf der Disco-Karte markierten Bereiche eingesetzt werden. Danach folgt ein kurzes Abschlussgespräch mit dem Conserje.

### Lernziele

- Fragewörter passend verwenden
- Subjektpronomen zuordnen
- Inhalte der vorherigen Missionen integriert abrufen
- einen kurzen Kennenlerndialog verstehen

### Etappen

| Nr. | Etappe | Aufgabentyp | Grundlage | Entscheidung |
|---:|---|---|---|---|
| 1 | Codefragmente ordnen und eingeben | Codeschloss | neu | **neu erstellen** |
| 2 | Fragen des Conserje beantworten | Zuordnung | `finale_preguntas_01` | **überarbeiten** |
| 3 | Pronomen und Sätze verbinden | Zuordnung | `finale_pronombres_01` | **behalten** |
| 4 | Abschlussgespräch zusammensetzen | Sortieren/Dialog | `finale_conversacion_final` | **behalten und inszenieren** |

### Codeschloss

Die Fragmente lauten zunächst:

```text
03 – 27 – 14 – 58
```

Die richtige Reihenfolge muss im Spiel eindeutig herleitbar sein. Empfohlen wird eine Disco-Karte mit vier nummerierten Symbolen. Ein bloßes Ausprobieren aller Reihenfolgen soll nicht die schnellste Strategie sein.

Nach korrekter Eingabe:

1. Terminal wechselt von Rot auf Grün.
2. Ein Schlossgeräusch wird abgespielt, sofern Ton aktiviert ist.
3. Der Conserje erscheint.
4. Das Abschlussgespräch beginnt.
5. Die Tür öffnet sich sichtbar erst nach Abschluss der Sprachaufgaben.

### Notwendige Korrekturen

- Der Sprechername wird vollständig von `Hausmeister` auf `Conserje` umgestellt.
- `¿Quién?` zu `Se llama Penélope Cruz` wird durch ein eindeutigeres Frage-Antwort-Paar ersetzt.
- Beim Abschluss darf nicht irrtümlich „Código guardado“ erscheinen; stattdessen wird „¡Puerta abierta!“ angezeigt.
- Die bereits vorhandene Geschichte zur Freischaltung des Finales muss tatsächlich ausgelöst werden.

### Belohnung

- Schlüssel beziehungsweise geöffnete Tür
- Sticker „¡Escapaste de la disco!“
- Abschlusspunktzahl und kurze Übersicht der gemeisterten Lernbereiche

## 9. Übergreifendes Feedbacksystem

Das bisherige allgemeine Feedback `¡Casi! Inténtalo de nuevo.` bleibt als erste Reaktion erhalten, wird aber durch gestufte Hilfen ergänzt.

### Stufe 1 – Ermutigung

Kurze Rückmeldung ohne Lösung, zum Beispiel:

- `¡Casi! Mira otra vez el sujeto.`
- `Piensa: ¿hablamos de una característica o de un lugar?`

### Stufe 2 – Regelhilfe

Nach einem weiteren Fehler erscheint eine passende Regel oder ein Beispiel.

### Stufe 3 – Teilhilfe

Nach mehreren Fehlern wird eine unpassende Option entfernt, eine Endung markiert oder der relevante Satzteil hervorgehoben.

### Nach der Lösung

Bei zentralen Grammatikaufgaben erscheint eine sehr kurze Begründung. Sie muss wegklickbar sein und darf den Spielfluss nicht unnötig verlangsamen.

## 10. Punkte und Bewertung

Punkte dienen der Motivation, nicht der Bestrafung.

- Pflichtetappe: 10 bis 15 Punkte
- anspruchsvolle Transferetappe: 15 bis 20 Punkte
- freiwillige Zusatzaufgabe: 5 bis 10 Punkte
- keine Minuspunkte für Fehler
- keine zusätzlichen Punkte beim wiederholten Lösen derselben Etappe

Optional kann am Ende eine wertfreie Rückmeldung erscheinen:

- alle Missionen abgeschlossen
- Anzahl gelöster Extras
- verwendete Hilfen
- noch einmal übbare Lernbereiche

Eine Rangliste ist für die Klausurvorbereitung nicht vorgesehen.

## 11. Navigation und Darstellung

### Hub

Der bisherige Karten-Hub wird perspektivisch durch eine zusammenhängende Disco-Szene ersetzt. Für den ersten technischen Umbau kann die Kartenansicht bestehen bleiben, solange die Missionen bereits als zusammenhängende Abläufe funktionieren.

### Missionsansicht

Die Lernenden sehen nicht alle Einzelaufgaben als lange Liste. Stattdessen werden angezeigt:

- Name und Ziel der Mission
- aktueller Missionsschritt
- Fortschritt, beispielsweise `3/5`
- NPC und aktuelle Reaktion
- Schaltfläche zum Fortsetzen
- freiwillige Extras erst nach oder neben der Hauptmission

### Wiederholen

Nach Abschluss einer Mission kann sie frei erneut geöffnet werden. Wiederholungen verändern die erhaltene Belohnung nicht und vergeben keine doppelten Punkte.

## 12. Technische Korrekturen vor der Bildproduktion

Folgende Punkte sollten umgesetzt werden, bevor alle finalen Assets erzeugt werden:

1. Missions- und Etappenmodell in den Inhaltsdaten ergänzen.
2. Speicherstand auf Missionen und Etappen erweitern und alte Speicherstände migrieren.
3. Dialogabläufe an die vollständigen Pflichtetappen koppeln.
4. Codeschloss und echte Verwendung des Inventars implementieren.
5. unbenutzte Storyübergänge einbauen.
6. Hotspot- und Memory-Aufgaben korrigieren.
7. Vorschaubilder im Asset-Manifest ergänzen oder direkt aus Hauptbildern erzeugen.
8. fehlenden Garderoben-Hintergrundspfad ergänzen.
9. mehrere Nutzerprofile für gemeinsam verwendete iPads konzipieren.
10. grundlegende Tests für Freischaltung, Speicherung und Belohnungen ergänzen.

## 13. Asset-Konzept und Pixelauflösung

Die sichtbare Größe der Szenen auf dem iPad bleibt groß und responsiv. Empfohlen wird:

- Gestaltungsraster: 400 × 250 oder 480 × 300 Pixel
- finale Datei: 1600 × 1000 beziehungsweise ein anderes ganzzahliges Vielfaches
- Skalierung: ohne Glättung / Nearest Neighbor
- Anzeige im Spiel: volle verfügbare Breite
- keine wichtigen Informationen direkt am äußersten Bildrand
- wichtige Gegenstände deutlich größer als realistische Maßstäbe es verlangen würden

Zuerst wird ein visueller Prototyp erstellt, bestehend aus:

- Hub oder Garderobenszene
- einem Avatar
- einem NPC
- Dialogbox
- Missionsanzeige
- einem Aufgabenfenster
- einem Codefragment

Erst nach Prüfung dieses Prototyps auf dem iPad werden alle übrigen Bilder als zusammenhängende Serie produziert.

## 14. Empfohlene Implementierungsreihenfolge

### Umbau 1 – Daten und Spielfluss

- Missionsdaten definieren
- vorhandene Aufgaben gruppieren
- neue Platzhalter-Etappen anlegen
- Speichermodell erweitern
- Dialoge und Belohnungen reparieren

### Umbau 2 – Aufgabenqualität

- Hotspot- und Memory-Probleme lösen
- neue mehrteilige Aufgaben ergänzen
- gestuftes Feedback implementieren
- Codeschloss bauen

### Umbau 3 – Visueller Prototyp

- neue Missionsoberfläche
- Pixel-Rahmen und Farbkonzept
- eine vollständige Szene mit finalen Beispielassets
- iPad-Test in Hoch- und Querformat

### Umbau 4 – Vollständige Ausstattung

- alle Hintergründe und Figuren erstellen
- Zustandsbilder und kleine Animationen ergänzen
- Sound und Musik einbauen
- Abschlussdurchlauf und Zeitmessung

## 15. Abnahmekriterien

Der Umbau gilt als inhaltlich und spielerisch erfolgreich, wenn:

- ein vollständiger Durchlauf ungefähr 30 bis 35 Minuten dauert,
- alle zentralen Lernziele tatsächlich mehrfach angewendet werden,
- keine Pflichtaufgabe durch Dialoge übersprungen wird,
- jede Mission als zusammenhängender Auftrag verständlich ist,
- die Codefragmente für das Finale notwendig sind,
- der Fortschritt nach jeder Etappe erhalten bleibt,
- keine Aufgabe durch uneindeutige oder bereits verratene Lösungen unfair ist,
- Texte und Bedienelemente auf dem iPad gut lesbar und antippbar sind,
- Hoch- und Querformat ohne abgeschnittene Inhalte funktionieren,
- das Spiel auch ohne Ton vollständig nutzbar bleibt.
