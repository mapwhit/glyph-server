#!/usr/bin/env node

import connect from '@pirxpilot/connect';
import { FONT_PATH, PORT } from './lib/env.js';
import router from './lib/map-glyph-server.js';

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
