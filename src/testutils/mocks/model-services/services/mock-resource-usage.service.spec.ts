import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ResourceStats } from '../../../../app/shared/services/resource-usage.service';

@Injectable()
export class MockResourceUsageService {
  constructor(@Inject('mockResourceUsageServiceConfig') public config: { value: any }) {}

  public getResourceUsage(): Observable<ResourceStats> {
    return of(
      new ResourceStats(
        this.config.value.available,
        this.config.value.consumed,
        this.config.value.max,
      ),
    );
  }
}
