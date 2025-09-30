import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { combine } from '@furkot/glyph-pbf-composite';
import Debug from 'debug';

const debug = Debug('map-glyph-server');

async function getFontPbf(fontPath, choices, range) {
  debug('Looking for', choices[0], range);
  const checked = Object.create(null);

  for (const name of choices) {
    const pbf = await loadFont(name);
    if (pbf) {
      return pbf;
    }
  }

  async function loadFont(name) {
    const filename = join(fontPath, name, `${range}.pbf`);

    if (checked[filename]) {
      return;
    }
    try {
      const data = await readFile(filename);
      debug('Font found:', name);
      return data;
    } catch {
      debug('Font not found:', name);
      checked[filename] = true;
    }
  }
}

export default async function getFontsPbf(fontPath, fonts, range, fallbacks) {
  let pbfs = await Promise.all(
    fonts.map(font => getFontPbf(fontPath, [font, ...fallbacks], range))
  );
  // only non-empty fonts are OK
  pbfs = pbfs.filter(p => p?.length);
  debug(pbfs);
  if (pbfs.length < fonts.length) {
    throw 404;
  }
  const result = pbfs.length > 1 ? combine(pbfs) : pbfs[0];
  return result;
}
