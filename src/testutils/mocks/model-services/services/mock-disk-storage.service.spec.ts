import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class MockDiskStorageService {
  constructor(@Inject('mockDiskStorageServiceConfig') public config: { value: any }) {}

  public getAvailablePrimaryStorage(): Observable<number> {
    return this.config.value;
  }
}
