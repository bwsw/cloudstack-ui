import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class MockVmService {
  constructor(@Inject('mockVmServiceConfig') public config: { value: any }) {}

  public getNumberOfVms(): Observable<number> {
    return of(this.config.value);
  }
}
