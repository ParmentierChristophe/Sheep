const one=window.SHEEP_ONE;
const two=window.SHEEP_TWO;
const three=window.SHEEP_THREE;
const lightning=window.SHEEP_LIGHTNING;
const E=window.SheepGameEngine;
const $=id=>document.getElementById(id);

const STATS_KEY='sheep-card-stats-v1';
const FEEDBACK_KEY='sheep-card-feedback';
const state={
  match:null,
  current:null,
  next:null,
  usedNormal:new Set(),
  lightningDeck:[],
  lightningIndex:0,
  recentFamilies:[]
};

$('cardCount').textContent=`${one.length+two.length+three.length+lightning.length} thèmes`;

function shuffle(arr){
  const a=[...arr];
  for(let i=a.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}

function show(id){
  ['setup','game','win'].forEach(x=>$(x).classList.add('hidden'));
  $(id).classList.remove('hidden');
}

function hideDecisions(){
  ['judge','choice','failed'].forEach(x=>$(x).classList.add('hidden'));
}

function toast(text){
  const el=document.createElement('div');
  el.className='toast';
  el.textContent=text;
  document.body.appendChild(el);
  setTimeout(()=>el.remove(),1700);
}

function escapeHtml(value){
  return String(value).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}

function addTeam(name){
  const row=document.createElement('div');
  row.className='team-row';
  row.innerHTML='<div class="team-dot">M</div><input placeholder="Nom de l’équipe"><button class="remove-team" aria-label="Supprimer">×</button>';
  row.querySelector('input').value=name||'';
  row.querySelector('.remove-team').onclick=()=>{
    if($('teams').children.length>2)row.remove();
    else toast('Il faut au moins 2 équipes');
  };
  $('teams').appendChild(row);
}

addTeam('Les Bêêêles');
addTeam('Les Frisés');
$('add').onclick=()=>addTeam('Équipe '+($('teams').children.length+1));

function renderScores(){
  if(!state.match)return;
  $('scores').innerHTML=state.match.teams.map((t,i)=>`<div class="score-chip ${i===state.match.active?'active':''}"><div class="score-name">${i===state.match.active?'●':'○'} ${escapeHtml(t.name)}</div><div class="score-value"><strong>${t.score}</strong><div class="score-track"><div class="score-fill" style="width:${Math.min(100,t.score/state.match.targetScore*100)}%"></div></div></div></div>`).join('');
  $('turnLabel').innerHTML=`Au tour de <strong>${escapeHtml(E.activeTeam(state.match).name)}</strong>`;
}

function promptFamily(q){
  if(/^Si je dis/i.test(q))return'association';
  if(/^Qui ici/i.test(q))return'groupe';
  if(/^(Combien|À partir|L’âge|Le prix|La meilleure heure|Le temps maximum|Le nombre idéal|Le pourboire)/i.test(q))return'estimation';
  if(/^(Le meilleur|La meilleure|Le pire|La pire|Le plus grand|La plus grande)/i.test(q))return'opinion';
  if(/métier/i.test(q))return'métier';
  if(/^Un animal|^Une couleur de requin/i.test(q))return'animal';
  if(/^(Un film|Une série|Une chanson|Un personnage|Une célébrité|Le Français|La personnalité)/i.test(q))return'culture';
  if(/^(Un aliment|Un plat|Une boisson|Un truc qu’on (mange|boit)|Le meilleur truc à manger)/i.test(q))return'nourriture';
  if(/^(Une excuse|Une raison)/i.test(q))return'excuse';
  if(/^Quand /i.test(q))return'situation';
  if(/^(Un objet|Un truc qu’on (oublie|perd|cherche|laisse|retrouve|garde|emmène|prend|met|vérifie))/i.test(q))return'objet';
  return null;
}

function rememberFamily(family){
  if(!family)return;
  state.recentFamilies.push(family);
  if(state.recentFamilies.length>3)state.recentFamilies.shift();
}

function randomNormalCard(){
  const total=one.length+two.length+three.length;
  if(state.usedNormal.size>=total)state.usedNormal.clear();

  let fallback=null;
  for(let attempt=0;attempt<80;attempt++){
    const r=Math.random();
    const d=r<.38?1:r<.72?2:3;
    const pool=d===1?one:d===2?two:three;
    const idx=Math.floor(Math.random()*pool.length);
    const key=`${d}:${idx}`;
    if(state.usedNormal.has(key))continue;
    const q=pool[idx];
    const family=promptFamily(q);
    const candidate={d,q,id:key,family};
    fallback=candidate;
    if(family&&state.recentFamilies.at(-1)===family)continue;
    state.usedNormal.add(key);
    rememberFamily(family);
    return candidate;
  }

  if(!fallback)return randomNormalCard();
  state.usedNormal.add(fallback.id);
  rememberFamily(fallback.family);
  return fallback;
}

function refillLightningDeck(){
  state.lightningDeck=shuffle(lightning.map((_,i)=>i));
}

function drawLightningCard(){
  if(state.lightningDeck.length<4)refillLightningDeck();
  const ids=state.lightningDeck.splice(0,4);
  return{d:'L',questions:ids.map(i=>lightning[i]),ids,id:`L:${ids.join('-')}`};
}

function draw(){
  return Math.random()<.30?drawLightningCard():randomNormalCard();
}

function ensureNext(){
  if(!state.next)state.next=draw();
}

function takeNext(){
  ensureNext();
  state.current=state.next;
  state.next=null;
  ensureNext();
}

function currentValue(){
  return state.current.d==='L'?1:Number(state.current.d);
}

function difficultyLabel(d){
  return d==='L'?'ÉCLAIR · 1 POINT':`${d} MOUTON${d>1?'S':''} · ${d} POINT${d>1?'S':''}`;
}

function cardClass(d){return'd'+d}

function loadStats(){
  try{return JSON.parse(localStorage.getItem(STATS_KEY)||'{}')}catch{return{}}
}

function saveStats(stats){
  localStorage.setItem(STATS_KEY,JSON.stringify(stats));
}

function statTargets(card=state.current){
  if(!card)return[];
  if(card.d==='L')return card.ids.map((id,i)=>({id:`L:${id}`,type:'L',text:card.questions[i]}));
  return[{id:card.id,type:String(card.d),text:card.q}];
}

function recordPlay(card=state.current){
  const stats=loadStats();
  for(const target of statTargets(card)){
    const row=stats[target.id]||{id:target.id,type:target.type,text:target.text,plays:0,wins:0,losses:0};
    row.text=target.text;
    row.type=target.type;
    row.plays++;
    stats[target.id]=row;
  }
  saveStats(stats);
}

function recordResult(success,card=state.current){
  const stats=loadStats();
  for(const target of statTargets(card)){
    const row=stats[target.id]||{id:target.id,type:target.type,text:target.text,plays:0,wins:0,losses:0};
    success?row.wins++:row.losses++;
    stats[target.id]=row;
  }
  saveStats(stats);
}

function renderCard(){
  const d=state.current.d;
  state.lightningIndex=0;
  $('handoff').classList.add('hidden');
  $('questionCard').classList.remove('hidden');
  $('questionCard').className=`game-card ${cardClass(d)}`;
  $('badge').textContent=d==='L'?'ÉCLAIR · 1 POINT':`${d} MOUTON${d>1?'S':''} · ${d} POINT${d>1?'S':''}`;
  $('question').classList.toggle('hidden',d==='L');
  $('lightningStage').classList.toggle('hidden',d!=='L');
  $('cardAction').disabled=false;
  hideDecisions();
  renderScores();
  recordPlay();

  if(d==='L'){
    $('instruction').textContent='4 amorces à la suite. Pas de « 1, 2, 3 » entre les réponses.';
    $('cardAction').textContent='Démarrer l’éclair';
    $('cardAction').onclick=startLightning;
    renderLightningPrompt(false);
  }else{
    $('question').textContent=state.current.q;
    $('instruction').textContent='Réfléchissez en silence. Puis « 1, 2, 3 » et répondez ensemble.';
    $('cardAction').textContent='Réponses données';
    $('cardAction').onclick=openJudge;
  }
}

function nextCard(){
  takeNext();
  renderCard();
}

function prepareHandoff(){
  hideDecisions();
  renderScores();
  $('questionCard').classList.add('hidden');
  $('handoff').classList.remove('hidden');
  $('handoffTeam').textContent=E.activeTeam(state.match).name;
  $('handoffScore').textContent=`${E.activeTeam(state.match).score} / ${state.match.targetScore} points`;
  window.scrollTo({top:0,behavior:'smooth'});
}

function revealTurn(){
  E.revealCard(state.match);
  nextCard();
}

$('revealCard').onclick=revealTurn;

function renderLightningPrompt(started=true){
  const i=state.lightningIndex;
  $('lightningCounter').textContent=started?`${i+1} / 4`:'ÉCLAIR';
  $('lightningQuestion').textContent=started?state.current.questions[i]:'Prêts ?';
  $('lightningDots').innerHTML=[0,1,2,3].map(n=>`<span class="lightning-dot ${n<i?'done':n===i&&started?'current':''}"></span>`).join('');
}

function startLightning(){
  state.lightningIndex=0;
  renderLightningPrompt(true);
  $('cardAction').textContent='Suivante';
  $('cardAction').onclick=advanceLightning;
}

function advanceLightning(){
  if(state.lightningIndex<3){
    state.lightningIndex++;
    renderLightningPrompt(true);
    if(state.lightningIndex===3)$('cardAction').textContent='Terminer';
  }else openJudge();
}

function openJudge(){
  E.openJudge(state.match);
  $('cardAction').disabled=true;
  $('judge').classList.remove('hidden');
  $('choice').classList.add('hidden');
  $('failed').classList.add('hidden');
  $('pot').textContent=state.match.turnPoints?`${state.match.turnPoints} point${state.match.turnPoints>1?'s':''} déjà en jeu`:'Premier gain du tour';

  if(state.current.d==='L'){
    $('judgeTitle').textContent='4 sur 4 ?';
    $('judgeCopy').textContent='Une seule différence suffit à rater toute la carte.';
    $('no').textContent='Au moins une erreur';
    $('yes').textContent='4 réponses identiques';
  }else{
    $('judgeTitle').textContent='Même réponse ?';
    $('judgeCopy').textContent='La réponse doit être exactement la même.';
    $('no').textContent='Différentes';
    $('yes').textContent='Identiques';
  }
  $('judge').scrollIntoView({behavior:'smooth',block:'nearest'});
}

function failTurn(){
  recordResult(false);
  const {lost}=E.failCard(state.match);
  $('judge').classList.add('hidden');
  $('choice').classList.add('hidden');
  $('failed').classList.remove('hidden');
  $('loss').textContent=lost?`${lost} point${lost>1?'s':''} gagné${lost>1?'s':''} pendant ce tour ${lost>1?'sont':'est'} perdu${lost>1?'s':''}.`:'Aucun point perdu cette fois.';
  $('failed').scrollIntoView({behavior:'smooth',block:'nearest'});
}

function showWinner(){
  const winner=state.match.teams[state.match.winner];
  $('winner').textContent=`${winner.name} gagne avec ${winner.score} points`;
  show('win');
}

function succeedTurn(){
  recordResult(true);
  const result=E.succeedCard(state.match,currentValue());
  $('judge').classList.add('hidden');
  $('failed').classList.add('hidden');
  if(result.won){showWinner();return}

  $('choice').classList.remove('hidden');
  ensureNext();
  $('choiceTitle').textContent=`${state.match.turnPoints} point${state.match.turnPoints>1?'s':''} en jeu`;
  $('choiceCopy').textContent='Encaissez maintenant, ou tentez la prochaine carte et risquez tout le tour.';
  const n=state.next;
  $('nextPreview').className=`next-card ${cardClass(n.d)}`;
  $('nextPreview').innerHTML=`<div class="next-icon">${n.d==='L'?'4×':n.d}</div><div class="next-copy"><small>Prochaine carte</small><strong>${difficultyLabel(n.d)}</strong></div>`;
  $('choice').scrollIntoView({behavior:'smooth',block:'nearest'});
}

function bankTurn(){
  const result=E.bank(state.match);
  if(result.won){showWinner();return}
  toast(`+${result.gain} point${result.gain>1?'s':''}`);
  prepareHandoff();
}

function continueTurn(){
  E.continueTurn(state.match);
  nextCard();
  window.scrollTo({top:0,behavior:'smooth'});
}

function nextTeam(){
  E.nextTeam(state.match);
  prepareHandoff();
}

$('no').onclick=failTurn;
$('yes').onclick=succeedTurn;
$('bank').onclick=bankTurn;
$('continue').onclick=continueTurn;
$('nextTeam').onclick=nextTeam;

$('start').onclick=()=>{
  const names=[...$('teams').querySelectorAll('input')].map((x,i)=>x.value.trim()||`Équipe ${i+1}`);
  state.match=E.createMatch(names,7);
  state.current=null;
  state.next=null;
  state.usedNormal.clear();
  state.recentFamilies=[];
  refillLightningDeck();
  show('game');
  prepareHandoff();
};

$('rematch').onclick=()=>{
  E.rematch(state.match);
  state.current=null;
  state.next=null;
  state.usedNormal.clear();
  state.recentFamilies=[];
  refillLightningDeck();
  show('game');
  prepareHandoff();
};

$('backSetup').onclick=()=>show('setup');
$('exit').onclick=()=>{if(confirm('Quitter la partie en cours ?'))show('setup')};

function currentFeedbackTarget(){
  if(!state.current)return null;
  if(state.current.d==='L'){
    const i=Math.min(state.lightningIndex,3);
    return{type:'L',text:state.current.questions[i],id:`L:${state.current.ids[i]}`};
  }
  return{type:String(state.current.d),text:state.current.q,id:state.current.id};
}

$('feedback').onclick=()=>{
  const target=currentFeedbackTarget();
  if(!target)return;
  $('feedbackText').textContent=`« ${target.text} »`;
  $('feedbackModal').classList.remove('hidden');
};

$('feedbackClose').onclick=()=>$('feedbackModal').classList.add('hidden');
$('feedbackModal').onclick=e=>{if(e.target===$('feedbackModal'))$('feedbackModal').classList.add('hidden')};

document.querySelectorAll('[data-feedback]').forEach(btn=>btn.onclick=()=>{
  const target=currentFeedbackTarget();
  if(!target)return;
  const entries=JSON.parse(localStorage.getItem(FEEDBACK_KEY)||'[]');
  entries.push({...target,feedback:btn.dataset.feedback,at:new Date().toISOString()});
  localStorage.setItem(FEEDBACK_KEY,JSON.stringify(entries));
  $('feedbackModal').classList.add('hidden');
  toast('Avis enregistré');
});

function aggregateStats(){
  const rows=Object.values(loadStats());
  const groups={1:{plays:0,wins:0,losses:0},2:{plays:0,wins:0,losses:0},3:{plays:0,wins:0,losses:0},L:{plays:0,wins:0,losses:0}};
  for(const row of rows){
    const group=groups[row.type];
    if(!group)continue;
    group.plays+=row.plays||0;
    group.wins+=row.wins||0;
    group.losses+=row.losses||0;
  }
  return{rows,groups};
}

function feedbackSummary(){
  let entries=[];
  try{entries=JSON.parse(localStorage.getItem(FEEDBACK_KEY)||'[]')}catch{}
  return{
    entries,
    good:entries.filter(x=>x.feedback==='good').length,
    difficulty:entries.filter(x=>x.feedback==='difficulty').length,
    bad:entries.filter(x=>x.feedback==='bad').length
  };
}

function rate(group){
  const decided=group.wins+group.losses;
  return decided?Math.round(group.wins/decided*100):null;
}

function renderStats(){
  const {rows,groups}=aggregateStats();
  const feedback=feedbackSummary();
  const labels={1:'1 mouton',2:'2 moutons',3:'3 moutons',L:'Éclair'};
  const targets={1:'repère 60–75 %',2:'repère 35–55 %',3:'repère 15–30 %',L:'4 réponses à la suite'};
  $('statsSummary').innerHTML=Object.entries(groups).map(([key,g])=>{
    const r=rate(g);
    return`<div class="stat-row"><div><strong>${labels[key]}</strong><small>${targets[key]}</small></div><div class="stat-number">${r===null?'—':r+' %'}<small>${g.plays} exposition${g.plays>1?'s':''}</small></div></div>`;
  }).join('');
  $('feedbackSummary').textContent=`Avis : ${feedback.good} bonnes · ${feedback.difficulty} difficultés à revoir · ${feedback.bad} mauvaises`;

  const problemIds=new Set(feedback.entries.filter(x=>x.feedback!=='good').map(x=>x.id));
  const problems=rows.filter(row=>problemIds.has(row.id)).slice(-12);
  $('problemCards').innerHTML=problems.length?problems.map(row=>`<div class="problem-card"><b>${row.type==='L'?'Éclair':row.type+' mouton'+(row.type==='1'?'':'s')}</b><span>${escapeHtml(row.text)}</span></div>`).join(''):'<p class="stats-empty">Aucune carte signalée pour le moment.</p>';
}

$('openStats').onclick=()=>{
  renderStats();
  $('statsModal').classList.remove('hidden');
};
$('statsClose').onclick=()=>$('statsModal').classList.add('hidden');
$('statsModal').onclick=e=>{if(e.target===$('statsModal'))$('statsModal').classList.add('hidden')};

$('exportStats').onclick=()=>{
  const payload={
    exportedAt:new Date().toISOString(),
    stats:loadStats(),
    feedback:feedbackSummary().entries
  };
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;
  a.download=`mouton-family-playtest-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  setTimeout(()=>URL.revokeObjectURL(url),500);
};

$('resetStats').onclick=()=>{
  if(!confirm('Effacer toutes les statistiques et tous les avis de test sur cet appareil ?'))return;
  localStorage.removeItem(STATS_KEY);
  localStorage.removeItem(FEEDBACK_KEY);
  renderStats();
  toast('Données de test effacées');
};
