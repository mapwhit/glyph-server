import Router from '@pirxpilot/router';
import entityTag from 'etag';
import fresh from 'fresh';
import findFonts from './find-fonts.js';
import getFontsPbf from './get-fonts-pbf.js';

const CACHE_MAX_AGE = process.env.MAP_GLYPH_SERVER_CACHE_MAX_AGE;

async function find(req, res, next) {
  const fonts = await findFonts(req.fontPath);
  req.fonts = fonts;
  req.fontList = Object.keys(fonts);
  next();
}

function sendFontsList(req, res) {
  const fontList = req.fontList.sort();
  const payload = JSON.stringify(fontList);
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Length', Buffer.byteLength(payload));
  return res.end(payload);
}

async function sendFontsPbf(req, res) {
  const { fontPath } = req;
  const { fontstack, range } = req.params;

  const fontstacks = decodeURI(fontstack).split(',');

  const pbf = await getFontsPbf(fontPath, fontstacks, range, req.fontList);
  if (pbf.length === 0) {
    return res.writeHeader(204).end();
  }
  if (CACHE_MAX_AGE) {
    const etag = entityTag(pbf);
    res.setHeader('Cache-Control', `public, max-age=${CACHE_MAX_AGE}`);
    res.setHeader('ETag', etag);
    if (fresh(req.headers, { etag })) {
      return res.writeHeader(304).end();
    }
  }
  res.setHeader('Content-Type', 'application/x-protobuf');
  res.setHeader('Content-Length', pbf.length);
  res.end(pbf);
}

export default function (fontPath) {
  const router = new Router({
    strict: true,
    caseSensitive: true
  });

  router.use(function (req, res, next) {
    req.fontPath = fontPath;
    next();
  });

  router.get(
    /^\/(?<fontstack>[^/]+)\/(?<range>\d+-\d+)\.pbf$/,
    find,
    sendFontsPbf
  );
  router.get('/.json', find, sendFontsList);
  return router;
}
