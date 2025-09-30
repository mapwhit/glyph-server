import assert from 'node:assert/strict';
import test from 'node:test';
import findFonts from '../lib/find-fonts.js';

test('find all fonts directories', async function () {
  const fonts = await findFonts(`${import.meta.dirname}/fixtures`);
  assert.deepEqual(fonts, {
    'Metropolis Black': true,
    'Open Sans Bold': true,
    'Open Sans Regular': true
  });
});
