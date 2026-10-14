import {Game,validate,fitText} from './engine.mjs';
const $=id=>document.getElementById(id),canvas=$('game'),ctx=canvas.getContext('2d');
const params=new URLSearchParams(location.search);let editing=!params.has('embed')&&(params.has('edit')||document.body.dataset.workshop==='true');let scenario,game,selected=null,drag=null,scrollGesture=null,last=0,paused=false,texts=new Map();
function notice(message){$('notice').textContent=message;$('editor-notice').textContent=message;}
function readHash(){if(!location.hash)return null;try{return JSON.parse(decodeURIComponent(location.hash.slice(1)));}catch{throw Error('Die Szenario-Adresse ist beschädigt.');}}
try{scenario=validate(readHash()||await(await fetch('./scenarios/knotberg.json')).json());}catch(e){notice(e.message);throw e;}
function setView(){document.body.classList.toggle('edit-view',editing);document.body.classList.toggle('play-view',!editing);$('editor').hidden=!editing;}
setView();
function setup(s){const next=validate(s),nextTexts=new Map();for(const c of next.categories)for(const word of c.words)nextTexts.set(word,fitText(ctx,word,next.size,next.font,next.fontSize));scenario=next;texts=nextTexts;document.documentElement.classList.toggle('transparent-game',!!scenario.transparent);document.documentElement.style.backgroundColor=scenario.transparent?'transparent':scenario.background;document.body.classList.toggle('hud-transparent',scenario.hudTransparent);document.documentElement.style.setProperty('--hud-background',scenario.hudBackground);document.documentElement.style.setProperty('--hud-text',scenario.hudText);canvas.parentElement.style.backgroundColor=scenario.transparent?'transparent':scenario.background;game=new Game(scenario);resizeBoard();selected=null;drag=null;scrollGesture=null;paused=false;$('pause').textContent='Pause';$('title').textContent=scenario.name;$('intro').textContent=scenario.intro;$('result').hidden=true;last=0;notice('Bereit. Starte die Runde.');applyStartMode();sync();draw();}
function updateStats(){const parts=[];if(scenario.showProgress)parts.push(`${game.count}/${game.total} zugeordnet`);if(scenario.timer)parts.push(`Zeit: ${Math.ceil(game.remaining)} s`);const text=parts.join(' · ');if($('stats').textContent!==text)$('stats').textContent=text;$('stats').hidden=!text;$('toolbar-info').hidden=$('stats').hidden&&$('code-box').hidden;}

function updateControls(){
  const ready=game.phase==='ready',ended=['won','lost','timeout'].includes(game.phase),overlay=ready&&!editing&&scenario.startMode==='overlay';
  canvas.parentElement.classList.toggle('waiting',overlay);canvas.parentElement.classList.toggle('ended',ended);
  $('start-screen').hidden=!overlay;$('start').hidden=!ready||(!editing&&scenario.startMode!=='button');$('start').disabled=!ready;$('start').textContent=scenario.startLabel;
  $('play-start').setAttribute('aria-label',scenario.startLabel);$('start-caption').textContent=scenario.startLabel;
  $('pause').hidden=game.phase!=='playing';$('pause').disabled=game.phase!=='playing';
  $('keyboard-tools').hidden=ready||ended;
  $('lives').setAttribute('aria-label',`${game.lives} von ${scenario.lives} Leben`);const hearts=$('life-icons');hearts.replaceChildren();
  for(let i=0;i<scenario.lives;i++){const heart=document.createElement('span');heart.textContent='♥';heart.className=i<game.lives?'life-alive':'life-lost';heart.setAttribute('aria-hidden','true');hearts.append(heart);}
}
function applyStartMode(){if(!editing&&scenario.startMode==='auto'&&!document.hidden){game.start();notice('Die Runde läuft. Ordne die Wörter zu.');}}
function sync(){ renderCategories();renderCode();updateStats();updateControls();const words=$('word-buttons');words.replaceChildren();for(const b of game.bubbles.filter(b=>b.state==='floating')){const button=document.createElement('button');button.textContent=b.word.replaceAll('|','');button.setAttribute('aria-pressed',String(b===selected));button.disabled=game.phase!=='playing'||paused;button.onclick=()=>{if(game.phase==='playing'&&!paused){selected=b;notice('Wähle jetzt die Kategorie.');sync();}};words.append(button);}const targets=$('target-buttons');targets.replaceChildren();scenario.categories.forEach((c,i)=>{const button=document.createElement('button');button.textContent=c.name;button.disabled=game.phase!=='playing'||paused;button.onclick=()=>{if(selected)assign(selected,i);};targets.append(button);});}
function finishView(){if(!['won','lost','timeout'].includes(game.phase))return;$('result').hidden=false;$('result-title').textContent=game.phase==='won'?'Geschafft!':game.phase==='timeout'?'Die Zeit ist abgelaufen':'Keine Leben mehr';$('result-message').textContent=game.phase==='won'?scenario.success:'Versuche es noch einmal. Deine Einstellungen bleiben erhalten.';$('code').textContent=game.phase==='won'?game.solutionCode():'';$('code').hidden=!$('code').textContent;drag=null;selected=null;sync();$('again').focus();}
function assign(b,i){if(paused)return;const answer=game.assign(b,i);selected=null;drag=null;if(answer!==null)notice(answer?'Richtig! Das Wort gleitet zu seinem Ziel.':'Das passt noch nicht. Ein Leben ist verloren.');sync();finishView();}
function roundRect(t,fill,border){ctx.fillStyle=fill;ctx.strokeStyle=border;ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(t.x,t.y,t.w,t.h,15);ctx.fill();ctx.stroke();}
function targetText(text,x,y,width,size){ctx.font=`${size}px "${scenario.font}"`;let words=text.split(' '),lines=[''];for(const word of words){let candidate=(lines.at(-1)+' '+word).trim();if(ctx.measureText(candidate).width>width&&lines.at(-1))lines.push(word);else lines[lines.length-1]=candidate;}while(lines.some(l=>ctx.measureText(l).width>width)&&size>8){size--;ctx.font=`${size}px "${scenario.font}"`;}lines.forEach((l,i)=>ctx.fillText(l,x,y+i*size*1.1));}
function categoryTitle(text,width,wanted){
  for(let size=wanted;size>=8;size-=.5){ctx.font=`${size}px "${scenario.font}"`;const lines=[''];for(const word of text.split(' ')){const candidate=(lines.at(-1)+' '+word).trim();if(ctx.measureText(candidate).width>width&&lines.at(-1))lines.push(word);else lines[lines.length-1]=candidate;}if(lines.length<=2&&lines.every(l=>ctx.measureText(l).width<=width))return {lines,size};}
  return {lines:[text],size:8};
}
function renderCategories(){
  if(!game)return;const layer=$('category-cards');layer.replaceChildren();const scale=canvas.clientWidth/game.w;
  game.targets.forEach((t,i)=>{const c=scenario.categories[i],card=document.createElement('section');card.className='target-card';card.setAttribute('aria-label',c.name);
    Object.assign(card.style,{left:`${canvas.offsetLeft+t.x*scale}px`,top:`${canvas.offsetTop+t.y*scale}px`,width:`${t.w*scale}px`,height:`${t.h*scale}px`,background:c.background,borderColor:c.border,color:c.text,fontFamily:scenario.font,padding:`${6*scale}px`,borderWidth:`${2*scale}px`,borderRadius:`${15*scale}px`,gap:`${4*scale}px`});
    const title=document.createElement('h2'),fitted=categoryTitle(c.name,t.w-20,scenario.categoryFontSize);title.textContent=fitted.lines.join('\n');title.style.fontSize=`${fitted.size*scale}px`;card.append(title);
    if(scenario.collected){const list=document.createElement('ul');list.className='collected-words';list.style.fontSize=`${16*scale}px`;for(const word of game.collected[i]){const item=document.createElement('li');item.textContent=word;list.append(item);}card.append(list);}
    else{const count=document.createElement('p');count.className='collected-count';count.style.fontSize=`${16*scale}px`;count.textContent=`${game.collected[i].length} / ${c.words.length}`;card.append(count);}
    card.onpointerdown=e=>{if(selected)canvas.onpointerdown(e);};layer.append(card);
  });
}
function renderCode(){const box=$('code-box');box.hidden=scenario.codeMode!=='categories';const slots=$('code-slots');slots.replaceChildren();if(box.hidden)return;game.codeSlots().forEach((part,i)=>{const slot=document.createElement('span');slot.className='code-slot';slot.textContent=part??'–';slot.setAttribute('aria-label',`${scenario.categories[i].name}: ${part??'noch nicht vollständig'}`);if(part!==null)slot.classList.add('revealed');slots.append(slot);});}
function draw(){ctx.clearRect(0,0,game.w,game.h);ctx.textAlign='center';ctx.textBaseline='middle';if(scenario.movementArea==='clear'){const a=game.arena;ctx.strokeStyle='#ffffff19';ctx.setLineDash([4,8]);ctx.strokeRect(a.x,a.y,a.w,a.h);ctx.setLineDash([]);}

 if(drag){ctx.strokeStyle='#ffe0a0';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(drag.b.x,drag.b.y);ctx.lineTo(drag.x,drag.y);ctx.stroke();}
 for(const b of game.bubbles){ctx.save();ctx.fillStyle=scenario.fill;ctx.strokeStyle=b===selected?'#ffffff':scenario.stroke;ctx.lineWidth=scenario.strokeWidth;if(scenario.glow){ctx.shadowColor=scenario.stroke;ctx.shadowBlur=14;}ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.shadowBlur=0;const fitted=texts.get(b.word);ctx.font=`${fitted.size}px "${scenario.font}"`;ctx.fillStyle=scenario.text;fitted.lines.forEach((line,i)=>ctx.fillText(line,b.x,b.y+(i-(fitted.lines.length-1)/2)*fitted.size*1.18));ctx.restore();}
}
function frame(t){if(last&&game.phase==='playing'&&!paused){const before=game.count,beforeQueue=game.queue.length,phase=game.phase;game.step(Math.min((t-last)/1000,.04),selected,(t-last)/1000);if(game.count!==before||game.queue.length!==beforeQueue){sync();}if(phase!==game.phase)finishView();updateStats();}last=t;draw();requestAnimationFrame(frame);}
function point(e){const rect=canvas.getBoundingClientRect();return {x:(e.clientX-rect.left)*game.w/rect.width,y:(e.clientY-rect.top)*game.h/rect.height};}
function targetAt(p){return game.targets.findIndex(t=>p.x>=t.x&&p.x<=t.x+t.w&&p.y>=t.y&&p.y<=t.y+t.h);}
function listAt(p){const i=targetAt(p);return i>=0?$('category-cards').children[i]?.querySelector('.collected-words'):null;}
canvas.onpointerdown=e=>{
  if(drag||scrollGesture)return;const p=point(e),target=targetAt(p),active=game.phase==='playing'&&!paused;
  // Words above a target remain selectable. Contact alone never assigns a word.
  const b=active?[...game.bubbles].reverse().find(b=>b.state==='floating'&&Math.hypot(b.x-p.x,b.y-p.y)<=b.r):null;
  if(b){selected=b;drag={b,...p,origin:p,id:e.pointerId};canvas.setPointerCapture(e.pointerId);sync();return;}
  if(active&&selected&&target>=0){assign(selected,target);return;}
  const list=listAt(p);if(list&&list.scrollHeight>list.clientHeight+1){scrollGesture={id:e.pointerId,y:e.clientY,list};canvas.setPointerCapture(e.pointerId);}
};
canvas.onpointermove=e=>{if(scrollGesture&&scrollGesture.id===e.pointerId){scrollGesture.list.scrollTop+=scrollGesture.y-e.clientY;scrollGesture.y=e.clientY;}else if(drag&&drag.id===e.pointerId)Object.assign(drag,point(e));};
canvas.onpointerup=e=>{if(scrollGesture&&scrollGesture.id===e.pointerId){scrollGesture=null;return;}if(!drag||drag.id!==e.pointerId)return;const p=point(e),i=targetAt(p),b=drag.b,moved=Math.hypot(p.x-drag.origin.x,p.y-drag.origin.y)>8;drag=null;if(i>=0&&moved)assign(b,i);else notice('Wort ausgewählt. Tippe ein Ziel an oder zeichne die Verbindung erneut.');};
canvas.onpointercancel=()=>{drag=null;scrollGesture=null;selected=null;sync();};
canvas.addEventListener('wheel',e=>{const list=listAt(point(e));if(list&&list.scrollHeight>list.clientHeight+1){list.scrollTop+=e.deltaY;e.preventDefault();}},{passive:false});

function beginRound(){game.start();notice('Ordne die Wörter zu.');sync();$('pause').focus();}
$('start').onclick=beginRound;$('play-start').onclick=beginRound;
function restart(){setup(scenario);game.start();sync();notice('Neue Runde gestartet.');}
$('again').onclick=restart;$('pause').onclick=()=>{paused=!paused;drag=null;$('pause').textContent=paused?'Weiter':'Pause';notice(paused?'Runde pausiert.':'Runde läuft weiter.');sync();};
document.addEventListener('visibilitychange',()=>{if(document.hidden&&game.phase==='playing'){paused=true;drag=null;$('pause').textContent='Weiter';notice('Runde pausiert. Mit Weiter fortsetzen.');sync();}else if(!document.hidden&&game.phase==='ready'&&!editing&&scenario.startMode==='auto'){applyStartMode();sync();}});
const fieldDefs=[['name','Szenarioname','text'],['startMode','Startart','select',['button','Startbutton über dem Spielfeld','auto','Automatisch beim Öffnen','overlay','Großer Play-Button auf verschwommenem Spielfeld']],['startLabel','Beschriftung des Startbuttons','text'],['intro','Spielauftrag','text'],['code','Gemeinsamer Lösungscode (nur im Modus „erst am Ende“)','text'],['success','Erfolgsmeldung','text'],['codeMode','Code anzeigen','select',['categories','Ein Zeichen je gelöster Kategorie','final','Gemeinsamer Code erst am Ende','none','Nur Erfolgsmeldung, ohne Code']],['layout','Ziele anordnen','select',['corners','Ecken','bottom','Alle unten nebeneinander','sides','Links und rechts']],['font','Gemeinsame Schriftart','select',['Georgia','Georgia','Arial','Arial','Verdana','Verdana','Trebuchet MS','Trebuchet MS']],['size','Kugelgröße (64–150)','number',64,150],['fontSize','Kugelschrift (12–36)','number',12,36],['categoryFontSize','Kategorienschrift (12–30)','number',12,30],['fill','Kugelfüllung','color'],['stroke','Kugelrahmen','color'],['strokeWidth','Rahmenstärke (0–8)','number',0,8],['text','Kugeltext','color'],['glow','Leuchteffekt','checkbox'],['background','Spielfeldfarbe','color'],['transparent','Hintergrund transparent','checkbox'],['movementArea','Bewegungsfläche','select',['full','Gesamtes Spielfeld – auch über Kategorien','clear','Freier Bereich zwischen den Kategorien']],['speed','Geschwindigkeit (0–120)','number',0,120],['lives','Start-Leben (1–10)','number',1,10],['timer','Timer in Sekunden (0 = aus)','number',0,3600],['collected','Gesammelte Wörter anzeigen','checkbox'],['showProgress','Zuordnungszähler anzeigen','checkbox'],['hudTransparent','Hintergrund der Spielanzeigen transparent','checkbox'],['hudBackground','Hintergrundfarbe der Spielanzeigen','color'],['hudText','Textfarbe der Spielanzeigen','color']];
function field(parent,key,label,type,value,options,min,max){const l=document.createElement('label');l.textContent=label;const input=document.createElement(type==='select'?'select':type==='textarea'?'textarea':'input');input.name=key;if(type==='select')for(let i=0;i<options.length;i+=2){const o=new Option(options[i+1],options[i]);input.add(o);}else if(type!=='textarea')input.type=type;if(type==='checkbox')input.checked=value;else input.value=value;if(type==='number'){input.min=min;input.max=max;input.step=1;}if(type==='textarea')input.rows=6;l.append(input);parent.append(l);}
function populate(){ $('category-count').value=String(scenario.categories.length);$('general').replaceChildren();fieldDefs.forEach(([k,l,t,...args])=>field($('general'),k,l,t,scenario[k],t==='select'?args[0]:null,args[0],args[1]));$('categories').replaceChildren();scenario.categories.forEach((c,i)=>{const fs=document.createElement('fieldset'),legend=document.createElement('legend');legend.textContent=`Kategorie ${i+1}`;fs.append(legend);for(const [k,l,t] of [['name','Name','text'],['codePart','Codezeichen bei vollständiger Kategorie','text'],['background','Hintergrund','color'],['border','Rahmen','color'],['text','Textfarbe','color'],['words','Wörter (eines je Zeile)','textarea']])field(fs,`c${i}-${k}`,l,t,k==='words'?c.words.join('\n'):c[k]);$('categories').append(fs);});$('settings').elements.codeMode.onchange=updateCodeFields;updateCodeFields();}
function updateCodeFields(){const elements=$('settings').elements,categories=elements.codeMode.value==='categories';elements.code.disabled=elements.codeMode.value!=='final';scenario.categories.forEach((c,i)=>{elements[`c${i}-codePart`].disabled=!categories;});}
function readSettings(){const next=structuredClone(scenario),elements=$('settings').elements;for(const [k,,t] of fieldDefs)next[k]=t==='checkbox'?elements[k].checked:t==='number'?Number(elements[k].value):elements[k].value;next.categories.forEach((c,i)=>{for(const k of ['name','codePart','background','border','text','words'])c[k]=k==='words'?elements[`c${i}-${k}`].value.split('\n').map(s=>s.trim()).filter(Boolean):elements[`c${i}-${k}`].value;});return validate(next);}
function apply(){setup(readSettings());}
function safe(action){try{action();}catch(e){notice(e.message);}}
$('settings').onsubmit=e=>{e.preventDefault();safe(apply);};
const storageKey='bubble-match-scenarios-v1';function saved(){return JSON.parse(localStorage.getItem(storageKey)||'{}');}function refreshSaved(){safe(()=>{const list=$('saved');list.replaceChildren();for(const name of Object.keys(saved()))list.add(new Option(name,name));});}
$('save').onclick=()=>safe(()=>{apply();const all=saved();all[scenario.name]=structuredClone(scenario);localStorage.setItem(storageKey,JSON.stringify(all));refreshSaved();notice('Szenario in diesem Browser gespeichert.');});
$('load').onclick=()=>safe(()=>{const s=saved()[$('saved').value];if(!s)throw Error('Bitte zuerst ein Szenario speichern oder JSON laden.');setup(s);populate();});
$('duplicate').onclick=()=>safe(()=>{apply();scenario.name+=' · Kopie';populate();notice('Kopie angelegt. Vergib einen neuen Namen und speichere sie.');});
$('export').onclick=()=>safe(()=>{apply();const url=URL.createObjectURL(new Blob([JSON.stringify(scenario,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='bubble-match-szenario.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);notice('JSON-Datei heruntergeladen.');});
$('import').onchange=async e=>{try{const file=e.target.files[0];if(!file)return;if(file.size>100000)throw Error('Datei zu groß.');setup(JSON.parse(await file.text()));populate();notice('Szenario geladen.');}catch(error){notice(error.message);}finally{e.target.value='';}};
function createEmbed(){
  apply();const url=new URL(location.href);url.pathname=url.pathname.replace(/werkstatt\.html$/, 'index.html');url.search='?embed=1';url.hash=encodeURIComponent(JSON.stringify(scenario));
  $('embed').value=`<iframe src="${url.href}" width="100%" height="600" title="Bubble Match" style="border:0" allow="fullscreen"></iframe>`;
  $('copy-embed').disabled=false;$('embed-status').textContent=location.protocol==='https:'?'Dein iFrame-Code ist bereit zum Kopieren.':'Dein iFrame-Code ist bereit. Lokale Adressen sind in Genially noch nicht erreichbar.';
}
$('link').onclick=()=>safe(createEmbed);
$('copy-embed').onclick=async()=>{
  const value=$('embed').value;if(!value)return;
  try{if(!navigator.clipboard?.writeText)throw Error('Zwischenablage nicht verfügbar');await navigator.clipboard.writeText(value);$('embed-status').textContent='iFrame-Code kopiert. Du kannst ihn jetzt in Genially einfügen.';}
  catch{const field=$('embed');field.focus();field.select();let copied=false;try{copied=document.execCommand('copy');}catch{}$('embed-status').textContent=copied?'iFrame-Code kopiert. Du kannst ihn jetzt in Genially einfügen.':'Der Code ist markiert. Kopiere ihn mit ⌘C (Mac) oder Strg+C (Windows).';}
};

function resizeBoard(){
  if(!game)return;
  const board=canvas.parentElement, width=Math.max(1,board.clientWidth-2);
  const availableHeight=editing?Math.min(650,Math.max(360,window.innerHeight*.62)):Math.max(1,board.clientHeight-2);
  const logicalWidth=width<650?600:1000;
  const minimumHeight=scenario.movementArea==='full'?(scenario.layout==='bottom'?Math.max(210,scenario.size+48):300):scenario.layout==='corners'?(scenario.categories.length>2?316:174)+scenario.size+24:scenario.layout==='bottom'?174+scenario.size+24:320;
  const logicalHeight=Math.max(minimumHeight,Math.round(logicalWidth*availableHeight/width));
  if(game.w!==logicalWidth||game.h!==logicalHeight){game.resize(logicalWidth,logicalHeight);selected=null;drag=null;sync();}
  const scale=Math.min(width/logicalWidth,availableHeight/logicalHeight);
  canvas.style.width=`${logicalWidth*scale}px`;canvas.style.height=`${logicalHeight*scale}px`;
  canvas.width=game.w*2;canvas.height=game.h*2;ctx.setTransform(2,0,0,2,0,0);renderCategories();draw();
}
function closeEditor(){safe(()=>{
  apply();editing=false;setView();resizeBoard();applyStartMode();sync();
  const url=new URL(location.href);url.search='?embed=1';url.hash=encodeURIComponent(JSON.stringify(scenario));
  try{history.replaceState(null,'',url.href);}catch{/* Some browsers restrict file history changes; the current view still works. */}
  window.scrollTo(0,0);if(game.phase==='playing'){$('pause').focus();notice('Einstellungen übernommen. Die Runde läuft.');}else{(scenario.startMode==='overlay'?$('play-start'):$('start')).focus();notice('Einstellungen übernommen. Bereit zum Spielen.');}
});}
$('category-count').onchange=()=>safe(()=>{const next=readSettings(),count=Number($('category-count').value);while(next.categories.length<count){const i=next.categories.length;next.categories.push({name:`Kategorie ${i+1}`,codePart:String(i+1),background:'#3e5572',border:'#a1bfdf',text:'#fff1dd',words:[`Beispiel ${i+1}`]});}next.categories=next.categories.slice(0,count);setup(next);populate();notice('Kategorienzahl angepasst. Die übrigen Kategorien bleiben erhalten.');});
$('close-editor').onclick=closeEditor;$('close-editor-bottom').onclick=closeEditor;
window.addEventListener('resize',resizeBoard);
new ResizeObserver(()=>resizeBoard()).observe(canvas.parentElement);

setup(scenario);if(editing){populate();refreshSaved();}requestAnimationFrame(frame);
