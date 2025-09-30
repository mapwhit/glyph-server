[![NPM version][npm-image]][npm-url]
[![Build Status][build-image]][build-url]
[![Dependency Status][deps-image]][deps-url]

# map-glyph-server

Server for glyph/font files compatible with [mapbox-gl-js], [maplibre-gl-js], [mapwhit-gl-js]

## Install

```sh
$ npm install --global @mapwhit/glyph-server
```

## Environment

The following environment variables are used by `@mapwhit/glyph-server`

- `MAP_GLYPH_SERVER_FONT_PATH` - needs to specify the location of the fonts files
- `MAP_GLYPH_SERVER_PORT` - local port to which `@mapwhit/glyph-server` binds to default: *3060*
- `MAP_GLYPH_SERVER_CACHE_MAX_AGE` - if specified used as a `max-age` value of the
  [`Cache-Control` header][cache-control] when serving font/pbf files
  (maximum amount of seconds a resource is considered fresh)

`/etc/default/map-glyph-server` can be used to set environment variables

## Usage

Prior to starting the server glyphs should be located in `MAP_GLYPH_SERVER_FONT_PATH` directory. This can
be achieved using [openmaptiles/fonts] or a similar utility.

In order to use the fonts edit [Style JSON][glyphs-doc] and change the endpoint for glyphs:

    "glyphs": "https://fonts.example.com/fonts/{fontstack}/{range}.pbf",

## License

MIT © [Damian Krzeminski](https://furkot.com)

[npm-image]: https://img.shields.io/npm/v/@mapwhit/glyph-server
[npm-url]: https://npmjs.org/package/@mapwhit/glyph-server

[build-url]: https://github.com/mapwhit/glyph-server/actions/workflows/check.yaml
[build-image]: https://img.shields.io/github/actions/workflow/status/mapwhit/glyph-server/check.yaml?branch=main

[deps-image]: https://img.shields.io/librariesio/release/npm/@mapwhit/glyph-server
[deps-url]: https://libraries.io/npm/@mapwhit%2Fglyph-server


[openmaptiles/fonts]: https://github.com/openmaptiles/fonts
[cache-control]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control
[glyphs-doc]: https://docs.mapbox.com/mapbox-gl-js/style-spec/glyphs/

[mapbox-gl-js]: https://github.com/mapbox/mapbox-gl-js
[maplibre-gl-js]: https://github.com/maplibre/maplibre-gl-js
[mapwhit-gl-js]: https://github.com/mapwhit/mapwhit-gl-js
