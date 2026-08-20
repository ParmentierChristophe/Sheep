import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const E=require('./game-engine.js');

function match(){return E.createMatch(['A','B'])}

{
  const m=match();
  assert.equal(m.phase,E.PHASE.HANDOFF);
  E.revealCard(m);E.openJudge(m);
  const result=E.succeedCard(m,1);
  assert.equal(result.won,false);
  assert.equal(m.turnPoints,1);
  assert.equal(m.phase,E.PHASE.CHOICE);
}

{
  const m=match();
  m.teams[0].score=6;
  E.revealCard(m);E.openJudge(m);
  const result=E.succeedCard(m,1);
  assert.equal(result.won,true);
  assert.equal(m.teams[0].score,7);
  assert.equal(m.turnPoints,0);
  assert.equal(m.phase,E.PHASE.WON);
}

{
  const m=match();
  m.teams[0].score=5;
  E.revealCard(m);E.openJudge(m);E.succeedCard(m,1);
  E.continueTurn(m);E.openJudge(m);
  const result=E.succeedCard(m,2);
  assert.equal(result.won,true);
  assert.equal(m.teams[0].score,8);
  assert.equal(m.phase,E.PHASE.WON);
}

{
  const m=match();
  E.revealCard(m);E.openJudge(m);E.succeedCard(m,3);
  E.continueTurn(m);E.openJudge(m);
  const {lost}=E.failCard(m);
  assert.equal(lost,3);
  assert.equal(m.turnPoints,0);
  assert.equal(m.teams[0].score,0);
  assert.equal(m.phase,E.PHASE.FAILED);
  E.nextTeam(m);
  assert.equal(m.active,1);
  assert.equal(m.phase,E.PHASE.HANDOFF);
}

{
  const m=match();
  E.revealCard(m);E.openJudge(m);E.succeedCard(m,2);
  const result=E.bank(m);
  assert.equal(result.gain,2);
  assert.equal(m.teams[0].score,2);
  assert.equal(m.active,1);
  assert.equal(m.phase,E.PHASE.HANDOFF);
}

{
  const m=match();
  E.revealCard(m);E.openJudge(m);E.succeedCard(m,1);
  E.bank(m);
  E.revealCard(m);E.openJudge(m);E.succeedCard(m,2);
  E.bank(m);
  E.rematch(m);
  assert.deepEqual(m.teams.map(t=>t.score),[0,0]);
  assert.equal(m.active,0);
  assert.equal(m.phase,E.PHASE.HANDOFF);
}

{
  const m=match();
  assert.throws(()=>E.openJudge(m),/Invalid transition/);
}

console.log('✅ Game engine tests passed');
