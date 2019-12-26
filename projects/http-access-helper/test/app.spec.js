const moxios = require('moxios');
const request = require('supertest');

const { createApp } = require('../src/app');
const { ReachableResponse, UnreachableResponse } = require('../src/response');

describe('app', () => {
  let originalConsoleLog;

  beforeAll(() => {
    originalConsoleLog = console.log;

    console.log = () => {};
  });

  afterAll(() => {
    console.log = originalConsoleLog;
  });

  beforeEach(() => moxios.install());
  afterEach(() => moxios.uninstall());

  const url = 'https://google.com';

  function stubReachibilityRequest(status) {
    moxios.stubRequest(url, { status });
  }

  async function assertReachable(reachable = true) {
    const res = await request(createApp(6000))
      .get('/')
      .query({ url });

    expect(moxios.requests.mostRecent().url).toBe(url);

    const expectedResponse = reachable ? ReachableResponse(url) : UnreachableResponse(url);
    expect(res.body).toEqual(expectedResponse);
  }

  it('should handle reachable resources', async () => {
    stubReachibilityRequest(200);
    await assertReachable();
  });

  it('should treat 405 as reachable', async () => {
    stubReachibilityRequest(405);
    await assertReachable();
  });

  it('should treat other errors as unreachable', async () => {
    stubReachibilityRequest(404);
    await assertReachable(false);
  });
});
