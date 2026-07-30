(function () {
  "use strict";
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const D=window.VERB_DATA,C=window.TEACHER_CONFIG,Store=window.TrainerStorage,Planner=window.TrainingPlanner;
  const state=Store.load();let session=null,current=null;
  const MODES={
    mixed:{label:"Gemischtes Training",icon:"✦",text:"Neue, bekannte und schwierige Formen im Wechsel."},
    write:{label:"Verbform schreiben",icon:"⌨",text:"Bilde die passende Präsensform selbst."},
    choice:{label:"Verbform auswählen",icon:"◉",text:"Erkenne die Form zwischen typischen Fehlern."},
    person:{label:"Person erkennen",icon:"♙",text:"Ordne eine Form der richtigen Person zu."},
    infinitive:{label:"Infinitiv erkennen",icon:"∞",text:"Finde den passenden Infinitiv."},
    sentence:{label:"Belegte Lückensätze",icon:"□",text:"Ergänze Sätze aus dem Unterrichtsmaterial."}
  };
  const CATEGORY={new:"Neues Verb",old:"Bekanntes Verb",review:"Persönliche Wiederholung"};
  const normalize=s=>String(s||"").trim().toLocaleLowerCase("es").replace(/\s+/g," ");
  const shuffle=a=>[...a].sort(()=>Math.random()-.5);
  const escapeHtml=s=>String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[m]);
  const releasedVerbs=()=>D.verbs.filter(v=>v.active&&v.stage<=C.currentStage&&C.activeLessons.includes(v.lesson)&&C.activeGroups.includes(v.group)&&v.difficulty<=C.releasedDifficulty);
  const newestVerbs=()=>releasedVerbs().filter(v=>v.stage===C.currentStage);

  function init(){D.verbs.forEach(v=>v.introduced=v.stage<=C.currentStage);renderStages();renderModes();renderDashboard();populateDialog();bind();if(!releasedVerbs().length)showEmptyState();}
  function bind(){
    $("#quick-start").addEventListener("click",()=>start({mode:"mixed"}));$("#free-training").addEventListener("click",()=>$("#training-dialog").showModal());$("#settings-button").addEventListener("click",openSettings);
    $$(".close-dialog").forEach(b=>b.addEventListener("click",()=>b.closest("dialog").close()));$("#training-form").addEventListener("submit",handleTrainingForm);
    $("#check-answer").addEventListener("click",checkAnswer);$("#next-question").addEventListener("click",nextQuestion);$("#leave-training").addEventListener("click",leaveTraining);
    $("#repeat-round").addEventListener("click",()=>start(session.settings));$("#back-home").addEventListener("click",()=>{showView("home-view");renderDashboard();});
    $("#save-name").addEventListener("click",saveName);$("#export-data").addEventListener("click",exportData);$("#reset-progress").addEventListener("click",resetProgress);
  }
  function renderStages(){
    const visible=C.showLockedStages?C.stages:C.stages.filter(s=>s.id<=C.currentStage);
    $("#stage-status").textContent=`Stufe ${C.currentStage} von ${C.stages.length} freigegeben`;
    $("#stage-list").innerHTML=visible.map(stage=>{const status=stage.id<C.currentStage?"complete":stage.id===C.currentStage?"current":"locked";const verbs=D.verbs.filter(v=>v.stage===stage.id);return `<article class="stage-card ${status}"><img src="${stage.image}" alt="${escapeHtml(stage.title)} in der illustrierten Verb-Akademie" width="1100" height="700"><div class="stage-copy"><span class="stage-number">${status==="locked"?"Spätere Stufe":status==="current"?"Aktuelle Stufe":"Freigeschaltet"} · ${stage.id}</span><h3>${escapeHtml(stage.title)}</h3><p>${escapeHtml(stage.subtitle)}</p><div class="stage-verbs">${status==="locked"?"<span>Noch nicht freigegeben</span>":verbs.map(v=>`<span>${v.infinitive}</span>`).join("")}</div></div></article>`;}).join("");
  }
  function renderModes(){
    $("#mode-grid").innerHTML=C.enabledTaskTypes.map(k=>`<button class="mode-card" type="button" data-mode="${k}"><span>${MODES[k].icon}</span><strong>${MODES[k].label}</strong><small>${MODES[k].text}</small></button>`).join("");
    $$(".mode-card").forEach(b=>b.addEventListener("click",()=>start({mode:b.dataset.mode})));
  }
  function renderDashboard(){
    const released=releasedVerbs(),answered=state.totals.answered,accuracy=answered?Math.round(state.totals.correct/answered*100)+" %":"–",mastered=released.filter(v=>Planner.mastery(state.verbs[v.id])>=80).length;
    $("#header-xp").textContent=state.xp;$("#xp-value").textContent=`${state.xp} XP`;$("#accuracy-value").textContent=accuracy;$("#best-value").textContent=state.bestStreak;$("#mastered-value").textContent=mastered;
    chips($("#new-verbs"),newestVerbs(),"Noch keine Verben in der aktuellen Stufe.");
    chips($("#known-verbs"),released.filter(v=>v.stage<C.currentStage),C.currentStage===1?"Wächst mit der nächsten Stufe.":"Noch keine älteren Verben.");
    const focus=released.filter(v=>state.verbs[v.id]).sort((a,b)=>Planner.dueScore(b,state,C)-Planner.dueScore(a,state,C)).slice(0,4);chips($("#focus-verbs"),focus,"Entsteht nach deinen ersten Antworten.");
    const practiced=released.filter(v=>state.verbs[v.id]).sort((a,b)=>b.sequence-a.sequence).slice(0,7);$("#mastery-list").innerHTML=practiced.length?practiced.map(v=>{const m=Planner.mastery(state.verbs[v.id]);return `<div class="mastery-row"><span>${v.infinitive}</span><div class="mini-track"><i style="width:${m}%"></i></div><b>${m} %</b></div>`;}).join(""):'<span class="privacy-note">Nach der ersten Runde erscheinen hier deine Verben.</span>';
    $("#badge-list").innerHTML=state.badges.map(b=>`<span class="badge">${badgeLabel(b)}</span>`).join("");
  }
  function chips(root,verbs,empty){root.innerHTML=verbs.length?verbs.map(v=>`<span>${v.infinitive}</span>`).join(""):`<span class="empty">${empty}</span>`;}
  function badgeLabel(id){return ({first:"✦ Erste Formen",foundation:"◇ Sicheres Fundament",remembered:"↻ Nicht vergessen",newPower:"◎ Neue Sprachkraft"})[id]||id;}
  function populateDialog(){
    const released=releasedVerbs(),lessons=[...new Set(released.map(v=>v.lesson))],groups=[...new Set(released.map(v=>v.group))];
    $("#mode-select").innerHTML=C.enabledTaskTypes.map(k=>`<option value="${k}">${MODES[k].label}</option>`).join("");
    $("#lesson-options").innerHTML=lessons.map(k=>`<label><input type="checkbox" name="lesson" value="${k}" checked><span>${D.lessons[k]}</span></label>`).join("");
    $("#group-options").innerHTML=groups.map(g=>`<label><input type="checkbox" name="group" value="${g}" checked><span>${g}</span></label>`).join("");$("#round-length").value=String(C.roundLength);
  }
  function handleTrainingForm(event){event.preventDefault();const lessons=$$("input[name=lesson]:checked").map(x=>x.value),groups=$$("input[name=group]:checked").map(x=>x.value);if(!lessons.length||!groups.length){$("#training-error").textContent="Wähle mindestens eine Lektion und eine Verbgruppe.";return;}$("#training-dialog").close();start({mode:$("#mode-select").value,lessons,groups,length:Number($("#round-length").value)});}
  function modeAvailable(v,mode){return mode==="mixed"?v.taskTypes.some(t=>C.enabledTaskTypes.includes(t)&&t!=="mixed"):v.taskTypes.includes(mode);}
  function start(settings={}){
    const full={mode:settings.mode||"mixed",lessons:settings.lessons||C.activeLessons,groups:settings.groups||C.activeGroups,length:settings.length||C.roundLength};
    const pool=releasedVerbs().filter(v=>full.lessons.includes(v.lesson)&&full.groups.includes(v.group)&&modeAvailable(v,full.mode));
    if(!pool.length){alert("Für diese Auswahl sind noch keine belegten Aufgaben verfügbar.");return;}
    const plan=Planner.buildRound({verbs:pool,state,config:C,length:full.length});session={settings:full,plan,index:0,correct:0,xp:0,streak:0,startedAt:Date.now(),results:[],used:[]};showView("training-view");nextQuestion();
  }
  function nextQuestion(){if(session.index>=session.plan.length)return finish();const item=session.plan[session.index],verb=item.verb,person=Planner.pickPerson(verb,state);let mode=session.settings.mode;if(mode==="mixed"){const options=verb.taskTypes.filter(t=>C.enabledTaskTypes.includes(t)&&t!=="mixed");mode=options[Math.floor(Math.random()*options.length)];}current=buildQuestion(verb,person,mode,item.category);renderQuestion();}
  function buildQuestion(verb,person,mode,category){
    if(mode==="sentence"){const sentence=verb.sentences[Math.floor(Math.random()*verb.sentences.length)];person=sentence.person;return{verb,person,mode,category,answer:sentence.answer,prompt:sentence.text,context:`${verb.infinitive} · ${verb.meaning}`,input:true};}
    if(mode==="write")return{verb,person,mode,category,answer:verb.forms[person],prompt:`${D.persons[person]} + ${verb.infinitive}`,context:verb.meaning,input:true};
    if(mode==="choice")return{verb,person,mode,category,answer:verb.forms[person],prompt:`${D.persons[person]} + ${verb.infinitive}`,context:verb.meaning,options:distractors(verb,person)};
    if(mode==="person")return{verb,person,mode,category,answer:D.persons[person],prompt:verb.forms[person],context:`Infinitiv: ${verb.infinitive}`,options:shuffle(D.persons)};
    const candidates=shuffle(releasedVerbs().filter(v=>v.id!==verb.id)).slice(0,3).map(v=>v.infinitive);return{verb,person,mode,category,answer:verb.infinitive,prompt:verb.forms[person],context:"Wie lautet der Infinitiv?",options:shuffle([verb.infinitive,...candidates])};
  }
  function distractors(v,p){
    const list=[v.forms[(p+1)%6],v.infinitive],stem=v.infinitive.slice(0,-2),endings={"-ar":["o","as","a","amos","áis","an"],"-er":["o","es","e","emos","éis","en"],"-ir":["o","es","e","imos","ís","en"]},base=v.infinitive.endsWith("ar")?"-ar":v.infinitive.endsWith("er")?"-er":"-ir";list.push(stem+endings[base][p]);if(v.stemChange)list.push(stem+endings[base][p]);return shuffle([v.forms[p],...[...new Set(list.filter(x=>x!==v.forms[p]))].slice(0,3)]);
  }
  function renderQuestion(){
    const q=current;$("#round-label").textContent=`Aufgabe ${session.index+1} von ${session.plan.length}`;$("#round-xp").textContent=`${session.xp} XP`;$("#progress-bar").style.width=`${session.index/session.plan.length*100}%`;$("#question-category").textContent=CATEGORY[q.category];$("#question-mode").textContent=MODES[q.mode].label;$("#question-group").textContent=q.verb.group;
    $("#question-instruction").textContent=q.mode==="person"?"Welche Person passt zu dieser Form?":q.mode==="infinitive"?"Erkenne den Infinitiv.":q.mode==="sentence"?"Ergänze die passende Verbform.":"Bilde die richtige Präsensform.";$("#question-title").textContent=q.prompt;$("#question-context").textContent=q.context;$("#feedback").hidden=true;$("#feedback").className="feedback";$("#check-answer").hidden=false;$("#next-question").hidden=true;
    if(q.input){$("#answer-area").innerHTML='<label class="sr-only" for="text-answer">Antwort</label><input id="text-answer" class="answer-input" autocomplete="off" autocapitalize="none" autocorrect="off" spellcheck="false" inputmode="text" placeholder="Antwort eingeben">';renderSpecialCharacters();setTimeout(()=>$("#text-answer").focus(),30);$("#text-answer").addEventListener("keydown",e=>{if(e.key==="Enter")checkAnswer();});}
    else{$("#answer-area").innerHTML=`<div class="choice-grid">${q.options.map(o=>`<button class="choice" type="button" data-value="${escapeHtml(o)}">${escapeHtml(o)}</button>`).join("")}</div>`;$("#special-characters").hidden=true;$$('.choice').forEach(b=>b.addEventListener("click",()=>{$$('.choice').forEach(x=>x.classList.remove("selected"));b.classList.add("selected");}));}
  }
  function renderSpecialCharacters(){const box=$("#special-characters");box.hidden=false;box.innerHTML=C.specialCharacters.map(c=>`<button type="button">${c}</button>`).join("");$$('button',box).forEach(b=>b.addEventListener('click',()=>{const input=$("#text-answer"),start=input.selectionStart;input.setRangeText(b.textContent,start,input.selectionEnd,"end");input.focus();}));}
  function selectedAnswer(){return current.input?$("#text-answer").value:$(".choice.selected")?.dataset.value||"";}
  function checkAnswer(){
    const given=selectedAnswer();if(!given){const f=$("#feedback");f.hidden=false;f.className="feedback neutral";f.textContent="Bitte gib eine Antwort ein oder wähle eine aus.";return;}
    const correct=normalize(given)===normalize(current.answer),error=correct?null:diagnose(current,given),xp=correct?10+Math.min(session.streak,5)*2:2;if(correct){session.correct++;session.streak++;state.bestStreak=Math.max(state.bestStreak,session.streak);}else session.streak=0;session.xp+=xp;
    Store.record(state,{verbId:current.verb.id,person:D.persons[current.person],correct,errorCategory:error?.category||"keiner",xp});session.used.push(current.verb.id);session.results.push({verb:current.verb.infinitive,person:D.persons[current.person],mode:current.mode,category:current.category,correct,error:error?.category||null});
    const oldNote=current.category==="old"?"<em>Dieses Verb kennst du schon – die Wiederholung festigt es.</em>":current.category==="review"?"<em>Diese Form ist Teil deiner persönlichen Wiederholung.</em>":"";const f=$("#feedback");f.hidden=false;f.className=`feedback ${correct?"correct":"incorrect"}`;f.innerHTML=correct?`<strong>Richtig · +${xp} XP</strong><span>${patternHint(current.verb,current.person,true)}</span>${oldNote}`:`<strong>Noch nicht: ${escapeHtml(current.answer)}</strong><span>${escapeHtml(error.message)}</span>${oldNote}`;
    if(current.input)$("#text-answer").disabled=true;else $$(".choice").forEach(b=>{b.disabled=true;if(normalize(b.dataset.value)===normalize(current.answer))b.classList.add("is-correct");else if(b.classList.contains("selected"))b.classList.add("is-wrong");});$("#check-answer").hidden=true;$("#next-question").hidden=false;$("#next-question").focus();session.index++;
  }
  function diagnose(q,given){const v=q.verb,p=q.person,n=normalize(given);if(v.forms.some((f,i)=>i!==p&&normalize(f)===n))return{category:"falsche Person",message:`Das ist eine Form für eine andere Person. Achte auf ${D.persons[p]}.`};if(n===normalize(v.infinitive))return{category:"Infinitiv statt Verbform",message:"Hier brauchst du eine konjugierte Form, nicht den Infinitiv."};if(v.stemChange&&[0,1,2,5].includes(p)&&!n.includes(v.stemChange.split("→")[1]))return{category:"Stammwechsel vergessen",message:`Bei ${v.infinitive} wird ${v.stemChange} in den betonten Formen.`};if(v.stemChange&&[3,4].includes(p)&&n.includes(v.stemChange.split("→")[1]))return{category:"Stammwechsel an falscher Stelle",message:`Der Stammwechsel gilt hier nicht bei ${D.persons[p]}.`};if(p===0&&v.yoSpecial)return{category:"besondere yo-Form vergessen",message:`Die yo-Form von ${v.infinitive} lautet ${v.yoSpecial}.`};if(Math.abs(n.length-normalize(q.answer).length)<=1)return{category:"Tippfehler",message:`Vergleiche deine Schreibweise genau mit ${q.answer}.`};return{category:"falsche Endung oder Form",message:patternHint(v,p,false)};}
  function patternHint(v,p,positive){if(v.stemChange)return[3,4].includes(p)?`Bei ${D.persons[p]} bleibt der Stamm ohne Wechsel.`:`Muster: ${v.stemChange} in dieser betonten Form.`;if(p===0&&v.yoSpecial)return`Merke dir die besondere yo-Form: ${v.yoSpecial}.`;if(!v.regular)return`Diese Form von ${v.infinitive} ist unregelmäßig.`;return`${positive?"Passt":"Achte"}: Stamm und Endung für ${D.persons[p]}.`;}
  function awardBadges(){const add=id=>{if(!state.badges.includes(id))state.badges.push(id);};if(state.sessions.length>=1)add("first");if(session.results.some(r=>r.category==="new"&&r.correct))add("newPower");if(session.results.some(r=>r.category==="review"&&r.correct))add("remembered");const older=releasedVerbs().filter(v=>v.stage<C.currentStage&&Planner.mastery(state.verbs[v.id])>=70);if(older.length>=2)add("foundation");}
  function finish(){
    const duration=Date.now()-session.startedAt,rate=Math.round(session.correct/session.plan.length*100),mix=session.results.reduce((a,r)=>(a[r.category]++,a),{new:0,old:0,review:0});state.totals.durationMs+=duration;
    state.sessions.unshift({date:new Date().toISOString(),mode:session.settings.mode,currentStage:C.currentStage,durationMs:duration,questions:session.plan.length,correct:session.correct,xp:session.xp,lessons:session.settings.lessons,groups:session.settings.groups,verbs:[...new Set(session.used)],mix});state.sessions=state.sessions.slice(0,50);awardBadges();Store.save(state);
    $("#result-summary").textContent=`${session.correct} von ${session.plan.length} Aufgaben richtig · ${rate} % Trefferquote`;$("#result-stats").innerHTML=`<div><strong>+${session.xp}</strong><span>XP</span></div><div><strong>${Math.max(1,Math.round(duration/60000))}</strong><span>Minuten</span></div><div><strong>${session.results.filter(r=>!r.correct).length}</strong><span>Fehler</span></div>`;$("#result-mix").innerHTML=`<strong>Deine Mischung:</strong> ${mix.new} neu · ${mix.old} bekannt · ${mix.review} persönlich`;
    const errors=Object.entries(session.results.reduce((a,r)=>{if(r.error)a[r.error]=(a[r.error]||0)+1;return a;},{})).sort((a,b)=>b[1]-a[1]);$("#result-focus").innerHTML=errors.length?`<strong>Nächster Fokus:</strong> ${escapeHtml(errors[0][0])}`:"<strong>Starke Runde:</strong> Alle Aufgaben richtig gelöst.";showView("result-view");renderDashboard();
  }
  function leaveTraining(){if(confirm("Diese Runde beenden? Dein bisheriger Lernstand bleibt gespeichert."))showView("home-view");}
  function showView(id){$$('.view').forEach(v=>v.hidden=v.id!==id);window.scrollTo({top:0});}
  function openSettings(){$("#learner-name").value=state.learnerName||"";$("#settings-dialog").showModal();}
  function saveName(){state.learnerName=$("#learner-name").value.trim();Store.save(state);$("#settings-dialog").close();}
  function exportData(){const report={trainer:"¡Vamos! Verb für Verb",exportiertAm:new Date().toISOString(),nameOderKuerzel:state.learnerName||"",aktuelleStufe:C.currentStage,freigegebeneVerben:releasedVerbs().map(v=>v.id),gesamt:{...state.totals,xp:state.xp,besteSerie:state.bestStreak},abzeichen:state.badges,fehler:state.errors,verben:state.verbs,personen:state.persons,runden:state.sessions};const blob=new Blob([JSON.stringify(report,null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`vamos-verb-fuer-verb-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(a.href);}
  function resetProgress(){if(!confirm("Den gesamten lokalen Lernstand auf diesem Gerät wirklich löschen?"))return;Store.clear();location.reload();}
  function showEmptyState(){$("#quick-start").disabled=true;$("#mode-grid").innerHTML='<p class="privacy-note">Zurzeit sind keine Verben freigegeben. Prüfe die Lehrkraftkonfiguration.</p>';}
  init();
})();
