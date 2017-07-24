import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class MockVmService {
  constructor(@Inject('mockVmServiceConfig') public config: { value: any }) {}

  public getNumberOfVms(): Observable<number> {
    return Observable.of(this.config.value);
  }
}
