import { beforeEach, afterEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { act, createElement } from 'react';
import { setup } from './helpers.mjs';
import { useClipboard } from '../dist/index.js';
let ui, api;
beforeEach(async () => (ui = await setup()));
afterEach(async () => ui.cleanup());
test('copy is bounded and permission failures are exposed without HTML fallback', async () => {
  let copied = '';
  ui.replace('navigator', {
    clipboard: {
      writeText: async (text) => {
        copied = text;
      },
    },
  });
  function App() {
    api = useClipboard({ maxLength: 4, resetAfter: 0 });
    return null;
  }
  await ui.render(createElement(App));
  await act(async () => assert.equal(await api.copy('safe'), true));
  assert.equal(copied, 'safe');
  await act(async () => assert.equal(await api.copy('oversize'), false));
  assert.equal(api.status, 'error');
  ui.replace('navigator', {
    clipboard: {
      writeText: async () => {
        throw new Error('denied');
      },
    },
  });
  await act(async () => api.copy('no'));
  assert.match(api.error.message, /denied/);
});
