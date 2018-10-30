import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BackendResource } from '../../shared/decorators';
import { BaseBackendService, FormattedResponse } from '../../shared/services/base-backend.service';
import { VmLogFile } from '../models/vm-log-file.model';

@Injectable()
@BackendResource({
  entity: 'VmLogFile',
})
export class VmLogFilesService extends BaseBackendService<VmLogFile> {
  constructor(protected http: HttpClient) {
    super(http);
  }

  protected formatGetListResponse(response: any): FormattedResponse<VmLogFile> {
    const result = (response && response.vmlogfiles) || [];
    return {
      list: result as VmLogFile[],
      meta: {
        count: response.count || 0,
      },
    };
  }
}
