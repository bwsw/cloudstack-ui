import { loadVmLogsRequestParams } from './load-vm-logs-request-params.selector';
import * as moment from 'moment';

describe('loadVmLogsRequestParams selector', () => {
  const date = moment(0);

  beforeAll(() => {
    jasmine.clock().mockDate(date.toDate());
  });

  it('should select load logs request params without search', () => {
    const id = 'test-id';
    const search = null;

    const params = loadVmLogsRequestParams.projector(id, search);

    expect(params).toEqual({
      id,
      sort: 'timestamp',
    });
  });

  it('should select load logs request params with search', () => {
    const id = 'test-id';
    const search = 'test-search';

    const params = loadVmLogsRequestParams.projector(id, search);

    expect(params).toEqual({
      id,
      keywords: search,
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

    const params = loadVmLogsRequestParams.projector(id, null, date, date, '', true);

    expect(params).toEqual({
      ...defaultRequestParams,
      sort: '-timestamp',
    });
  });
});
