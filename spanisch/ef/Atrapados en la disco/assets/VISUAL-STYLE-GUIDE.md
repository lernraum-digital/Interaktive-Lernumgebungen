# Visual Style Guide – Atrapados en la disco

## Leitidee

Ein hochwertiges 2D-Pixel-Adventure in einer spanischen Retro-Disco der späten 1980er-Jahre. Die Oberfläche soll auf dem iPad groß, kontrastreich und leicht antippbar bleiben. Pixel-Art ist die Formensprache, nicht die sichtbare Bildschirmgröße.

## Farbpalette

| Funktion | Farbe |
|---|---|
| tiefster Hintergrund | `#10091d` |
| Aubergine | `#1b1030` |
| Karten und Paneele | `#2f1f52` |
| Neon-Magenta | `#ff3d81` |
| Neon-Cyan | `#35d0ba` |
| Disco-Gold | `#ffc93d` |
| Erfolg | `#35c98d` |
| Gefahr / gesperrt | `#e5484d` |
| Haupttext | `#fdfaff` |

## Gestaltungsregeln

- Große, klar erkennbare Objekte statt kleinteiliger Kulissen.
- Hintergründe füllen die verfügbare iPad-Breite aus.
- Wichtige Objekte liegen nicht direkt am Bildrand.
- Kantige Rahmen, deutliche 2-Pixel-Konturen und versetzte Blockschatten.
- Pixel-Schriftoptik nur für kurze Labels und Überschriften.
- Aufgaben- und Dialogtexte bleiben in einer gut lesbaren Systemschrift.
- Keine simulierten CRT-Scanlines über Lerntexten.
- Farbe wird nie als einziges Statussignal verwendet.
- Mindestens 44 × 44 CSS-Pixel große Touchflächen.
- `prefers-reduced-motion` wird respektiert.

## Pixelauflösung

- Kompositionsraster ungefähr 400 × 250 oder 480 × 300 Pixel.
- Finale Dateien ungefähr 1600 × 1000 Pixel oder ein ganzzahliges Vielfaches.
- CSS-Anzeige responsiv und bildschirmfüllend.
- Hochskalierung ohne Glättung beziehungsweise mit `image-rendering: pixelated`.

## Vorhandene Prototyp-Assets

| Datei | Status |
|---|---|
| `backgrounds/background_hub.png` | fertiger Hub-Prototyp |
| `sprites/avatar/avatar_diego.png` | freigestellter Avatar-Prototyp |
| `sprites/avatar/avatar_carlos.png` | freigestellter Avatar |
| `sprites/avatar/avatar_sofia.png` | freigestellter Avatar |
| `sprites/avatar/avatar_lucia.png` | freigestellter Avatar |
| `sprites/npc/npc_camarera_idle.png` | freigestellte Camarera |
| `sprites/npc/npc_bailarines_idle.png` | freigestelltes Duo Marta und Lucía |
| `sprites/npc/npc_dj_idle.png` | freigestellter DJ |
| `sprites/npc/npc_conserje_idle.png` | freigestellter Conserje |
| `backgrounds/background_barra.png` | fertige Bar-Szene |
| `backgrounds/background_pista.png` | fertige Tanzflächen-Szene |
| `backgrounds/background_dj.png` | fertige DJ-Kabine |
| `backgrounds/background_finale.png` | fertiger Ausgangsbereich |
| `backgrounds/background_hub_mapa.png` | geografisch geprüfte Spanienkarte |
| `scenes/scene_guardarropa_generos.png` | Genus-Suchszene |
| `scenes/scene_bar_camille.png` | Camilles Gastprofil |
| `scenes/scene_pista_dialogo.png` | Gesprächsszene auf der Tanzfläche |
| `scenes/scene_dj_ser_estar.png` | SER/ESTAR-DJ-Metapher |
| `scenes/scene_finale_dialogo.png` | Gespräch mit dem Conserje |
| `icons/icon_codigo.png` | freigestelltes Codefragment ohne feste Zahl |
| `icons/icon_llave.png` | freigestellter goldener Sicherheitsschlüssel |
| `icons/sticker_hub.png` | Spanien- und Kompass-Sticker |
| `icons/sticker_barra.png` | alkoholfreier Mocktail-Sticker |
| `icons/sticker_pista.png` | genderneutraler Tanzstern-Sticker |
| `icons/sticker_dj.png` | Kopfhörer-und-Schallplatte-Sticker |
| `icons/sticker_finale.png` | Ausgang-und-Erfolg-Sticker |

## Prompt – Hub

```text
Use case: stylized-concept
Asset type: 2D game environment background for an iPad learning adventure
Primary request: the entrance and coat-check hub of a Spanish nightclub in a playful late-1980s retro disco, designed as the central navigation scene for a game called Atrapados en la disco
Scene/backdrop: spacious nightclub entrance with a coat-check counter, hanging jackets and numbered coat hooks, tiled floor, a glowing disco ball, neon directional symbols toward a bar, dance floor and DJ booth, and a clearly visible locked security door with a red terminal; no readable words or numbers
Style/medium: polished authentic 2D pixel art, crisp blocky pixel clusters, limited deliberate palette, like a high-quality 16-bit adventure game rather than a pixel filter
Composition/framing: wide 16:10 landscape, straight-on slightly elevated game-camera view, large readable objects, uncluttered central walking area, important interactive objects kept away from the extreme edges, suitable for full-width iPad display and UI overlays
Lighting/mood: energetic but mysterious after-hours disco, deep aubergine shadows, electric magenta and cyan neon, warm golden yellow highlights, strong readable silhouettes
Color palette: deep plum #1b1030, magenta #ff3d81, cyan #35d0ba, golden yellow #ffc93d, pale cream highlights
Constraints: environment only, no people, no characters, no text, no logos, no trademarks, no watermark, no photorealism, no soft painterly brushwork, no fake CRT scanlines, no tiny illegible details, no cropped door or counter
```

## Prompt – Diego

```text
Use case: stylized-concept
Asset type: selectable player avatar sprite for a 2D iPad learning adventure
Primary request: Diego, a friendly teenage Spanish exchange student ready for a retro disco night, confident relaxed neutral pose
Subject: full body visible, short dark wavy hair, warm medium skin tone, purple bomber jacket with cyan trim, pale cream T-shirt, dark jeans, magenta-and-white sneakers, small cross-body bag; age-appropriate and friendly
Style/medium: polished authentic 2D pixel art matching a high-quality 16-bit adventure game, crisp blocky pixel clusters, clean silhouette, limited deliberate palette, not a pixel filter
Composition/framing: centered full-body character, front three-quarter view, generous empty padding on every side, square canvas
Color palette: deep plum, electric magenta, cyan, golden yellow accents, pale cream; do not use bright green on the character
Scene/backdrop: perfectly flat solid #00ff00 chroma-key background for background removal
Constraints: background must be one uniform #00ff00 color with no shadows, gradients, texture, floor plane, reflections or lighting variation; crisp separated edges; no cast shadow; no contact shadow; no text; no logos; no watermark; no extra objects; no cropped body parts; no photorealism; no anti-aliased painterly edges
```

## Asset-Status

Die vorgesehene erste Produktionsserie aus Avataren, NPCs, Hintergründen, Aufgabenszenen, Karte, Codefragmenten, Schlüssel und Stickern ist vollständig erzeugt und im Spiel eingebunden.

## Prompt-Set – Carlos, Sofía und Lucía

Alle drei Figuren wurden einzeln mit `avatar_diego.png` als reiner Stilreferenz erzeugt. Der gemeinsame Prompt verlangte denselben Pixelgrad, dieselben Proportionen, dieselbe Skalierung, eine quadratische Ganzkörperkomposition sowie einen flachen grünen Chroma-Key-Hintergrund. Gemeinsame Ausschlüsse: keine Schatten, keine Bodenkontaktfläche, kein Text, keine Logos, keine abgeschnittenen Körperteile und keine fotorealistische Darstellung.

### Carlos

```text
Friendly teenage exchange student; dark brown skin; short close-cropped textured curls; teal varsity-style jacket with golden yellow trim; pale cream shirt; dark plum trousers; cyan-and-white high-top sneakers; relaxed confident pose; distinct silhouette from Diego.
```

### Sofía

```text
Friendly teenage exchange student; warm olive skin; long voluminous dark-brown curly hair; cropped magenta denim jacket; pale cream top; high-waisted dark plum trousers; golden yellow belt; cyan-and-magenta sneakers; upbeat confident pose.
```

### Lucía

```text
Friendly teenage exchange student; fair skin with light freckles; chin-length auburn bob; cyan cropped bomber jacket; golden yellow top; high-waisted magenta skirt; opaque dark plum leggings; pale cream-and-magenta ankle boots; thoughtful cheerful pose.
```

## Prompt-Set – Disco-NPCs

Die vier NPC-Dateien wurden im eingebauten Bildgenerator als quadratische Ganzkörper-Sprites erzeugt. `avatar_diego.png` diente ausschließlich als visuelle Stilreferenz. Gemeinsamer Modus: 16-Bit-inspirierte Pixel-Art, klare Silhouette, begrenzte Neonpalette, großzügiger Rand und ein einfarbiger Chroma-Key-Hintergrund `#00ff00`. Anschließend wurde der Hintergrund mit weicher Alphakante und Despill entfernt. Gemeinsame Ausschlüsse: keine Schrift, Logos, Schatten, Bodenfläche, angeschnittenen Körperteile, zusätzlichen Personen oder fotorealistische Darstellung.

### Camarera

```text
Young adult woman with medium olive skin and a high dark ponytail; magenta blouse, cyan apron and plum trousers; holding a tray and greeting the player with a friendly wave.
```

### Marta und Lucía

```text
Two friendly teenage exchange students as one readable duo: blonde Marta in a cyan jacket and plum trousers; dark-haired Lucía in a magenta vest, yellow top and skirt; conversational pose suitable for the dance-floor mission.
```

### DJ

```text
Androgynous young adult DJ with light-brown skin, asymmetrical platinum hair and magenta headphones; plum-and-cyan club outfit; confident welcoming pose.
```

### Conserje

```text
Friendly Spanish school caretaker in his late fifties or early sixties; short silver hair and neat mustache; plum work jacket, cyan shirt, practical trousers and a small golden keyring; warm, helpful and slightly embarrassed expression.
```

## Prompt-Set – Disco-Hintergründe

Alle vier Umgebungen wurden mit `background_hub.png` als reiner Stilreferenz im eingebauten Bildgenerator erzeugt. Gemeinsamer Modus: neue `stylized-concept`-Generierung, breite 16:10-Spielkulisse, leicht erhöhte gerade Spielkamera, hochwertige 16-Bit-inspirierte Pixel-Art und dieselbe Neonpalette. Die Komposition hält wichtige Objekte groß und vom Rand entfernt und lässt Platz für separat eingeblendete NPCs. Gemeinsame Ausschlüsse: keine Personen, Schrift, Logos, UI-Elemente, Wasserzeichen, CRT-Scanlines, fotorealistische oder weich gemalte Darstellung.

### La barra

```text
Spacious late-1980s disco bar with a curved counter, illuminated shelves of abstract colorful bottles and glasses, four stools, serving hatch and a clearly readable vintage wall telephone; cyan shelf light, magenta accents and warm golden counter lamps; open area for the Camarera.
```

### La pista de baile

```text
Large illuminated checkerboard dance floor, central mirror ball, stage lights, wall speakers, geometric light panels and a side bench; joyful energetic lighting with an uncluttered foreground for Marta and Lucía.
```

### La cabina del DJ

```text
Interior DJ control booth with two large turntables, central mixer, readable sliders and symbol-only buttons, stacked speakers, record shelves, coiled cables and a window toward the colored dance floor; open side area for the DJ.
```

### La salida

```text
School-friendly suspenseful service corridor with a large reinforced security door, red-and-gold keypad, wall key board, conduit pipes, utility cabinet and neon spill from the disco; large recognizable lock objects and room for the Conserje.
```

## Prompt-Set – Aufgabenszenen

Die fünf Szenen wurden im eingebauten Bildgenerator als neue `scientific-educational`-Illustrationen erzeugt. Die jeweils passende Disco-Kulisse diente als Stilreferenz; bei Figuren kam zusätzlich der vorhandene NPC als reine Stil- oder Identitätsreferenz zum Einsatz. Gemeinsame Vorgaben: breite 16:10-Komposition, große iPad-lesbare Symbole, keine eingebrannte Schrift und keine Antworttexte im Bild.

### Garderobe: Genus

```text
Exactly six separated illuminated compartments in a two-by-three grid: vintage radio, abstract computer program, raised hand symbol, open text page, city skyline and country-map silhouette; no additional objects or labels.
```

### Bar: Camille

```text
One fictional guest named Camille at the neon bar, holding a microphone; nonverbal clues for French origin, languages and singer profession; no celebrities, real people or written profile fields.
```

### Tanzfläche: Dialog

```text
Two friendly teenagers in conversation on the dance floor; four large empty pixel speech bubbles containing only icons for greeting, wellbeing, name and person; no written dialogue.
```

### DJ: SER und ESTAR

```text
Close-up of two turntable tracks: identity/profile plus quality sparkle on the left, map plus location pin on the right, connected by the central crossfader; no grammatical labels in the image.
```

### Finale: Kennenlerndialog

```text
The same Conserje at the security door speaking to a neutral player silhouette; three large speech bubbles with icons for name, origin and languages; preserve the Conserje's appearance and show no words.
```

## Prompt-Set – Inventargegenstände und Sticker

Die sieben quadratischen Einzelobjekte wurden im eingebauten Bildgenerator erzeugt. Die jeweils thematisch passende Disco-Kulisse diente als reine Stilreferenz. Gemeinsame Vorgaben: klare 16-Bit-inspirierte Pixel-Art, ein einzelnes großes Motiv, kräftige Konturen, großzügiger Rand, keine Schrift, Logos, Wasserzeichen, Schatten oder Bodenfläche und ein vollständig flacher Chroma-Key-Hintergrund `#00ff00`.

Da eine weiche Freistellung feine Cyan- und Cremeflächen beschädigte, wurden die finalen Dateien mit einer harten, pixelgerechten Farbtoleranz von 80 freigestellt. Dadurch bleiben die Pixelkanten transparent und zugleich die Innenfarben vollständig erhalten.

### Codefragment

```text
Magenta-plum electronic security cartridge with cyan circuit traces, gold contacts and two empty dark display windows; no digits or written code inside the bitmap.
```

Die wechselnden Codewerte `03`, `27`, `14` und `58` werden bewusst als scharfer HTML-Text über beziehungsweise neben dem Bild angezeigt. So bleiben sie auf dem iPad gut lesbar und können später ohne eine neue Bildgenerierung geändert werden.

### Schlüssel

```text
Golden security key with a disco-ball-shaped bow, cyan enamel inset and a large unmistakable silhouette.
```

### Hub-Sticker

```text
Spain silhouette with a small compass rose and disco sparkle; recognizable at inventory size and without place labels.
```

### Bar-Sticker

```text
Clearly non-alcoholic pink citrus mocktail with fruit garnish, straw and neon sparkle; playful and school-appropriate.
```

### Tanzflächen-Sticker

```text
Gender-neutral golden dancing star over cyan and magenta illuminated disco tiles.
```

### DJ-Sticker

```text
Large cyan-and-magenta headphones wrapped around a dark vinyl record with a golden center.
```

### Finale-Sticker

```text
Open security door with warm golden light, a victory star and a small golden key; clear visual symbol for escape and completion.
```

## Spanienkarte: Geometrie und Gestaltung

Der erste KI-Entwurf wurde nach der Sichtprüfung verworfen, weil Portugal geografisch nicht zuverlässig von Spanien getrennt war. Die finale Karte verwendet deshalb die offiziellen Länderpolygone aus dem gemeinfreien Natural-Earth-Datensatz `ne_10m_admin_0_countries`. Die Pixelgestaltung, Neonpalette, Meeresstruktur, Pyrenäen-Symbole und Kompassrose wurden anschließend projektlokal gerendert. Die HTML-Pins bleiben separate Bedienelemente und liegen auf Madrid, den Pyrenäen, Mallorca, Valencia und Sevilla.
