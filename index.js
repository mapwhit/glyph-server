#!/usr/bin/env node

const process = require('node:process');
const connect = require('@pirxpilot/connect');
const router = require('./lib/map-glyph-server');

try {
  process.loadEnvFile('/etc/default/map-glyph-server');
} catch {
  console.error('Environment file cannot be loaded.');
}

const PORT = process.env.MAP_GLYPH_SERVER_PORT || 3060;
const FONT_PATH = process.env.MAP_GLYPH_SERVER_FONT_PATH;

if (!FONT_PATH) {
  console.error('Please configure MAP_GLYPH_SERVER_FONT_PATH');
  process.exit(1);
}

const app = connect();

app.use('/fonts', router(FONT_PATH));

module.exports = app;

if (!module.parent) {
  app.listen(PORT);
  console.log('Listening on port', PORT);
}
