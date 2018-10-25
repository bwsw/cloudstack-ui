import { loadVmLogsRequestParams } from './load-vm-logs-request-params.selector';
import moment = require('moment');

describe('loadVmLogsRequestParams selector', () => {
  const date = moment(0);

  beforeAll(() => {
    jasmine.clock().mockDate(date.toDate());
  });

  it('should select load logs request params without keywords', () => {
    const id = 'test-id';
    const keywords = [];

    const params = loadVmLogsRequestParams.projector(id, keywords);

    expect(params).toEqual({
      id,
      startDate: '1970-01-01T00:00:00.000',
      endDate: '1970-01-01T00:00:00.000',
      sort: 'timestamp',
    });
  });

  it('should select load logs request params with keywords', () => {
    const id = 'test-id';
    const keywords = [{ text: 'test-keyword1' }, { text: 'test-keyword2' }];

    const params = loadVmLogsRequestParams.projector(id, keywords);

    expect(params).toEqual({
      id,
      keywords: 'test-keyword1,test-keyword2',
      startDate: '1970-01-01T00:00:00.000',
      endDate: '1970-01-01T00:00:00.000',
      sort: 'timestamp',
    });
  });

  const defaultId = 'test-id';
  const defaultDate = '1970-01-01T00:00:00.000';
  const defaultSort = 'timestamp';
  const defaultRequestParams = {
    id: defaultId,
    startDate: defaultDate,
    endDate: defaultDate,
    sort: defaultSort,
  };

  it('should set sort: -timestamp if newest first = true', () => {
    const id = 'test-id';

    const params = loadVmLogsRequestParams.projector(id, [], date, date, '', true);

    expect(params).toEqual({
      ...defaultRequestParams,
      sort: '-timestamp',
    });
  });
});
