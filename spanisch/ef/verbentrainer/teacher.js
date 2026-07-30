(function () {
  "use strict";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const KEY = "vamos-teacher-draft-v1";
  const D = window.VERB_DATA;
  const C = window.TEACHER_CONFIG;
  const REVISION = 2;
  const MODE_LABELS = {
    write:"Verbform schreiben", choice:"Verbform auswählen", person:"Person erkennen",
    verbGroup:"Verbgruppe erkennen", sentence:"Belegte Lückensätze", mixed:"Gemischtes Training"
  };
  let draft = readCurrent();

  function cleanModes(modes) {
    return [...new Set((modes || []).map(mode => mode === "infinitive" ? "verbGroup" : mode).filter(mode => MODE_LABELS[mode]))];
  }
  function freshDraft() {
    return {
      version:2, curriculumRevision:REVISION, currentStage:C.currentStage, roundLength:C.roundLength,
      distribution:{...C.distribution}, repetition:{...C.repetition}, enabledTaskTypes:cleanModes(C.enabledTaskTypes),
      verbs:D.verbs.map(verb => ({id:verb.id,sequence:verb.sequence,stage:verb.stage,active:verb.active})),
      customVerbs:D.verbs.filter(verb => verb.custom).map(copyCustom)
    };
  }
  function copyCustom(verb) {
    return {
      id:verb.id, infinitive:verb.infinitive, meaning:verb.meaning, forms:[...verb.forms], group:verb.group,
      lesson:verb.lesson, topic:verb.topic, regular:verb.regular, irregularity:verb.irregularity,
      stemChange:verb.stemChange, yoSpecial:verb.yoSpecial, difficulty:verb.difficulty,
      sentences:[...(verb.sentences || [])], sources:[...verb.sources], active:verb.active,
      taskTypes:cleanModes(verb.taskTypes), sequence:verb.sequence, stage:verb.stage, custom:true
    };
  }
  function readCurrent() {
    const base = freshDraft();
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "null");
      if (!saved) return base;
      base.currentStage = Number.isInteger(saved.currentStage) ? saved.currentStage : base.currentStage;
      base.roundLength = Number(saved.roundLength) || base.roundLength;
      if (saved.distribution) base.distribution = {...base.distribution,...saved.distribution};
      if (saved.repetition) base.repetition = {...base.repetition,...saved.repetition};
      if (saved.enabledTaskTypes) base.enabledTaskTypes = cleanModes(saved.enabledTaskTypes);
      if (saved.curriculumRevision === REVISION && Array.isArray(saved.verbs)) base.verbs = saved.verbs;
      if (Array.isArray(saved.customVerbs)) base.customVerbs = saved.customVerbs;
      return base;
    } catch (_) { return base; }
  }
  function init() { populateStatic(); render(); bind(); updateMix(); }
  function populateStatic() {
    const stageOptions = C.stages.map(stage => `<option value="${stage.id}">Stufe ${stage.id} · ${stage.title}</option>`).join("");
    $("#current-stage").innerHTML = stageOptions;
    $("#new-stage").innerHTML = stageOptions;
    $("#new-lesson").innerHTML = Object.entries(D.lessons).map(([id,label]) => `<option value="${id}">${label}</option>`).join("");
    $("#mode-options").innerHTML = Object.entries(MODE_LABELS).map(([id,label]) => `<label><input type="checkbox" value="${id}"><span>${label}</span></label>`).join("");
  }
  function render() {
    $("#current-stage").value = draft.currentStage;
    $("#round-length").value = draft.roundLength;
    $("#minimum-older").value = draft.repetition.minimumOlderItemsPerRound;
    $("#maximum-same").value = draft.repetition.maximumSameVerbPerRound;
    $("#newest-share").value = Math.round(draft.distribution.newestStage * 100);
    $("#older-share").value = Math.round(draft.distribution.olderStages * 100);
    $("#adaptive-share").value = Math.round(draft.distribution.adaptiveReview * 100);
    $$("#mode-options input").forEach(input => input.checked = draft.enabledTaskTypes.includes(input.value));
    renderVerbs(); updateMix(); updateSummary();
  }
  function verbById(id) { return D.verbs.find(verb => verb.id === id); }
  function renderVerbs() {
    draft.verbs.sort((a,b) => a.sequence - b.sequence);
    $("#verb-list").innerHTML = draft.verbs.map((item,index) => {
      const verb = verbById(item.id); if (!verb) return "";
      const released = item.active && item.stage <= draft.currentStage;
      return `<article class="verb-row ${released ? "is-released" : "is-locked"}" data-id="${item.id}">
        <div class="order-buttons"><button type="button" data-move="up" aria-label="${verb.infinitive} nach oben" ${index===0?"disabled":""}>↑</button><button type="button" data-move="down" aria-label="${verb.infinitive} nach unten" ${index===draft.verbs.length-1?"disabled":""}>↓</button></div>
        <div class="verb-name"><strong>${verb.infinitive}${verb.custom?' <span class="custom-mark">eigen</span>':''}</strong><small>${verb.meaning}</small></div>
        <label class="toggle"><input type="checkbox" data-active ${item.active?"checked":""}> aktiv</label>
        <select data-stage aria-label="Stufe für ${verb.infinitive}">${C.stages.map(stage => `<option value="${stage.id}" ${stage.id===item.stage?"selected":""}>Stufe ${stage.id}</option>`).join("")}</select>
        <span class="sequence">Position ${index+1}</span>${verb.custom?`<button class="delete-verb" type="button" data-delete aria-label="${verb.infinitive} löschen">Löschen</button>`:""}
      </article>`;
    }).join("");
    bindVerbRows();
  }
  function bind() {
    $("#current-stage").addEventListener("change", event => { draft.currentStage=Number(event.target.value); saveAndRender(); });
    $("#round-length").addEventListener("change", event => { draft.roundLength=Number(event.target.value); save(); });
    $("#minimum-older").addEventListener("change", event => { draft.repetition.minimumOlderItemsPerRound=Number(event.target.value); save(); });
    $("#maximum-same").addEventListener("change", event => { draft.repetition.maximumSameVerbPerRound=Number(event.target.value); save(); });
    [["newest-share","newestStage"],["older-share","olderStages"],["adaptive-share","adaptiveReview"]].forEach(([id,key]) => $("#"+id).addEventListener("input", event => { draft.distribution[key]=Number(event.target.value)/100; updateMix(); save(false); }));
    $$("#mode-options input").forEach(input => input.addEventListener("change", () => { draft.enabledTaskTypes=$$("#mode-options input:checked").map(item=>item.value); save(); }));
    $("#add-verb-form").addEventListener("submit", addVerb);
    $("#download-js").addEventListener("click",downloadJs);
    $("#download-json").addEventListener("click",()=>download(JSON.stringify(draft,null,2),"vamos-lehrkraft-entwurf.json","application/json"));
    $("#import-json").addEventListener("change",importJson);
    $("#reset-draft").addEventListener("click",resetDraft);
  }
  function bindVerbRows() {
    $$(".verb-row").forEach(row => {
      const id=row.dataset.id;
      $$('button[data-move]',row).forEach(button=>button.addEventListener("click",()=>move(id,button.dataset.move)));
      $("[data-active]",row).addEventListener("change",event=>{find(id).active=event.target.checked;syncCustom(id);saveAndRender();});
      $("[data-stage]",row).addEventListener("change",event=>{find(id).stage=Number(event.target.value);syncCustom(id);saveAndRender();});
      $("[data-delete]",row)?.addEventListener("click",()=>deleteVerb(id));
    });
  }
  function find(id) { return draft.verbs.find(verb=>verb.id===id); }
  function move(id,direction) {
    const index=draft.verbs.findIndex(verb=>verb.id===id),target=direction==="up"?index-1:index+1;
    if(target<0||target>=draft.verbs.length)return;
    [draft.verbs[index],draft.verbs[target]]=[draft.verbs[target],draft.verbs[index]];
    draft.verbs.forEach((verb,i)=>verb.sequence=i+1);draft.customVerbs.forEach(verb=>syncCustom(verb.id));saveAndRender();
  }
  function syncCustom(id) { const custom=draft.customVerbs.find(verb=>verb.id===id),item=find(id);if(custom&&item)Object.assign(custom,{sequence:item.sequence,stage:item.stage,active:item.active}); }
  function makeId(infinitive) { return infinitive.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-zñ]+/g,"-").replace(/^-|-$/g,""); }
  function addVerb(event) {
    event.preventDefault();const error=$("#add-verb-error");error.textContent="";
    const infinitive=$("#new-infinitive").value.trim().toLocaleLowerCase("es"),id=makeId(infinitive),group=$("#new-group").value,forms=$$("[data-new-form]").map(input=>input.value.trim().toLocaleLowerCase("es"));
    if(!id||D.verbs.some(verb=>verb.id===id)){error.textContent="Dieses Verb ist bereits vorhanden oder besitzt keinen gültigen Infinitiv.";return;}
    if(group.startsWith("-")&&!infinitive.endsWith(group.slice(1))){error.textContent=`Der Infinitiv passt nicht zur ausgewählten Gruppe ${group}.`;return;}
    if(forms.some(form=>!form)){error.textContent="Bitte trage alle sechs Präsensformen ein.";return;}
    const regular=group.startsWith("-");const stage=Number($("#new-stage").value),sequence=draft.verbs.length+1;
    const custom={id,infinitive,meaning:$("#new-meaning").value.trim(),forms,group,lesson:$("#new-lesson").value,topic:"Aktueller Unterricht",regular,irregularity:regular?null:"von der Lehrkraft als unregelmäßig eingetragen",stemChange:null,yoSpecial:null,difficulty:regular?1:2,sentences:[],sources:[$("#new-source").value.trim()],active:true,taskTypes:["write","choice","person","verbGroup"],sequence,stage,custom:true};
    if(!custom.meaning||!custom.sources[0]||!$("#new-verified").checked){error.textContent="Bedeutung, Quelle und fachliche Bestätigung sind erforderlich.";return;}
    D.verbs.push(custom);draft.customVerbs.push(custom);draft.verbs.push({id,sequence,stage,active:true});save();event.target.reset();$("#new-stage").value=String(stage);renderVerbs();updateSummary();$("#save-status").textContent=`${infinitive} hinzugefügt`;
  }
  function deleteVerb(id) { const verb=verbById(id);if(!verb?.custom||!confirm(`Das selbst eingetragene Verb „${verb.infinitive}“ aus diesem Entwurf löschen?`))return;D.verbs=D.verbs.filter(item=>item.id!==id);draft.verbs=draft.verbs.filter(item=>item.id!==id);draft.customVerbs=draft.customVerbs.filter(item=>item.id!==id);draft.verbs.forEach((item,index)=>item.sequence=index+1);saveAndRender(); }
  function updateSummary() { const released=draft.verbs.filter(item=>item.active&&item.stage<=draft.currentStage),custom=draft.customVerbs.length;$("#release-summary").innerHTML=`<strong>Vorschau:</strong> ${released.length} Verben bis Stufe ${draft.currentStage} freigegeben · ${custom} selbst ergänzt. <span>Änderungen gelten lokal sofort; für GitHub ist anschließend der Export nötig.</span>`; }
  function updateMix() { const newest=Math.round(draft.distribution.newestStage*100),older=Math.round(draft.distribution.olderStages*100),adaptive=Math.round(draft.distribution.adaptiveReview*100),total=newest+older+adaptive;$("#newest-output").textContent=newest+" %";$("#older-output").textContent=older+" %";$("#adaptive-output").textContent=adaptive+" %";$("#mix-total").textContent=`Summe: ${total} %`;$("#mix-total").className=`mix-total ${total===100?"valid":"invalid"}`;$("#download-js").disabled=total!==100; }
  function save(show=true) { draft.curriculumRevision=REVISION;localStorage.setItem(KEY,JSON.stringify(draft));if(show){$("#save-status").textContent="Lokal gespeichert · noch nicht veröffentlicht";setTimeout(()=>$("#save-status").textContent="Gilt für die Vorschau",1600);}updateSummary(); }
  function saveAndRender() { save();renderVerbs(); }
  function downloadJs() { save();const content=`(function () {\n  "use strict";\n  window.PUBLISHED_TEACHER_OVERRIDE = ${JSON.stringify(draft,null,2)};\n})();\n`;download(content,"teacher-settings.js","text/javascript"); }
  function download(content,name,type) { const blob=new Blob([content],{type}),link=document.createElement("a");link.href=URL.createObjectURL(blob);link.download=name;link.click();URL.revokeObjectURL(link.href); }
  async function importJson(event) { const file=event.target.files?.[0];if(!file)return;try{const parsed=JSON.parse(await file.text());validate(parsed);parsed.curriculumRevision=REVISION;parsed.enabledTaskTypes=cleanModes(parsed.enabledTaskTypes);localStorage.setItem(KEY,JSON.stringify(parsed));location.reload();}catch(_){alert("Die Datei konnte nicht als gültiger Lehrkraftentwurf gelesen werden.");}event.target.value=""; }
  function validate(value) { if(!value||!Array.isArray(value.verbs)||!Number.isInteger(value.currentStage)||!value.distribution)throw new Error("ungültig");for(const verb of value.customVerbs||[]){if(!verb.id||!verb.infinitive||!verb.meaning||verb.forms?.length!==6||!verb.sources?.length)throw new Error("unvollständiges eigenes Verb");}const ids=new Set([...D.verbs.map(verb=>verb.id),...(value.customVerbs||[]).map(verb=>verb.id)]);if(value.verbs.some(verb=>!ids.has(verb.id)))throw new Error("unbekanntes Verb"); }
  function resetDraft() { if(!confirm("Den lokalen Lehrkraftentwurf wirklich auf die Projektstandards zurücksetzen?"))return;localStorage.removeItem(KEY);location.reload(); }
  init();
})();
