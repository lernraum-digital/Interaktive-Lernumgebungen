(function () {
  "use strict";

  const tasks = [];
  let id = 1;
  const add = (task) => tasks.push({ id: `Q${String(id++).padStart(3, "0")}`, ...task });
  const text = (category, prompt, answers, hint, explanation, extra = {}) => add({ category, type: "text", prompt, answers, hint, explanation, ...extra });
  const choice = (category, prompt, options, answer, hint, explanation, extra = {}) => add({ category, type: "choice", prompt, options, answer, hint, explanation, ...extra });
  const order = (category, prompt, tokens, answer, hint, explanation) => add({ category, type: "order", prompt, tokens, answers: Array.isArray(answer) ? answer : [answer], hint, explanation });
  const imageChoice = (category, prompt, options, answer, hint, explanation) => add({ category, type: "image", image: "assets/plaza-scene.jpg", prompt, options, answer, hint, explanation });
  const challenge = (type, category, prompt, stimulus, questions, hint, explanation) => add({ category, type, prompt, stimulus, questions, hint, explanation, challenge: true });

  // Präsens: regelmäßige und wichtige unregelmäßige Verben
  text("Presente", "Setze ser für yo ein: Yo ___ estudiante.", ["soy"], "Die yo-Form von ser beginnt mit s.", "Yo <strong>soy</strong> estudiante.");
  text("Presente", "Setze ser für nosotros ein: Nosotros ___ de Alemania.", ["somos"], "Die nosotros-Form endet auf -mos.", "Nosotros <strong>somos</strong> de Alemania.");
  text("Presente", "Setze tener für ella ein: Ella ___ dos hermanos.", ["tiene"], "Achte auf den Vokalwechsel e → ie.", "Ella <strong>tiene</strong> dos hermanos.");
  text("Presente", "Setze tener für yo ein: Yo ___ mucha hambre.", ["tengo"], "Die yo-Form ist unregelmäßig und endet auf -go.", "Yo <strong>tengo</strong> mucha hambre.", { vocab: [{ es: "hambre", de: "Hunger" }] });
  text("Presente", "Setze ir für vosotros ein: Vosotros ___ al instituto.", ["vais"], "Die Form ist sehr kurz und beginnt mit v.", "Vosotros <strong>vais</strong> al instituto.");
  text("Presente", "Setze hacer für yo ein: Yo ___ los deberes.", ["hago"], "Die yo-Form endet auf -go.", "Yo <strong>hago</strong> los deberes.");
  text("Presente", "Setze querer für tú ein: Tú ___ aprender español.", ["quieres"], "e wird in dieser Form zu ie.", "Tú <strong>quieres</strong> aprender español.");
  text("Presente", "Setze poder für nosotros ein: Nosotros ___ ayudar.", ["podemos"], "Bei nosotros gibt es keinen Vokalwechsel.", "Nosotros <strong>podemos</strong> ayudar.", { vocab: [{ es: "ayudar", de: "helfen" }] });
  text("Presente", "Setze entender für ellos ein: Ellos no ___.", ["entienden"], "e wird zu ie; die Endung für ellos lautet -en.", "Ellos no <strong>entienden</strong>.");
  text("Presente", "Konjugiere hablar: Mi amiga y yo ___ español.", ["hablamos"], "Mi amiga y yo entspricht nosotros/nosotras.", "Mi amiga y yo <strong>hablamos</strong> español.");
  text("Presente", "Konjugiere leer: ¿Tú ___ muchos libros?", ["lees"], "Der Stamm bleibt le-; ergänze die tú-Endung.", "¿Tú <strong>lees</strong> muchos libros?");
  text("Presente", "Konjugiere escribir: Marta ___ un mensaje.", ["escribe"], "Marta entspricht ella.", "Marta <strong>escribe</strong> un mensaje.");
  choice("Presente", "Welche Form ergänzt den Satz? Mis padres ___ en un hotel.", ["trabaja", "trabajan", "trabajáis", "trabajo"], "trabajan", "Mis padres ist Plural.", "Mis padres <strong>trabajan</strong> en un hotel.");
  choice("Presente", "Welche Verbform passt? Ana y tú ___ en Madrid.", ["vivís", "vive", "viven", "vivimos"], "vivís", "Ana y tú entspricht in Spanien vosotros/vosotras.", "Ana y tú <strong>vivís</strong> en Madrid.");
  choice("Presente", "Welche Form ist richtig? Yo no ___ la pregunta.", ["entiende", "entiendo", "entendo", "entiendes"], "entiendo", "Die yo-Form hat den Vokalwechsel e → ie.", "Yo no <strong>entiendo</strong> la pregunta.");
  choice("Presente", "Welche Form passt? Vosotras ___ mucha paciencia.", ["tenéis", "tienen", "tenemos", "tienes"], "tenéis", "Vosotras verlangt die Form der 2. Person Plural.", "Vosotras <strong>tenéis</strong> mucha paciencia.", { vocab: [{ es: "paciencia", de: "Geduld" }] });

  // ser, estar, hay und gustar
  choice("Ser, estar y hay", "¿Dónde ___ la biblioteca?", ["es", "está", "hay", "son"], "está", "Für den Ort einer bestimmten Sache verwendet man estar.", "¿Dónde <strong>está</strong> la biblioteca?");
  choice("Ser, estar y hay", "En mi barrio ___ dos supermercados.", ["están", "son", "hay", "es"], "hay", "Eine unbestimmte Anzahl wird mit hay eingeführt.", "En mi barrio <strong>hay</strong> dos supermercados.");
  choice("Ser, estar y hay", "Mi profesora ___ muy simpática.", ["es", "está", "hay", "son"], "es", "Eine allgemeine Eigenschaft wird mit ser beschrieben.", "Mi profesora <strong>es</strong> muy simpática.");
  choice("Ser, estar y hay", "Hoy Pablo ___ cansado.", ["es", "está", "hay", "son"], "está", "Ein momentaner Zustand wird mit estar ausgedrückt.", "Hoy Pablo <strong>está</strong> cansado.", { vocab: [{ es: "cansado", de: "müde" }] });
  choice("Ser, estar y hay", "Madrid ___ en el centro de España.", ["es", "está", "hay", "son"], "está", "Für die geografische Lage verwendet man estar.", "Madrid <strong>está</strong> en el centro de España.");
  choice("Ser, estar y hay", "¿Dónde está la fiesta? – La fiesta ___ en casa de Lucía.", ["es", "está", "hay", "son"], "está", "Die Frage zielt auf den Ort der Feier. Verwende deshalb estar.", "La fiesta <strong>está</strong> en casa de Lucía.");
  text("Gustar", "Übersetze: Ich mag Spanisch.", ["me gusta el español", "me gusta español"], "Beginne mit Me gusta …", "Akzeptiert werden <strong>Me gusta el español</strong> und <strong>Me gusta español</strong>. Auch ein fehlendes ñ macht die Antwort nicht falsch.");
  choice("Gustar", "A Marta ___ los libros de aventuras.", ["le gusta", "les gustan", "le gustan", "la gustan"], "le gustan", "Das Subjekt los libros steht im Plural.", "A Marta <strong>le gustan</strong> los libros de aventuras.");
  choice("Gustar", "A nosotros no ___ bailar.", ["nos gusta", "nos gustan", "os gusta", "les gusta"], "nos gusta", "Ein Infinitiv wird mit gusta verbunden.", "A nosotros no <strong>nos gusta</strong> bailar.");
  text("Ser, estar y hay", "Übersetze: In Madrid gibt es viele Hotels.", ["en madrid hay muchos hoteles"], "Für „es gibt“ verwendet man hay. Madrid und hotel/hoteles kannst du direkt erkennen.", "En Madrid <strong>hay muchos hoteles</strong>.");

  // Reflexive Verben und Gerundium
  text("Verbos reflexivos", "Setze ducharse ein: Yo ___ por la mañana.", ["me ducho"], "Vor der yo-Form steht das Reflexivpronomen me.", "Yo <strong>me ducho</strong> por la mañana.");
  text("Verbos reflexivos", "Setze llamarse ein: ¿Cómo ___ tú?", ["te llamas"], "Für tú lautet das Reflexivpronomen te.", "¿Cómo <strong>te llamas</strong> tú?");
  text("Verbos reflexivos", "Setze levantarse ein: Mis hermanos ___ a las siete.", ["se levantan"], "Mis hermanos ist 3. Person Plural; das Pronomen lautet se.", "Mis hermanos <strong>se levantan</strong> a las siete.");
  choice("Verbos reflexivos", "Welche Form passt? Nosotros ___ en casa.", ["nos quedamos", "se quedamos", "quedamos nos", "os quedáis"], "nos quedamos", "Das Reflexivpronomen für nosotros lautet nos.", "Nosotros <strong>nos quedamos</strong> en casa.");
  choice("Verbos reflexivos", "Welche Form ist richtig? Vosotras ___ muy rápido.", ["os vestís", "se vestís", "os visten", "te vistes"], "os vestís", "Das Reflexivpronomen für vosotros/vosotras ist os.", "Vosotras <strong>os vestís</strong> muy rápido.", { vocab: [{ es: "rápido", de: "schnell" }] });
  text("Estar + gerundio", "¿Qué estás haciendo? Bilde die Verlaufsform und achte auf die richtige Schreibweise: Ahora yo (comer) ___.", ["estoy comiendo"], "Konjugiere estar für yo und bilde bei comer das Gerundium auf -iendo.", "Ahora yo <strong>estoy comiendo</strong>.");
  text("Estar + gerundio", "Bilde die Verlaufsform: Marta (hablar) ___ por teléfono.", ["está hablando"], "Für -ar-Verben endet das Gerundium auf -ando.", "Marta <strong>está hablando</strong> por teléfono.");
  choice("Estar + gerundio", "¿Qué hacéis? – ___ la cena.", ["Estamos preparando", "Somos preparando", "Preparando", "Está preparando"], "Estamos preparando", "Für nosotros braucht man estamos + Gerundium.", "<strong>Estamos preparando</strong> la cena.");
  choice("Estar + gerundio", "Welche Form ist richtig? Los chicos ___ al fútbol.", ["están jugando", "son jugando", "está jugando", "están jugar"], "están jugando", "Plural: están; jugar bildet jugando.", "Los chicos <strong>están jugando</strong> al fútbol.");
  choice("Estar + gerundio", "Welche Handlung passiert gerade?", ["Voy a estudiar.", "Estoy estudiando.", "Estudio los lunes.", "Tengo que estudiar."], "Estoy estudiando.", "estar + gerundio beschreibt eine gerade ablaufende Handlung.", "<strong>Estoy estudiando</strong> bedeutet: Ich lerne gerade.");

  // Futuro inmediato und Modalverben
  text("Futuro inmediato", "Übersetze: Ich werde heute lernen.", ["voy a estudiar hoy", "hoy voy a estudiar"], "Verwende die richtige Form von ir + a + Infinitiv.", "<strong>Voy a estudiar hoy.</strong>");
  text("Futuro inmediato", "Ergänze: Mis amigos ___ visitar Barcelona.", ["van a"], "Mis amigos entspricht ellos.", "Mis amigos <strong>van a</strong> visitar Barcelona.");
  choice("Futuro inmediato", "Welche Form passt? Mañana nosotros ___ jugar al tenis.", ["vamos a", "van a", "estamos", "tenemos"], "vamos a", "Das futuro inmediato besteht aus ir + a + Infinitiv.", "Mañana nosotros <strong>vamos a jugar</strong> al tenis.");
  choice("Futuro inmediato", "Was bedeutet „¿Qué vas a hacer?“", ["Was machst du gerade?", "Was wirst du machen?", "Was musst du machen?", "Was kannst du machen?"], "Was wirst du machen?", "vas a + Infinitiv bezeichnet eine nahe Zukunft oder einen Plan.", "¿Qué vas a hacer? = <strong>Was wirst du machen?</strong>");
  text("Obligación y posibilidad", "Übersetze: Ich muss ein Buch lesen.", ["tengo que leer un libro"], "Verwende tener que + Infinitiv.", "<strong>Tengo que leer un libro.</strong>");
  text("Obligación y posibilidad", "Übersetze: Pepe kann nicht tanzen.", ["pepe no sabe bailar", "pepe no puede bailar"], "No steht vor dem konjugierten Verb.", "Je nach Bedeutung: <strong>Pepe no sabe bailar</strong> (er beherrscht es nicht) oder <strong>Pepe no puede bailar</strong> (es ist ihm nicht möglich).");
  choice("Obligación y posibilidad", "Welche Form passt? ¿___ ayudarme, por favor?", ["Puedes", "Tienes", "Quieres a", "Eres"], "Puedes", "poder + Infinitiv drückt eine Möglichkeit aus.", "¿<strong>Puedes</strong> ayudarme, por favor?", { vocab: [{ es: "ayudarme", de: "mir helfen" }] });
  choice("Obligación y posibilidad", "Welche Aussage bedeutet „Wir müssen gehen“?", ["Podemos ir.", "Queremos ir.", "Tenemos que ir.", "Vamos a ir."], "Tenemos que ir.", "tener que + Infinitiv drückt eine Verpflichtung aus.", "<strong>Tenemos que ir.</strong>");

  // Vergleiche und Ortsangaben, einschließlich KI-Bild
  text("Comparación", "Übersetze: Juan ist größer als Puri.", ["juan es más alto que puri"], "Bei der Körpergröße einer männlichen Person verwendet man alto; der Vergleich lautet más … que.", "Juan es <strong>más alto que</strong> Puri.");
  text("Comparación", "Übersetze: Barcelona ist größer als Sevilla.", ["barcelona es más grande que sevilla"], "Bei Städten kann grande verwendet werden. Der Vergleich lautet más … que.", "Barcelona es <strong>más grande que</strong> Sevilla.");
  choice("Comparación", "Ana tiene 16 años y Eva tiene 17. Eva es …", ["más vieja que Ana", "mayor que Ana", "más alta que Ana", "grande que Ana"], "mayor que Ana", "Beim Alter ist mayor que die natürliche Form.", "Eva es <strong>mayor que Ana</strong>.");
  choice("Comparación", "Mi mochila cuesta 20 € y tu mochila 35 €. Mi mochila es …", ["más cara que la tuya", "más barata que la tuya", "menos grande de", "tan cara de"], "más barata que la tuya", "20 € sind weniger als 35 €.", "Mi mochila es <strong>más barata que la tuya</strong>.", { vocab: [{ es: "mochila", de: "Rucksack" }, { es: "cuesta", de: "kostet" }] });
  imageChoice("La plaza · imagen", "Mira la imagen. ¿Quién es más alto?", ["El chico es más alto que la chica.", "La chica es más alta que el chico.", "Los dos son igual de altos.", "La mesa es más alta que el chico."], "El chico es más alto que la chica.", "Vergleiche die Körpergröße; verwende alto/alta.", "El chico es <strong>más alto que</strong> la chica.");
  imageChoice("La plaza · imagen", "Mira la imagen. ¿Dónde está el libro verde?", ["Está encima de la mesa.", "Está debajo de la silla azul.", "Está en la silla roja.", "Está entre las dos personas."], "Está en la silla roja.", "Achte auf die Farbe des Stuhls.", "El libro verde <strong>está en la silla roja</strong>.");
  imageChoice("La plaza · imagen", "Mira la imagen. ¿Dónde está la mesa?", ["Está entre las dos sillas.", "Está detrás de la casa.", "Está a la izquierda de la silla roja.", "Está debajo del libro."], "Está entre las dos sillas.", "entre bedeutet „zwischen“.", "La mesa <strong>está entre las dos sillas</strong>.");
  imageChoice("La plaza · imagen", "Mira la imagen. ¿Qué frase es correcta?", ["Hay tres sillas.", "Hay dos libros.", "Hay dos sillas y una mesa.", "No hay plantas."], "Hay dos sillas y una mesa.", "Zähle nur die deutlich sichtbaren Stühle und Tische im Vordergrund.", "<strong>Hay dos sillas y una mesa.</strong>");
  text("Posición", "Übersetze: Das Buch liegt links vom Tisch.", ["el libro está a la izquierda de la mesa"], "„links von“ heißt a la izquierda de.", "El libro está <strong>a la izquierda de la mesa</strong>.");
  text("Posición", "Übersetze: Antonio befindet sich zwischen den Stühlen.", ["antonio está entre las sillas"], "Für einen bestimmten Ort verwendet man estar; „zwischen“ heißt entre.", "Antonio <strong>está entre las sillas</strong>.", { vocab: [{ es: "la silla / las sillas", de: "der Stuhl / die Stühle" }] });

  // Zahlen und Uhrzeit
  text("Números y hora", "Schreibe auf Spanisch: 16", ["dieciséis"], "Die Zahl beginnt mit dieci- und endet betont auf -séis.", "16 = <strong>dieciséis</strong>.");
  text("Números y hora", "Schreibe auf Spanisch: 22", ["veintidós"], "Bei 22 trägt die letzte Silbe einen Akzent.", "22 = <strong>veintidós</strong>.");
  text("Números y hora", "Rechne und schreibe das Ergebnis auf Spanisch: 124 + 268", ["trescientos noventa y dos"], "Das Ergebnis ist 392. Hunderter, Zehner und Einer werden getrennt gebildet.", "392 = <strong>trescientos noventa y dos</strong>.");
  text("Números y hora", "Rechne und schreibe das Ergebnis auf Spanisch: 884 − 672", ["doscientos doce"], "Das Ergebnis ist 212.", "212 = <strong>doscientos doce</strong>.");
  choice("Números y hora", "¿Qué hora es? 8:30", ["Son las ocho y media.", "Es la ocho y media.", "Son las nueve menos media.", "Son ocho y cuarto."], "Son las ocho y media.", "Für mehrere Stunden verwendet man Son las; :30 heißt y media.", "<strong>Son las ocho y media.</strong>");
  choice("Números y hora", "¿Qué hora es? 10:45", ["Son las diez y cuarto.", "Son las once menos cuarto.", "Es la once menos cuarto.", "Son las diez y media."], "Son las once menos cuarto.", "Eine Viertelstunde vor elf: las once menos cuarto.", "<strong>Son las once menos cuarto.</strong>");
  choice("Números y hora", "¿Qué hora es? 1:15", ["Son las una y cuarto.", "Es la una y cuarto.", "Es una menos cuarto.", "Son la una y quince."], "Es la una y cuarto.", "Nur bei ein Uhr verwendet man Es la una.", "<strong>Es la una y cuarto.</strong>");
  choice("Números y hora", "Welche Zahl ist „quinientos setenta y seis“?", ["567", "576", "756", "506"], "576", "quinientos = 500, setenta = 70, seis = 6.", "quinientos setenta y seis = <strong>576</strong>.");

  // Wortstellung, Verneinung und Fehlerkorrektur
  order("Orden y negación", "Ordne zu einem korrekten Satz.", ["no", "María", "hoy", "trabaja"], ["María no trabaja hoy", "Hoy María no trabaja"], "no steht direkt vor dem konjugierten Verb.", "<strong>María no trabaja hoy.</strong> Auch <strong>Hoy María no trabaja</strong> ist möglich.");
  order("Orden y negación", "Ordne zu einer korrekten Frage.", ["vives", "¿Dónde", "tú"], "¿Dónde vives tú?", "Das Fragewort steht am Anfang; das Subjekt kann nach dem Verb stehen.", "<strong>¿Dónde vives tú?</strong>");
  order("Orden y negación", "Ordne zu einem korrekten Satz.", ["a", "vamos", "estudiar", "mañana"], ["Vamos a estudiar mañana", "Mañana vamos a estudiar"], "Das futuro inmediato lautet ir + a + Infinitiv.", "<strong>Vamos a estudiar mañana.</strong> Auch <strong>Mañana vamos a estudiar</strong> ist möglich.");
  order("Orden y negación", "Ordne zu einem korrekten Satz.", ["gusta", "no", "me", "bailar"], "No me gusta bailar", "Die Verneinung no steht vor dem Pronomen me.", "<strong>No me gusta bailar.</strong>");
  text("Corrección", "Korrigiere den Satz: Puri y yo son amigas.", ["puri y yo somos amigas"], "Puri y yo entspricht nosotras.", "Puri y yo <strong>somos</strong> amigas.");
  text("Corrección", "Korrigiere den Satz: Yo no puedo a bailar.", ["yo no puedo bailar", "no puedo bailar"], "Nach poder folgt der Infinitiv ohne a.", "Yo no puedo <strong>bailar</strong>.");
  text("Corrección", "Korrigiere den Satz: Marta se llamo Marta.", ["marta se llama marta", "se llama marta"], "Die Form für ella endet auf -a.", "Marta <strong>se llama</strong> Marta.");
  text("Corrección", "Korrigiere den Satz: Estamos hablar español.", ["estamos hablando español"], "Nach estar braucht man das Gerundium.", "Estamos <strong>hablando</strong> español.");
  choice("Orden y negación", "Wo steht no normalerweise?", ["Direkt vor dem konjugierten Verb", "Immer am Satzende", "Direkt nach dem Infinitiv", "Vor jedem Substantiv"], "Direkt vor dem konjugierten Verb", "Denke an: No hablo español.", "Die einfache Satzverneinung <strong>no</strong> steht vor dem konjugierten Verb.");
  choice("Corrección", "Welcher Satz ist korrekt?", ["No me gusta no bailar.", "Me no gusta bailar.", "No me gusta bailar.", "No gusta me bailar."], "No me gusta bailar.", "Bei gustar steht no vor dem Pronomen.", "<strong>No me gusta bailar.</strong>");

  // Lese- und Hörverstehen: gleiche Chancen durch feste Reto-Turns im Spiel
  challenge("audio", "Comprensión auditiva", "Escucha y responde a las tres preguntas.", "María es italiana, pero vive en Madrid con sus padres. Trabaja en el restaurante de un hotel.", [
    { prompt: "¿De dónde es María?", options: ["De España", "De Italia", "De México"], answer: "De Italia" },
    { prompt: "¿Dónde vive?", options: ["En Roma", "En Barcelona", "En Madrid"], answer: "En Madrid" },
    { prompt: "¿Dónde trabaja?", options: ["En un restaurante de un hotel", "En un instituto", "En una tienda"], answer: "En un restaurante de un hotel" }
  ], "Achte auf die drei Informationen Herkunft, Wohnort und Arbeitsplatz.", "María es <strong>italiana</strong>, vive en <strong>Madrid</strong> y trabaja en <strong>el restaurante de un hotel</strong>.");
  challenge("audio", "Comprensión auditiva", "Escucha y responde a las tres preguntas.", "Carlos tiene diecisiete años. Vive con su madre y su hermana. Los sábados trabaja en una cafetería.", [
    { prompt: "¿Cuántos años tiene Carlos?", options: ["16", "17", "18"], answer: "17" },
    { prompt: "¿Con quién vive?", options: ["Con sus padres", "Con su madre y su hermana", "Con sus amigos"], answer: "Con su madre y su hermana" },
    { prompt: "¿Cuándo trabaja?", options: ["Los lunes", "Los viernes", "Los sábados"], answer: "Los sábados" }
  ], "Höre besonders auf Alter, Familie und den Zeitpunkt der Arbeit.", "Carlos tiene <strong>diecisiete años</strong>, vive con <strong>su madre y su hermana</strong> y trabaja <strong>los sábados</strong>.");
  challenge("audio", "Comprensión auditiva", "Escucha y responde a las tres preguntas.", "Ahora Lucía está haciendo los deberes. Después va a preparar la cena con su padre. No puede salir esta tarde.", [
    { prompt: "¿Qué está haciendo Lucía ahora?", options: ["Está preparando la cena", "Está haciendo los deberes", "Está saliendo"], answer: "Está haciendo los deberes" },
    { prompt: "¿Qué va a hacer después?", options: ["Va a preparar la cena", "Va a estudiar", "Va a trabajar"], answer: "Va a preparar la cena" },
    { prompt: "¿Puede salir esta tarde?", options: ["Sí", "No", "No se sabe"], answer: "No" }
  ], "Achte auf ahora, después und no puede.", "Ahora hace <strong>los deberes</strong>; después va a <strong>preparar la cena</strong> y esta tarde <strong>no puede salir</strong>.");
  challenge("audio", "Comprensión auditiva", "Escucha y responde a las tres preguntas.", "En mi barrio hay un supermercado y dos panaderías. La biblioteca está al lado del parque. Mi casa está enfrente de la biblioteca.", [
    { prompt: "¿Cuántas panaderías hay?", options: ["Una", "Dos", "Tres"], answer: "Dos" },
    { prompt: "¿Dónde está la biblioteca?", options: ["Al lado del parque", "Enfrente del parque", "Detrás del supermercado"], answer: "Al lado del parque" },
    { prompt: "¿Dónde está la casa?", options: ["Al lado de la biblioteca", "Enfrente de la biblioteca", "En el parque"], answer: "Enfrente de la biblioteca" }
  ], "Achte auf Zahlen und die Ortsangaben al lado de und enfrente de.", "Hay <strong>dos panaderías</strong>. La biblioteca está <strong>al lado del parque</strong> y la casa, <strong>enfrente de la biblioteca</strong>.");
  challenge("audio", "Comprensión auditiva", "Escucha y responde a las tres preguntas.", "Ana y Elena son amigas. Ana es más alta, pero Elena es mayor. A las dos les gusta jugar al voleibol.", [
    { prompt: "¿Quién es más alta?", options: ["Ana", "Elena", "Las dos"], answer: "Ana" },
    { prompt: "¿Quién es mayor?", options: ["Ana", "Elena", "No se sabe"], answer: "Elena" },
    { prompt: "¿Qué les gusta hacer?", options: ["Bailar", "Jugar al voleibol", "Leer"], answer: "Jugar al voleibol" }
  ], "Unterscheide más alta (Körpergröße) und mayor (Alter).", "Ana es <strong>más alta</strong>, Elena es <strong>mayor</strong> y a las dos les gusta <strong>jugar al voleibol</strong>.");
  challenge("audio", "Comprensión auditiva", "Escucha y responde a las tres preguntas.", "Son las ocho y media. Diego está desayunando porque a las nueve tiene que ir al instituto. Va a ir en autobús.", [
    { prompt: "¿Qué hora es?", options: ["Las ocho y cuarto", "Las ocho y media", "Las nueve"], answer: "Las ocho y media" },
    { prompt: "¿Qué está haciendo Diego?", options: ["Está desayunando", "Está estudiando", "Está esperando"], answer: "Está desayunando" },
    { prompt: "¿Cómo va a ir al instituto?", options: ["A pie", "En bicicleta", "En autobús"], answer: "En autobús" }
  ], "Achte auf Uhrzeit, Gerundium und Verkehrsmittel.", "Son <strong>las ocho y media</strong>. Diego <strong>está desayunando</strong> y va a ir <strong>en autobús</strong>.");
  challenge("reading", "Comprensión lectora", "Lee el texto y responde a las tres preguntas.", "Pablo vive en Valencia con dos amigos. Estudia alemán y trabaja por la tarde en una tienda de ropa. Hoy no trabaja porque está enfermo.", [
    { prompt: "¿Dónde vive Pablo?", options: ["En Madrid", "En Valencia", "En Sevilla"], answer: "En Valencia" },
    { prompt: "¿Qué estudia?", options: ["Español", "Italiano", "Alemán"], answer: "Alemán" },
    { prompt: "¿Por qué no trabaja hoy?", options: ["Porque está enfermo", "Porque tiene clase", "Porque va a viajar"], answer: "Porque está enfermo" }
  ], "Markiere gedanklich Wohnort, Fach und den Grund mit porque.", "Pablo vive en <strong>Valencia</strong>, estudia <strong>alemán</strong> y hoy no trabaja porque <strong>está enfermo</strong>.");
  challenge("reading", "Comprensión lectora", "Lee el texto y responde a las tres preguntas.", "Mañana Sara va a visitar a su abuela. Primero tiene que comprar un billete. Después va a tomar el tren de las once.", [
    { prompt: "¿A quién va a visitar?", options: ["A su amiga", "A su abuela", "A su profesora"], answer: "A su abuela" },
    { prompt: "¿Qué tiene que comprar?", options: ["Un libro", "Un regalo", "Un billete"], answer: "Un billete" },
    { prompt: "¿Qué transporte va a usar?", options: ["El autobús", "El tren", "El coche"], answer: "El tren" }
  ], "Achte auf die drei Infinitive visitar, comprar und tomar.", "Sara va a visitar a <strong>su abuela</strong>, tiene que comprar <strong>un billete</strong> y va a tomar <strong>el tren</strong>.");
  challenge("reading", "Comprensión lectora", "Lee el texto y responde a las tres preguntas.", "En la clase hay veinticuatro estudiantes. La profesora está delante de la pizarra. Dos alumnos están escribiendo y los otros están leyendo.", [
    { prompt: "¿Cuántos estudiantes hay?", options: ["22", "24", "42"], answer: "24" },
    { prompt: "¿Dónde está la profesora?", options: ["Delante de la pizarra", "Detrás de la puerta", "Entre los alumnos"], answer: "Delante de la pizarra" },
    { prompt: "¿Qué están haciendo los otros alumnos?", options: ["Están hablando", "Están leyendo", "Están jugando"], answer: "Están leyendo" }
  ], "Suche nach hay, der Ortsangabe und den beiden Gerundien.", "Hay <strong>veinticuatro estudiantes</strong>. La profesora está <strong>delante de la pizarra</strong> y los otros alumnos <strong>están leyendo</strong>.");
  challenge("reading", "Comprensión lectora", "Lee el texto y responde a las tres preguntas.", "A Nuria le gusta mucho la música, pero no sabe tocar un instrumento. Este año va a aprender a tocar la guitarra con su primo.", [
    { prompt: "¿Qué le gusta a Nuria?", options: ["La música", "El deporte", "La cocina"], answer: "La música" },
    { prompt: "¿Sabe tocar un instrumento?", options: ["Sí", "No", "No se sabe"], answer: "No" },
    { prompt: "¿Qué va a aprender?", options: ["A cantar", "A tocar el piano", "A tocar la guitarra"], answer: "A tocar la guitarra" }
  ], "Achte auf pero, no sabe und va a aprender.", "A Nuria le gusta <strong>la música</strong>, todavía <strong>no sabe</strong> tocar y va a aprender <strong>la guitarra</strong>.");

  tasks.filter((task) => task.type === "audio").forEach((task) => {
    task.audio = `assets/audio/${task.id.toLowerCase()}.wav`;
  });

  window.QUESTION_BANK = tasks;
  window.QUESTION_TYPES = {
    text: "Freie Eingabe",
    choice: "Auswahl",
    order: "Satz ordnen",
    image: "Bildaufgabe",
    audio: "Hörverstehen",
    reading: "Leseverstehen"
  };
})();
