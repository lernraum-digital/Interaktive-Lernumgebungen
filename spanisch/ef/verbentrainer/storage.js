(function () {
  "use strict";
  const KEY = "vamos-verb-fuer-verb-progress-v2";
  const LEGACY_KEY = "conjura-ef-progress-v1";
  const blank = () => ({ version:2, learnerName:"", xp:0, bestStreak:0, badges:[], totals:{answered:0,correct:0,durationMs:0}, verbs:{}, persons:{}, errors:{}, sessions:[], migratedFrom:null, updatedAt:null });
  function normalizeVerb(v={}) { return { attempts:v.attempts||0, correct:v.correct||0, errors:v.errors||0, streak:v.streak||0, repetitions:v.repetitions||v.attempts||0, lastSeen:v.lastSeen||null, nextReview:v.nextReview||null, persons:v.persons||{}, errorTypes:v.errorTypes||{} }; }
  function migrate(raw) {
    const next=Object.assign(blank(),raw,{version:2,migratedFrom:raw.version===1?"conjura-ef-progress-v1":raw.migratedFrom||null});
    next.verbs=Object.fromEntries(Object.entries(raw.verbs||{}).map(([id,v])=>[id,normalizeVerb(v)]));
    return next;
  }
  function load() {
    try {
      const current=localStorage.getItem(KEY);
      if(current) return migrate(JSON.parse(current));
      const legacy=localStorage.getItem(LEGACY_KEY);
      if(legacy){const state=migrate(JSON.parse(legacy));save(state);return state;}
    } catch(_) { /* Mit leerem, lokalem Lernstand fortfahren. */ }
    return blank();
  }
  function save(state){state.updatedAt=new Date().toISOString();localStorage.setItem(KEY,JSON.stringify(state));}
  function clear(){localStorage.removeItem(KEY);localStorage.removeItem(LEGACY_KEY);}
  function reviewDelayDays(streak){return [0,1,2,4,7,14,30][Math.min(streak,6)];}
  function record(state,result){
    state.totals.answered++;state.totals.correct+=result.correct?1:0;state.xp+=result.xp;
    const now=new Date(), verb=state.verbs[result.verbId] ||= normalizeVerb();
    verb.attempts++;verb.repetitions++;verb.correct+=result.correct?1:0;verb.errors+=result.correct?0:1;verb.streak=result.correct?verb.streak+1:0;verb.lastSeen=now.toISOString();
    verb.nextReview=new Date(now.getTime()+reviewDelayDays(verb.streak)*86400000).toISOString();
    const vp=verb.persons[result.person] ||= {attempts:0,errors:0};vp.attempts++;vp.errors+=result.correct?0:1;
    const person=state.persons[result.person] ||= {attempts:0,errors:0};person.attempts++;person.errors+=result.correct?0:1;
    if(!result.correct){state.errors[result.errorCategory]=(state.errors[result.errorCategory]||0)+1;verb.errorTypes[result.errorCategory]=(verb.errorTypes[result.errorCategory]||0)+1;}
    save(state);
  }
  window.TrainerStorage={KEY,LEGACY_KEY,load,save,clear,record,blank,migrate};
})();
