# Lehrkraft- und Testmodus

## Direkt lokal öffnen

Die Datei `lehrkraft.html` kann im Finder direkt per Doppelklick geöffnet werden. Sie aktiviert den Lehrkraftmodus automatisch und verwendet dieselben Inhalte, Bilder und Programmdateien wie die normale Schülerversion.

## Alternativer Aufruf

Der Lehrkraftmodus kann weiterhin auch über den URL-Parameter `lehrkraft=1` aktiviert werden:

```text
index.html?lehrkraft=1
```

Bei einem lokalen Webserver wird der Parameter entsprechend an die Adresse angehängt, zum Beispiel:

```text
http://localhost:8000/index.html?lehrkraft=1
```

## Funktionen

- Direkter Zugriff auf alle Pflicht-, Bonus- und Spezialaufgaben
- Vor- und Zurückblättern durch alle Aufgaben
- Lösung jeder Aufgabe ein- und ausblenden
- Aufgabe ohne Bearbeitung als erledigt markieren
- Eigener, vom Schülerzugang getrennter lokaler Spielstand
- Teststand leeren
- Finale mit allen vier Codefragmenten sofort freischalten
- Gesamtes Spiel als abgeschlossen markieren

Der aktive Modus ist durch die Schaltfläche **Lehrkraft** in der oberen Leiste und die feste Kennzeichnung **LEHRKRAFTMODUS** am unteren Bildschirmrand erkennbar. Die normale `index.html` startet ohne URL-Parameter weiterhin ausschließlich die Schülerversion.
