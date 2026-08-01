# Asset-Manifest — "Atrapados en la disco"

Diese Datei listet alle Grafiken, die das spätere Design-Tool erzeugen soll.
Solange eine Datei fehlt, zeigt das Spiel automatisch einen grauen Platzhalter
mit Textlabel (siehe `js/ui.js`, Funktion `createImageOrPlaceholder`). Das Spiel
ist also **jederzeit vollständig spielbar**, auch ohne einziges echtes Bild.

Sobald eine Datei unter dem angegebenen Pfad/Namen abgelegt wird, verwendet
das Spiel sie automatisch — es muss kein Code geändert werden.

## Hintergründe — `assets/backgrounds/` (empfohlen 1600×1000px, Querformat, JPG oder PNG)

| Datei | Szene |
|---|---|
| `background_hub.png` | Entrada / Guardarropa (Hub) – Prototyp vorhanden |
| `background_barra.png` | La barra (Bar-Bereich der Disco) – vorhanden |
| `background_pista.png` | La pista de baile (Tanzfläche) – vorhanden |
| `background_dj.png` | Cabina del DJ (Backstage/DJ-Kabine) – vorhanden |
| `background_finale.png` | Puerta de seguridad (Ausgangstür, Finale) – vorhanden |
| `background_hub_mapa.png` | Geografisch korrekte Spanienkarte für die Hub-Kartenaufgabe – vorhanden |

## Aufgabenszenen — `assets/scenes/` (1600×1000px, Querformat, PNG)

| Datei | Verwendung |
|---|---|
| `scene_guardarropa_generos.png` | Sechs anklickbare Bildstationen für das Genus |
| `scene_bar_camille.png` | Gastprofil Camille: Herkunft, Sprache und Beruf |
| `scene_pista_dialogo.png` | Visuelle Gesprächsfolge auf der Tanzfläche |
| `scene_dj_ser_estar.png` | Zwei DJ-Spuren als Metapher für ser und estar |
| `scene_finale_dialogo.png` | Abschlussgespräch mit dem Conserje |

## Avatare — `assets/sprites/avatar/` (empfohlen 512×512px, quadratisch, freigestellt/transparent, PNG)

Die Spielfigur, die sich die Schüler:innen am Anfang aussuchen (2 männlich, 2 weiblich).

| Datei | Figur |
|---|---|
| `avatar_diego.png` | Diego (chico) – vorhanden |
| `avatar_carlos.png` | Carlos (chico) – vorhanden |
| `avatar_sofia.png` | Sofía (chica) – vorhanden |
| `avatar_lucia.png` | Lucía (chica) – vorhanden |

## NPC-Sprites — `assets/sprites/npc/` (empfohlen 512×512px, freigestellt/transparent, PNG)

| Datei | Figur |
|---|---|
| `npc_camarera_idle.png` | Camarera an der Bar – vorhanden |
| `npc_camarera_talk.png` | Camarera/Camarero, sprechend (optional) |
| `npc_bailarines_idle.png` | Marta und Lucía auf der Tanzfläche – vorhanden |
| `npc_dj_idle.png` | DJ in der Kabine – vorhanden |
| `npc_conserje_idle.png` | Conserje an der Ausgangstür – vorhanden |

## Icons — `assets/icons/` (empfohlen 128×128px, PNG mit Transparenz)

| Datei | Verwendung |
|---|---|
| `icon_codigo.png` | Code-Fragment im Inventar – vorhanden |
| `icon_llave.png` | Schlüssel-Item – vorhanden |
| `sticker_hub.png` | Explorador/a de España – vorhanden |
| `sticker_barra.png` | Camarero/a honorario/a – vorhanden |
| `sticker_pista.png` | Estrella de la pista – vorhanden |
| `sticker_dj.png` | DJ de honor – vorhanden |
| `sticker_finale.png` | Escapaste de la disco – vorhanden |
| `icon_ayuda.png` | Hinweis-/Hilfe-Button ("?") |
| `icon_sonido_on.png` | Sound an |
| `icon_sonido_off.png` | Sound aus (stumm) |
| `icon_check.png` | Abgeschlossener Bereich (Häkchen) |
| `icon_inventario.png` | Inventar-Button |
| `icon_progreso.png` | Fortschrittsübersicht-Button |

## Hörtexte — `assets/audio/` (lokale WAV-Dateien, mono)

| Datei | Verwendung |
|---|---|
| `bar_mercedes.wav` | Pflicht-Hörstation: Mercedes aus Spanien |
| `bar_camille.wav` | Pflicht-Hörstation: Camille aus Frankreich |
| `bar_luca_male.wav` | Pflicht-Hörstation: Luca aus Italien/Frankreich (männliche Stimme) |
| `bar_ines.wav` | Freiwillige Hörvertiefung: Inês aus Portugal |

## UI-Elemente — `assets/ui/` (empfohlen als 9-slice-taugliche PNGs oder einfache Rechtecke)

| Datei | Verwendung |
|---|---|
| `panel_dialogo.png` | Hintergrundrahmen für Dialogboxen |
| `panel_tarea.png` | Hintergrundrahmen für Aufgaben-Karten |
| `boton_normal.png` | Button-Hintergrund (Normalzustand) |
| `boton_pressed.png` | Button-Hintergrund (gedrückt) |

## Hinweis zur Pixel-Art

Das Spiel ist optisch auf einen 2D-Pixel-Art-Look ausgelegt. Bilder sollten
möglichst mit sauberen Kanten geliefert werden (kein Weichzeichner/Blur), da
CSS `image-rendering: pixelated` auf die Hintergründe und Sprites angewendet
wird, sobald sie eine Breite/Höhe haben, die ein Vielfaches von 8px ist.
Andernfalls einfach normale Fotos/Illustrationen verwenden — das Spiel
funktioniert mit beidem, `image-rendering` hat dann nur keinen sichtbaren Effekt.
