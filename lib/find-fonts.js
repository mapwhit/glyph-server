import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import Debug from 'debug';

const debug = Debug('map-glyph-server');

const memo = Object.create(null);

export default function findFonts(fontPath) {
  let p = memo[fontPath];
  if (!p) {
    memo[fontPath] = p = findFontsImplementation(fontPath);
  }
  return p;
}

async function findFontsImplementation(fontPath) {
  debug('Looking for fonts in:', fontPath);
  const dirs = await readdir(fontPath, { withFileTypes: true });
  const fonts = {};
  await Promise.all(dirs.filter(d => d.isDirectory() || d.isSymbolicLink()).map(checkDir));
  return fonts;

  async function checkDir({ name, parentPath }) {
    const filename = join(parentPath, name, '0-255.pbf');
    const st = await stat(filename).catch(() => null);
    if (st?.isFile()) {
      debug('Found font', name);
      fonts[name] = true;
    }
  }
}
