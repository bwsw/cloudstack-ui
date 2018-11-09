import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class MockDiskStorageService {
  constructor(@Inject('mockDiskStorageServiceConfig') public config: { value: any }) {}

  public getAvailablePrimaryStorage(): Observable<number> {
    return this.config.value;
  }
}
