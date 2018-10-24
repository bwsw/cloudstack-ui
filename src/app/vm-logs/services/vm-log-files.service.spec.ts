import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, inject, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { VmLogFilesService } from './vm-log-files.service';

describe('VM logs service test', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [VmLogFilesService],
      imports: [HttpClientTestingModule],
    });
  }));

  it('should get log files', async(
    inject([VmLogFilesService], testService => {
      const params = {
        id: 'test-id',
      };

      const vmlogfiles = [
        {
          file: 'test-file',
        },
      ];

      spyOn(testService, 'sendCommand').and.callFake(() => {
        return of({
          vmlogfiles,
          count: 1,
        });
      });

      testService.getList(params).subscribe(res => {
        expect(res).toEqual(vmlogfiles);
      });
    }),
  ));
});
