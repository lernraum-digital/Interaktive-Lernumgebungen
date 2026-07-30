(function () {
  "use strict";
  const P = ["yo", "tú", "él/ella", "nosotros/-as", "vosotros/-as", "ellos/ellas"];
  const source = {
    basic: "Verbentrainer Material/Vocabulario básico.pdf",
    u1: "Verbentrainer Material/Clase de Español EF (2).pdf",
    u2: "Verbentrainer Material/Mi gente y mi barrio (3).pdf",
    u4: "Verbentrainer Material/El día a día.pdf",
    list1: "Verbentrainer Material/Bildschirmfoto 2026-07-30 um 11.43.58.png",
    list2: "Verbentrainer Material/Bildschirmfoto 2026-07-30 um 11.44.07.png",
    list3: "Verbentrainer Material/Bildschirmfoto 2026-07-30 um 11.44.16.png",
    list4: "Verbentrainer Material/Bildschirmfoto 2026-07-30 um 11.44.21.png",
    list5: "Verbentrainer Material/Bildschirmfoto 2026-07-30 um 11.44.28.png",
    list6: "Verbentrainer Material/Bildschirmfoto 2026-07-30 um 11.44.39.png",
    list7: "Verbentrainer Material/Bildschirmfoto 2026-07-30 um 11.44.45.png",
  };
  function verb(id, infinitive, meaning, forms, group, lesson, options = {}) {
    return { id, infinitive, meaning, forms, group, lesson, topic: options.topic || "Grundwortschatz", regular: options.regular !== false, irregularity: options.irregularity || null, stemChange: options.stemChange || null, yoSpecial: options.yoSpecial || null, difficulty: options.difficulty || 1, persons: P, sentences: options.sentences || [], sources: options.sources || [source.basic], active: options.active !== false, taskTypes: options.taskTypes || ["write", "choice", "person", "verbGroup"] };
  }
  const verbs = [
    verb("hablar", "hablar", "sprechen", ["hablo","hablas","habla","hablamos","habláis","hablan"], "-ar", "U1", { sources:[source.basic,source.u1,source.list1], sentences:[{ text:"Marta ___ alemán y español.", person:2, answer:"habla", vocabulary:["Marta","alemán","español"], source:source.list1 }] }),
    verb("trabajar", "trabajar", "arbeiten", ["trabajo","trabajas","trabaja","trabajamos","trabajáis","trabajan"], "-ar", "U1", { sources:[source.basic,source.list1], sentences:[{ text:"¿Estudias o ___?", person:1, answer:"trabajas", vocabulary:["estudiar","o"], source:source.list1 }] }),
    verb("estudiar", "estudiar", "lernen; studieren", ["estudio","estudias","estudia","estudiamos","estudiáis","estudian"], "-ar", "U1", { sources:[source.basic,source.u1,source.list1], sentences:[{ text:"Marta ___ en el instituto Parque Aluche.", person:2, answer:"estudia", vocabulary:["Marta","instituto","Parque Aluche"], source:source.list1 }] }),
    verb("charlar", "charlar", "quatschen; sich unterhalten", ["charlo","charlas","charla","charlamos","charláis","charlan"], "-ar", "U1", { sources:[source.basic,source.u1,source.list1], sentences:[{ text:"Lucía y Marta ___ en una plaza.", person:5, answer:"charlan", vocabulary:["Lucía","Marta","plaza"], source:source.u1 }] }),
    verb("escuchar", "escuchar", "hören; jemandem zuhören", ["escucho","escuchas","escucha","escuchamos","escucháis","escuchan"], "-ar", "U3", { topic:"Freizeit", sources:[source.basic,source.list5] }),
    verb("preparar", "preparar", "vorbereiten", ["preparo","preparas","prepara","preparamos","preparáis","preparan"], "-ar", "U1", { sources:[source.basic,source.list2] }),
    verb("practicar", "practicar", "üben", ["practico","practicas","practica","practicamos","practicáis","practican"], "-ar", "U1", { sources:[source.list2], sentences:[{ text:"Manuel ___ inglés.", person:2, answer:"practica", vocabulary:["Manuel","inglés"], source:source.list2 }] }),
    verb("bailar", "bailar", "tanzen", ["bailo","bailas","baila","bailamos","bailáis","bailan"], "-ar", "U1", { sources:[source.basic,source.list2] }),
    verb("comprar", "comprar", "kaufen", ["compro","compras","compra","compramos","compráis","compran"], "-ar", "U1", { sources:[source.basic,source.list2], sentences:[{ text:"¿Cuándo ___ el regalo?", person:1, answer:"compras", vocabulary:["cuándo","regalo"], source:source.list2 }] }),
    verb("tomar", "tomar", "nehmen; trinken", ["tomo","tomas","toma","tomamos","tomáis","toman"], "-ar", "U1", { sources:[source.list2], sentences:[{ text:"¿___ un café?", person:3, answer:"tomamos", vocabulary:["café"], source:source.list2 }] }),
    verb("necesitar", "necesitar", "brauchen", ["necesito","necesitas","necesita","necesitamos","necesitáis","necesitan"], "-ar", "U1", { sources:[source.basic,source.list3], sentences:[{ text:"___ ayuda.", person:0, answer:"necesito", vocabulary:["ayuda"], source:source.list3 }] }),
    verb("quedar", "quedar", "sich verabreden; sich treffen", ["quedo","quedas","queda","quedamos","quedáis","quedan"], "-ar", "U1", { sources:[source.basic,source.u1,source.list2], sentences:[{ text:"Entonces, ¿cuándo ___?", person:3, answer:"quedamos", vocabulary:["entonces","cuándo"], source:source.list2 }] }),
    verb("contestar", "contestar", "(be)antworten", ["contesto","contestas","contesta","contestamos","contestáis","contestan"], "-ar", "U3", { sources:[source.basic,source.list5], sentences:[{ text:"María hoy no ___.", person:2, answer:"contesta", vocabulary:["María","hoy","no"], source:source.list5 }] }),
    verb("tocar", "tocar", "ein Instrument spielen", ["toco","tocas","toca","tocamos","tocáis","tocan"], "-ar", "U3", { topic:"Freizeit", sources:[source.basic,source.list5], sentences:[{ text:"Lucía ___ la guitarra.", person:2, answer:"toca", vocabulary:["Lucía","guitarra"], source:source.list5 }] }),
    verb("comer", "comer", "essen", ["como","comes","come","comemos","coméis","comen"], "-er", "U1", { sources:[source.basic,source.list2], sentences:[{ text:"¿___ en la cafetería?", person:3, answer:"comemos", vocabulary:["cafetería"], source:source.list2 }] }),
    verb("comprender", "comprender", "verstehen", ["comprendo","comprendes","comprende","comprendemos","comprendéis","comprenden"], "-er", "U1", { sources:[source.basic,source.u1,source.list2], sentences:[{ text:"¿Quién ___ el diálogo?", person:2, answer:"comprende", vocabulary:["quién","diálogo"], source:source.list2 }] }),
    verb("aprender", "aprender", "lernen", ["aprendo","aprendes","aprende","aprendemos","aprendéis","aprenden"], "-er", "U1", { sources:[source.basic,source.u1,source.list2], sentences:[{ text:"Silvia ___ español.", person:2, answer:"aprende", vocabulary:["Silvia","español"], source:source.list2 }] }),
    verb("leer", "leer", "lesen", ["leo","lees","lee","leemos","leéis","leen"], "-er", "U1", { sources:[source.list2,source.u1], sentences:[{ text:"¿Qué periódico ___?", person:1, answer:"lees", vocabulary:["qué","periódico"], source:source.list5 }] }),
    verb("beber", "beber", "trinken", ["bebo","bebes","bebe","bebemos","bebéis","beben"], "-er", "U1", { sources:[source.basic] }),
    verb("escribir", "escribir", "schreiben", ["escribo","escribes","escribe","escribimos","escribís","escriben"], "-ir", "U1", { sources:[source.basic,source.u1,source.list2] }),
    verb("vivir", "vivir", "leben; wohnen", ["vivo","vives","vive","vivimos","vivís","viven"], "-ir", "U1", { sources:[source.basic,source.list2], sentences:[{ text:"Alejandro ___ en Madrid.", person:2, answer:"vive", vocabulary:["Alejandro","Madrid"], source:source.list2 }] }),
    verb("subir", "subir", "hinaufgehen; hochladen", ["subo","subes","sube","subimos","subís","suben"], "-ir", "U1", { sources:[source.list2], sentences:[{ text:"Ana ___ la escalera.", person:2, answer:"sube", vocabulary:["Ana","escalera"], source:source.list2 }] }),
    verb("tener", "tener", "haben", ["tengo","tienes","tiene","tenemos","tenéis","tienen"], "mehrfach unregelmäßig", "U2", { regular:false, irregularity:"yo-Sonderform und Stammwechsel e→ie", stemChange:"e→ie", yoSpecial:"tengo", difficulty:2, sources:[source.basic,source.u2,source.list3,source.list4], sentences:[{ text:"___ una hermana.", person:0, answer:"tengo", vocabulary:["hermana"], source:source.list3 }] }),
    verb("querer", "querer", "wollen", ["quiero","quieres","quiere","queremos","queréis","quieren"], "e→ie", "U2", { regular:false, irregularity:"Stammwechsel e→ie in den betonten Formen", stemChange:"e→ie", difficulty:2, sources:[source.basic,source.u2,source.list3], sentences:[{ text:"¿Qué ___ tomar?", person:1, answer:"quieres", vocabulary:["qué","tomar"], source:source.list3 }] }),
    verb("entender", "entender", "verstehen", ["entiendo","entiendes","entiende","entendemos","entendéis","entienden"], "e→ie", "U3", { regular:false, irregularity:"Stammwechsel e→ie in den betonten Formen", stemChange:"e→ie", difficulty:2, sources:[source.basic,source.list5], sentences:[{ text:"___ un poco de árabe.", person:3, answer:"entendemos", vocabulary:["poco","árabe"], source:source.list5 }] }),
    verb("empezar", "empezar", "anfangen; beginnen", ["empiezo","empiezas","empieza","empezamos","empezáis","empiezan"], "e→ie", "U4", { regular:false, irregularity:"Stammwechsel e→ie in den betonten Formen", stemChange:"e→ie", difficulty:2, sources:[source.basic,source.list7], sentences:[{ text:"¿A qué hora ___ la clase?", person:2, answer:"empieza", vocabulary:["a qué hora","clase"], source:source.list7 }] }),
    verb("poder", "poder", "können", ["puedo","puedes","puede","podemos","podéis","pueden"], "o→ue", "U2", { regular:false, irregularity:"Stammwechsel o→ue in den betonten Formen", stemChange:"o→ue", difficulty:2, sources:[source.basic,source.u2,source.list4] }),
    verb("probar", "probar", "probieren; ausprobieren", ["pruebo","pruebas","prueba","probamos","probáis","prueban"], "o→ue", "U2", { regular:false, irregularity:"Stammwechsel o→ue in den betonten Formen", stemChange:"o→ue", difficulty:2, sources:[source.u2,source.list4] }),
    verb("costar", "costar", "kosten", ["cuesto","cuestas","cuesta","costamos","costáis","cuestan"], "o→ue", "U2", { regular:false, irregularity:"Stammwechsel o→ue in den betonten Formen", stemChange:"o→ue", difficulty:2, sources:[source.basic,source.u2,source.list4], sentences:[{ text:"El café ___ un euro.", person:2, answer:"cuesta", vocabulary:["café","euro"], source:source.list4 }] }),
    verb("jugar", "jugar", "spielen", ["juego","juegas","juega","jugamos","jugáis","juegan"], "u→ue", "U3", { regular:false, irregularity:"Stammwechsel u→ue in den betonten Formen", stemChange:"u→ue", difficulty:2, sources:[source.basic,source.list5], sentences:[{ text:"¿___ al fútbol?", person:1, answer:"juegas", vocabulary:["fútbol"], source:source.list5 }] }),
    verb("hacer", "hacer", "machen", ["hago","haces","hace","hacemos","hacéis","hacen"], "yo-Sonderform", "U3", { regular:false, irregularity:"besondere yo-Form", yoSpecial:"hago", difficulty:2, sources:[source.basic,source.list5], sentences:[{ text:"¿Qué ___ mañana?", person:1, answer:"haces", vocabulary:["qué","mañana"], source:source.list5 }] }),
    verb("salir", "salir", "ausgehen", ["salgo","sales","sale","salimos","salís","salen"], "yo-Sonderform", "U3", { regular:false, irregularity:"besondere yo-Form", yoSpecial:"salgo", difficulty:2, sources:[source.basic,source.list5] }),
    verb("dar", "dar", "geben", ["doy","das","da","damos","dais","dan"], "yo-Sonderform", "U3", { regular:false, irregularity:"besondere yo-Form", yoSpecial:"doy", difficulty:2, sources:[source.basic,source.list6] }),
    verb("ver", "ver", "sehen", ["veo","ves","ve","vemos","veis","ven"], "yo-Sonderform", "U3", { regular:false, irregularity:"besondere yo-Form", yoSpecial:"veo", difficulty:2, sources:[source.basic,source.list5] }),
    verb("parecer", "parecer", "scheinen; wirken", ["parezco","pareces","parece","parecemos","parecéis","parecen"], "yo-Sonderform", "U3", { regular:false, irregularity:"besondere yo-Form auf -zco", yoSpecial:"parezco", difficulty:3, sources:[source.basic,source.list6] }),
    verb("ser", "ser", "sein", ["soy","eres","es","somos","sois","son"], "vollständig unregelmäßig", "U1", { regular:false, irregularity:"vollständig unregelmäßig", difficulty:2, sources:[source.basic,source.list1] }),
    verb("estar", "estar", "sein; sich befinden", ["estoy","estás","está","estamos","estáis","están"], "mehrfach unregelmäßig", "U1", { regular:false, irregularity:"besondere yo-Form und Akzente", yoSpecial:"estoy", difficulty:2, sources:[source.basic,source.list4] }),
    verb("ir", "ir", "gehen; fahren", ["voy","vas","va","vamos","vais","van"], "vollständig unregelmäßig", "U2", { regular:false, irregularity:"vollständig unregelmäßig", difficulty:3, sources:[source.basic,source.u2,source.list4] }),
    verb("saber", "saber", "wissen; können", ["sé","sabes","sabe","sabemos","sabéis","saben"], "yo-Sonderform", "U4", { regular:false, irregularity:"besondere yo-Form", yoSpecial:"sé", difficulty:3, sources:[source.u4] }),
    verb("abrir", "abrir", "öffnen", ["abro","abres","abre","abrimos","abrís","abren"], "-ir", "U4", { sources:[source.u4,source.list7] }),
    verb("terminar", "terminar", "(be)enden", ["termino","terminas","termina","terminamos","termináis","terminan"], "-ar", "U4", { sources:[source.basic,source.list7], sentences:[{ text:"¿A qué hora ___ el concierto?", person:2, answer:"termina", vocabulary:["a qué hora","concierto"], source:source.list7 }] }),
  ];
  const curriculum = [
    ["ser",1],["estar",1],["hablar",1],["terminar",1],
    ["trabajar",2],["charlar",2],
    ["escuchar",3],["bailar",3],["estudiar",3],
    ["preparar",4],["practicar",4],["comprar",4],["tomar",4],
    ["comer",5],["beber",5],["aprender",5],["comprender",5],["leer",5],
    ["escribir",6],["vivir",6],["subir",6],["quedar",6],["necesitar",6],
    ["tener",7],["querer",7],
    ["poder",8],["probar",8],["costar",8],
    ["hacer",9],["salir",9],["ver",9],["dar",9],
    ["jugar",10],["tocar",10],["contestar",10],["entender",10],
    ["ir",11],["saber",11],["parecer",11],
    ["abrir",12],["empezar",12]
  ];
  const order = new Map(curriculum.map(([id, stage], index) => [id, { stage, sequence:index + 1 }]));
  verbs.forEach(v => {
    if (v.sentences.length) v.taskTypes.push("sentence");
    const placement = order.get(v.id);
    v.sequence = placement.sequence;
    v.stage = placement.stage;
    v.introduced = false;
    v.prerequisites = placement.sequence === 1 ? [] : [curriculum[placement.sequence - 2][0]];
  });
  verbs.sort((a,b) => a.sequence - b.sequence);
  window.VERB_DATA = { schemaVersion:"2.0", tense:"presente", persons:P, lessons:{ U1:"Unidad 1 · Erste Kontakte", U2:"Unidad 2 · Mi gente y mi barrio", U3:"Unidad 3 · Me gusta", U4:"Unidad 4 · El día a día" }, verbs };
})();
