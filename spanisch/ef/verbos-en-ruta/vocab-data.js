/* Lokale Kopie der unveränderten PDF-Datenquelle: vokabelliste_spanisch.pdf */
window.JUMPRUN_VOCAB = [
  ['la capital','die Hauptstadt'],['estar','sein / sich befinden'],['el país','das Land'],['el norte','der Norden'],
  ['el sur','der Süden'],['grande','groß'],['la costa','die Küste'],['el este','der Osten'],['el oeste','der Westen'],
  ['hablar','sprechen'],['la lengua','die Sprache'],['famoso','berühmt (männlich)'],['famosa','berühmt (weiblich)'],
  ['la playa','der Strand'],['la isla','die Insel'],['la montaña','der Berg'],['también','auch'],['hay','es gibt'],
  ['entre','zwischen'],['interesante','interessant'],['el nombre','der Name'],['la fiesta','das Fest / die Feier'],
  ['qué','was (Fragewort)'],['de dónde','woher (Fragewort)'],['quién','wer (Fragewort)'],['trabajar','arbeiten'],
  ['cantante','Sänger/in'],['actor','Schauspieler'],['actriz','Schauspielerin'],['rey','König'],['reina','Königin'],
  ['futbolista','Fußballspieler/in'],['nacionalidad','Nationalität'],['estudiar','lernen / studieren'],
  ['comprender','verstehen'],['escuchar','zuhören / anhören'],['vivir','leben / wohnen'],['leer','lesen'],
  ['aprender','lernen'],['el instituto','die weiterführende Schule']
].map(([es,de], i) => ({id:`pdf-${i}`, es, de, area:i < 9 ? 'hub' : i < 25 ? 'barra' : 'pista'}));
