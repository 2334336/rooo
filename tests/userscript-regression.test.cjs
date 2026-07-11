const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const scriptPath = path.join(__dirname, '..', 'userscripts', 'polymarket-world-cup-zh.user.js');
const script = fs.readFileSync(scriptPath, 'utf8');

test('keeps combo navigation and combo market surfaces visible', () => {
  assert.match(script, /\/combos,\/zh\/combos/);
  assert.match(script, /\(\?:combos\|sports/);
  assert.match(script, /a\[href\*="\/combos"\]/);
  assert.doesNotMatch(script, /Goal rush stacks\|Favourites acca\|Favourites handicap/);
  assert.doesNotMatch(script, /querySelector\('button\[aria-label\^="Build "\]'\)/);
  assert.doesNotMatch(script, /\^Build \/i\.test/);
  assert.doesNotMatch(script, /\d\+\\s\*pick combo\/i\.test/);
});

test('uses a bounded DOM translation queue instead of repeated full body scans', () => {
  assert.match(script, /MAX_DOM_NODES_PER_FRAME/);
  assert.match(script, /MAX_DOM_FRAME_MS/);
  assert.match(script, /Date\.now\(\)-g>800/);
  assert.doesNotMatch(script, /document\.body&&E\(document\.body\)/);
  assert.doesNotMatch(script, /else document\.body&&E\(document\.body\)/);
});

test('bumps the userscript cache key for Tampermonkey updates', () => {
  assert.match(script, /@version\s+1\.3\.1/);
  assert.match(script, /polymarket-sports-zh-data\.js\?v=1\.3\.1/);
});
