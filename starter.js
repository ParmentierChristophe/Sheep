(function(){
  let drawTimer=null;

  function randomFrom(indices){
    return indices[Math.floor(Math.random()*indices.length)];
  }

  function lowestScoreIndices(teams){
    const lowest=Math.min(...teams.map(team=>team.score));
    return teams.map((team,index)=>team.score===lowest?index:-1).filter(index=>index>=0);
  }

  function resetRoundDecks(){
    state.current=null;
    state.next=null;
    state.usedNormal.clear();
    state.recentFamilies=[];
    refillLightningDeck();
  }

  function finishDraw(index){
    const team=state.match.teams[index];
    $('starterLabel').textContent='Le Berger a choisi';
    $('starterTicker').textContent=team.name;
    $('starterTicker').classList.remove('tick');
    $('starterResult').textContent=`${team.name} commence`;
    $('starterResult').classList.remove('hidden');
    $('starterContinue').disabled=false;
  }

  function runDraw(candidates,reason,{animate=true}={}){
    if(drawTimer)clearTimeout(drawTimer);
    show('starter');
    $('starterReason').textContent=reason;
    $('starterResult').classList.add('hidden');
    $('starterContinue').disabled=true;

    const chosen=state.match.active;
    if(!animate||candidates.length===1){
      $('starterLabel').textContent='Équipe prioritaire';
      $('starterTicker').textContent=state.match.teams[chosen].name;
      drawTimer=setTimeout(()=>finishDraw(chosen),350);
      return;
    }

    $('starterLabel').textContent='Le Berger hésite entre…';
    let step=0;
    const totalSteps=16;

    function tick(){
      const index=candidates[step%candidates.length];
      $('starterTicker').textContent=state.match.teams[index].name;
      $('starterTicker').classList.toggle('tick');
      step++;

      if(step>=totalSteps){
        drawTimer=setTimeout(()=>finishDraw(chosen),150);
        return;
      }

      const delay=70+step*7;
      drawTimer=setTimeout(tick,delay);
    }

    tick();
  }

  $('start').onclick=()=>{
    const names=[...$('teams').querySelectorAll('input')].map((input,index)=>input.value.trim()||`Équipe ${index+1}`);
    const candidates=names.map((_,index)=>index);
    const starter=randomFrom(candidates);
    state.match=E.createMatch(names,7,starter);
    resetRoundDecks();
    runDraw(candidates,'Première partie : le Berger tire au sort l’équipe qui ouvre la partie.');
  };

  $('rematch').onclick=()=>{
    const candidates=lowestScoreIndices(state.match.teams);
    const starter=randomFrom(candidates);
    const tied=candidates.length>1;
    E.rematch(state.match,starter);
    resetRoundDecks();
    runDraw(
      candidates,
      tied
        ? 'Revanche : plusieurs équipes sont à égalité au score le plus bas. Le Berger les départage.'
        : 'Revanche : l’équipe la moins bien classée à la partie précédente commence.',
      {animate:tied}
    );
  };

  $('starterContinue').onclick=()=>{
    if(drawTimer)clearTimeout(drawTimer);
    $('starter').classList.add('hidden');
    show('game');
    prepareHandoff();
  };

  $('starterBack').onclick=()=>{
    if(drawTimer)clearTimeout(drawTimer);
    $('starter').classList.add('hidden');
    show('setup');
  };

  window.SheepStarterRules={lowestScoreIndices};
})();
