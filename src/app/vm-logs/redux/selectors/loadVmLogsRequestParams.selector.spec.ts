import * as fromVmLogs from '../vm-logs.reducers';
import { loadVmLogsRequestParams } from './loadVmLogsRequestParams.selector';


describe('loadVmLogsRequestParams selector', () => {
  it('should select load logs request params without keywords', () => {
    const id = 'test-id';
    const keywords = [];

    const params = loadVmLogsRequestParams.projector(
      id,
      keywords
    );

    expect(params).toEqual({
      id,
      startDate: '1970-01-01T00:00:00.000',
      endDate: '1970-01-01T00:00:00.000',
      sort: '-timestamp'
    })
  });

  it('should select load logs request params with keywords', () => {
    const id = 'test-id';
    const keywords = [
      { text: 'test-keyword1' },
      { text: 'test-keyword2' }
    ];

    const params = loadVmLogsRequestParams.projector(
      id,
      keywords
    );

    expect(params).toEqual({
      id,
      keywords: 'test-keyword1,test-keyword2',
      startDate: '1970-01-01T00:00:00.000',
      endDate: '1970-01-01T00:00:00.000',
      sort: '-timestamp'
    });
  });
});
