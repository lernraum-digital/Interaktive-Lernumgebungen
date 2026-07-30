# Materialanalyse für den EF-Verbentrainer

Stand: 30. Juli 2026

Diese Übersicht trennt die belegte Wortschatzbasis von der Anwendung. Die Originalmaterialien in `../Verbentrainer Material/` wurden nicht verändert.

## Ausgewertete Quellen

| Datei | Inhalt | Verwendung |
|---|---|---|
| `Vocabulario básico.pdf` | Grundwortschatz Unidad 1-4 | Infinitive, Bedeutungen, Gruppen und Themen |
| `Clase de Español EF (2).pdf` | Unidad 1 | regelmäßige Verben, Subjektpronomen, Beispiele |
| `Mi gente y mi barrio (3).pdf` | Unidad 2 | `tener`, `querer`, `ir`, `poder`, `probar`, `costar` |
| `Me gusta  Unidad 3.pdf` | Unidad 3 | Freizeitwortschatz und Kontexte |
| `El día a día.pdf` | Unidad 4 | Uhrzeit, `empezar`, `terminar`, `abrir`, `saber` |
| `Esto es España (1).pdf`, `Esto es Espana-2.pdf` | Landeskunde | grundlegender Satz- und Ortswortschatz |
| `Ejercicios Vorkurs  (repaso)-2.pdf` | Arbeitsblatt | Formen von `hablar`, `ser`, `estar`, `trabajar` |
| `Hoja de ejercicios (2)-2.pdf` | Arbeitsblatt | Frage- und Länderstrukturen |
| sieben Screenshots | Lehrwerksliste S. 194-207 | Bedeutungen, Lektionen, Sätze, Unregelmäßigkeiten |

Auch die EF-Übersicht, `ser-und-estar` und `ruta-espana-starterpaket` mit HTML, CSS, JavaScript, Daten, Tests und Bildern wurden geprüft. Der Trainer ist technisch getrennt und verwendet relative Pfade.

## Übernommene Inhalte

Die Fachdaten stehen in `data/verbs.js`. Sie umfassen Verben aus Unidad 1-4: regelmäßige Verben auf -ar/-er/-ir, e→ie, o→ue, u→ue, besondere yo-Formen, mehrfach und vollständig unregelmäßige Verben. Verwendet werden die belegten Formen `yo`, `tú`, `él/ella`, `nosotros/-as`, `vosotros/-as`, `ellos/ellas`. `usted/ustedes` erscheinen mangels eindeutigem Einführungsbeleg nicht.

Lückensätze werden nur aus einzeln hinterlegten Quellsätzen erzeugt. Jeder nennt Schablone, Person, Lösung, Wortschatz und Quelle. Verben ohne eindeutigen kurzen Satz erhalten keine Satzaufgabe.

## Unklare oder widersprüchliche Stellen

- `decribir` ist vermutlich `describir`; nicht aufgenommen.
- `empezar (e-io)` widerspricht dem belegten `empieza`; fachlich korrekt als e→ie erfasst und hier dokumentiert.
- `Qué e parece…?` und `To tengo (ni) idea.` sind fehlerhaft/unvollständig; nicht verwendet.
- Die Konstruktion zu `pasar Zeit verbringen` ist unvollständig; nicht aufgenommen.
- Bloße Lehrbuchverweise gelten nicht allein als Satzbeleg.
- `llamarse` erscheint vor allem als `se llama`; keine vollständige Reihe abgeleitet.
- Imperativ, Reflexivverben und Futur aus Unidad 4 bleiben wegen des Umfangs „nur Präsens“ außen vor.

## Technischer Bestand

- statische, GitHub-Pages-taugliche Struktur ohne Build-Schritt
- getrennte Styles und Skripte der vorhandenen Lernangebote
- wiederverwendbare Prinzipien für lokale Speicherung und Export im Starterpaket
- keine `.openai/hosting.json`, kein notwendiges Framework
- keine vorhandenen Materialien verschoben oder gelöscht

## Überarbeitung zur kumulativen Lernfolge

Die 2026 überarbeitete Fassung trennt die vollständige materialbelegte Datenbasis von der unterrichtlichen Freigabe. `sequence` und `stage` werden aus einer zentralen Lehrkraftfolge abgeleitet. Die erste Freigabe umfasst nur `ser`, `estar`, `hablar` und `trabajar`. `escuchar` wurde ergänzt, weil es in `Vocabulario básico.pdf` und der Lehrwerksliste belegt ist; es bleibt bis Stufe 3 gesperrt.

Gesperrte Datensätze bleiben für spätere Unterrichtsphasen erhalten, werden jedoch nicht für Aufgaben, Ablenkungen, freie Filter oder Lernstatistiken verwendet. Satzbelege und die zuvor dokumentierten unklaren Stellen bleiben unverändert.
