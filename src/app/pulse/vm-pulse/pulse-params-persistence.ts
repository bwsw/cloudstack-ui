import { Injectable } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { StorageService } from '../../shared/services/storage.service';
import { PulseParams } from './pulse-params';

export const pulseParamsKey = 'pulse.params';

export interface PulseParamsByUserId {
  [id: string]: PulseParams | undefined;
}

@Injectable()
export class PulseParamsPersistence {
  private get userId() {
    return this.auth.user.userid;
  }

  constructor(private storage: StorageService, private auth: AuthService) {}

  writeParams(params: Partial<PulseParams>) {
    const pulseParams = this.readAllParams();
    const merged = {
      ...pulseParams,
      [this.userId]: { ...pulseParams[this.userId], ...params },
    };
    this.storage.write(pulseParamsKey, JSON.stringify(merged));
  }

  readParams(): PulseParams {
    const allParams = this.readAllParams();

    const paramsForCurrentUser = allParams[this.userId];
    if (paramsForCurrentUser == null) {
      return {
        aggregations: undefined,
        scaleRange: undefined,
        shift: undefined,
        shiftAmount: undefined,
      };
    }

    return {
      aggregations: Array.isArray(paramsForCurrentUser.aggregations)
        ? paramsForCurrentUser.aggregations
        : undefined,
      scaleRange: paramsForCurrentUser.scaleRange,
      shift: paramsForCurrentUser.shift,
      shiftAmount: paramsForCurrentUser.shiftAmount && +paramsForCurrentUser.shiftAmount,
    };
  }

  private readAllParams(): PulseParamsByUserId {
    const rawData = this.storage.read(pulseParamsKey);

    try {
      return JSON.parse(rawData) || {};
    } catch {
      return {};
    }
  }
}
