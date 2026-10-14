import {Game,validate,fitText} from './engine.mjs';
import fs from 'node:fs';import assert from 'node:assert/strict';
const s=JSON.parse(fs.readFileSync(new URL('./scenarios/knotberg.json',import.meta.url)));let seed=72;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/2**32;};
for(const layout of ['corners','bottom','sides'])for(const size of [64,108,150])for(const [w,h] of [[1000,760],[600,1000]]){
 const g=new Game({...s,layout,size,movementArea:'clear'},w,h,random);g.start();let moved=0,maxOverlap=0;for(let i=0;i<18000;i++){const old=g.bubbles.map(b=>[b.x,b.y]);g.step(1/60);g.bubbles.forEach((b,j)=>{assert(Number.isFinite(b.x+b.y));assert(b.x>=g.arena.x+b.r-1&&b.x<=g.arena.x+g.arena.w-b.r+1);assert(b.y>=g.arena.y+b.r-1&&b.y<=g.arena.y+g.arena.h-b.r+1);if(Math.hypot(b.x-old[j][0],b.y-old[j][1])>.001)moved++;});for(let j=0;j<g.bubbles.length;j++)for(let k=j+1;k<g.bubbles.length;k++){const b=g.bubbles[j],c=g.bubbles[k];maxOverlap=Math.max(maxOverlap,b.r+c.r-Math.hypot(b.x-c.x,b.y-c.y));}}assert(moved>17000);assert.equal(g.count,0);assert(maxOverlap<3,`overlap ${maxOverlap}`);
 for(let i=0;i<3;i++)g.assign(g.bubbles[0],(g.bubbles[0].category+1)%4);assert.equal(g.phase,'lost');g.reset();assert.equal(g.lives,3);assert.equal(g.count,0);g.start();let guard=0;while(g.phase==='playing'&&guard++<1000){for(const b of g.bubbles)if(b.state==='floating')g.assign(b,b.category);g.step(.1);}assert.equal(g.phase,'won');assert.equal(g.count,12);g.reset();assert.equal(g.collected.flat().length,0);
 console.log(`PASS ${layout}, ${size}px, ${w}×${h}: 5 simulated minutes, boundaries, separation, loss, restart, win`);
}
const timer=new Game({...s,timer:1});timer.start();timer.step(1);assert.equal(timer.phase,'timeout');timer.reset();assert.equal(timer.remaining,1);assert.equal(timer.phase,'ready');assert.throws(()=>validate({...s,categories:[]}));
console.log('PASS timer + reset + invalid scenario');
// Resizing a live round must preserve progress and move every unfinished word into a reachable area.
for(const layout of ['corners','bottom','sides'])for(const size of [64,108,150]){
  const g=new Game({...s,layout,size,timer:600},1000,760,random);g.start();const b=g.bubbles[0];g.assign(b,b.category);g.step(.2);
  const lives=g.lives,remaining=g.remaining;
  const height=layout==='corners'?316+size+24:layout==='bottom'?174+size+24:320;
  g.resize(600,height);assert.equal(g.phase,'playing');assert.equal(g.lives,lives);assert.equal(g.remaining,remaining);
  assert.equal(g.count+g.bubbles.length+g.queue.length,g.total);
  const free=g.bubbles.filter(b=>b.state==='floating');for(let i=0;i<free.length;i++)for(let j=i+1;j<free.length;j++)assert(Math.hypot(free[i].x-free[j].x,free[i].y-free[j].y)>=free[i].r+free[j].r);
  g.step(.7);assert.equal(g.count,1);for(let frame=0;frame<1800;frame++){g.step(1/60);for(const word of g.bubbles.filter(b=>b.state==='floating')){assert(word.x>=g.arena.x+word.r-1&&word.x<=g.arena.x+g.arena.w-word.r+1);assert(word.y>=g.arena.y+word.r-1&&word.y<=g.arena.y+g.arena.h-word.r+1);}}g.resize(1000,760);assert.equal(g.count,1);
  let guard=0;while(g.phase==='playing'&&guard++<1000){for(const bubble of g.bubbles)if(bubble.state==='floating')g.assign(bubble,bubble.category);g.step(.1);}assert.equal(g.phase,'won');assert.equal(g.count,12);
}
assert.equal(validate({...s,transparent:undefined}).transparent,false);assert.throws(()=>validate({...s,transparent:'yes'}));
console.log('PASS responsive reflow during glide: all layouts and sizes, no lost words or progress; transparency compatibility');
for(const count of [2,3,4])for(const layout of ['corners','bottom','sides']){
  const round={...s,layout,categories:s.categories.slice(0,count).map((c,i)=>({...c,words:[c.words[0]],codePart:String(7-i)})),codeMode:'categories'};
  const g=new Game(round,1000,760,random);assert.equal(g.targets.length,count);assert.deepEqual(g.codeSlots(),Array(count).fill(null));g.start();
  for(const category of Array.from({length:count},(_,i)=>count-1-i)){
    const b=g.bubbles.find(b=>b.category===category);assert(b);g.assign(b,category);assert.equal(g.codeSlots()[category],null);assert.equal(g.assign(b,category),null);g.step(.8);assert.equal(g.codeSlots()[category],String(7-category));
  }
  assert.equal(g.phase,'won');assert.equal(g.solutionCode(),round.categories.map(c=>c.codePart).join(''));g.reset();assert.deepEqual(g.codeSlots(),Array(count).fill(null));
}
const legacy=structuredClone(s);delete legacy.codeMode;legacy.categories.forEach(c=>delete c.codePart);assert.equal(new Game(legacy).solutionCode(),legacy.code);assert.equal(validate(legacy).codeMode,'final');
console.log('PASS 2–4 categories × three layouts: code slots reveal only after complete glide, fixed order, duplicate guard, reset and legacy scenarios');
const oldStart=structuredClone(s);delete oldStart.startMode;delete oldStart.startLabel;assert.equal(validate(oldStart).startMode,'button');assert.equal(validate(oldStart).startLabel,'Runde starten');
for(const startMode of ['button','auto','overlay'])assert.equal(validate({...s,startMode}).startMode,startMode);
assert.throws(()=>validate({...s,startMode:'bad'}));assert.throws(()=>validate({...s,startLabel:''}));
const plainExercise=new Game({...s,codeMode:'none',categories:s.categories.slice(0,2).map(c=>({...c,words:[c.words[0]]}))});assert.equal(plainExercise.solutionCode(),'');plainExercise.start();
const glide=plainExercise.bubbles[0],from={x:glide.x,y:glide.y},target=plainExercise.targets[glide.category];plainExercise.assign(glide,glide.category);assert.equal(glide.x,from.x);plainExercise.step(.4);assert.equal(plainExercise.count,0);assert(Math.abs(glide.x-(from.x+target.x+target.w/2)/2)<.001);assert(Math.abs(glide.y-(from.y+target.y+target.h/2)/2)<.001);plainExercise.step(.4);assert.equal(plainExercise.count,1);assert.equal(plainExercise.solutionCode(),'');
console.log('PASS start settings and compatibility, no-code mode, visible 0.8-second eased glide before collection');
const oldHud=structuredClone(s);for(const key of ['showProgress','hudTransparent','hudBackground','hudText'])delete oldHud[key];assert.equal(validate(oldHud).showProgress,true);assert.equal(validate(oldHud).hudTransparent,false);assert.equal(validate(oldHud).hudBackground,'#142d2b');
assert.equal(validate({...s,showProgress:false,hudTransparent:true}).showProgress,false);assert.throws(()=>validate({...s,hudTransparent:'true'}));assert.throws(()=>validate({...s,hudBackground:'blue'}));
console.log('PASS display settings: old scenario compatibility, optional counter, transparent HUD and invalid colour rejection');
for(const layout of ['corners','bottom','sides'])for(const size of [64,108,150])for(const [w,h] of [[1000,760],[600,layout==='bottom'?Math.max(210,size+48):300]]){
  const g=new Game({...s,layout,size,movementArea:'full',speed:72},w,h,random);g.start();const stalled=new Map();let maxStall=0,maxOverlap=0,categoryContacts=0;
  for(let frame=0;frame<18000;frame++){
    const old=new Map(g.bubbles.map(b=>[b,{x:b.x,y:b.y}]));g.step(1/60);
    for(const b of g.bubbles){assert(b.x>=g.arena.x+b.r-1&&b.x<=g.arena.x+g.arena.w-b.r+1);assert(b.y>=g.arena.y+b.r-1&&b.y<=g.arena.y+g.arena.h-b.r+1);const p=old.get(b);const stuck=p&&Math.hypot(b.x-p.x,b.y-p.y)<.001?(stalled.get(b)||0)+1:0;stalled.set(b,stuck);maxStall=Math.max(maxStall,stuck);if(g.targets.some(t=>b.x>=t.x&&b.x<=t.x+t.w&&b.y>=t.y&&b.y<=t.y+t.h))categoryContacts++;}
    for(let i=0;i<g.bubbles.length;i++)for(let j=i+1;j<g.bubbles.length;j++){const a=g.bubbles[i],b=g.bubbles[j];maxOverlap=Math.max(maxOverlap,(a.r+b.r-Math.hypot(a.x-b.x,a.y-b.y))/(a.r+b.r));}
  }
  assert.equal(g.count,0);assert.equal(g.lives,3);assert(categoryContacts>0);assert(maxStall<60,`stalled ${maxStall} frames`);assert(maxOverlap<.4,`deep overlap ${maxOverlap}`);
  console.log(`PASS full field ${layout}, ${size}px, ${w}×${h}: 5 simulated minutes, category flyovers, max stall ${maxStall}, max overlap ${(maxOverlap*100).toFixed(0)}%`);
}
const oldMovement=structuredClone(s);delete oldMovement.movementArea;assert.equal(validate(oldMovement).movementArea,'clear');assert.throws(()=>validate({...s,movementArea:'bad'}));

const clockColours=validate({...s,timerColor:'#2255cc',timerWarningColor:'#ccee11',timerUrgentColor:'#cc1155'});assert.equal(clockColours.timerColor,'#2255cc');assert.equal(validate(JSON.parse(JSON.stringify(clockColours))).timerUrgentColor,'#cc1155');assert.equal(validate({...s,timerColor:undefined,hudText:'#123456'}).timerColor,'#123456');for(const key of ['timerColor','timerWarningColor','timerUrgentColor'])assert.throws(()=>validate({...s,[key]:'invalid'}));console.log('PASS timer ring colours: custom colours, snapshot roundtrip, legacy fallback and invalid input');
