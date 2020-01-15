import { Injectable } from '@angular/core';
import { StorageService } from '../../shared/services/storage.service';
import { PulseParams } from './pulse-params';

export const pulseParamsKey = 'pulse.params';

@Injectable()
export class PulseParamsPersistence {
  constructor(private storage: StorageService) {}

  writeParams(params: Partial<PulseParams>) {
    const merged = { ...this.readParams(), ...params };
    this.storage.write(pulseParamsKey, JSON.stringify(merged));
  }

  readParams(): PulseParams {
    const rawData = this.storage.read(pulseParamsKey);

    try {
      const parsedData = JSON.parse(rawData);

      return {
        aggregations: Array.isArray(parsedData.aggregations) ? parsedData.aggregations : undefined,
        scaleRange: parsedData.scaleRange,
        shift: parsedData.shift,
        shiftAmount: parsedData.shiftAmount && +parsedData.shiftAmount,
      };
    } catch {
      return {
        aggregations: undefined,
        scaleRange: undefined,
        shift: undefined,
        shiftAmount: undefined,
      };
    }
  }
}
