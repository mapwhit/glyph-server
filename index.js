#!/usr/bin/env node

import process from 'node:process';
import connect from '@pirxpilot/connect';
import Debug from 'debug';
import router from './lib/map-glyph-server.js';

const debug = Debug('map-glyph-server:app');

try {
  process.loadEnvFile('/etc/default/map-glyph-server');
} catch {
  debug('Environment file cannot be loaded.');
}

const PORT = process.env.MAP_GLYPH_SERVER_PORT || 3060;
const FONT_PATH = process.env.MAP_GLYPH_SERVER_FONT_PATH;

if (!FONT_PATH) {
  console.error('Please configure MAP_GLYPH_SERVER_FONT_PATH');
  process.exit(1);
}

export const app = connect();

app.use('/fonts', router(FONT_PATH));

if (import.meta.main) {
  app.listen(PORT);
  console.log('Listening on port', PORT);
}
