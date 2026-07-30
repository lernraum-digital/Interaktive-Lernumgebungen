(function () {
  "use strict";
  const day=86400000;
  const shuffle=a=>[...a].sort(()=>Math.random()-.5);
  function mastery(stat){if(!stat?.attempts)return 0;const accuracy=stat.correct/stat.attempts;const practice=Math.min(stat.attempts,8)/8;const stability=Math.min(stat.streak||0,4)/4;return Math.round((accuracy*.55+practice*.25+stability*.20)*100);}
  function dueScore(verb,state,config,now=Date.now()){
    const s=state.verbs[verb.id];if(!s)return 2.4;
    const accuracy=s.attempts?s.correct/s.attempts:0;
    const overdue=s.nextReview?Math.max(0,(now-new Date(s.nextReview).getTime())/day):1;
    const unseenDays=s.lastSeen?Math.max(0,(now-new Date(s.lastSeen).getTime())/day):config.repetition.overdueAfterDays;
    const personErrors=Math.max(0,...Object.values(s.persons||{}).map(x=>x.errors||0));
    return .6+(1-accuracy)*2.2+Math.min(overdue,14)*.12+Math.min(unseenDays,14)*.08+Math.min(personErrors,4)*.18;
  }
  function weightedPick(pool,state,config,counts,lastId,adaptive){
    let allowed=pool.filter(v=>(counts[v.id]||0)<config.repetition.maximumSameVerbPerRound);
    if(config.repetition.avoidImmediateRepetition&&allowed.length>1)allowed=allowed.filter(v=>v.id!==lastId);
    if(!allowed.length)allowed=pool;
    const weighted=allowed.map(v=>({v,w:adaptive?dueScore(v,state,config):1+(state.verbs[v.id]?0:.8)}));
    let n=Math.random()*weighted.reduce((sum,x)=>sum+x.w,0);for(const x of weighted){n-=x.w;if(n<=0)return x.v;}return weighted[0].v;
  }
  function allocate(length,hasOlder,distribution,minOlder){
    if(!hasOlder)return {newest:length,older:0,adaptive:0};
    const older=Math.min(length-1,Math.max(minOlder,Math.round(length*distribution.olderStages)));
    const adaptive=Math.min(length-older-1,Math.round(length*distribution.adaptiveReview));
    return {newest:length-older-adaptive,older,adaptive};
  }
  function buildRound({verbs,state,config,length}){
    const released=verbs.filter(v=>v.active&&v.stage<=config.currentStage).sort((a,b)=>a.sequence-b.sequence);
    const newest=released.filter(v=>v.stage===config.currentStage),older=released.filter(v=>v.stage<config.currentStage);
    if(!released.length)return [];
    const quota=allocate(length,older.length>0&&newest.length>0,config.distribution,config.repetition.minimumOlderItemsPerRound);
    const labels=shuffle([...Array(quota.newest).fill("new"),...Array(quota.older).fill("old"),...Array(quota.adaptive).fill("review")]);
    const counts={},plan=[];
    for(const category of labels){const pool=category==="new"?newest:category==="old"?older:released;const verb=weightedPick(pool.length?pool:released,state,config,counts,plan.at(-1)?.verb.id,category==="review");counts[verb.id]=(counts[verb.id]||0)+1;plan.push({verb,category});}
    return plan;
  }
  function pickPerson(verb,state){const stats=state.verbs[verb.id]?.persons||{};const weights=verb.persons.map(p=>1+(stats[p]?.errors||0)*.6);let n=Math.random()*weights.reduce((a,b)=>a+b,0);for(let i=0;i<weights.length;i++){n-=weights[i];if(n<=0)return i;}return 0;}
  window.TrainingPlanner={buildRound,mastery,dueScore,pickPerson,allocate};
})();
