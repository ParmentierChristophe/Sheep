import fs from 'node:fs';
import vm from 'node:vm';

const files = {
  one: 'cards-one.js',
  two: 'cards-two.js',
  three: 'cards-three.js',
  lightning: 'cards-lightning.js',
};

const sandbox = { window: {} };
for (const file of Object.values(files)) {
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), sandbox, { filename: file });
}

const pools = {
  one: sandbox.window.SHEEP_ONE,
  two: sandbox.window.SHEEP_TWO,
  three: sandbox.window.SHEEP_THREE,
  lightning: sandbox.window.SHEEP_LIGHTNING,
};

const failures = [];
const fail = message => failures.push(message);

for (const [name, cards] of Object.entries(pools)) {
  if (!Array.isArray(cards)) {
    fail(`${name}: la banque n'est pas un tableau`);
    continue;
  }

  const seen = new Set();
  for (const card of cards) {
    if (typeof card !== 'string' || !card.trim()) {
      fail(`${name}: carte vide ou non textuelle`);
      continue;
    }
    if (card !== card.trim()) fail(`${name}: espaces parasites: ${JSON.stringify(card)}`);
    if (seen.has(card)) fail(`${name}: doublon exact: ${card}`);
    seen.add(card);
    if (card.length > 140) fail(`${name}: carte trop longue (${card.length}): ${card}`);
  }
}

const minimums = { one: 150, two: 170, three: 180, lightning: 250 };
for (const [name, minimum] of Object.entries(minimums)) {
  if (pools[name]?.length < minimum) fail(`${name}: seulement ${pools[name]?.length ?? 0} cartes, minimum ${minimum}`);
}

// 1 mouton doit tester la synchronisation, pas une réponse scolaire unique.
const deterministicOnePatterns = [
  /^Le contraire de\b/i,
  /^La capitale de\b/i,
  /^Le sport où\b/i,
  /^Le sport de\b/i,
  /^Le pays de la\b/i,
  /^Le pays des\b/i,
  /^Une? (?:semaine|année|heure|minute|triangle|carré|octogone|vélo|voiture|dé) (?:a|compte)\b/i,
  /^Une? (?:vache|poule|abeille|mouton) (?:donne|pond|fait)\b/i,
  /^Pour .+, on utilise\b/i,
  /^La planète\b/i,
  /^Le symbole\b/i,
];

for (const card of pools.one ?? []) {
  for (const pattern of deterministicOnePatterns) {
    if (pattern.test(card)) fail(`one: carte trop déterministe / quiz: ${card}`);
  }
}

// Une carte Éclair doit être une amorce à compléter, jamais une question ouverte ou un quiz.
for (const card of pools.lightning ?? []) {
  const blanks = (card.match(/___/g) ?? []).length;
  if (blanks !== 1) fail(`lightning: exactement un blanc requis: ${card}`);
  if (card.includes('?')) fail(`lightning: question interdite: ${card}`);
  if (/[:：]\s*___\s*$/.test(card)) fail(`lightning: format quiz « question : réponse » interdit: ${card}`);
  if (/^Si je dis\b/i.test(card)) fail(`lightning: association ouverte interdite: ${card}`);
  if (/^Quand on\b/i.test(card)) fail(`lightning: situation ouverte interdite: ${card}`);
}

// Une même carte normale ne doit pas changer artificiellement de difficulté.
const normalPools = ['one', 'two', 'three'];
const owners = new Map();
for (const name of normalPools) {
  for (const card of pools[name] ?? []) {
    if (owners.has(card)) fail(`normal: carte présente en ${owners.get(card)} et ${name}: ${card}`);
    else owners.set(card, name);
  }
}

if (failures.length) {
  console.error(`\n❌ Validation échouée (${failures.length} problème(s)):\n`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('✅ Banques de cartes valides');
for (const [name, cards] of Object.entries(pools)) console.log(`- ${name}: ${cards.length}`);
