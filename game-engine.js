(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.SheepGameEngine=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const PHASE=Object.freeze({
    HANDOFF:'handoff',
    CARD:'card',
    JUDGE:'judge',
    CHOICE:'choice',
    FAILED:'failed',
    WON:'won'
  });

  function normalizeStartingIndex(teamCount,startingIndex=0){
    const index=Number(startingIndex);
    if(!Number.isInteger(index)||index<0||index>=teamCount)throw new Error('Invalid starting team index');
    return index;
  }

  function createMatch(teamNames,targetScore=7,startingIndex=0){
    if(!Array.isArray(teamNames)||teamNames.length<2)throw new Error('At least two teams are required');
    const active=normalizeStartingIndex(teamNames.length,startingIndex);
    return{
      teams:teamNames.map((name,i)=>({name:String(name||`Équipe ${i+1}`),score:0})),
      active,
      turnPoints:0,
      targetScore,
      phase:PHASE.HANDOFF,
      winner:null
    };
  }

  function activeTeam(match){return match.teams[match.active]}
  function projectedScore(match){return activeTeam(match).score+match.turnPoints}

  function assertPhase(match,...allowed){
    if(!allowed.includes(match.phase))throw new Error(`Invalid transition from ${match.phase}`);
  }

  function revealCard(match){
    assertPhase(match,PHASE.HANDOFF,PHASE.CHOICE);
    match.phase=PHASE.CARD;
    return match;
  }

  function openJudge(match){
    assertPhase(match,PHASE.CARD);
    match.phase=PHASE.JUDGE;
    return match;
  }

  function succeedCard(match,value){
    assertPhase(match,PHASE.JUDGE);
    const points=Number(value);
    if(!Number.isFinite(points)||points<=0)throw new Error('Card value must be positive');
    match.turnPoints+=points;

    if(projectedScore(match)>=match.targetScore){
      const team=activeTeam(match);
      team.score+=match.turnPoints;
      match.turnPoints=0;
      match.phase=PHASE.WON;
      match.winner=match.active;
      return{won:true,team};
    }

    match.phase=PHASE.CHOICE;
    return{won:false,team:activeTeam(match)};
  }

  function failCard(match){
    assertPhase(match,PHASE.JUDGE);
    const lost=match.turnPoints;
    match.turnPoints=0;
    match.phase=PHASE.FAILED;
    return{lost};
  }

  function nextTeam(match){
    assertPhase(match,PHASE.FAILED);
    match.active=(match.active+1)%match.teams.length;
    match.phase=PHASE.HANDOFF;
    return match;
  }

  function bank(match){
    assertPhase(match,PHASE.CHOICE);
    const gain=match.turnPoints;
    const team=activeTeam(match);
    team.score+=gain;
    match.turnPoints=0;

    if(team.score>=match.targetScore){
      match.phase=PHASE.WON;
      match.winner=match.active;
      return{won:true,gain,team};
    }

    match.active=(match.active+1)%match.teams.length;
    match.phase=PHASE.HANDOFF;
    return{won:false,gain,team};
  }

  function continueTurn(match){
    assertPhase(match,PHASE.CHOICE);
    match.phase=PHASE.CARD;
    return match;
  }

  function rematch(match,startingIndex=0){
    const active=normalizeStartingIndex(match.teams.length,startingIndex);
    match.teams.forEach(team=>team.score=0);
    match.active=active;
    match.turnPoints=0;
    match.phase=PHASE.HANDOFF;
    match.winner=null;
    return match;
  }

  return{PHASE,createMatch,activeTeam,projectedScore,revealCard,openJudge,succeedCard,failCard,nextTeam,bank,continueTurn,rematch};
});
