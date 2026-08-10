import process from 'node:process';
import Debug from 'debug';

const debug = Debug('map-glyph-server:app');

try {
  process.loadEnvFile('/etc/default/map-glyph-server');
} catch {
  debug('Environment file cannot be loaded.');
}

const { MAP_GLYPH_SERVER_CACHE_MAX_AGE, MAP_GLYPH_SERVER_PORT = 3600, MAP_GLYPH_SERVER_FONT_PATH } = process.env;

export {
  MAP_GLYPH_SERVER_CACHE_MAX_AGE as CACHE_MAX_AGE,
  MAP_GLYPH_SERVER_PORT as PORT,
  MAP_GLYPH_SERVER_FONT_PATH as FONT_PATH
};
