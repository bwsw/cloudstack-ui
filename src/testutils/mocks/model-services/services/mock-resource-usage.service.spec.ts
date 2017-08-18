import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ResourceStats } from '../../../../app/shared/services';


@Injectable()
export class MockResourceUsageService {
  constructor(@Inject('mockResourceUsageServiceConfig') public config: { value: any }) {}

  public getResourceUsage(): Observable<ResourceStats> {
    return Observable.of(new ResourceStats(
      this.config.value.available,
      this.config.value.consumed,
      this.config.value.max
    ));
  }
}
