const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const test = require('node:test');
const ts = require('typescript');
const { JSDOM } = require('jsdom');

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
  url: 'https://in-the-loop.local/', pretendToBeVisual: true,
});
for (const key of ['window', 'document', 'navigator', 'HTMLElement', 'Element', 'SVGElement', 'ShadowRoot']) {
  Object.defineProperty(global, key, { configurable: true, value: dom.window[key] });
}
global.getComputedStyle = element => dom.window.getComputedStyle(element);
global.requestAnimationFrame = dom.window.requestAnimationFrame.bind(dom.window);
global.cancelAnimationFrame = dom.window.cancelAnimationFrame.bind(dom.window);
global.IS_REACT_ACT_ENVIRONMENT = true;
window.matchMedia = query => ({ matches: false, media: query, addListener() {}, removeListener() {} });
let locationRequests = 0;
navigator.geolocation = { getCurrentPosition(_, reject) {
  locationRequests++;
  reject({ code: 1, PERMISSION_DENIED: 1 });
} };

for (const extension of ['.ts', '.tsx']) {
  require.extensions[extension] = (module, filename) => {
    const { outputText } = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React, esModuleInterop: true },
      fileName: filename,
    });
    module._compile(outputText, filename);
  };
}
require.extensions['.css'] = module => { module.exports = {}; };

const React = require('react');
const { act } = React;
const { createRoot } = require('react-dom/client');
const { stationIndex } = require('../src/config/index/index.ts');
const listeners = new Set();
const subscribe = listener => { listeners.add(listener); return () => listeners.delete(listener); };
let history = [];
let historyIndex = -1;
let current;
let revision = 0;
const notify = () => listeners.forEach(listener => listener());
const navigate = (to, options = {}) => {
  if (typeof to === 'number') {
    historyIndex += to;
    current = history[historyIndex];
  } else {
    const base = `https://in-the-loop.local${current?.pathname || '/'}`.replace(/\/?$/, '/');
    const url = new URL(to, base);
    current = { pathname: url.pathname, search: url.search, state: options.state || null };
    history = history.slice(0, historyIndex + 1);
    history.push(current);
    historyIndex++;
  }
  notify();
};

const now = new Date();
const fixtures = new Map();
const followData = (run, transitType) => {
  if (!fixtures.has(run)) fixtures.set(run, {
    response: {
      run, transitType, route: transitType === 'train' ? 'Blue' : '3',
      arrivals: [transitType === 'train' ? '30001' : '1103', transitType === 'train' ? '30003' : '1102'].map(stopId => ({
        stopId, stopName: `Upcoming ${stopId}`, time: new Date(now.getTime() + 600000).toISOString(),
      })),
    }, lastUpdated: now,
  });
  return fixtures.get(run);
};

// Mock only routing and remote data; render the real pages, tables, and links.
const originalLoad = Module._load;
Module._load = function(request, parent, isMain) {
  if (request === '@reach/router') return {
    useLocation: () => React.useSyncExternalStore(subscribe, () => current, () => current),
  };
  if (request === 'gatsby') return {
    navigate,
    Link: React.forwardRef(({ to, state, onClick, children, ...props }, ref) => React.createElement('a', {
      ...props, ref, href: to,
      onClick: event => {
        onClick?.(event);
        if (!event.defaultPrevented) { event.preventDefault(); navigate(to, { state }); }
      },
    }, children)),
  };
  if (request === 'swr') return { __esModule: true, default: key => {
    React.useSyncExternalStore(subscribe, () => revision, () => revision);
    let data;
    if (key?.run) data = followData(key.run, key.transitType);
    else if (Array.isArray(key)) data = { response: [[{
      transitType: 'train', route: 'Blue', run: '123',
      arrival: { stopName: 'Austin-Blue', time: new Date(now.getTime() + 600000).toISOString() },
    }]], lastUpdated: now };
    return { data, isValidating: false, isLoading: false, mutate() {} };
  } };
  return originalLoad.call(this, request, parent, isMain);
};

const FollowPage = require('../src/pages/follow.tsx').default;
const NearbyPage = require('../src/pages/nearby.tsx').default;
const StationPage = require('../src/templates/station.tsx').default;
const StopPage = require('../src/templates/stationStop.tsx').default;
const { AppProvider } = require('../src/features/layout/AppContext.tsx');
const root = createRoot(document.getElementById('root'));
function App() {
  const location = React.useSyncExternalStore(subscribe, () => current, () => current);
  const parts = location.pathname.split('/').filter(Boolean);
  if (parts[0] === 'follow') return React.createElement(FollowPage);
  if (parts[0] === 'nearby') return React.createElement(NearbyPage);
  if (parts[0] === 'station') return React.createElement(parts[2] ? StopPage : StationPage, {
    pageContext: { stationId: parts[1], stopId: parts[2] },
  });
  return React.createElement('div', null, 'Search');
}
const start = async url => {
  await act(async () => {
    root.render(null);
  });
  history = []; historyIndex = -1;
  await act(async () => {
    navigate(url);
    root.render(React.createElement(AppProvider, null, React.createElement(App)));
  });
};
const click = async element => {
  assert.ok(element, 'Expected an element to click');
  await act(async () => element.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true })));
};
const link = text => [...document.querySelectorAll('a')].find(a =>
  a.textContent.trim() === text && a.closest('tr')?.style.display !== 'none');
const button = text => [...document.querySelectorAll('button')].find(b => b.textContent.trim() === text);
const originStation = Object.keys(stationIndex).find(id => stationIndex[id].stops['30001']);

test('arrivals → follow → transfer → station → arrivals and back preserves the complete route', async t => {
  t.mock.method(console, 'log', () => {});
  t.mock.method(console, 'error', () => {});
  const initial = `/station/${originStation}/30001`;
  await start(initial);
  await click(document.querySelector('.ant-table-row'));
  await click(link('Follow'));
  assert.equal(current.pathname, '/follow');
  assert.equal(current.search, '?run=123');
  assert.ok(button('Back to Stop'));
  assert.equal(document.querySelector('input'), null);

  await click(document.querySelector('.ant-table-row-expand-icon'));
  assert.ok(link('Transfer'), 'Expand icon opens the row exactly once');
  await click(document.querySelector('.ant-table-row-expand-icon'));
  assert.equal(link('Transfer'), undefined);
  await click(document.querySelector('.ant-table-row'));
  await click(link('Transfer'));
  assert.equal(current.pathname, '/nearby');
  assert.equal(current.search, '?stop=30001&run=123');
  assert.match(document.body.textContent, /Transfers near Austin-Blue/);
  assert.equal(locationRequests, 0);
  assert.ok(button('Back to Run #123'));

  await click(document.querySelector(`a[href="/station/${originStation}"]`));
  assert.ok(button('Back to Transfers'));
  await click(document.querySelector('a[href="30001"]'));
  assert.ok(button('Select Stop'));
  await click(button('Select Stop'));
  await click(button('Back to Transfers'));
  assert.equal(current.search, '?stop=30001&run=123');
  await click(button('Back to Run #123'));
  assert.equal(current.search, '?run=123');
  assert.ok(button('Back to Stop'));
  await click(button('Back to Stop'));
  assert.equal(current.pathname, initial);
});

test('bus rows refresh, discard passed stops, and reset expansion for a different run', async t => {
  t.mock.method(console, 'log', () => {});
  t.mock.method(console, 'error', () => {});
  await start('/follow?run=12345');
  await click(document.querySelector('.ant-table-row'));
  assert.ok(link('Transfer').href.includes('stop=1103&run=12345'));
  await act(async () => {
    fixtures.get('12345').response.arrivals = fixtures.get('12345').response.arrivals.map(stop => ({
      ...stop, time: new Date(now.getTime() + 700000).toISOString(),
    }));
    revision++; notify();
  });
  assert.ok(link('Transfer'));
  await act(async () => {
    fixtures.get('12345').response.arrivals = fixtures.get('12345').response.arrivals.slice(1);
    revision++; notify();
  });
  assert.equal(link('Transfer'), undefined);
  await click(document.querySelector('.ant-table-row'));
  await act(async () => navigate('/follow?run=67890'));
  assert.equal(link('Transfer'), undefined);
});

test('direct transfer URLs, missing runs, and invalid stops work without location access', async t => {
  t.mock.method(console, 'log', () => {});
  t.mock.method(console, 'error', () => {});
  await start('/nearby?stop=1103&run=12345');
  assert.match(document.body.textContent, /Transfers near/);
  await click(button('Back to Run #12345'));
  assert.equal(current.pathname, '/follow');
  assert.equal(current.search, '?run=12345');
  await start('/nearby?stop=30001');
  await click(button('Back to Follow'));
  assert.equal(current.pathname, '/follow');
  for (const stop of ['', 'invalid', '999999999']) {
    await start(`/nearby?stop=${stop}&run=007`);
    assert.match(document.body.textContent, /location of this transfer stop is unavailable/);
    assert.ok(button('Back to Run #007'));
  }
  assert.equal(locationRequests, 0);
  await start('/nearby');
  assert.match(document.body.textContent, /Permission to access location was denied/);
  assert.equal(locationRequests, 1);
});

test.after(async () => {
  await act(async () => root.unmount());
  Module._load = originalLoad;
  dom.window.close();
});
