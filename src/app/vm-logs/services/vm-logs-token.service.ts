import { Injectable } from '@angular/core';
import { BaseBackendService } from '../../shared/services/base-backend.service';
import { VmLogsToken } from '../models/vm-log-token.model';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class VmLogsTokenService extends BaseBackendService<VmLogsToken> {
  constructor(protected http: HttpClient) {
    super(http);
  }
}
