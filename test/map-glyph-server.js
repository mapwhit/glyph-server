import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import test from 'node:test';
import { makeFetch } from 'supertest-fetch';

import './env.js';
import { app } from '../index.js';

/*
75651 fixtures/Metropolis Black/0-255.pbf
45992 fixtures/Metropolis Black/256-511.pbf
80025 fixtures/Open Sans Bold/0-255.pbf
74696 fixtures/Open Sans Regular/0-255.pbf
*/

const fetch = makeFetch(createServer(app));

test('return /fonts.json', async () => {
  const res = await fetch('/fonts.json').expect('Content-Type', /json/).expect(200);

  const body = await res.json();

  assert.deepEqual(body, ['Metropolis Black', 'Open Sans Bold', 'Open Sans Regular']);
});

test('return a specific font', () =>
  fetch('/fonts/Metropolis%20Black/0-255.pbf')
    .expect('Content-Type', 'application/x-protobuf')
    .expect('Content-Length', '75651')
    .expect('Cache-Control', 'public, max-age=2592000')
    .expect('Etag', '"12783-O+uYHa1nljeTWqe1xiWgzTqMMDk"')
    .expect(200));

test('return a specific font again if no etag', () =>
  fetch('/fonts/Metropolis%20Black/0-255.pbf')
    .expect('Content-Type', 'application/x-protobuf')
    .expect('Content-Length', '75651')
    .expect('Cache-Control', 'public, max-age=2592000')
    .expect('Etag', '"12783-O+uYHa1nljeTWqe1xiWgzTqMMDk"')
    .expect(200));

test('return a specific font again if etag does not match', () =>
  fetch('/fonts/Metropolis%20Black/0-255.pbf', {
    headers: {
      'If-None-Match': '"XXX"', // different etag
      'Cache-Control': ''
    }
  })
    .expect('Content-Type', 'application/x-protobuf')
    .expect('Content-Length', '75651')
    .expect('Cache-Control', 'public, max-age=2592000')
    .expect('Etag', '"12783-O+uYHa1nljeTWqe1xiWgzTqMMDk"')
    .expect(200));

test('return not modified if etag matches', () =>
  fetch('/fonts/Metropolis%20Black/0-255.pbf', {
    headers: {
      'If-None-Match': '"12783-O+uYHa1nljeTWqe1xiWgzTqMMDk"',
      'Cache-Control': ''
    }
  })
    .expect('Cache-Control', 'public, max-age=2592000')
    .expect('Etag', '"12783-O+uYHa1nljeTWqe1xiWgzTqMMDk"')
    .expect(304));

test('return a fallback font for invalid name', () =>
  fetch('/fonts/Open%20Sans%20XXXX/256-511.pbf')
    .expect('Content-Type', 'application/x-protobuf')
    .expect('Content-Length', '45992')
    .expect(200));

test('combines fonts if needed', () =>
  fetch('/fonts/Metropolis%20Black,Open%20Sans%20Bold/0-255.pbf')
    .expect('Content-Type', 'application/x-protobuf')
    .expect(200));
