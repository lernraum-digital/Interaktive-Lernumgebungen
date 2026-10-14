export function validate(raw) {
  const s = structuredClone(raw);
  if(s.transparent===undefined)s.transparent=false;
  if(s.showProgress===undefined)s.showProgress=true;
  if(s.hudTransparent===undefined)s.hudTransparent=false;
  if(s.hudBackground===undefined)s.hudBackground='#142d2b';
  if(s.hudText===undefined)s.hudText='#f6edda';
  if(typeof s.showProgress!=='boolean'||typeof s.hudTransparent!=='boolean')throw Error('Ungültige Einstellung für die Spielanzeigen.');
  if(!/^#[0-9a-f]{6}$/i.test(s.hudBackground)||!/^#[0-9a-f]{6}$/i.test(s.hudText))throw Error('Bitte gültige Farben für die Spielanzeigen wählen.');
  if(typeof s.transparent!=='boolean')throw Error('Ungültige Einstellung: transparenter Hintergrund.');
  if (s.version !== 1 || !Array.isArray(s.categories) || s.categories.length < 2 || s.categories.length > 4) throw Error('Bitte zwei bis vier Kategorien und Szenario-Version 1 verwenden.');
  if(s.codeMode===undefined)s.codeMode='final';
  if(!['final','categories','none'].includes(s.codeMode))throw Error('Bitte einen gültigen Code-Modus wählen.');
  if(s.movementArea===undefined)s.movementArea='clear';
  if(!['full','clear'].includes(s.movementArea))throw Error('Bitte eine gültige Bewegungsfläche wählen.');
  if(s.startMode===undefined)s.startMode='button';
  if(s.startLabel===undefined)s.startLabel='Runde starten';
  if(!['button','auto','overlay'].includes(s.startMode))throw Error('Bitte eine gültige Startart wählen.');
  if(typeof s.startLabel!=='string'||!s.startLabel.trim()||s.startLabel.length>80)throw Error('Bitte eine Startbutton-Beschriftung mit höchstens 80 Zeichen eingeben.');
  s.categories.forEach((c,i)=>{if(c.codePart===undefined)c.codePart=String(i+1);if(typeof c.codePart!=='string'||!c.codePart.trim()||Array.from(c.codePart).length>4)throw Error('Je Kategorie bitte ein Codezeichen mit höchstens vier Zeichen eingeben.');});
  const labels={size:'Kugelgröße',fontSize:'Kugelschriftgröße',categoryFontSize:'Kategorienschriftgröße',strokeWidth:'Rahmenstärke',speed:'Geschwindigkeit',lives:'Start-Leben',timer:'Timer'};
  const limits={size:[64,150],fontSize:[12,36],categoryFontSize:[12,30],strokeWidth:[0,8],speed:[0,120],lives:[1,10],timer:[0,3600]};
  for(const [k,[min,max]] of Object.entries(limits)) if(!Number.isFinite(s[k]) || s[k]<min || s[k]>max) throw Error(`${labels[k]} muss zwischen ${min} und ${max} liegen.`);
  if(!['corners','bottom','sides'].includes(s.layout)) throw Error('Unbekannte Anordnung.');
  if(!['Georgia','Arial','Verdana','Trebuchet MS'].includes(s.font)) throw Error('Bitte eine der angebotenen Schriftarten wählen.');
  for(const key of ['name','intro','code','success']) if(typeof s[key]!=='string'||s[key].length>1000) throw Error(`Ungültiger Text: ${key}`);
  for(const key of ['glow','collected']) if(typeof s[key]!=='boolean') throw Error(`Ungültige Einstellung: ${key}`);
  for(const obj of [s,...s.categories]) for(const key of obj===s?['fill','stroke','text','background']:['background','border','text']) if(!/^#[0-9a-f]{6}$/i.test(obj[key])) throw Error('Farben bitte als sechsstellige Hex-Farbe angeben.');
  let n=0;
  s.categories.forEach(c=>{if(typeof c.name!=='string'||!c.name.trim()||c.name.length>80||!Array.isArray(c.words)||!c.words.length) throw Error('Jede Kategorie benötigt einen Namen und Wörter.'); c.words.forEach(w=>{if(typeof w!=='string'||!w.trim()||w.length>100||w.split('|').some(p=>!p.trim()))throw Error('Wörter dürfen nicht leer sein; | nur zwischen Wortteilen setzen.'); n++;});});
  if(n>40)throw Error('Der Prototyp unterstützt bis zu 40 Wörter; es erscheinen höchstens sechs gleichzeitig.');
  return s;
}
export function geometry(w,h,layout,count=4,movementArea='clear') {
  const pad=16,gap=12,ch=126;let targets,arena;
  if(layout==='bottom'){
    const cw=(w-pad*2-gap*(count-1))/count;
    targets=Array.from({length:count},(_,i)=>({x:pad+i*(cw+gap),y:h-ch-pad,w:cw,h:ch}));arena={x:pad,y:pad,w:w-2*pad,h:h-ch-3*pad};
  }else{
    const side=Math.min(210,w*.24);
    if(layout==='sides'){
      const left=Math.ceil(count/2),right=Math.floor(count/2);
      targets=Array.from({length:count},(_,i)=>{const isLeft=i%2===0,n=isLeft?left:right,row=Math.floor(i/2);return {x:isLeft?pad:w-side-pad,y:(row+1)*h/(n+1)-ch/2,w:side,h:ch};});
      arena={x:side+pad*2,y:pad,w:w-2*side-pad*4,h:h-pad*2};
    }else{
      targets=[{x:pad,y:pad,w:side,h:ch},{x:w-side-pad,y:pad,w:side,h:ch},{x:pad,y:h-ch-pad,w:side,h:ch},{x:w-side-pad,y:h-ch-pad,w:side,h:ch}].slice(0,count);
      arena={x:pad,y:ch+pad*2,w:w-pad*2,h:h-(count>2?2*ch+pad*4:ch+pad*3)};
    }
  }if(movementArea==='full')arena={x:8,y:8,w:w-16,h:h-16};return {targets,arena};
}
export class Game {
  constructor(s,w=1000,h=760,random=Math.random){this.s=validate(s);this.random=random;this.w=w;this.h=h;this.reset();}
  reset(){Object.assign(this,geometry(this.w,this.h,this.s.layout,this.s.categories.length,this.s.movementArea));this.phase='ready';this.lives=this.s.lives;this.remaining=this.s.timer;this.count=0;this.time=0;this.bubbles=[];this.collected=this.s.categories.map(()=>[]);this.queue=this.s.categories.flatMap((c,category)=>c.words.map(word=>({word,category})));for(let i=this.queue.length-1;i>0;i--){let j=Math.floor(this.random()*(i+1));[this.queue[i],this.queue[j]]=[this.queue[j],this.queue[i]];}this.total=this.queue.length;this.spawn();}
  resize(w,h){
    const old=this.arena;this.w=w;this.h=h;Object.assign(this,geometry(w,h,this.s.layout,this.s.categories.length,this.s.movementArea));
    const a=this.arena,r=this.s.size/2+4,cols=Math.floor(a.w/(r*2+8)),rows=Math.floor(a.h/(r*2+8)),cap=Math.min(6,cols*rows);
    if(cap<1)throw Error('Spielfeld zu klein für diese Kugelgröße.');
    const positions=[];for(let row=0;row<rows;row++)for(let col=0;col<cols;col++)positions.push({x:a.x+r+8+col*(r*2+8),y:a.y+r+8+row*(r*2+8)});
    if(this.s.movementArea==='full')for(let i=positions.length-1;i>0;i--){const j=Math.floor(this.random()*(i+1));[positions[i],positions[j]]=[positions[j],positions[i]];}
    let placed=0;this.bubbles=this.bubbles.filter(b=>{
      if(b.state==='gliding'){
        b.from={x:a.x+(b.from.x-old.x)*a.w/old.w,y:a.y+(b.from.y-old.y)*a.h/old.h};
        const target=this.targets[b.category],t=Math.min(1,b.elapsed/.8),e=t*t*(3-2*t);
        b.x=b.from.x+(target.x+target.w/2-b.from.x)*e;b.y=b.from.y+(target.y+target.h/2-b.from.y)*e;return true;
      }
      if(placed>=cap){this.queue.push({word:b.word,category:b.category});return false;}
      b.x=positions[placed].x;b.y=positions[placed].y;placed++;return true;
    });this.spawn();
  }
  start(){if(this.phase==='ready')this.phase='playing';}
  spawn(){const r=this.s.size/2+4,a=this.arena,spacing=r*2+8,cols=Math.floor(a.w/spacing),rows=Math.floor(a.h/spacing),cap=Math.min(6,cols*rows);
    if(cap<1)throw Error('Spielfeld zu klein für diese Kugelgröße.');
    const cells=[];for(let row=0;row<rows;row++)for(let col=0;col<cols;col++)cells.push({x:a.x+(a.w-cols*spacing)/2+(col+.5)*spacing,y:a.y+(a.h-rows*spacing)/2+(row+.5)*spacing});
    for(let i=cells.length-1;i>0;i--){const j=Math.floor(this.random()*(i+1));[cells[i],cells[j]]=[cells[j],cells[i]];}
    for(const p of cells){if(!this.queue.length||this.bubbles.length>=cap)break;if(this.bubbles.some(b=>Math.hypot(p.x-b.x,p.y-b.y)<r*2+4))continue;const angle=this.random()*Math.PI*2;this.bubbles.push({...this.queue.pop(),x:p.x,y:p.y,dx:Math.cos(angle),dy:Math.sin(angle),state:'floating',r:r-4});}
  }
  assign(b,target){if(this.phase!=='playing'||b.state!=='floating')return null;
    if(b.category!==target){this.lives--;if(!this.lives)this.finish('lost');return false;}
    b.state='gliding';b.from={x:b.x,y:b.y};b.elapsed=0;return true;
  }
  codeSlots(){return this.s.categories.map((c,i)=>this.collected[i].length===c.words.length?c.codePart:null);}
  solutionCode(){if(this.s.codeMode==='none')return '';return this.s.codeMode==='categories'?this.s.categories.map(c=>c.codePart).join(''):this.s.code;}
  finish(phase){if(this.phase==='playing')this.phase=phase;}
  step(dt,held=null,elapsed=dt){if(this.phase!=='playing')return;this.time+=elapsed;
    if(this.s.timer){this.remaining=Math.max(0,this.remaining-elapsed);if(!this.remaining){this.finish('timeout');return;}}
    const a=this.arena;
    for(const b of this.bubbles){if(b.state==='gliding'){b.elapsed+=dt;let t=Math.min(1,b.elapsed/.8),e=t*t*(3-2*t),target=this.targets[b.category];b.x=b.from.x+(target.x+target.w/2-b.from.x)*e;b.y=b.from.y+(target.y+target.h/2-b.from.y)*e;if(t===1){b.state='done';this.collected[b.category].push(b.word.replaceAll('|',''));this.count++;}continue;}
      if(b===held)continue;b.x+=b.dx*this.s.speed*dt;b.y+=b.dy*this.s.speed*dt;
      if(b.x<a.x+b.r+4){b.x=a.x+b.r+4;b.dx=Math.abs(b.dx);}if(b.x>a.x+a.w-b.r-4){b.x=a.x+a.w-b.r-4;b.dx=-Math.abs(b.dx);}if(b.y<a.y+b.r+4){b.y=a.y+b.r+4;b.dy=Math.abs(b.dy);}if(b.y>a.y+a.h-b.r-4){b.y=a.y+a.h-b.r-4;b.dy=-Math.abs(b.dy);}
    }
    const free=this.bubbles.filter(b=>b.state==='floating');
    for(let i=0;i<free.length;i++)for(let j=i+1;j<free.length;j++){const b=free[i],c=free[j];let dx=c.x-b.x,dy=c.y-b.y,d=Math.hypot(dx,dy),min=this.s.movementArea==='full'?(b.r+c.r)*.82:b.r+c.r+8;if(d<min){let nx=d?dx/d:1,ny=d?dy/d:0,over=(min-d)/2;if(b!==held){b.x-=nx*over;b.y-=ny*over;}if(c!==held){c.x+=nx*over;c.y+=ny*over;}let dot=(c.dx-b.dx)*nx+(c.dy-b.dy)*ny;if(dot<0){b.dx-=(-dot)*nx;b.dy-=(-dot)*ny;c.dx+=(-dot)*nx;c.dy+=(-dot)*ny;}for(const v of [b,c]){let norm=Math.hypot(v.dx,v.dy)||1;v.dx/=norm;v.dy/=norm;v.x=Math.max(a.x+v.r+4,Math.min(a.x+a.w-v.r-4,v.x));v.y=Math.max(a.y+v.r+4,Math.min(a.y+a.h-v.r-4,v.y));}}}
    this.bubbles=this.bubbles.filter(b=>b.state!=='done');this.spawn();if(this.count===this.total)this.finish('won');
  }
}
// Explicit | points are the only breaks inside words. Fit actual measured lines into a safe inner rectangle.
export function fitText(ctx,word,diameter,font,wanted){const limit=diameter*.70,parts=word.split('|');
  for(let size=wanted;size>=10;size-=.5){ctx.font=`${size}px "${font}"`;let lines=[''];for(let i=0;i<parts.length;i++){const p=parts[i];if(ctx.measureText(lines.at(-1).replace(/-$/,'')+p).width<=limit)lines[lines.length-1]=lines.at(-1).replace(/-$/,'')+p;else {if(lines.at(-1))lines[lines.length-1]+='-';else lines.pop();lines.push(p);}}
    if(lines.every(l=>ctx.measureText(l).width<=limit)&&lines.length*size*1.18<=limit)return {lines,size};
  }
  throw Error(`„${word}“ passt nicht lesbar. Bitte sinnvolle |Trennstellen ergänzen oder größere Kugeln wählen.`);
}
