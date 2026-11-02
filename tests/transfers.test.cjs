const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');
const ts = require('typescript');

// Exercise the actual pure TypeScript modules with the existing compiler.
require.extensions['.ts'] = (module, filename) => {
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
    fileName: filename,
  });
  module._compile(outputText, filename);
};

const { getDistance, orderByDistance } = require('geolib');
const { stationIndex, stopIndex, trackIndex } = require('../src/config/index/index.ts');
const { getNearbyStations, getTransferOrigin, getTransferRequest, pruneNearbyStations } = require('../src/features/navigate/nearbyLib.ts');
const { normalizePath, nearbyBackPath } = require('../src/components/navigation.ts');
const { getFollowRows } = require('../src/features/follow/followRows.ts');

test('every indexed route stop has an exact, finite stop location', () => {
  for (const track of Object.values(trackIndex)) {
    const stop = getTransferOrigin(track.stop);
    assert.ok(stop, track.stop);
    assert.equal(stop.name, track.stopName);
    assert.ok(Number.isFinite(stop.latitude) && Number.isFinite(stop.longitude));
  }
});

test('transfer queries distinguish ordinary Nearby from invalid transfer origins', () => {
  assert.equal(getTransferRequest(''), null);
  assert.equal(getTransferRequest('?run=123'), null);
  assert.deepEqual(getTransferRequest('?stop=30001&run=007'), { stopId: '30001', run: '007' });
  assert.deepEqual(getTransferRequest('?stop=30001'), { stopId: '30001', run: '' });
  assert.equal(getTransferRequest('?stop=&run=abc').run, '');
  for (const id of [null, '', 'nope', '30001x', '-1', '999999999']) {
    assert.equal(getTransferOrigin(id), undefined);
  }
  assert.equal(getTransferOrigin('30001'), stopIndex['30001']);
});

test('ordinary Nearby retains its shared distance/pruning behavior', () => {
  const origin = stopIndex['30001'];
  const coords = Object.entries(stationIndex).map(([id, station]) => ({ id, ...station }));
  const expected = pruneNearbyStations(orderByDistance(origin, coords), 25);
  assert.deepEqual(getNearbyStations(origin), expected);
  assert.deepEqual(getNearbyStations(origin, undefined, 0), []);
});

for (const transit of ['train', 'bus']) {
  test(`${transit} transfers include the arrival station, both modes, and sorted nearby results`, () => {
    const track = Object.values(trackIndex).find(t => t.type === transit && t.stopName.includes('Clark'));
    assert.ok(track);
    const origin = stopIndex[track.stop];
    const results = getNearbyStations(origin, track.stop);
    assert.equal(results.length, 25);
    assert.equal(new Set(results).size, results.length);
    assert.ok(stationIndex[results[0]].stops[track.stop]);
    const types = new Set(results.flatMap(id => Object.values(stationIndex[id].stops).flat().map(tid => trackIndex[tid].type)));
    assert.ok(types.has('train') && types.has('bus'));
    const distances = results.slice(1).map(id => getDistance(origin, stationIndex[id]));
    assert.deepEqual(distances, [...distances].sort((a, b) => a - b));
    const routeCounts = new Map();
    for (const id of results) {
      const routes = [...new Set(Object.values(stationIndex[id].stops).flat().map(tid => trackIndex[tid].route))].sort();
      const key = JSON.stringify(routes);
      routeCounts.set(key, (routeCounts.get(key) || 0) + 1);
    }
    assert.ok([...routeCounts.values()].every(count => count <= 3));
  });
}

test('coordinates also resolve stops that have no active station entry', () => {
  const served = new Set(Object.values(stationIndex).flatMap(s => Object.keys(s.stops)));
  const unserved = Object.keys(stopIndex).find(id => !served.has(id));
  assert.ok(unserved);
  assert.equal(getNearbyStations(getTransferOrigin(unserved), unserved).length, 25);
});

test('back paths preserve transfer and follow queries across trailing slashes and prefixes', () => {
  assert.equal(normalizePath('/in-the-loop/follow/?run=007', '/in-the-loop'), '/follow?run=007');
  assert.equal(normalizePath('/nearby/?stop=30001&run=007'), normalizePath('/nearby?run=007&stop=30001'));
  assert.notEqual(normalizePath('/follow?run=007'), normalizePath('/follow?run=008'));
  assert.deepEqual(nearbyBackPath('/in-the-loop/nearby/?stop=30001&run=007', '/in-the-loop'), {
    to: '/nearby?run=007&stop=30001', text: 'Back to Transfers',
  });
  assert.deepEqual(nearbyBackPath('/nearby/'), { to: '/nearby', text: 'Back to Nearby Stops' });
  assert.deepEqual(nearbyBackPath('/search'), nearbyBackPath());
});

test('follow row keys distinguish repeated stops and survive prediction refreshes', () => {
  const stops = [
    { stopId: '30001', stopName: 'First', time: '2026-11-01T12:00:00' },
    { stopId: '30002', stopName: 'Second', time: '2026-11-01T12:10:00' },
    { stopId: '30001', stopName: 'First', time: '2026-11-01T12:20:00' },
  ];
  const keys = getFollowRows(stops).map(s => s.rowKey);
  assert.equal(new Set(keys).size, stops.length);
  assert.deepEqual(getFollowRows(stops.map(s => ({ ...s, time: '2026-11-01T12:30:00' }))).map(s => s.rowKey), keys);
  assert.deepEqual(getFollowRows(stops.slice(1)).map(s => s.rowKey), keys.slice(1));
});
