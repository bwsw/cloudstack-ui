import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, inject, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { VmLogsService } from './vm-logs.service';

describe('VM logs service test', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [VmLogsService],
      imports: [HttpClientTestingModule],
    });
  }));

  it('should get logs', async(
    inject([VmLogsService], testService => {
      const params = {
        id: 'test-id',
      };

      const items = [
        {
          file: 'test-file',
          log: 'test-log',
          timestamp: 'test-timestamp',
        },
      ];

      spyOn(testService, 'sendCommand').and.callFake(() => {
        return of({
          vmlogs: {
            items,
            count: 1,
          },
        });
      });

      testService.getList(params).subscribe(res => {
        expect(res).toEqual(items);
      });
    }),
  ));
});
