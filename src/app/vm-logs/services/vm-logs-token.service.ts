import { Injectable } from '@angular/core';
import { BaseBackendService } from '../../shared/services/base-backend.service';
import { VmLogsToken } from '../models/vm-log-token.model';

@Injectable()
export class VmLogsTokenService extends BaseBackendService<VmLogsToken> {}
