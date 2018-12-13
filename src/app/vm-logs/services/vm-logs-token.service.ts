import { Injectable } from '@angular/core';
import { BaseBackendService, CSCommands } from '../../shared/services/base-backend.service';
import { VmLogToken } from '../models/vm-log-token.model';
import { HttpClient } from '@angular/common/http';
import { BackendResource } from '../../shared/decorators';

@Injectable()
@BackendResource({
  entity: 'VmLogToken',
})
export class VmLogsTokenService extends BaseBackendService<VmLogToken> {
  constructor(protected http: HttpClient) {
    super(http);
  }

  public invalidate({ token }: { token: string }) {
    return this.sendCommand(CSCommands.Invalidate, { token });
  }
}
